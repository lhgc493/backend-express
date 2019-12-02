// importaciones - Requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar vaiables

var app = express();

// configuracion BODY PARSER (libreria externa)
// para utilizar en enpostman application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// conexion al BD

mongoose.connection.openUri('mongodb://localhost:27017/proyectoDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
});

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login')

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones

app.listen(3000, () => {
    console.log('express corre en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})