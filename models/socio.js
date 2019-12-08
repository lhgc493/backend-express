var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var socioSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospedaje: { type: Schema.Types.ObjectId, ref: 'Hospedaje', required: [true, 'El id	hospedaje es un campo obligatorio '] }
});
module.exports = mongoose.model('Socio', socioSchema);