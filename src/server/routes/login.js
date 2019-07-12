const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios');
const app = express();

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    Usuario.findOne({ email }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Error en el proceso de login',
                detail: err.message
            });
        }

        if (!user) {
            return res.status(500).json({
                status: 'error',
                message: 'USUARIO o password incorrecto',
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(500).json({
                status: 'error',
                message: 'Usuario o PASSWORD incorrecto',
            });
        }
        res.json({ status: 'ok', message: 'login successfully!', token: 'hhhh' });
    });

});

module.exports = app;
