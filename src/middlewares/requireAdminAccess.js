
const { ErrorHandler } = require("../utils/error")

module.exports = (req,res,next) => {
    if (!req.user.isAdmin) throw new ErrorHandler(401, "Unauthorized")
    next();
}