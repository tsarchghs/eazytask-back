
const { Category } = require("../../models")

module.exports = {
    findAll: async () => (await Category.findAll())
}