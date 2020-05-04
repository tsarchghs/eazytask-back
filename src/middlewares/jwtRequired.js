
const expressJwt = require('express-jwt');
const { JWT_SECRET } = require("../configs");


module.exports = expressJwt({ 
    secret: JWT_SECRET, 
    credentialsRequired: true,
    requestProperty: "auth"
})