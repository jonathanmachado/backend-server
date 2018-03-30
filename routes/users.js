// Requires
const express = require('express');
const bcrypt = require('bcryptjs');

// Init Variables
const app = express();
const Users = require('../models/user');

const jwt = require('jsonwebtoken');

const mdAuth = require('../middlewares/auth');

app.get('/', (request, response, next) => {

    Users.find({}, 'name img role email').exec((error, collectionUsers) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error users',
                errors: error
            });
        } 

        response.status(200).json({
            ok: true,
            users: collectionUsers
        });
            
        
    });

});



app.post('/', mdAuth.verifyToken, (request, response) => {

    const body = request.body;

    const user = new Users({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((error, userSave) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: error
            });
            
        }
        
        response.status(201).json({
            ok: true,
            user: userSave,
            userToken: request.user
        });

    });


});

app.put('/:id', mdAuth.verifyToken, (request, response) => {
    const id = request.params.id;

    Users.findById(id, (error, user) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: error
            });
            
        }

        if (!user) {
            return response.status(400).json({
                ok: false,
                message: `El usuario con id ${id} no existe`,
                user: user,
                errors: {
                    message: 'No existe un usuario con ese id.'
                }
            });
        }

        const body = request.body;
    
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;
    
        user.save((error, userSave) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el usuario',
                    errors: error
                });
                
            }
            userSave.password = '******';
            response.status(200).json({
                ok: true,
                user: userSave
            });
        });
        
    });



});


app.delete('/:id', mdAuth.verifyToken, (request, response) => {
    const id = request.params.id;

    Users.findByIdAndRemove(id, (error, userDelete) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: error
            });
            
        }

        if (!userDelete) {
            return response.status(400).json({
                ok: false,
                message: 'No existe un usuario con ese id.',
                errors: {
                    message: 'No existe un usuario con ese id.'
                }
            });
            
        }

        response.status(200).json({
            ok: true,
            usuario: userDelete
        });
    });
});

module.exports = app;