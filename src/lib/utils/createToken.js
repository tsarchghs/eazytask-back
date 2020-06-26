const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../../configs")

module.exports = (userId, extra = {}, expiresIn) => {
    let options = {}
    if (expiresIn) options.expiresIn = expiresIn;
    const token = jwt.sign({
        userId: userId,
        ...extra
    }, JWT_SECRET, options);
    return token
}