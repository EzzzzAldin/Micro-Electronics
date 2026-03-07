const joi = require("joi");

const registerSchema = joi.object({
    username: joi.string().min(6).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(255).required(),
    role: joi.string().valid("admin", "user").default("user")
});

module.exports = registerSchema;