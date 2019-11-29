// Requires 
var express = require('express');
var mongoose = require('mongoose');


// Inicializar vaiables

var app = express();

// conexion al BD

mongoose.connection.openUri('mongodb://localhost:27017/proyectoDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
});

// rutas

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// Escuchar peticiones

app.listen(3000, () => {
    console.log('express corre en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})