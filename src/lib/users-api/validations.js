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
        notification_option: yup.string().oneOf(["SMS", "EMAIL"]),
        email: yup.string().email(),
        phone: yup.string(),
        profile_image: yup.string(),
        cover_image: yup.string(),
        zipCode: yup.string(),
        address: yup.string(),
        city: yup.string(),
        first_name: yup.string().min(2),
        lastname: yup.string().min(2),
        password,
        setupCompleted: yup.bool(),
    })
}