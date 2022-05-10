const Joi = require("joi");
const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

exports.validateRegister = (user) => {
  const JoiSchema = Joi.object({
    password: Joi.string().min(6).regex(regularExpression).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required()
    
  });
  return JoiSchema.validate(user);
};

exports.validateUser = (user) => {
  const JoiSchema = Joi.object({
    password: Joi.string().min(6).regex(regularExpression).required(),
    email: Joi.string().required(),
  });
  return JoiSchema.validate(user);
};

exports.changePassword = (user) => {
  const JoiSchema = Joi.object({
    oldPassword: Joi.string().min(6).regex(regularExpression).required(),
    newPassword: Joi.string().min(6).regex(regularExpression).required(),
    confirmPassword: Joi.string().min(6).regex(regularExpression).required(),
  });
  return JoiSchema.validate(user);
};

exports.editProfile = (user) => {
  const JoiSchema = Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().required(),
    email: Joi.string().required(),
    bio: Joi.string(),
    dob: Joi.string(),
    mobile: Joi.string(),
    photo: Joi.string(),
    removeImg: Joi.boolean()
  });
  return JoiSchema.validate(user);
};

