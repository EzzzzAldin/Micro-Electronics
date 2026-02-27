const Joi = require("joi");

const addCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = addCartSchema;
