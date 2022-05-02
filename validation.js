const Joi = require("joi");
const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

exports.validateUser = (user) => {
  const JoiSchema = Joi.object({
    password: Joi.string().min(6).regex(regularExpression),
  });
  return JoiSchema.validate(user);
};

exports.changePassword = (user) => {
  const JoiSchema = Joi.object({
    oldPassword: Joi.string().min(6).regex(regularExpression),
    newPassword: Joi.string().min(6).regex(regularExpression),
    confirmPassword: Joi.string().min(6).regex(regularExpression),
  });
  return JoiSchema.validate(user);
};

exports.editProfile = (user) => {
  const JoiSchema = Joi.object({
      name: Joi.string().required(),
      gender: Joi.string().required()
  });
  return JoiSchema.validate(user);
};

// exports.feedPosts = (user) => {
//   const JoiSchema = Joi.object({
//     postImg: ,
//     caption: ,
//     like: ,
//     comment:   
//   });
//   return JoiSchema.validate(user);
// };
