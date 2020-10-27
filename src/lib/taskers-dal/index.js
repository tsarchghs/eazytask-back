
const { Offer, Tasker } = require("../../models")

module.exports = {
    findTaskerOfTask: async (TaskId) => {
        let offer = await Offer.findOne({ where: { TaskId, status: "ACCEPTED" }})
        if (!offer) return;
        return await Tasker.findByPk(offer.TaskerId);
    }
}