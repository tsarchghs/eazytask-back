
const { ErrorHandler, handleError } = require("../utils/error");

module.exports = (err, req, res, next) => {
    console.log(err,900,JSON.stringify(err),err instanceof ErrorHandler)
    console.log("----------------------------------------------")
    if (err instanceof ErrorHandler) return handleError(err, res);
    else if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: "error",
            message:"Unauthorized",
            code: 401,
        })
    } else {
        if (process.env.DEVELOPMENT) throw err;
        else return res.status(500).json()
    }
}