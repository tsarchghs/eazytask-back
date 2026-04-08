'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);

var db = {};

if (process.env.IN_TRAVIS){
    process.env.MYSQL_DATABASE = "eazytask_test"
    process.env.MYSQL_USERNAME = "root"
    process.env.MYSQL_PASSWORD = ""
    process.env.MYSQL_HOST = "localhost"
}

const databaseUrl = process.env.DATABASE_URL || process.env.database_url || process.env.CLEARDB_DATABASE_URL
const isPostgresUrl = Boolean(databaseUrl && databaseUrl.startsWith('postgres'))

let sequelize;
if (databaseUrl){
    sequelize = new Sequelize(databaseUrl, {
        dialect: isPostgresUrl ? 'postgres' : 'mysql',
        logging: false
    });
} else {
    sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
        logging: false
    });
}

sequelize.authenticate()
    .then(() => console.log('Authenticated'))
    .catch(err => console.log('Authentication failed!', err));

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        if (file !== 'common.js') {
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

console.log('CONNECTED TO ', db.sequelize.config.database)

module.exports = db;
