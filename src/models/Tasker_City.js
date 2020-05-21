
"use strict"

module.exports = (sequelize, DataTypes) => {
    let Tasker_City = sequelize.define('Tasker_City', {
        // role: DataTypes.STRING
    });
    return Tasker_City;
}