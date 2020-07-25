
const { User, Tasker, Skill, Language, City } = require("../../models")

module.exports = {
    findUserByPk: async (pk, includeTasker, scope, includeAll) => {
        let include = []
        if (includeTasker) include.push(Tasker);
        if (includeAll) include.push({
            model: Tasker,
            include: [
                { model: Skill, required: false },
                { model: Language, required: false },
                { model: City, required: false }
            ]
        })
        let instance = User;
        if (scope) instance = instance.scope(scope)
        return await instance.findOne({ where: { id: pk, deleted: false }, include })
    }
}