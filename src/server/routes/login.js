const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

        const token = jwt.sign({
            user: {
                name: user.nombre,
                email: user.email,
                role: user.role,
                permissions: []
            }
        }, process.env.TOKEN_PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRED_IN });
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
    // console.info('idtoken: ', token);
    const user = await verify(token)
        .catch(err => {
            console.error(err);
            return response.status(403).json({
                status: 'error',
                message: err.message,
            });
        });

    Usuario.findOne({ email: user.email }, (err, userDB) => {
        if (err) {
            console.error(err);
            return response.status(500).json({
                status: 'error',
                message: 'Error en el proceso de autenticacion',
                detail: err.message
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Debe ingresar con su cuenta normal',
                });
            } else {
                // Actualizo las credendenciales
                const token = jwt.sign({
                    user: {
                        name: user.nombre,
                        email: user.email,
                        img: user.image,
                        role: userDB.role,
                        permissions: []
                    }
                }, process.env.TOKEN_PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRED_IN });
                response.json({ status: 'ok', message: 'login successfully!', token });
            }
        } else {
            let usuario = new Usuario();
            usuario.nombre = user.name;
            usuario.email = user.email;
            usuario.img = user.image;
            usuario.google = true;
            usuario.password = bcrypt.hashSync(':)', 10);

            usuario.save((err, userDB) => {
                if (err) {
                    console.error(err);
                    return response.status(500).json({
                        status: 'error',
                        message: 'Error en el proceso de autenticacion',
                        detail: err.message
                    });
                }
                const token = jwt.sign({
                    user: {
                        name: userDB.nombre,
                        email: userDB.email,
                        role: userDB.role,
                        permissions: []
                    }
                }, process.env.TOKEN_PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRED_IN });
                response.json({ status: 'ok', message: 'login successfully!', token });
            });
        }

    });
});

module.exports = app;
