
const { Category } = require("../../models")

module.exports = {
    findAll: async ({ categoryGroupId }) => (
        await Category.findAll({ 
            where: { 
                CategoryGroupId: categoryGroupId
            }
        })
    )
}