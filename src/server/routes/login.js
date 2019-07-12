const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        
        const token = jwt.sign ({
            username: `${user.nombre}`
        }, process.env.TOKEN_PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRED_IN });
        res.json({ status: 'ok', message: 'login successfully!', token });
    });

});

module.exports = app;
