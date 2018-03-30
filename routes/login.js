// Requires
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

// Init Variables
const app = express();
const Users = require('../models/user');

app.post('/', (request, response) => {
    const body = request.body;

    Users.findOne({ email: body.email }, (error, user) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al encontrar el usuario',
                errors: error
            });
            
        }

        if (!user) {
            return response.status(400).json({
                ok: false,
                message: `El usuario con email ${body.email} no existe`,
                user: user,
                errors: {
                    message: 'No existe un usuario con ese email.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return response.status(400).json({
                ok: false,
                message: `Credenciales incorrectas`,
                user: user,
                errors: {
                    message: 'Credenciales incorrectas.'
                }
            });
        }

        user.password = '*****';

        const token = jwt.sign({ user: user, }, SEED, { expiresIn: 14400 });

        response.status(200).json({
            ok: true,
            user: user,
            id: user._id,
            token: token
        });

    });
});

module.exports = app;