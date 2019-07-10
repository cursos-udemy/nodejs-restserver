const mongoose = require('mongoose');

const { Schema } = mongoose;

const usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El email es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' },
    estado: { type: Boolean, required: true, default: true },
    google: { type: Boolean, required: false, default: false }
});

module.exports = mongoose.model('usuario', usuarioSchema);