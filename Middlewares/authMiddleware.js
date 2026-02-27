const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // get token
    const authHeader = req.headers.authorization;

    // Validate Auth Header
    if (!authHeader) return res.status(401).json({ msg: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userid, role

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Token" });
  }
};

module.exports = authMiddleware;
