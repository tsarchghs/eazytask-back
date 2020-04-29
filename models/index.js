'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var db = {};

var sequelize = new Sequelize(`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@localhost:3306/${process.env.MYSQL_DATABASE}`);

sequelize.authenticate()
    .then(() => console.log("Authenticated"))
    .catch(err => console.log("Authentication failed!"));

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        console.log(file)
        if (file !== "common.js"){
            var model = sequelize['import'](path.join(__dirname, file));
            db[model.name] = model;
        }
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;