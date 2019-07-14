const express = require('express');

const { validToken, isUserAdminRole } = require('../middlewares/authentication');
const Categoria = require('../models/categorias');
const Usuario = require('../models/usuarios');
const { handleResponseError } = require('../util/handlers-errors')

const app = express();

app.get('/categoria', validToken, (req, res) => {
    const conditions = {};
    Categoria.find(conditions)
        .sort('descripcion')
        .populate({ path: 'usuario', model: Usuario, select: 'nombre email' })
        .exec((err, categorias) => {
            if (err) return handleResponseError(500, res, 'Error al consultar las categorias', err);
            res.json({ status: 'ok', categorias });
        });
});

app.get('/categoria/:id', validToken, (req, res) => {
    const { id } = req.params;
    Categoria.findById(id, (err, categoria) => {
        if (err) return handleResponseError(500, res, 'Error al consultar la categoria', err);
        if (!categoria) return handleResponseError(400, res, `No se encontro la categoria "${id}"`);
        res.json({ status: 'ok', categoria });
    })
});

app.post('/categoria', validToken, (req, res) => {
    const { descripcion } = req.body;
    const categoria = new Categoria({
        descripcion,
        usuario: req.userContext.user.ref
    });

    categoria.save((err, categoriaBD) => {
        if (err) return handleResponseError(400, res, 'Error al dar de alta la categoria', err);
        if (!categoriaBD) return handleResponseError(400, res, err.message);
        res.json({ status: 'ok', categoria: categoriaBD });
    });
});

app.put('/categoria/:id', validToken, (req, res) => {
    const { id } = req.params;
    const body = { descripcion: req.body.descripcion };
    const optionals = { new: true, runValidators: true };
    Categoria.findByIdAndUpdate(id, body, optionals, (err, categoria) => {
        if (err) return handleResponseError(400, res, 'Error al actualizar la categoria', err);
        res.json({
            status: 'ok',
            message: 'Categoria actualizada correctamente',
            categoria
        });
    });
});

app.delete('/categoria/:id', [validToken, isUserAdminRole], (req, res) => {
    const { id } = req.params;
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) return handleResponseError(500, res, 'Error al eliminar la categoria', err);
        if (!categoria) return handleResponseError(400, res, 'La categoria no existe');
        res.json({
            status: 'ok',
            message: 'Categoria eliminada correctamente',
        });
    })
});

module.exports = app;