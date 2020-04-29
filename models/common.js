
const NonNullUniqueString = stringType => ({
    type: stringType,
    unique: true,
    allowNull: false
})

const NonNullString = stringType => ({
    type: stringType,
    allowNull: false
})

const NonNullStatusField = enumType => ({
    type: enumType("ACTIVE", "DEACTIVATED", "ACCEPTED"),
    default: "ACTIVE",
    allowNull: false
})

module.exports = {
    NonNullUniqueString,
    NonNullString,
    NonNullStatusField
}