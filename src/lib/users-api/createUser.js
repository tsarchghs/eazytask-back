
const { User } = require("../../models")
const bcrypt = require("bcrypt")
const { SALT_ROUNDS } = require("../../configs")
const { ErrorHandler } = require("../../utils/error")

module.exports = async (user) => {
    if (!user.notification_option) user.notification_option = "EMAIL"
    let createdUser;

    let hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    try {
        createdUser = await User.create({ ...user, password: hashedPassword, isAdmin: false })
    } catch (err) {
        throw new ErrorHandler(409, "Cannot create resource because it conflicts with the current state of the server.", err.errors.map(_ => _.message)) 
    }
    createdUser.password = undefined
    return createdUser
}