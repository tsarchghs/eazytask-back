const yup = require("yup");
const { id } = require("../../utils/validations");

let stringArray = yup.array().of(
    yup.string()
).required()

module.exports = {
    get_taskerId: yup.object().shape({
        query: yup.object().shape({
            taskerId: id.required()
        })
    }),
    post_taskers: yup.object().shape({
        requestBody: yup.object().shape({
            area_of_activity: yup.string().required(),
            languages: stringArray,
            skills: stringArray,
        })
    })
}