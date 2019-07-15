const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuarios');
const { validToken, isUserAdminRole } = require('../middlewares/authentication');
const { handleResponseError } = require('../util/handlers-errors')
const app = express();

app.get('/usuario', validToken, (req, res) => {
    const skip = Number(req.query.skip || '0');
    const limit = Number(req.query.limit || '5');
    const conditions = { estado: true };
    const fieldsFilter = 'nombre email google img role estado';
    Usuario.find(conditions, fieldsFilter)
        .skip(skip)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) return handleResponseError(500, 'Error al realizar la consulta', err);
            Usuario.countDocuments(conditions, (err, count) => {
                res.json({
                    status: 'ok',
                    usuarios,
                    elements: err ? -1 : count
                });
            });
        });
});

app.post('/usuario', [validToken, isUserAdminRole], (req, res) => {
    const body = req.body;
    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) return handleResponseError(400, 'Error al crear al usuario!', err);
        res.json({
            status: 'ok',
            message: 'Usuario generado correctamente!',
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [validToken, isUserAdminRole], (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);
    const optionals = { new: true, runValidators: true };
    Usuario.findByIdAndUpdate(id, body, optionals, (err, usuario) => {
        if (err) return handleResponseError(400, 'Error al actualizar al usuario!', err);
        if (!usuario) return handleResponseError(400, res, 'El usuario no existe');
        res.json({
            status: 'ok',
            message: 'Usuario actualizado correctamente!',
            usuario
        });
    });
});

app.delete('/usuario/:id', [validToken, isUserAdminRole], (req, res) => {
    const { id } = req.params;
    const data = { estado: false };
    const optionals = { new: true };
    Usuario.findByIdAndUpdate(id, data, optionals, (err, usuario) => {
        if (err) return handleResponseError(400, 'Error al eliminar al usuario', err);
        if (!usuario) return handleResponseError(400, res, 'El usuario no existe');
        res.json({
            status: 'ok',
            message: 'Usuario eliminado correctamente'
        });
    });
});

module.exports = app;
