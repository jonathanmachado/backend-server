// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Init Variables
const app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Import Rutes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');

// Conection Data Base
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if (error) {
        throw error;
    } else {
        console.log('Database: \x1b[32m%s\x1b[0m', 'online');
    }
});

app.use('/login', loginRoutes);
app.use('/users', userRoutes);
app.use('/', appRoutes);


// Listeners
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});
