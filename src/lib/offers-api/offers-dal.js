
const { Task, Tasker, Offer, User } = require("../../models")

const { ErrorHandler } = require("../../utils/error")

const getModelsFromFields = require("../utils/getModelsFromFields");
const cloneDeep = require("../utils/cloneDeep");

const FIELD_MODEL = {
    tasker: { model: Tasker, include: [ User ] },
    task: { model: Task.scope("all"), required: false, include: [ { model: Offer, required: false } ] }
}

module.exports = {
    findAll: async ({UserId}) => {
        let where = {}
        let offers = await Offer.findAll({ where, include: [
                {
                    model: Tasker,
                    where: { UserId },
                    include: [ { model: User, where: { deleted: false } } ]
                },
                Task
            ]
        })
        return offers;
    },
    findOne: async (offerId, options = {}) => {
        let offer = await Offer.findOne({
            where: { id: offerId },
            include: options.fields && getModelsFromFields(FIELD_MODEL, options.fields),
        })
        if (!offer) {
            throw new ErrorHandler(404, "Not found", [`Offer not found`])
        }
        return offer;
    },
    acceptOffer: async ({taskId,offerId,currentUser}) => {
        console.log({ taskId, offerId, currentUser })
        let alreadyExists = await Offer.findOne({
            where: { TaskId: taskId, status: "ACCEPTED" }
        })
        if (alreadyExists) throw new ErrorHandler(403, "Already exists", [`Task already has an accepted offer`])
        let offer = await Offer.findOne({where: { id: offerId }});
        if (!offer) throw new ErrorHandler(404, "Not found", [`Offer not found`])
        let updated_offer = await offer.update({ status: "ACCEPTED" })
        console.log(updated_offer)
        return updated_offer
    },
    createOffer: async data =>  {
        let include = getModelsFromFields(FIELD_MODEL,data.fields);
        delete data["fields"];
        
        try {
            return await Offer.create({ ...data, status: "ACTIVE" }, { include })
        } catch (err) {
            if (
                err.original.code === "ER_NO_REFERENCED_ROW_2" &&
                err.fields.indexOf("TaskId") !== -1
            ) throw new ErrorHandler(404,"Task with taskId not found")
        }
    },
    findByTaskerAndTask: async (tasker_pk,task_pk) => await Offer.findOne({
        where: { 
            TaskerId: tasker_pk, 
            TaskId: task_pk 
        }
    })
}