const yup = require("yup");
const { password } = require("../../utils/validations")

module.exports = {
    post_auth: yup.object().shape({
        requestBody: yup.object().shape({
            email: yup.string().email().required(),
            password: password.required()
        }).required()
    })
}