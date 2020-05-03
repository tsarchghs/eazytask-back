const yup = require("yup");
const { password } = require("../../utils/validations")

const post_auth = yup.object().shape({
    requestBody: yup.object().shape({
        email: yup.string().email().required(),
        password
    }).required()
})

module.exports = {
    post_auth
}