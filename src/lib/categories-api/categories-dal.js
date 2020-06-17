
const { Category } = require("../../models")

module.exports = {
    findAll: async ({ categoryGroupId }) => {
        let where = {}
        if (categoryGroupId) where["CategoryGroupId"] = categoryGroupId
        return await Category.findAll({ where })
    }
}