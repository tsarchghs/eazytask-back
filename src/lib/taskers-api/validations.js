const yup = require("yup");
const { id } = require("../utils/validations");

let stringArray = yup.array().of(
    yup.string()
)//.required()

module.exports = {
    get_taskerId: yup.object().shape({
        params: yup.object().shape({
            taskerId: id.required()
        })
    }),
    post_taskers: yup.object().shape({
        requestBody: yup.object().shape({
            cities: stringArray,
            languages: stringArray,
            skills: stringArray,
        })
    }),
    patch_taskers: yup.object().shape({
        requestBody: yup.object().shape({
            cities: stringArray,
            languages: stringArray,
            skills: stringArray,
        })
    }),
}