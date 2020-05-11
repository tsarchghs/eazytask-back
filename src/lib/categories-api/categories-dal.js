
const { Category } = require("../../models")


module.exports = {
    findAll: async () => (await Category.findAll()),
    createCategory: async ({name}) => (await Category.create({name}))
}