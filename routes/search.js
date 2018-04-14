// Requires
const express = require('express');

// Init Variables
const app = express();

const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

// Routes
app.get('/:all/:search', (request, response, next) => {

    const search = request.params.search;
    const regex = new RegExp(search, 'i');

    Promise.all([ 
            searchHospitals(search, regex), 
            searchDoctors(search, regex),
            searchUsers(search, regex)
        ])
        .then(result => {
            response.status(200).json({
                ok: true,
                hospitals: result[0],
                doctors: result[1],
                users: result[2]
            });

        })
        .catch(error => {
            response.status(500).json({
                ok: false,
                error: error
            });
        });

});

app.get('/collection/:table/:search', (request, response) => {
    var table = request.params.table;
    var search = request.params.search;
    const regex = new RegExp(search, 'i');

    var promise;
    switch (table) {
        case 'users':
            promise = searchUsers(search, regex);
            break;
        case 'hospitals':
            promise = searchHospitals(search, regex);
            break;
        case 'doctors':
            promise = searchDoctors(search, regex);
            break;
        default:
            return response.status(400).json({
                ok: false,
                error: 'Error al ejecutar la busqueda'
            });
            break;
    }

    promise.then(data => {
        response.status(200).json({
            ok: true,
            [table]: data
        });
    })
});

function searchHospitals(search, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((error, hospital) => {
            if (error) {
                reject('Error al cargar hospitales');
            } else {
                resolve(hospital);
            }
        });

    });
}

function searchDoctors(search, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((error, doctors) => {
            if (error) {
                reject('Error al cargar doctores');
            } else {
                resolve(doctors);
            }
        });

    });
}


function searchUsers(search, regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role img')
            .or([{name: search}, {email: regex}])
            .exec((error, users) => {
                if (error) {
                    reject('Error al cargar usuarios', error);
                } else {
                    resolve(users);
                }
            })
    })
}

module.exports = app;