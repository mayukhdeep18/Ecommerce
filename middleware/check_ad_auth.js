const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_KEY_ADMIN);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Session expired, please login again!'
        });
    }
};