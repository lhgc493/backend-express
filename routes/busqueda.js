var express = require('express');
var Hospedaje = require('../models/hospedaje');
var Socio = require('../models/socio');
var Usuario = require('../models/usuario');
var app = express();



/////////////////////
// funcion busca por coleccion
////////////////////

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'socios':
            promesa = buscarSocio(busqueda, regex);
            break;
        case 'hospedajes':
            promesa = buscarHopedajes(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'No hay un tabla conesa nombre',
                error: { mensaje: 'Nohay esa tabla' }
            });

    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data // para capturar el valor la entidad
        });

    });

});




/////////////////////
// funciones de busca globales
////////////////////

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); // i es para que no importe mayusculas o minusculas


    Promise.all([
            buscarHopedajes(busqueda, regex),
            buscarSocio(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospedajes: respuestas[0], // hospedajes esta en la pocion 0 el arreglo
                socios: respuestas[1], // socios esta en la pocion 1 el arreglo
                usuarios: respuestas[2]
            });
        });
});



/////////////////////
// funcion busca global hospedajes
////////////////////
function buscarHopedajes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospedaje.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec(

                (err, hospedajes) => {
                    if (err) {
                        reject('Error al buscar hospedaje', err);

                    } else {
                        resolve(hospedajes)
                    }
                });

    });

}

/////////////////////
// funcion busca global socios
////////////////////

function buscarSocio(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Socio.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec(
                (err, socios) => {
                    if (err) {
                        reject('Error al buscar socios', err);

                    } else {
                        resolve(socios)
                    }
                });

    });
}


/////////////////////
// funcion busca global Usuario con dos columnas (nombre email)
////////////////////

function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role') // para que solo se muestre esos campos
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('error al cargar usuarios');

                } else {
                    resolve(usuarios);
                }
            });

    });

}



module.exports = app;