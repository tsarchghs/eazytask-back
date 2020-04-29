const yup = require("yup");
const common = require("../common");

module.exports = yup.object().shape({
    query: yup.object().shape({
        fields: common.user_offers_fields
    }),
    requestBody: yup.object().shape({
        category_id: common.id.required(),
        thumbnail: yup.string(),
        title: yup.string().required(),
        description: yup.string().required(),
        due_date_type: yup.string().oneOf(["FIXED_DATE","UNTIL_DATE"]).required(),
        due_date: yup.date().required(),
        expected_price: yup.number()
    })
})