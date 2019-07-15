const express = require('express');

const { validToken, isUserAdminRole } = require('../middlewares/authentication');
const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const Usuario = require('../models/usuarios');
const { handleResponseError } = require('../util/handlers-errors')

const app = express();

app.get('/productos', validToken, (req, res) => {
    const skip = Number(req.query.skip || '0');
    const limit = Number(req.query.limit || '5');
    const conditions = { activo: true };
    const fieldsFilter = '';
    Producto.find(conditions, fieldsFilter)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'categoria', model: Categoria, select: 'descripcion' })
        .populate({ path: 'usuario', model: Usuario, select: 'nombre email' })
        .exec((err, productos) => {
            if (err) return handleResponseError(500, 'Error al realizar la consulta', err);
            Producto.countDocuments(conditions, (err, count) => {
                res.json({
                    status: 'ok',
                    productos,
                    elements: err ? -1 : count
                });
            });
        });
});

app.get('/producto/:id', validToken, (req, res) => {
    const { id } = req.params;
    Producto.findById(id)
        .populate({ path: 'categoria', model: Categoria, select: 'descripcion' })
        .populate({ path: 'usuario', model: Usuario, select: 'nombre email' })
        .exec((err, producto) => {
            if (err) return handleResponseError(500, res, 'Error al consultar el producto', err);
            res.json({ status: 'ok', producto });
        });
});

app.get('/productos/search', validToken, (req, res) => {
    const query = req.query;
    let conditions = {};
    if (query.categoria) {
        conditions.categoria = query.categoria;
    }
    if (query.nombre) {
        const regex = new RegExp(query.nombre, 'i');
        conditions.nombre = regex;
    }
    if (query.activo) {
        conditions.activo = query.activo;
    }
    Producto.find(conditions)
        .populate({ path: 'categoria', model: Categoria, select: 'descripcion' })
        //.populate({ path: 'usuario', model: Usuario, select: 'nombre email' })
        .exec((err, productos) => {
            if (err) return handleResponseError(500, res, 'Error al consultar los productos', err);
            res.json({ status: 'ok', productos });
        });
});

app.post('/producto', validToken, (req, res) => {
    const body = req.body;
    let data = {
        nombre: body.nombre,
        precioUnitario: body.precioUnitario,
        descripcion: body.descripcion,
        usuario: req.userContext.user.ref,
    }
    if (body.categoria) {
        data.categoria = body.categoria;
    }

    const producto = new Producto(data);
    const options = {}
    producto.save(options, (err, productoDB) => {
        if (err) return handleResponseError(400, res, 'Error al crear el producto', err);
        if (!productoDB) return handleResponseError(400, res, err.message);
        res.json({ status: 'ok', categoria: productoDB });
    });
});

app.put('/producto/:id', validToken, (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const data = { usuario: req.userContext.user.ref };

    if (body.nombre) {
        data.nombre = body.nombre;
    }
    if (body.precioUnitario) {
        data.precioUnitario = body.precioUnitario;
    }
    if (body.descripcion) {
        data.descripcion = body.descripcion;
    }
    if (body.categoriaId) {
        data.categoria = body.categoriaId;
    }
    const optionals = { new: true, runValidators: true };
    Producto.findByIdAndUpdate(id, data, optionals, (err, producto) => {
        if (err) return handleResponseError(400, res, 'Error al actualizar el producto', err);
        if (!producto) return handleResponseError(400, res, 'El producto no existe');
        res.json({ status: 'ok', producto });
    });
});

app.delete('/producto/:id', validToken, (req, res) => {
    const { id } = req.params;
    const data = { activo: false, usuario: req.userContext.user.ref };
    const optionals = { new: true };
    Producto.findByIdAndUpdate(id, data, optionals, (err, producto) => {
        if (err) return handleResponseError(400, 'Error al eliminar el producto', err);
        if (!producto) return handleResponseError(400, res, 'El producto no existe');
        res.json({
            status: 'ok',
            message: 'Producto eliminado correctamente'
        });
    });
});

module.exports = app;