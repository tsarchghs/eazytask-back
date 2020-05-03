const yup = require("yup")
const common = require("../common");

module.exports = yup.object().shape({
    query: yup.object().shape({
        taskId: common.id.required(),
    })
})