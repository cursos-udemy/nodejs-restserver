const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuarios');
const app = express();

app.get('/usuario', (req, res) => {

    const skip = Number(req.query.skip || '0');
    const limit = Number(req.query.limit || '5');

    const conditions = {};
    Usuario.find(conditions)
        .skip(skip)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    status: 'error',
                    message: 'Error al consultar los usuarios',
                    detail: err.message
                });
            }

            Usuario.count(conditions, (err, count) => {
                res.json({
                    status: 'ok',
                    usuarios,
                    elements: err ? -1 : count
                });
            });
        });
});

app.post('/usuario', (req, res) => {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    console.log('usuario: ', usuario);

    usuario.save((err, usuarioDB) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                status: 'error',
                message: 'No se logro crear el usuario',
                detail: err.message
            });
        }
        res.json({
            status: 'ok',
            message: 'Usuario generado correctamente',
            data: usuarioDB
        });
    });
});

app.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);
    console.log('body: ', body);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                status: 'error',
                message: 'No se logro actualizar el usuario',
                detail: err.message
            });
        }
        res.json({
            status: 'ok',
            message: 'Usuario actualizo correctamente',
            data: usuarioDB
        });
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

module.exports = app;
