
const { Skill } = require("../../models")


module.exports = {
    // findAll: async () => (await Skill.findAll({ where: { createdByUser: false } })),
    findAll: async () => (await Skill.findAll()),
}