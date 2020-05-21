
const { City } = require("../../models")

const { ErrorHandler } = require("../../utils/error");

module.exports = {
    findCityByPk: async pk => await City.findByPk(pk),
    findCityByName: async name => {
        return await City.findOne({ where: { name } })
    },
    createCity: async ({ name, createdByUser }) => {
        try {
            return await City.create({ name, createdByUser })
        } catch (err) {
            if (err.parent.code === "ER_DUP_ENTRY")
            throw new ErrorHandler(409, "Cannot create resource because it conflicts with the current state of the server.", [
                "city.name must be unique"
            ])
        }
    }

}