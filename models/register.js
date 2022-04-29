const mongoose = require("mongoose");

const Scehma = mongoose.Schema;

const registerSchema = new Scehma({
  firstName: {
    type: String,
    required: true,
  },
  lasttName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [emailValidator, "incorrect email field"],
  },
  password: {
    type: String,
    required: true,
    validate: [passwordValidator, "incorrect password field"],
  },
});

function emailValidator(value) {
  return /^.+@.+\..+$/.test(value);
}

function passwordValidator(value) {
  return /^.+@.+\..+$/.test(value);
}
