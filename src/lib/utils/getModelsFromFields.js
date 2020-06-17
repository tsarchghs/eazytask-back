const { ErrorHandler } = require("../../utils/error");

const getModelsFromFields = (FIELD_MODEL,fields) => fields ? fields.split(",").map(x => {
    if (FIELD_MODEL[x]) return FIELD_MODEL[x]
    throw new ErrorHandler(403, "Validation error", [`query.fields does not support ${x}`])
}) : [];

module.exports = getModelsFromFields;