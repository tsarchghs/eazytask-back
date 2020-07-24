
const { Task, Tasker, User, Offer, Category, Question, Answer, Sequelize } = require("../../models")
const uploadFile = require("../aws/uploadFile");

const { ErrorHandler } = require("../../utils/error");

const { findOneByName, createCategory } = require("../categories-dal")

const cloneDeep = require("../utils/cloneDeep")
const getModelsFromFields = require("../utils/getModelsFromFields");

const moment = require("moment");

const FIELD_MODEL = {
    user: User,
    offers: {
        model: Offer,
        include: [ 
            { 
                model: Tasker,
                include: [ User ]
            }
         ]
    },
    category: Category,
    question: {
        model: Question,
        include: [Answer]
    },
}


module.exports = {
    countAll: async (filters, scope) => {
        let where = {}
        console.log(filters)
        if (filters["category_id"]) where["CategoryId"] = filters.category_id;
        if (filters["city"]) where["city"] = { [Sequelize.Op.like]: "%" + filters.city + "%" };
        if (filters["title"]) where["title"] = { [Sequelize.Op.like]: "%" + filters.title + "%" }; 
        if (filters["due_date"]) where["due_date"] = filters.due_date;
        if (filters["UserId"]) where["UserId"] = filters.UserId;
        
        let expected_price_filter = {}
        if (filters["min_expected_price"]) expected_price_filter[Sequelize.Op.gte] = Number(filters["min_expected_price"])
        if (filters["max_expected_price"]) expected_price_filter[Sequelize.Op.lte] = Number(filters["max_expected_price"])
        if (filters["min_expected_price"] || filters["max_expected_price"]) where.expected_price = Sequelize.and(expected_price_filter)
        delete filters["min_expected_price"]; delete filters["max_expected_price"]

        let and_due_date = []

        if (filters["due_date"]) {
            let due_date = moment.utc(filters.due_date);
            due_date_f = {
                [Sequelize.Op.gte]: due_date.startOf("day"),
                [Sequelize.Op.lte]: due_date.clone().endOf("day")
            }
            and_due_date.push(due_date_f);
        }
        if (filters["expire_soon"] == "true") {
            due_date = {
                [Sequelize.Op.gte]: moment().startOf("day"),
                [Sequelize.Op.lte]: moment().endOf("day").add(5, 'days')
            }
            and_due_date.push(due_date);
            delete where["expire_soon"]
        }
        if (and_due_date.length) where.due_date = Sequelize.and(...and_due_date)

        let instance = Task;
        if (scope) instance = instance.scope(scope);
        console.log("SCOPEEEE",scope,where)
        return await instance.count({ where })
    },
    findAll: async ({ limit, offset, category_id, expired, ...filters},scope) => {
        let where = filters;
        if (where.category_id) {
            where["category"] = category_id;
        }
        let and_due_date = []

        if (where.due_date) {
            let due_date = moment.utc(where.due_date);
            due_date_f = {
                [Sequelize.Op.gte]: due_date.startOf("day"),
                [Sequelize.Op.lte]: due_date.clone().endOf("day")
            }
            and_due_date.push(due_date_f);
        }
        if (where.expire_soon == "true"){
            console.log("where.expire_soon2", where.expire_soon)
            due_date = {
                [Sequelize.Op.gte]: moment().startOf("day"),
                [Sequelize.Op.lte]: moment().endOf("day").add(5, 'days')
            }
            and_due_date.push(due_date);
        }
        if (and_due_date.length){
            where.due_date = Sequelize.and(...and_due_date)
        }
        if (expired){
            where.due_date = {
                [Sequelize.Op.lte]: moment()
            }
        }

        let expected_price_filter = {}
        if (filters["min_expected_price"]) expected_price_filter[Sequelize.Op.gte] = Number(filters["min_expected_price"])
        if (filters["max_expected_price"]) expected_price_filter[Sequelize.Op.lte] = Number(filters["max_expected_price"])
        if (filters["min_expected_price"] || filters["max_expected_price"]) where.expected_price = Sequelize.and(expected_price_filter)
        delete filters["min_expected_price"]; delete filters["max_expected_price"]

        if (where.title) where.title = { [Sequelize.Op.like]: "%" + where.title + "%" };
        if (where.city) where.city = { [Sequelize.Op.like]: "%" + where.city + "%" }; 
        delete where["expire_soon"]

        let include = getModelsFromFields(FIELD_MODEL,where.fields);
        if (category_id) include.push({
            model: Category, where: { id: category_id }
        })
        console.log({ where }, scope, "SCOPE5555")
        let instance = Task;
        if (scope) instance = instance.scope(scope);
        let tasks = await instance.findAll({
            include,
            where: (delete where["fields"] && where),
            limit: Number(limit) || null,
            offset: Number(offset) || null
        })
        return tasks
    },
    findOne: async (taskId,options = {},scope) => {
        console.log(scope || "allNonDeleted")
        let task = await Task.scope(scope || "allNonDeleted").findOne({ 
            where: { id: taskId },
            include: options.fields && getModelsFromFields(FIELD_MODEL,options.fields),
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
        address,
        zipCode,
        city
    }) => {
        console.log({ gallery})
        if (gallery) {
            let gallery_file_urls = []
            for (file of gallery) {
                console.log((file,91919))
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
            title, description, due_date_type, 
            due_date, expected_price, address, zipCode, city, status: "ACTIVE"
        })
    },
    patchTask: async (task,patchFields) => {
        let { gallery, category, thumbnail, remove_thumbnail, remove_gallery } = patchFields
        if (gallery) {
            let gallery_file_urls = []
            for (file of gallery) {
                let url = await uploadFile(file)
                gallery_file_urls.push(url);
            }
            patchFields.gallery = gallery_file_urls.join(",")
            console.log("gallery_file_urls", gallery_file_urls)
        }
        if (thumbnail) patchFields.thumbnail = await uploadFile(thumbnail)
        if (remove_thumbnail) patchFields.thumbnail = null
        if (remove_gallery) patchFields.gallery = null
        if (category){
            console.log("Creating CATEGORY")
            let category_obj = await findOneByName(category);
            if (!category_obj) category_obj = await createCategory({
                name: category, createdByUser: true
            })
            patchFields.CategoryId = category_obj.id
        }
        console.log({patchFields})
        let updatedTask = await task.update(patchFields)
        // let updatedTask = await task.update({
        //     CategoryId: patchFields.CategoryId,
        //     title: patchFields.title,
        //     description: patchFields.description,
        //     due_date_type: patchFields.due_date_type,
        //     due_date: patchFields.due_date,
        //     expected_price: patchFields.expected_price,
        //     status: patchFields.status
        // })
        updatedTask = cloneDeep(updatedTask)
        if (updatedTask.gallery) updatedTask.formattedGallery = updatedTask.gallery.split(",")
        return updatedTask
    }
}