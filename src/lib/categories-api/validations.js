
const yup = require("yup");
const common = require("../utils/validations");

module.exports = {
    post_categories: yup.object().shape({
        requestBody: yup.object().shape({
            name: yup.string().required()
        }),
        query: yup.object().shape({
            categoryGroupId: common.id
        })
    })
}