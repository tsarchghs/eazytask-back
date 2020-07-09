
const { User, Tasker } = require("../../models")

module.exports = {
    findUserByPk: async (pk,includeTasker,scope) => {
        let include = []
        if (includeTasker) include.push(Tasker);
        let instance = User;
        if (scope) instance = instance.scope(scope)
        return await instance.findOne({ where: { id: pk, deleted: false }, include })
    }
}