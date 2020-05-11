
const { Task, User, Offer, Category } = require("../../models")
const uploadFile = require("../aws/uploadFile");

const { ErrorHandler } = require("../../utils/error");

const FIELD_MODEL = {
    user: User,
    offers: Offer,
    category: Category
}

const getModelsFromFIelds = fields => fields ? fields.split(",").map(x => {
    if (FIELD_MODEL[x]) return FIELD_MODEL[x]
    throw new ErrorHandler(403,"Validation error", [`query.fields does not support ${x}`])
}) : [];

module.exports = {
    findAll: async (filters) => {
        let where = filters;
        if (where.category_id) where["Categories.id"] = where.category_id;
        let tasks = await Task.findAll({
            include: getModelsFromFIelds(where.fields),
            where: (delete where["fields"] && where),
        })
        return tasks
    },
    findOne: async (taskId,options) => {
        let task = await Task.findOne({ 
            where: { id: taskId },
            include: getModelsFromFIelds(options.fields),
        })
        if (!task) {
            throw new ErrorHandler(404, "Not found", [`Task not found`])
        }
        return task;
    },
    createTask: async ({
        user_id,
        category_id,
        thumbnail,
        title,
        description,
        due_date_type,
        due_date,
        expected_price,
        location
    }) => {
        let task;
        try {
            task = await Task.create({
                UserId: user_id,
                CategoryId: category_id,
                thumbnail: thumbnail && await uploadFile(thumbnail),
                title, description, due_date_type, due_date, expected_price, location, status: "ACTIVE"
            })
        } catch (err) {
            if (
                err.name == "SequelizeForeignKeyConstraintError" && 
                err.fields.length === 1 && 
                err.fields[0] === "CategoryId"
            ) throw new ErrorHandler(403,"ForeignKeyConstraintError","Category id doesn't exist")
            throw err
        }
        return task;
    }
}