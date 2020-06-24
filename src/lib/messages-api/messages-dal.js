
const { Message } = require("../../models")


module.exports = {
    findAll: async ({taskId}) => {
        let where = {}
        if (taskId) where["TaskId"] = Number(taskId);
        return Message.findAll({where});
    },
    createMessage: async (data,currentUserId) => {
        data.client_createdAt = new Date(data.client_createdAt);
        data.UserId = currentUserId;
        return Message.create(data)
    }
        
}