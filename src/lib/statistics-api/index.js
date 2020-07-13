
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT, requireAdminAccess } = require("../../middlewares");

// const categories_dal = require("../categories-dal");
// const tasks_dal = require("../tasks-dal");
// const users_dal = require("../users-dal");
// const taskers_dal = require("../taskers-dal");
const { User, Task, Tasker, Category, Sequelize } = require("../../models");

app.use(allowCrossDomain);


app.get("/statistics", [
], async (req,res) => {
    let where = {}
    let { from, to } = req.query;
    if (from && to) where = {
        createdAt: { [Sequelize.Op.between]: [from,to] }
    }
    let data = [
        await User.count({ where }),
        await User.findAll({ where, include: [ Tasker ]}),
        await Tasker.count({ where }),
    ]
    let categories = await Category.findAll();
    let category_tasks = {}
    for (let category of categories){
        category_tasks[category.name] = await Task.count({
            where: { CategoryId: category.id, ...where }
        })
    }
    return res.json({
        code: 200,
        message: "success",
        data: {
            users_count: data[0],
            askers_count: data[1].filter(obj => !obj.Tasker).length,
            taskers_count: data[2],
            tasks_count: data[3],
            category_tasks
        },
    })
})