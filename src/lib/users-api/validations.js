const yup = require("yup");
const { password } = require("../utils/validations");

module.exports = {
    post_users: yup.object().shape({
        requestBody: yup.object().shape({
            first_name: yup.string().required().min(2),
            last_name: yup.string().required().min(2),
            email: yup.string().required().email(),
            password: password.required()
        })
    }),
    patch_users: yup.object().shape({
        first_name: yup.string().min(2),
        lastname: yup.string().min(2),
        email: yup.string().email(),
        password,
        cities: yup.array().of(yup.string()),
        skills: yup.array().of(yup.string()),
        languages: yup.array().of(yup.string()),
        zip: yup.string(),
        address: yup.string(),
        profile_image: yup.string(),
        cover_image: yup.string(),
        notification_option: yup.string().oneOf(["SMS", "EMAIL"])
    })
}