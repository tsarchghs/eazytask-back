'use strict';
require('dotenv').config()

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var dbs = {};

var sequelize = new Sequelize(`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@localhost:3306/${process.env.MYSQL_DATABASE}`);
var sequelizeTesting = new Sequelize(`mysql://${process.env.MYSQL_USERNAME_TESTING}:${process.env.MYSQL_PASSWORD_TESTING}@localhost:3306/${process.env.MYSQL_DATABASE_TESTING}`);


[sequelize, sequelizeTesting].forEach(seq => {
    let db = {}
    seq.authenticate()
        .then(() => console.log("Authenticated"))
        .catch(err => console.log("Authentication failed!"));
    
    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            if (file !== "common.js"){
                var model = seq['import'](path.join(__dirname, file));
                db[model.name] = model;
            }
        });
    
    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    
    db.sequelize = seq;
    db.sequelize = seq;
    if (seq.config.database === "eazytask") dbs["default"] = db
    dbs[seq.config.database] = db
})

module.exports = dbs;