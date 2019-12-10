var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator') //lib para validar atributos unicos 
var Schema = mongoose.Schema;

// roles validos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }, //enum para validar los roles validos
    google: { type: Boolean, default: false }
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' }) //{path} es para que valide todos los campos unicos en el modelo
module.exports = mongoose.model('Usuario', usuarioSchema);