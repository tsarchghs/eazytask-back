const yup = require("yup")
const common = require("../common");

module.exports = yup.object().shape({
    task_id: common.id.required(),
    amount: yup.number().positive().required(),
    description: yup.string()
})