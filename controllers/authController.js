const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { registerSchema, loginSchema } = require("./validation/authValidation");

const register = async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }

    const { username, email, password, role } = value;

    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ msg: "Account Already Exist" });
    // Create New User
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    // Response

    res.status(201).json({
      msg: "Done Created User",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    // Get Data
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    // Validated Data
    if (error) {
      return res.status(400).json({
        msg: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ msg: "Your Account Not Found Please Create Account" });

    // Match Password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ msg: "Invalid Password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      msg: "Success Login",
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
};
