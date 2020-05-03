const yup = require("yup");
const { password } = require("../../utils/validations");

const post_users = yup.object().shape({
    requestBody: yup.object().shape({
        first_name: yup.string().required().min(2),
        last_name: yup.string().required().min(2),
        email: yup.string().required().email(),
        password
    })
})

module.exports = {
    post_users
}