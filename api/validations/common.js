const yup = require("yup");

module.exports = {
    password: yup.string().required().min(6),
}