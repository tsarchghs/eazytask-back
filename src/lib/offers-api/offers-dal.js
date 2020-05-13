
const { Offer } = require("../../models")

const { ErrorHandler } = require("../../utils/error")

module.exports = {
    createOffer: async data =>  {
        try {
            return await Offer.create({ ...data, status: "ACTIVE" })
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