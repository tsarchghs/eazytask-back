const yup = require("yup");

module.exports = {
    id: yup.number().positive().integer(),
    password: yup.string().required().min(6),
    user_offers_fields: yup.array().of(yup.string().oneOf(["user", "offers"])),
}