
const { Message, User } = require("../../models")

module.exports = {
    findAll: async ({taskId}) => {
        let where = {}
        if (taskId) where["TaskId"] = Number(taskId);
        return Message.findAll({where, include: [ User ]});
    },
    createMessage: async (data,currentUserId) => {
        data.client_createdAt = new Date(data.client_createdAt);
        data.UserId = currentUserId;
        let message = Message.create(data);
        return Message.findOne({ where: { id: message.id }});
    }
        
}