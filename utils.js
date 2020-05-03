const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./configs.js');

const createToken = (userId) => {
    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET);
    return token
}

module.exports = {
    createToken
}