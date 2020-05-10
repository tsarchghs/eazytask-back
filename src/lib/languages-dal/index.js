
const { Language } = require("../../models")

module.exports = {
    findLanguageByPk: async pk => await Language.findByPk(pk),
    findLanguageByName: async name => {
        return await Language.findOne({ where: { name } })
    },
    createLanguage: async ({ name, createdByUser }) => (await Language.create({ name, createdByUser }))

}