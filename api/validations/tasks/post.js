const yup = require("yup");

module.exports = yup.object().shape({
    query: yup.object().shape({
        fields: yup.array().of(yup.string().oneOf("user","offers"))
    }),
    requestBody: yup.object().shape({
        category_id: yup.number().positive().integer().required(),
        thumbnail: yup.string(),
        title: yup.string().required(),
        description: yup.string().required(),
        due_date_type: yup.string().oneOf(["FIXED_DATE","UNTIL_DATE"]).required(),
        due_date: yup.date().required(),
        expected_price: yup.number()
    })
})