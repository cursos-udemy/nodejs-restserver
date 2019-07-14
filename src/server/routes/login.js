const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuarios');
const { handleResponseError } = require('../util/handlers-errors');
const app = express();

const createToken = (user) => {
    const token = jwt.sign({
        user: {
            ref: user._id,
            name: user.nombre,
            email: user.email,
            role: user.role,
            permissions: []
        }
    }, process.env.TOKEN_PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRED_IN });
    return token;
}

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    Usuario.findOne({ email }, (err, usuario) => {
        if (err) return handleResponseError(500, res, 'Error en el proceso de login', err);
        if (!usuario) return handleResponseError(500, res, 'USUARIO o password incorrecto');
        if (!bcrypt.compareSync(password, usuario.password)) return handleResponseError(500, res, 'Usuario o PASSWORD incorrecto');

        const token = createToken(usuario);
        res.json({ status: 'ok', message: 'login successfully!', token });
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
}

app.post('/externalsignin', async (request, response) => {
    const token = request.body.idtoken;
    try {
        const user = await verify(token)
    } catch (err) {
        return handleResponseError(403, response, err.message);
    };

    Usuario.findOne({ email: user.email }, (err, userDB) => {
        if (err) return handleResponseError(500, response, 'Error en el proceso de autenticacion', err);
        if (userDB) {
            if (userDB.google === false) {
                return handleResponseError(400, response, 'Debe ingresar con su cuenta normal');
            } else {
                // Actualizo las credendenciales
                const token = createToken(userBD);
                response.json({ status: 'ok', message: 'login successfully!', token });
            }
        } else {
            let usuario = new Usuario();
            usuario.nombre = user.name;
            usuario.email = user.email;
            usuario.img = user.image;
            usuario.google = true;
            //usuario.password = bcrypt.hashSync(':)', 10);
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) return handleResponseError(500, res, 'Error en el proceso de login', err);
                const token = createToken(usuarioDB);
                response.json({ status: 'ok', message: 'login successfully!', token });
            });
        }
    });
});

module.exports = app;
