
const { Task, User, Offer, Category } = require("../../models")
const uploadFile = require("../aws/uploadFile");

const { ErrorHandler } = require("../../utils/error");

const { findOneByName, createCategory } = require("../categories-dal")

const cloneDeep= require("../../utils/cloneDeep")

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
            include: options && getModelsFromFIelds(options.fields),
        })
        if (!task) {
            throw new ErrorHandler(404, "Not found", [`Task not found`])
        }
        return task;
    },
    createTask: async ({
        user_id,
        category,
        thumbnail,
        gallery,
        title,
        description,
        due_date_type,
        due_date,
        expected_price,
        location
    }) => {
        if (gallery) {
            let gallery_file_urls = []
            for (file of gallery) {
                let url = await uploadFile(file)
                gallery_file_urls.push(url);
            }
            gallery = gallery_file_urls.join(",")
        }
        let category_obj = await findOneByName(category);
        if (!category_obj) category_obj = await createCategory({
            name: category, createdByUser: true
        })
        return await Task.create({
            UserId: user_id,
            CategoryId: category_obj.id,
            thumbnail: thumbnail && await uploadFile(thumbnail), gallery,
            title, description, due_date_type, due_date, expected_price, location, status: "ACTIVE"
        })
    },
    patchTask: async (task,patchFields) => {
        let { gallery, category, thumbnail } = patchFields
        if (gallery) {
            let gallery_file_urls = []
            for (file of gallery) {
                let url = await uploadFile(file)
                gallery_file_urls.push(url);
            }
            patchFields.gallery = gallery_file_urls.join(",")
        }
        if (thumbnail) patchFields.thumbnail = await uploadFile(thumbnail)
        if (category){
            console.log("Creating CATEGORY")
            let category_obj = await findOneByName(category);
            if (!category_obj) category_obj = await createCategory({
                name: category, createdByUser: true
            })
            patchFields.CategoryId = category_obj.id
        }
        let updatedTask = await task.update({
            CategoryId: patchFields.CategoryId,
            title: patchFields.title,
            description: patchFields.description,
            due_date_type: patchFields.due_date_type,
            due_date: patchFields.due_date,
            expected_price: patchFields.expected_price,
            status: patchFields.status
        })
        console.log({cloneDeep})
        updatedTask = cloneDeep(updatedTask)
        if (updatedTask.gallery) updatedTask.formattedGallery = updatedTask.gallery.split(",")
        return updatedTask
    }
}