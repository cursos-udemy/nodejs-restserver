const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

const usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El email es obligatorio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
    estado: { type: Boolean, required: true, default: true },
    google: { type: Boolean, required: false, default: false }
});

usuarioSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

//usuarioSchema.plugin(uniqueValidator, {message: '{PATH}: Existe un usuario con el mismo email'});
//usuarioSchema.plugin(uniqueValidator, {message: 'Existe un usuario con este email'});

module.exports = mongoose.model('usuario', usuarioSchema);