
const yup = require("yup")
const common = require("../utils/validations");


module.exports = {
    post_reviews: yup.object().shape({
        requestBody: yup.object().shape({
            reliability: yup.number().integer(),
            punctuality: yup.number().integer(),
            accuracy: yup.number().integer(),
            quality: yup.number().integer(),
            friendliness: yup.number().integer(),
            cleanliness: yup.number().integer(),
            comment: yup.string(),
            TaskId: common.id.required()
        })
    }),
}