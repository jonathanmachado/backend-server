const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role permitido.'
};

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'El password es requerido'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
    google: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico.'});


module.exports = mongoose.model('Users', userSchema);