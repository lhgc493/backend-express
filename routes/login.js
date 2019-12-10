var express = require('express');
var bcrypt = require('bcryptjs'); // aqui la necesitamos para desemcriptar
var jwt = require('jsonwebtoken') // importar lib jwt
var SEED = require('../config/config').SEED; // se importa la llave secreta
var Usuario = require('../models/usuario');


var app = express();

//google
var CLIENT_ID = require('../config/config').CLIENT_ID; //se importa llave google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//=====================
// Autenticacion Google
//=====================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        });



    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al bsucar usuario',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Utilice la utenticacion normal',
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //@requip@ es el SEED nuestra firma token expura en 4hrs(14400)

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        } else { // el usuario no exixte hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ';)';

            usuario.save((err, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //@requip@ es el SEED nuestra firma token expura en 4hrs(14400)

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        }


    });

});



//=====================
// Autenticacion propia
//=====================

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