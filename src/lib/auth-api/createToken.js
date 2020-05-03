const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../../configs")

module.exports = (userId) => {
    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET);
    return token
}