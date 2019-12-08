var express = require('express');
var fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');
var Hospeje = require('../models/hospedaje');
var Socio = require('../models/socio');


var fs = require('fs'); //libreria de node que ya esta instalada para images
var app = express();

app.use(fileUpload()); // MD para subida de imagenes



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //para validar tipos de colleccion
    var tiposValidos = ['usuarios', 'hospedajes', 'socios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo coleccion no valida',
            errors: { mensaje: 'Tipo no valido' }
        });

    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al subir imagenes',
            errors: { mensaje: 'debe seleccionar una imagen' }
        });
    }

    // obtener nombre del archivo y validar que sea una imagen
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // validar extensiones de imagenes
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { mensaje: 'solo son validas: ' + extensionesValidas.join(', ') }
        });
    }

    //nombre archivo personalizado donde se guardara las imagenes
    //1254654654654-123.png (este formato id usuario-numerorandon-formato)
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al mover archivo',
                errors: err
            });
        }


        subirXtipo(tipo, id, nombreArchivo, res);


    });


});

function subirXtipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return
                res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: err
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // siexiste imagen la elimina 

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error con el archivo',
                            errors: { mensaje: 'Error con el archivo' }
                        });
                    }
                });
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede actualizar usuario',
                        errors: err
                    });

                }

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });

        });

    }

    // socios
    else if (tipo === 'socios') {

        Socio.findById(id, (err, socio) => {
            if (!socio) {
                return
                res.status(400).json({
                    ok: false,
                    mensaje: 'Socio no existe',
                    errors: err
                });
            }

            var pathViejo = './uploads/socios/' + socio.img;

            // siexiste imagen la elimina 

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error con el archivo',
                            errors: { mensaje: 'Error con el archivo' }
                        });
                    }
                });
            }

            socio.img = nombreArchivo;

            socio.save((err, socioActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede actualizar socio',
                        errors: err
                    });

                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de socio actualizada',
                    socio: socioActualizado
                });

            });

        });

    }

    // hospedajes
    else if (tipo === 'hospedajes') {

        Hospeje.findById(id, (err, hospedaje) => {
            if (!hospedaje) {
                return
                res.status(400).json({
                    ok: false,
                    mensaje: 'Hospedaje no existe',
                    errors: err
                });
            }

            var pathViejo = './uploads/hospedajes/' + hospedaje.img;

            // siexiste imagen la elimina 

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error con el archivo',
                            errors: { mensaje: 'Error con el archivo' }
                        });
                    }
                });
            }

            hospedaje.img = nombreArchivo;

            hospedaje.save((err, hospedajeActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede actualizar hospedaje',
                        errors: err
                    });

                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospedaje actualizada',
                    hospedaje: hospedajeActualizado
                });

            });

        });

    }

}

module.exports = app;