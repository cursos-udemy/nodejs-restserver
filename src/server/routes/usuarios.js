const express = require('express');
const Usuario = require('../models/usuarios');
const app = express();

app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    });
    console.log('usuario: ', usuario);

    usuario.save((err, usuarioDB) => {
        if (err) {
            console.error(err.message);
            return res.status(400).json({
                status: 'error',
                message: 'No se logro crear el usuario',
                detail: err.message
            });
        }
        res.json({
            status: 'ok',
            message: 'Usuario generado correctamente', 
            data: usuarioDB });
    });

});

app.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    console.log('id: ', id);
    res.json({
        id,
        url: req.url
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

module.exports = app;
