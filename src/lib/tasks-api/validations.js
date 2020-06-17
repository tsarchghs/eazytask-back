
const yup = require("yup");
const common = require("../utils/validations");

module.exports = {
    get_tasks: yup.object().shape({
        query: yup.object().shape({
            fields: yup.string(),
            category_id: yup.number().positive().integer(),
            due_date: yup.date(),
            expire_soon: yup.boolean(),
            min_budget: yup.number().integer(),
            max_budget: yup.number().integer(),
            title: yup.string(),
            limit: yup.number(),
            UserId: common.id,
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
        params: yup.object().shape({
            taskId: common.id.required(),
        })
    }),
    post_tasks: yup.object().shape({
        query: yup.object().shape({
            fields: yup.string()
        })
    }),
    post_tasks_requestBody: yup.object().shape({
        category: yup.string().required(),
        title: yup.string().required(),
        address: yup.string().required(),
        zipCode: yup.string().required(),
        city: yup.string().required(),
        description: yup.string().required(),
        due_date_type: yup.string().oneOf(["FIXED_DATE", "UNTIL_DATE"]).required(),
        due_date: yup.date().required(),
        expected_price: yup.number()
    }),
    patch_tasks: yup.object().shape({
        params: yup.object().shape({
            taskId: common.id.required(),
        })
    }),
    patch_tasks_requestBody: yup.object().shape({
        category: yup.string(),
        title: yup.string(),
        location: yup.string(),
        description: yup.string(),
        due_date_type: yup.string().oneOf(["FIXED_DATE", "UNTIL_DATE"]),
        due_date: yup.date(),
        expected_price: yup.number(),
        status: yup.string().oneOf(["ACTIVE", "DEACTIVATED", "ACCEPTED"])
    }),
    delete_tasks: yup.object().shape({
        params: yup.object().shape({
            taskId: yup.number().required()
        })
    })
}