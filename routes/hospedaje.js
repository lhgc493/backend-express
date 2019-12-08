var express = require('express');
var Hospedaje = require('../models/hospedaje');
var mdAutenticacion = require('../middlewares/autenticacion'); // importacion de MD
var app = express();

//================================
//Listado de hospedajes
//================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospedaje.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') // para que te muestre todos o los requeridos datos de usuario
        .exec(
            (err, hospedajes) => {
                if (err) {
                    return
                    res.status(500).json({
                        ok: false,
                        mensaje: 'error al listar hospedajes',
                        errors: err
                    });

                }

                Hospedaje.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospedaje: hospedajes,
                        total: conteo
                    });

                });

            });
});

//================================
//Crear de hospedajes
//================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospedaje = new Hospedaje({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospedaje.save((err, hospedajeGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se puede crear hospedaje!',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospedaje: hospedajeGuardado,

        });
    });
});

//================================
//actualiza de hospedajes
//================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospedaje.findById(id, (err, hospedaje) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospedaje!',
                errors: err
            });
        }

        if (!hospedaje) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error hospedaje con id ' + id + ' no existe',
                errors: { message: 'No existe un hospedaje con ese Id' }
            });
        }

        hospedaje.nombre = body.nombre;


        hospedaje.save((err, hospedajeActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospedaje!',
                    errors: err
                });
            }

            hospedajeActualizado.password = ':)'; // para que no se muestre el pwd encriptado pero no se guarda en la bd

            res.status(200).json({
                ok: true,
                hospedaje: hospedajeActualizado
            });
        });
    });
});

//================================
//eliminar de hospedajes
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospedaje.findByIdAndRemove(id, (err, HospedajeBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospedaje!',
                errors: err
            });
        }
        if (!HospedajeBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No exixte hospedaje con ese id!',
                errors: { message: 'No exixte hospedaje con ese id!' }
            });
        }

        res.status(200).json({
            ok: true,
            hospedaje: HospedajeBorrado
        });
    });
});


module.exports = app;