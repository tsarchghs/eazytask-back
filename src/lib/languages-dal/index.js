
const { Language } = require("../../models")

const { ErrorHandler } = require("../../utils/error");


module.exports = {
    findLanguageByPk: async pk => await Language.findByPk(pk),
    findLanguageByName: async name => {
        return await Language.findOne({ where: { name } })
    },
    createLanguage: async ({ name, createdByUser }) => {
        try {
            return await Language.create({ name, createdByUser })
        } catch (err) {
            if (err.parent.code === "ER_DUP_ENTRY")
            throw new ErrorHandler(409, "Cannot create resource because it conflicts with the current state of the server.", [
                "language.name must be unique"
            ])
        }
    }

}