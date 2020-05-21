
const { CategoryGroup } = require("../../models")


module.exports = {
    findAll: async () => (await CategoryGroup.findAll()),
    createCategoryGroup: async ({name}) => (await CategoryGroup.create({name}))
}