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
var loginRoutes = require('./routes/login');
var hospedajeRoutes = require('./routes/hospedaje');
var socioRoutes = require('./routes/socio');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload')
var imagesRoutes = require('./routes/imagenes');

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospedaje', hospedajeRoutes);
app.use('/socio', socioRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes); // esta siempre abajo




// Escuchar peticiones

app.listen(3000, () => {
    console.log('express corre en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})