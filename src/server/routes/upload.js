const express = require('express');
const fileUpload = require('express-fileupload');
const { handleResponseError } = require('../util/handlers-errors')
const app = express();

// default options
app.use(fileUpload());

app.post('/upload', (req, res) => {

    if (Object.keys(req.files).length == 0) {
        return handleResponseError(400, res, 'No hay archivos a subir');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const fileUpload = req.files.fileUpload;
    fileUpload.mv(`./src/uploads/${fileUpload.name}`, (err) => {
        if (err) return handleResponseError(500, res, 'Error al subir el archivo', err);
        res.json({ status: 'ok', message: 'Archivo subido correctamente' });
    });
});

module.exports = app;