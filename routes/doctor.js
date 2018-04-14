// Requires
const express = require('express');

// Init Variables
const app = express();
const Doctors = require('../models/doctor');

const mdAuth = require('../middlewares/auth');

app.get('/', (request, response, next) => {

    let offset = request.query.offset || 0;
    offset = Number(offset);

    Doctors.find({}, 'name img user hospital')
        .skip(offset)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((error, collectionDoctors) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error medico',
                errors: error
            });
        } 
        Doctors.count({}, (error, countMax) => {

            response.status(200).json({
                ok: true,
                doctors: collectionDoctors,
                max: countMax
            });
        });
            
        
    });

});



app.post('/', mdAuth.verifyToken, (request, response) => {

    const body = request.body;

    const doctor = new Doctors({
        name: body.name,
        user: request.user._id,
        hospital: body.hospital
    });

    doctor.save((error, doctorSave) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                message: 'Error al crear doctor',
                errors: error
            });
            
        }
        
        response.status(201).json({
            ok: true,
            doctor: doctorSave
        });

    });

});

app.put('/:id', mdAuth.verifyToken, (request, response) => {
    const id = request.params.id;

    Doctors.findById(id, (error, doctor) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al buscar el doctor',
                errors: error
            });
            
        }

        if (!doctor) {
            return response.status(400).json({
                ok: false,
                message: `El doctor con id ${id} no existe`,
                doctor: doctor,
                errors: {
                    message: 'No existe un doctor con ese id.'
                }
            });
        }

        const body = request.body;
    
        doctor.name = body.name;
        doctor.user = request.user._id;
        doctor.hospital = body.hospital;
    
        doctor.save((error, doctorSave) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el doctor',
                    errors: error
                });
                
            }
            response.status(200).json({
                ok: true,
                doctor: doctorSave
            });
        });
        
    });



});


app.delete('/:id', mdAuth.verifyToken, (request, response) => {
    const id = request.params.id;

    Doctors.findByIdAndRemove(id, (error, hospitalDelete) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al borrar hospital',
                errors: error
            });
            
        }

        if (!hospitalDelete) {
            return response.status(400).json({
                ok: false,
                message: 'No existe un hospital con ese id.',
                errors: {
                    message: 'No existe un hospital con ese id.'
                }
            });
            
        }

        response.status(200).json({
            ok: true,
            hospital: hospitalDelete
        });
    });
});

module.exports = app;