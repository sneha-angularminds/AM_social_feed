const mongoose = require("mongoose");

const Scehma = mongoose.Schema;

const bcrypt = require("bcryptjs");

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
    // validate: [passwordValidator, "incorrect password field"],
  },
});

function emailValidator(value) {
  return /^.+@.+\..+$/.test(value);
}

// function passwordValidator(value) {
//   return /^.+@.+\..+$/.test(value);
// }
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);
    this.password = passwordHash;
    next();
  } catch (err) {
    next(error);
  }
});

userSchema.methods.isPasswordValid = async function (value) {
  try {
    return await bcrypt.compare(value, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.models("user", registerSchema);