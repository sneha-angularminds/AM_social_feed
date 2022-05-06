const mongoose = require("mongoose");

const Scehma = mongoose.Schema;

const bcrypt = require("bcryptjs");

const registerSchema = new Scehma({
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true,
    validate: [emailValidator, "incorrect email field"],
  },
  password: {
    type: String,
    // required: true
  },
  name: {
    type: String,
  },
  bio: { type: String },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  mobile: {
    type: String,
  },
  photo: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

function emailValidator(value) {
  return /^.+@.+\..+$/.test(value);
}

registerSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);
    this.password = passwordHash;
    next();
  } catch (err) {
    next(error);
  }
});

registerSchema.methods.isPasswordValid = async function (value) {
  try {
    return await bcrypt.compare(value, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("user", registerSchema);