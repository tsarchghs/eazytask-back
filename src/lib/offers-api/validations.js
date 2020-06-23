const yup = require("yup")
const common = require("../utils/validations");

module.exports = {
    get_offers: yup.object().shape({
        query: yup.object().shape({
            UserId: common.id,
        })
    }),
    get_offers_id: yup.object().shape({
        params: yup.object().shape({
            offerId: common.id.required(),
        }).required(),
        query: yup.object().shape({
            fields: yup.string(),
        })
    }),
    accept_offer: yup.object().shape({
        params: yup.object().shape({
            taskId: common.id.required(),
            offerId: common.id.required(),
        }).required(),
    }),
    post_offers: yup.object().shape({
        requestBody: yup.object().shape({
            taskId: common.id.required(),
            amount: yup.number().required(),
            description: yup.string()
        })
    })
}