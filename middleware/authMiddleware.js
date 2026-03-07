const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.json({msg: "Token not found!"});

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    
    next();
    } 
    catch(error) {
        console.log(error);
    }
}

module.exports = authMiddleware;