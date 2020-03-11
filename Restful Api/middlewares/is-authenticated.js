const Jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;

    try {
        decodedToken = Jwt.verify(token, "veryStrongSecretveryStrongSecret");
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error("Your are not Authorized");
        err.statusCode(401);
        throw error;
    }

    req.userId = decodedToken.userId;
    req.userName = decodedToken.userName;
    next();
}