const { findUserByPk } = require("../lib/users-dal");
const { ErrorHandler } = require("../utils/error")

module.exports = async (req,res,next) => {
    let tasker = await req.user.getTasker();
    if (!tasker) throw new ErrorHandler(401,"No tasker found Unauthorized")
    req.user.tasker = tasker;
    next();
}