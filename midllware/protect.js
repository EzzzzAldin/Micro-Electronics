const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModels = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(process.env.JWT_SECRET);
    // console.log(decoded);
    // console.log(token);
    
    //  Check if user still exists
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token user ID",
      });
    }

    const currentUser = await UserModels.findById(decoded.userId);
    // console.log(currentUser);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }
    // Attach user to request
    req.user = currentUser;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;
