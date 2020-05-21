
const { City } = require("../../models")


module.exports = {
    findAll: async () => (await City.findAll()),
}