const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Get Token From Headers
    const authHeaders = req.headers.authorization;

    if (!authHeaders) return res.json({ msg: "Not Find Token" });

    const token = authHeaders.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authMiddleware;
