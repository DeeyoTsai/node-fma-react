const Joi = require("joi");

const createUserValidation = (data) => {
  const schema = Joi.object({
    employee: Joi.string().min(5).required(),
    password: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(50).required().email(),
    level: Joi.string().required().valid("normal", "super"),
  });
  return schema.validate(data);
};

module.exports.createUserValidation = createUserValidation;
