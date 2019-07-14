const mongoose = require('mongoose');

const { Schema } = mongoose;

const categoriaSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripcion es obligatoria'] },
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
});

module.exports = mongoose.model('categoria', categoriaSchema);