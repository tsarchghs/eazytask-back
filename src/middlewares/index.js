const errorHandler = require("./errorHandler");
const validateRequest = require("./validateRequest")
const caseInsensitiveEmail = require("./caseInsensitiveEmail")
const jwtRequired = require("./jwtRequired")
const passUserFromJWT = require("./passUserFromJWT")
const requireAdminAccess = require("./requireAdminAccess")
const allowCrossDomain = require("./allowCrossDomain");

module.exports = {
    errorHandler,
    validateRequest,
    caseInsensitiveEmail,
    jwtRequired,
    passUserFromJWT,
    requireAdminAccess, 
    allowCrossDomain
}