
const yup = require("yup");

module.exports = {
    post_languages: yup.object().shape({
        requestBody: yup.object().shape({
            name: yup.string()
        })
    })
}