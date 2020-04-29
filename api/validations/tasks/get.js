const yup = require("yup");

module.exports = yup.object().shape({
    fields: yup.array().of(yup.string().oneOf(["user","offers"])),
    category_id: yup.number().positive().integer(),
    due_date: yup.date(),
    expire_soon: yup.boolean(),
    min_budget: yup.number().integer(),
    max_budget: yup.number().integer(),
    title: yup.string()
})