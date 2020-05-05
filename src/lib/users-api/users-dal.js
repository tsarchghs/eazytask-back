
const { User } = require("../../models")

const bcrypt = require("bcrypt")
const { SALT_ROUNDS } = require("../../configs")
const { ErrorHandler } = require("../../utils/error")

const { findUserByPk } = require("../users-dal");
const uploadFile = require("../aws/uploadFile");

module.exports = {
    createUser: async user => {
        if (!user.notification_option) user.notification_option = "EMAIL"
        let createdUser;

        let hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        try {
            createdUser = await User.create({ ...user, password: hashedPassword, isAdmin: false })
        } catch (err) {
            console.log(err)
            throw new ErrorHandler(409, "Cannot create resource because it conflicts with the current state of the server.", err.errors.map(error => {
                return error.message.indexOf("email") !== -1 ? "users.email must be unique" : error.message
            }))
        }
        createdUser.password = undefined
        return createdUser
    },
    patchUser: async (id,patchFields) => {
        let user = await findUserByPk(id)
        if (!user) throw ErrorHandler(404, "The resource you tried to update does not exist")
        if (patchFields.password) throw new Error("To be decided if we go for confirm password or not.")
        if (patchFields.profile_image) patchFields.profile_image = await uploadFile(patchFields.profile_image)
        return await user.update({ ...patchFields, id: undefined })
    }

}