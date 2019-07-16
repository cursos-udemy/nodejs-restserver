
const mongoose = require('mongoose');

const { Schema } = mongoose;

const productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    precioUnitario: { type: Number, required: [true, 'El precio unitario es obligatorio'] },
    descripcion: { type: String, required: false },
    activo: { type: Boolean, required: false, default: true },
    img: { type: String, required: false },
    categoria: {type: Schema.Types.ObjectId, ref: 'Categoria'},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
});



module.exports = mongoose.model('Producto', productoSchema);