var express = require('express');
var bcrypt = require('bcryptjs'); // aqui la necesitamos para desemcriptar
var jwt = require('jsonwebtoken') // importar lib jwt
var SEED = require('../config/config').SEED; // se importa la llave secreta
var Usuario = require('../models/usuario');


var app = express();

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al bsucar usuario',
                errors: err
            })
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales no validas - email', //quitar - email en producion esta es solo en desarrollo
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales no validas - pwd', //quitar - pwd en producion esta es solo en desarrollo
                errors: err
            })
        }

        usuarioBD.password = ':)'; // para despistar

        //generar token 
        // SEED se crea un file externo se importa ys e lo llama
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); //@requip@ es el SEED nuestra firma token expura en 4hrs(14400)




        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });

    });


})


module.exports = app;