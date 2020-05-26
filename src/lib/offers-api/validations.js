const yup = require("yup")
const common = require("../utils/validations");

module.exports = {
    post_offers: yup.object().shape({
        requestBody: yup.object().shape({
            taskId: common.id.required(),
            amount: yup.number().required(),
            description: yup.string()
        })
    })
}