
const yup = require("yup")

module.exports = {
    get_latest_offer_received_notification_validation:  yup.object().shape({
        params: yup.object().shape({
            task_id: yup.number().required()
        })
    })
}