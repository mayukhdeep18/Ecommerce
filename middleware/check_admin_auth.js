const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("key",process.env.SUPER_ADMIN);
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_KEY_SUPER_ADMIN);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};