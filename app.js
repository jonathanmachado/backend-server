// Requires
const express = require('express');
const mongoose = require('mongoose');

// Init Variables
const app = express();

// Conection Data Base
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if (error) {
        throw error;
    } else {
        console.log('Database: \x1b[32m%s\x1b[0m', 'online');
    }
});

// Routes
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        message: 'Petición todo ok'
    })
})

// Listeners
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});