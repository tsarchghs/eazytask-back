const yup = require("yup");
const common = require("../common");

module.exports = yup.object().shape({
    query: yup.object().shape({
        fields: common.user_offers_fields,
        category_id: common.id,
        due_date: yup.date(),
        expire_soon: yup.boolean(),
        min_budget: yup.number().integer(),
        max_budget: yup.number().integer(),
        title: yup.string()
    })
})