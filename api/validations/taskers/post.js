const yup = require("yup");

module.exports = yup.object().shape({
    requestBody: yup.object().shape({
        area_of_activity: yup.string().required(),
        languages: yup.array().of(yup.string()),
        skills: yup.array().of(yup.string()),
    })
})