//importaciones - requires
var express = require('express');
var bcrypt = require('bcryptjs'); // libreria para encriptar contrasenas
var mdAutenticacion = require('../middlewares/autenticacion'); // importacion de MD
var Usuario = require('../models/usuario');


var app = express();

//================================
//Listado de usuarios
//================================
app.get('/', (req, res, next) => {

    Usuario.find({}, (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'problemas de conexion!',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            Usuario: usuarios
        });
    });

    /* si solo quieres listar algunos atributos exec
       Usuario.find({}, 'nombre email role').exec(
           (err, usuarios) => {
               if (err) {
                   res.status(500).json({
                       ok: false,
                       mensaje: 'Error conexion bd!'
                   });
               }

               res.status(200).json({
                   ok: true,
                   Usuario: usuarios
               });

           });*/
});

//================================
//Creacion de usuarios
//================================

//mdAutenticacion.verificaToken es un Middleware que busca autenticacion antes de crear usuario 
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // aqui se utiliza el encriptador con este hash
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se puede crear usuario!',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usurioToken: req.usuario
        });
    });
});

//================================
//Actualizar de usuarios
//================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error usuario con id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese Id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario!',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)'; // para que no se muestre el pwd encriptado pero no se guarda en la bd

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});
//================================
//Eliminar de usuarios x id
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario!',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No exixte usuario con ese id!',
                errors: { message: 'No exixte usuario con ese id!' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});



module.exports = app;