
const { Category } = require("../../models")

const { ErrorHandler } = require("../../utils/error")

module.exports = {
    findAll: async () => (await Category.findAll()),
    createCategory: async ({ name, createdByUser }) => {
        try {
            return await Category.create({ name, createdByUser })
        } catch (err) {
            if (err.parent.code === "ER_DUP_ENTRY")
            throw new ErrorHandler(409, "Cannot create resource because it conflicts with the current state of the server.", [
                "category.name must be unique"
            ])
        }
    }
}