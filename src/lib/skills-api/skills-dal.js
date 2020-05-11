
const { Skill } = require("../../models")


module.exports = {
    findAll: async () => (await Skill.findAll()),
}