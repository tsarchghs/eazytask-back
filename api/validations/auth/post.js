const yup = require("yup");
const { password } = require("../common")

module.exports = yup.object().shape({
    requestBody: yup.object().shape({
        email: yup.string().email().required(),
        password
    }).required()
})