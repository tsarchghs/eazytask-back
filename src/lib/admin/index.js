
const express = require("express");
const app = module.exports = express();

const models = require("../../models")

const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroSequelize = require('admin-bro-sequelizejs')

AdminBro.registerAdapter(AdminBroSequelize)

const adminBro = new AdminBro({
    databases: [models],
    rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

app.use(adminBro.options.rootPath, router)

