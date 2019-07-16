const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const { handleResponseError } = require('../util/handlers-errors')
const Usuario = require('../models/usuarios');
const Prodcuto = require('../models/productos');

const app = express();



// default options
app.use(fileUpload());

app.post('/upload/:folder/:id', (req, res) => {
    const { folder, id } = req.params;
    const folders = ['productos', 'usuarios'];
    if (!folders.includes(folder)) return handleResponseError(400, res, 'Error al especificar destino de las imagenes');

    if (Object.keys(req.files).length == 0) {
        return handleResponseError(400, res, 'No hay archivos a subir');
    }
    const extensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

    // The name of the input field (i.e. "fileUpload") is used to retrieve the uploaded file
    const fileUpload = req.files.fileUpload;
    const fileNameSplit = fileUpload.name.split('.');
    if (fileNameSplit.length < 1) return handleResponseError(400, res, 'No puede subir una imagen sin extension');
    const fileExtension = fileNameSplit[fileNameSplit.length - 1];
    if (!extensions.includes(fileExtension)) return handleResponseError(400, res, 'La extension del archivo no esta permitida');

    const newFileName = `${id}_${(new Date()).getTime()}.${fileExtension}`;
    fileUpload.mv(`./src/uploads/${folder}/${newFileName}`, (err) => {
        if (err) return handleResponseError(500, res, 'Error al subir el archivo', err);
        updateImagenUsuario(res, id, newFileName);
    });
});

function updateImagenUsuario(res, id, filename) {
    const originFolder = 'usuarios';

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            deleteImage(filename, originFolder);
            return handleResponseError(500, res, `Error al recuperar al usuario ${id}`, err);
        }
        if (!usuario) {
            deleteImage(filename, originFolder);
            return handleResponseError(400, res, `No existe el usuario ${id}`);
        }
        const imageToDelete = usuario.img;
        usuario.img = filename;
        usuario.save((e, usuarioDB) => {
            if (e) return handleResponseError(500, res, 'Error al actualizar el usuario.');
            deleteImage(imageToDelete, originFolder);
            res.json({ status: 'ok', message: 'Archivo subido correctamente', usuario: usuarioDB });
        })
    });
}

function updateImagenProducto(res, id, filename) {
    const originFolder = 'productos';
    const imageToDelete = producto.img;
    Producto.findById(id, (err, producto) => {
        if (err) {
            deleteImage(filename, originFolder);
            return handleResponseError(500, res, `Error al recuperar el producto ${id}`, err);
        }
        if (!producto) {
            deleteImage(filename, originFolder);
            return handleResponseError(400, res, `No existe el producto ${id}`);
        }
        producto.img = filename;
        producto.save((e, prodcutoDB) => {
            if (e) return handleResponseError(500, res, 'Error al actualizar el producto.');
            deleteImage(imageToDelete, originFolder);
            res.json({ status: 'ok', message: 'Archivo subido correctamente', producto: prodcutoDB });
        })
    });
}

function deleteImage(filename, originFolfer) {
    const imagePath = path.resolve(__dirname, `../../uploads/${originFolfer}/${filename}`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

function updateImagenProducto(id) {

}

module.exports = app;