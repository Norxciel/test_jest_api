const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeaders = req.headers?.authorization;

    const authToken = authHeaders?.split(' ')[1] || null;
    try {
        if (!authToken) {
            throw new Error();
        }
        const user = jwt.verify(authToken, process.env.JWT_SECRET);
        // console.log(authToken);
        if (!user) {
            throw new Error();
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = auth;
