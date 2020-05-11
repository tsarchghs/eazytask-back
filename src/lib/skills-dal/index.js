
const { Skill } = require("../../models");

const { ErrorHandler } = require("../../utils/error")

module.exports = {
    findSkillByName: async name => (await Skill.findOne({ where: { name } })),
    createSkill: async ({name, createdByUser}) => {
        try {
            return await Skill.create({ name, createdByUser })
        } catch (err) {
            if (err.parent.code === "ER_DUP_ENTRY")
            throw new ErrorHandler(409, "Cannot create resource because it conflicts with the current state of the server.", [
                "skill.name must be unique"
            ])
        }
    }
}