const User = require("../models/User");

const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    // get Data
    const { username, email, password, role } = req.body;
    // Validated Data
    if (!username || !email || !password)
      return res.status(400).json({ msg: "Missing Data" });

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
    const { email, password } = req.body;
    // Validated Data
    if (!email || !password)
      return res.status(400).json({ msg: "Missing Data" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ msg: "Your Account Not Found Please Create Account" });

    // Match Password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ msg: "Invalid Password" });

    res.status(200).json({
      msg: "Success Login",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
};
