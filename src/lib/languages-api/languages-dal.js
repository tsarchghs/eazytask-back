
const { Language } = require("../../models")


module.exports = {
    findAll: async () => (await Language.findAll()),
}