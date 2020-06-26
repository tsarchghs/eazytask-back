
const { User, Tasker } = require("../../models")

module.exports = {
    findUserByPk: async (pk,includeTasker) => {
        let include = []
        if (includeTasker) include.push(Tasker);
        return await User.findOne({ where: { id: pk, deleted: false }, include })
    }
}