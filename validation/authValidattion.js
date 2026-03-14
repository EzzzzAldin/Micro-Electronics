const joi = require("joi");
const registerSchema  =joi.object({
    username: joi.string().min(6).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(260).required(),
    role: joi.string().valid("admin", "user").default("user")
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(260).required()
})
module.exports= {registerSchema, loginSchema};
