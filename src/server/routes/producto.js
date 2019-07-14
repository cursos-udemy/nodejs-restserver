const express = require('express');

const { validToken, isUserAdminRole } = require('../middlewares/authentication');
const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const Usuario = require('../models/usuarios');
const { handleResponseError } = require('../util/handlers-errors')

const app = express();

app.get('/productos', validToken, (req, res) => {
    //recuperar todos los productos
    //poppulate usuario () y categoria
    // paginado
});


app.get('/producto/:id', validToken, (req, res) => {
    //poppulate usuario () y categoria
});

app.post('/producto', validToken, (req, res) => {

    const body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUnitario: body.precioUnitario,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
        usuario: req.userContext.user.ref,
    });

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
        res.json({ status: 'ok', producto });
    });
});

app.delete('/producto/:id', validToken, (req, res) => {

});

module.exports = app;