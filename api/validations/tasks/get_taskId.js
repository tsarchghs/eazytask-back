const yup = require("yup")
const common = require("../common");

module.exports = yup.object().shape({
    taskId: common.id.required(),
    fields: common.user_offers_fields
})