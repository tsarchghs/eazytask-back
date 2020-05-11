
const { Skill } = require("../../models");

module.exports = {
    findSkillByName: async name => (await Skill.findOne({ where: { name } })),
    createSkill: async ({name, createdByUser}) => (await Skill.create({ name, createdByUser }))
}