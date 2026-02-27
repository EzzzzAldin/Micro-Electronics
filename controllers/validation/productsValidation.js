const Joi = require("joi");

const addProductSchema = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(1).required(),
});

module.exports = addProductSchema;
