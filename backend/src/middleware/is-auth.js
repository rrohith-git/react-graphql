const jwt = require('jsonwebtoken');
const ENVIRONMENT = 'DEV';

module.exports = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            req.isAuth = false;
            return next();
        }
        const token = authHeader.split(' ')[1];
        if (!token || token === '') {
            req.isAuth = false;
            return next();
        }
        const decodedToken = jwt.verify(token, process.env[`${ENVIRONMENT}_JWT_SECRET`], { algorithms: ['HS512'] });
        if (!decodedToken) {
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        req.userId = decodedToken.userId;
        return next();
    } catch (err) {
        res.status(400);
        res.send('Forbidden');
    }
}