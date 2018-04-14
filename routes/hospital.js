// Requires
const express = require('express');

// Init Variables
const app = express();
const Hospitals = require('../models/hospital');

const mdAuth = require('../middlewares/auth');

app.get('/', (request, response, next) => {

    let offset = request.query.offset || 0;
    offset = Number(offset);

    Hospitals.find({}, 'name img user')
        .skip(offset)
        .limit(5)
        .populate('user', 'name email')
        .exec((error, collectionHospitals) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error hospitals',
                errors: error
            });
        } 

        Hospitals.count({}, (error, countMax) => {

            response.status(200).json({
                ok: true,
                hospitals: collectionHospitals,
                max: countMax
            });
        }); 
        
    });

});



app.post('/', mdAuth.verifyToken, (request, response) => {

    const body = request.body;

    const hospital = new Hospitals({
        name: body.name,
        user: request.user._id
    });

    hospital.save((error, hospitalSave) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                message: 'Error al crear hospital',
                errors: error
            });
            
        }
        
        response.status(201).json({
            ok: true,
            hospital: hospitalSave
        });

    });

});

app.put('/:id', mdAuth.verifyToken, (request, response) => {
    const id = request.params.id;

    Hospitals.findById(id, (error, hospital) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al buscar el hospital',
                errors: error
            });
            
        }

        if (!hospital) {
            return response.status(400).json({
                ok: false,
                message: `El hospital con id ${id} no existe`,
                hospital: hospital,
                errors: {
                    message: 'No existe un hospital con ese id.'
                }
            });
        }

        const body = request.body;
    
        hospital.name = body.name;
        hospital.user = request.user._id;
    
        hospital.save((error, hospitalSave) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el hospital',
                    errors: error
                });
                
            }
            response.status(200).json({
                ok: true,
                hospital: hospitalSave
            });
        });
        
    });



});


app.delete('/:id', mdAuth.verifyToken, (request, response) => {
    const id = request.params.id;

    Hospitals.findByIdAndRemove(id, (error, hospitalDelete) => {
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