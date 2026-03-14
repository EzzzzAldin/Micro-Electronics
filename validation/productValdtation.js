const Joi = require("joi")





const addProductSchema = Joi.object({
    name: Joi.string().min(5).max(16).required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().min(0).positive().required()
});

module.exports = addProductSchema;