
const yup = require("yup");

module.exports = {
    post_categories_groups: yup.object().shape({
        requestBody: yup.object().shape({
            name: yup.string().required()
        })
    })
}