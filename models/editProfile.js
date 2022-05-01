const mongoose = require('mongoose');

const editSchema = new mongoose.Schema({
    name: {type:String,
    required: true},
    bio: {type: String},
    gender: {type:String,
        required: true},
    dob : {
        type:String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [emailValidator, "incorrect email field"],
      },
    mobile: {
        type: String
    },
    // photo: {
    //     type: String
    // }
})

function emailValidator(value) {
    return /^.+@.+\..+$/.test(value);
  }