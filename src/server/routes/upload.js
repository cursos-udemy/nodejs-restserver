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
    const extensions = ['png1','jpg', 'jpeg', 'gif', 'bmp'];

    // The name of the input field (i.e. "fileUpload") is used to retrieve the uploaded file
    const fileUpload = req.files.fileUpload;
    const fileNameSplit = fileUpload.name.split('.');
    if (fileNameSplit.length < 1) return handleResponseError(400, res, 'No puede subir una imagen sin extension');
    const fileExtension = fileNameSplit[fileNameSplit.length-1];
    if (!extensions.includes(fileExtension)) return handleResponseError (400, res, 'La extension del archivo no esta permitida');

    fileUpload.mv(`./src/uploads/${fileUpload.name}`, (err) => {
        if (err) return handleResponseError(500, res, 'Error al subir el archivo', err);
        res.json({ status: 'ok', message: 'Archivo subido correctamente' });
    });
});

module.exports = app;