
const { ErrorHandler, handleError } = require("../utils/error");

module.exports = (err, req, res, next) => {
    console.log(err,900)
    console.log("----------------------------------------------")
    if (err instanceof ErrorHandler) return handleError(err, res);
    else if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            status: "error",
            message:"Unauthorized",
            code: 401,
        })
    } else {
        if (process.env.DEVELOPMENT) throw err;
        else res.status(500).json()
    }
}