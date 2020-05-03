const yup = require("yup")
const common = require("../common");

module.exports = yup.object().shape({
    requestBody: yup.object().shape({
        offerId: common.id.required(),
    })
})