const yup = require("yup");
const { password } = require("../common");

module.exports = yup.object().shape({
    query: yup.object().shape({
        first_name: yup.string().required().min(2),
        lastname: yup.string().required().min(2),
        email: yup.string().required().email(),
        password,
        gender: yup.string(),
        date_of_birth: yup.date(),
        country: yup.string(),
        city: yup.string(),
        address: yup.string(),
        profile_image: yup.string(),
        notification_option: yup.string().oneOf("SMS","EMAIL")
    })
})