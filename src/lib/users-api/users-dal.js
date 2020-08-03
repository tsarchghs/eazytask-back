
const { User, Tasker, Task, City, Skill, Language } = require("../../models")

const bcrypt = require("bcrypt")
const { SALT_ROUNDS } = require("../../configs")
const { ErrorHandler } = require("../../utils/error")

const { findUserByPk } = require("../users-dal");
const uploadFile = require("../aws/uploadFile");

const getModelsFromFields = require("../utils/getModelsFromFields");
const cloneDeep = require("../utils/cloneDeep");

const { createTasker } = require("../taskers-api/taskers-dal");
const emailManager = require("../email-manager");

const uuid = require("uuid");

const FIELD_MODEL = {
    tasker: {
        model: Tasker,
        include: [
            { model: Skill, required: false }, 
            { model: City, required: false },
            { model: Language, required: false }
        ]
    }
}

let findUserByEmail = async (email,scopeId) => {
    let user;
    if (scopeId) user = await User.scope(scopeId).findOne({ where: { email } })
    else user = await User.scope(scopeId).findOne({ where: { email } })
    return user;
}
module.exports = {
    findUserByEmail,
    findOne: async (userId, options = {}) => {
        let getTasks = options.fields && options.fields.split(",").indexOf("task") !== -1;
        if (options.fields) 
            options.fields = options.fields.split(",").filter(x => x != "task").join(",")
        console.log("options.fields",options.fields)
        console.log({
            where: { id: userId },
            include: options.fields && getModelsFromFields(FIELD_MODEL, options.fields),
        })
        let user = await User.findOne({
            where: { id: userId },
            include: options.fields && getModelsFromFields(FIELD_MODEL, options.fields),
        })
        if (!user) {
            throw new ErrorHandler(404, "Not found", [`User not found`])
        }
        if (getTasks){
            let tasks = await Task.scope("allNonDeleted").findAll({ where: { UserId: user.id }});
            user = cloneDeep(user);
            user.tasks = tasks;
        }
        console.log("USERUSER",user)
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
        console.log("AAAAAAAAA")
        let user;
        if (typeof(id) === "string" && id.indexOf("@") !== -1) user = await findUserByEmail(id);
        else user = await findUserByPk(id,undefined,"withPassword")
        if (!user) throw new ErrorHandler(404, "The resource you tried to update does not exist")
        console.log(patchFields.isTasker, typeof(patchFields.isTasker),"patchFields.isTasker")
        let afterUpdate;
        if (patchFields.deleted) {
            patchFields.email = user.email + "-" + uuid.v1()
        }
        if (patchFields.isTasker !== undefined) {
            let send = async (id, isTasker, setupCompleted) => {
                let user = await User.findOne({ where: { id }, include: [ FIELD_MODEL.tasker ] })
                let subject = "Eazytask: Admin notification"
                let text = `${user.first_name} ${user.last_name} `
                let wording = setupCompleted ? "account created as " : "switched to "
                if (isTasker === "true") text += wording + "tasker"
                else text += wording + "asker"
                text += `
                <br/> Info: <br/>
                    Skills: ${(user.Tasker.Skills || []).map(x => x.name).join(", ")}<br/>
                    Languages: ${(user.Tasker.Languages || []).map(x => x.name).join(", ")}<br/>
                    Cities: ${(user.Tasker.Cities || []).map(x => x.name).join(", ")}<br/>
                `
                console.log({ subject, text })
                emailManager.sendEmail({
                    to: "gjergjk71@gmail.com",
                    subject,
                    text, html: text,
                })
            }
            afterUpdate = async () => await send(id, patchFields.isTasker, patchFields.setupCompleted);
        }
        if (patchFields.isTasker) {
            let tasker = await Tasker.findOne({ where: { UserId: user.id }})
            if (!tasker) await createTasker({ userId: user.id, skills: [], languages: [], cities: [] })
        }
        if (patchFields.password) {
            if (patchFields.old_password){
                const match = await bcrypt.compare(patchFields.old_password,user.password);
                if (!match) throw new ErrorHandler(404, "Old password is not correct")
            }
            patchFields.password = await bcrypt.hash(patchFields.password, SALT_ROUNDS);
        }
        else patchFields.password = undefined // in case it's an empty string
        if (patchFields.profile_image) patchFields.profile_image = await uploadFile(patchFields.profile_image)
        if (patchFields.cover_image) patchFields.cover_image = await uploadFile(patchFields.cover_image)
        await user.update({ ...patchFields, id: undefined })
        if (afterUpdate) afterUpdate();
        return user;
    }

}