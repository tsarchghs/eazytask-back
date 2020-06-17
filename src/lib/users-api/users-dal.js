
const { User, Tasker, Task, City } = require("../../models")

const bcrypt = require("bcrypt")
const { SALT_ROUNDS } = require("../../configs")
const { ErrorHandler } = require("../../utils/error")

const { findUserByPk } = require("../users-dal");
const uploadFile = require("../aws/uploadFile");

const getModelsFromFields = require("../utils/getModelsFromFields");
const cloneDeep = require("../utils/cloneDeep");

const FIELD_MODEL = {
    tasker: { 
        model: Tasker,
        include: City
    }
}

module.exports = {
    findOne: async (userId, options = {}) => {
        let getTasks = options.fields && options.fields.split(",").indexOf("task") !== -1;
        options.fields = options.fields.split(",").filter(x => x != "task").join(",")
        console.log("options.fields",options.fields)
        let user = await User.findOne({
            where: { id: userId },
            include: options.fields && getModelsFromFields(FIELD_MODEL, options.fields),
        })
        if (getTasks){
            let tasks = await Task.findAll({ where: { UserId: user.id }});
            user = cloneDeep(user);
            user.tasks = tasks;
        }
        console.log("USERUSER",user)
        if (!user) {
            throw new ErrorHandler(404, "Not found", [`User not found`])
        }
        return user;
    },
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
        else patchFields.password = undefined // in case it's an empty string
        if (patchFields.profile_image) patchFields.profile_image = await uploadFile(patchFields.profile_image)
        if (patchFields.cover_image) patchFields.cover_image = await uploadFile(patchFields.cover_image)
        return await user.update({ ...patchFields, id: undefined })
    }

}