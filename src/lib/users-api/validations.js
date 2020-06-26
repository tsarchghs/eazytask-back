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
        deleted: yup.bool(),
        reason: yup.string(),
    }),
    post_reset_password: yup.object().shape({
        requestBody: yup.object().shape({
            email: yup.string().email().required(),
            code: yup.number().required().test("len", "code does not match required format", val => String(val).length === 6),
            new_password: password.required(),
            confirm_new_password: password.required().oneOf([yup.ref("new_password")]),
        })
    }),
    post_send_verification_code: yup.object().shape({
        requestBody: yup.object().shape({
            email: yup.string().email().required()
        })
    })
}