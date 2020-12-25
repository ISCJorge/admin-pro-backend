require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

// CORS 
app.use(cors());

// Base de datos
dbConnection();

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto 3000');
});

//Rutas
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola Mundo!'
    });

});
