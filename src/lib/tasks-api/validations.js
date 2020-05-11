
const yup = require("yup");
const common = require("../../utils/validations");

module.exports = {
    get_tasks: yup.object().shape({
        query: yup.object().shape({
            fields: yup.string(),
            category_id: yup.number().positive().integer(),
            due_date: yup.date(),
            expire_soon: yup.boolean(),
            min_budget: yup.number().integer(),
            max_budget: yup.number().integer(),
            title: yup.string()
        })
    }),
    post_tasks: yup.object().shape({
        query: yup.object().shape({
            fields: yup.string()
        })
    }),
    get_taskId: yup.object().shape({
        params: yup.object().shape({
            taskId: common.id.required(),
        }).required(),
        query: yup.object().shape({
            fields: yup.string(),
        })
    }),
    get_taskId_qa: yup.object().shape({
        taskId: common.id.required(),
    }),
    post_tasks_requestBody: yup.object().shape({
        category_id: common.id.required(),
        title: yup.string().required(),
        location: yup.string().required(),
        description: yup.string().required(),
        due_date_type: yup.string().oneOf(["FIXED_DATE", "UNTIL_DATE"]).required(),
        due_date: yup.date().required(),
        expected_price: yup.number()
    })
}