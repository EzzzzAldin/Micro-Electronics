const joi = require("joi");

const addProductSchema = joi.object({
  name: joi.string().min(3).required(),
  price: joi.number().positive().required(),
  stock: joi.number().min(0).positive().required(),
});

module.exports = addProductSchema;
