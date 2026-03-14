const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;
        // console.log(authHeader)
        if(!authHeader)return res.json({msg: "not find"})
        const token = authHeader.split(" ")[1];
        // console.log(token);
        const decodedToken = jwt.verify(token, secret);
        // console.log(decodedToken);
        req.user = decodedToken; // user = the token payload
        next(); // move forward
    }catch(err){
        console.log(err)
    }
}

module.exports = authMiddleware;
