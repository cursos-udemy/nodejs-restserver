const express = require('express');
const path = require('path');
const fs = require('fs');
const { validTokenURL } = require('../middlewares/authentication');

const app = express();

app.get('/download/:folder/:filename', validTokenURL, (req, res) => {
    const { folder, filename } = req.params;

    const folders = ['productos', 'usuarios'];
    if (!folders.includes(folder)) return handleResponseError(400, res, 'Error el origen de las imagenes');
    const imagePath = path.resolve(__dirname, `../../uploads/${folder}/${filename}`);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        console.warn(`No se encontro la imagen ${imagePath}`);
        res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
    }
});

module.exports = app;
