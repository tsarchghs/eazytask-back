
const yup = require("yup");

module.exports = {
    post_categories: yup.object().shape({
        requestBody: yup.object().shape({
            name: yup.string()
        })
    })
}