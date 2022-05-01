const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const editSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: { type: String },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [emailValidator, "incorrect email field"],
    },
    mobile: {
        type: String,
        required: true,
    },
    photo: {
        type: String
    }
})

function emailValidator(value) {
    return /^.+@.+\..+$/.test(value);
}

module.exports = mongoose.model('edit', editSchema);