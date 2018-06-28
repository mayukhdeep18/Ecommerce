const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("req",req.headers.authorization.split(" ")[1]);
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY_USER);
        console.log("token",token);
        console.log("decoded",decoded);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};