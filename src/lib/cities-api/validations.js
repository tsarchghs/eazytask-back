
const yup = require("yup");

module.exports = {
    post_cities: yup.object().shape({
        requestBody: yup.object().shape({
            name: yup.string().required()
        })
    })
}