const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

// Verify token
exports.verifyToken = function(request, response, next) {
    const token = request.query.token;
    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                message: 'Error en token',
                errors: error
            });
        }
        request.user = decoded.user;
        next();

    });

}
