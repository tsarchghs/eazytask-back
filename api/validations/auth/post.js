const yup = require("yup");
const { password } = require("../common")

module.exports = {
    email: yup.required.email(),
    password
}