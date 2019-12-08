var express = require('express');
var Socio = require('../models/socio');
var mdAutenticacion = require('../middlewares/autenticacion'); // importacion de MD
var app = express();

//================================
//Listado de Socios
//================================


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Socio.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre, email')
        .populate('hospedaje')
        .exec(
            (err, socios) => {
                if (err) {
                    return
                    res.status(500).json({
                        ok: false,
                        mensaje: 'error al listar socios',
                        errors: err
                    });

                }
                Socio.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        socio: socios,
                        total: conteo
                    });

                });


            });
});

//================================
//Crear de socios
//================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var socio = new Socio({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospedaje: body.hospedaje

    });

    socio.save((err, socioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se puede crear socio!',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            socio: socioGuardado,

        });
    });
});

//================================
//actualiza de socios
//================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Socio.findById(id, (err, socio) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar socio!',
                errors: err
            });
        }

        if (!socio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error socio con id ' + id + ' no existe',
                errors: { message: 'No existe un socio con ese Id' }
            });
        }

        socio.nombre = body.nombre;
        socio.usuario = req.usuario._id;
        socio.hospedaje = body.hospedaje;


        socio.save((err, socioActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar socio!',
                    errors: err
                });
            }

            socioActualizado.password = ':)'; // para que no se muestre el pwd encriptado pero no se guarda en la bd

            res.status(200).json({
                ok: true,
                socio: socioActualizado
            });
        });
    });
});

//================================
//eliminar de hospedajes
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Socio.findByIdAndRemove(id, (err, socioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar socio!',
                errors: err
            });
        }
        if (!socioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No exixte socio con ese id!',
                errors: { message: 'No exixte socio con ese id!' }
            });
        }

        res.status(200).json({
            ok: true,
            socio: socioBorrado
        });
    });
});


module.exports = app;