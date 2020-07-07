const errorHandler = require("./errorHandler");
const validateRequest = require("./validateRequest")
const caseInsensitiveEmail = require("./caseInsensitiveEmail")
const jwtRequired = require("./jwtRequired")
const passUserFromJWT = require("./passUserFromJWT")
const passTaskerFromUser = require("./passTaskerFromUser");
const requireAdminAccess = require("./requireAdminAccess")
const allowCrossDomain = require("./allowCrossDomain");
const adminRequired = require("./adminRequired");

module.exports = {
    errorHandler,
    validateRequest,
    caseInsensitiveEmail,
    jwtRequired,
    passUserFromJWT,
    passTaskerFromUser,
    requireAdminAccess, 
    allowCrossDomain,
    adminRequired
}