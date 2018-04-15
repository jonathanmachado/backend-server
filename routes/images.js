// Requires
const express = require('express');

// Init Variables
const app = express();
const path = require('path');
const fs = require('fs');


// Routes
app.get('/:type/:img', (request, response, next) => {

    const type =  request.params.type;
    const image = request.params.img;

    const pathImage = path.resolve(__dirname, `../uploads/${type}/${image}`);
    const pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);

    if (fs.existsSync(pathImage)) {
        response.sendFile(pathImage);
    } else {
        response.sendFile(pathNoImage);
    }
    
});

module.exports = app;