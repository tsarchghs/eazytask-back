const { findUserByPk } = require("../lib/users-dal");

module.exports = async (req,res,next) => {
    req.user = await findUserByPk(req.auth.userId)
    next();
}