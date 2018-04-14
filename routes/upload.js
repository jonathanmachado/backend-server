// Requires
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const Users = require('../models/user');
const Doctors = require('../models/doctor');
const Hospitals = require('../models/hospital');

// Init Variables
const app = express();

app.use(fileUpload());
// Routes
app.put('/:type/:id', (request, response, next) => {

    const type = request.params.type;
    const id = request.params.id;
    
    const validTypes = ['users', 'doctors', 'hospitals'];


    if (validTypes.indexOf(type) < 0) {
        return response.status(400).json({
            ok: false,
            message: 'Error',
            error: {
                message: 'Tipo no valido'
            }
        })
    }

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            message: 'Error no contiene un archivo',
            error: {
                message: 'Debe de seleccionar una imagen'
            }
        })
    }

    // Get Name file
    const file = request.files.img;
    const extension = file.name.split('.').pop();

    const validExtension = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtension.indexOf(extension) < 0) {
        return response.status(400).json({
            ok: false,
            message: 'Error',
            error: {
                message: 'Extension no valida'
            }
        })
    }

    // Name random
    const nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`;

    const path = `./uploads/${type}/${nameFile}`;

    file.mv(path, (error) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                message: 'Error',
                error: {
                    message: 'Error al mover el archivo'
                }
            })
        }

        uploadByType(type, id, nameFile, response);

        
    });


});

function uploadByType(type, id, nameFile, response) {

    if (type === 'users') {
        Users.findById(id, (error, user) => {
            if (!user) {
                return response.status(400).json({
                    ok: false,
                    message: 'Usuario no existe',
                    error: {
                        message: 'Usuario no existe'
                    }
                });
            }

            const oldPath = './uploads/users/' + user.img;
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            user.img = nameFile;
            user.password = '******';

            user.save((error, userUpdate) => {
                return response.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    user: userUpdate
                });
            });
        });
    }
    if (type === 'doctors') {
        Doctors.findById(id, (error, doctor) => {

            if (!doctor) {
                return response.status(400).json({
                    ok: false,
                    message: 'Medico no existe',
                    error: {
                        message: 'Medico no existe'
                    }
                });
            }

            const oldPath = './uploads/users/' + doctor.img;
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            doctor.img = nameFile;
            doctor.password = '******';

            doctor.save((error, doctorUpdate) => {
                return response.status(200).json({
                    ok: true,
                    message: 'Imagen de doctor actualizada',
                    doctor: doctorUpdate
                });
            });
        });
    } 
    if (type === 'hospitals') {
        Hospitals.findById(id, (error, hospital) => {

            if (!hospital) {
                return response.status(400).json({
                    ok: false,
                    message: 'Hospital no existe',
                    error: {
                        message: 'Hospital no existe'
                    }
                });
            }

            const oldPath = './uploads/users/' + hospital.img;
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = nameFile;
            hospital.password = '******';

            hospital.save((error, hospitalUpdate) => {
                return response.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada',
                    hospital: hospitalUpdate
                });
            });
        });
    }

}

module.exports = app;