
const { handleError } = require("../utils/error");

module.exports = (err, req, res, next) => {
    return handleError(err, res);
}