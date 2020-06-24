
const yup = require("yup");
const common = require("../utils/validations");

module.exports = {
    post_messages: yup.object().shape({
        requestBody: yup.object().shape({
            content: yup.string().required(),
            taskId: common.id,
            client_createdAt: yup.string().required(),
        })
    })
}