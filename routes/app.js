// Requires
const express = require('express');

// Init Variables
const app = express();

// Routes
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        message: 'Petición todo ok'
    })
});

module.exports = app;