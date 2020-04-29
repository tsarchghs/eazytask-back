
"use strict"

module.exports = (sequelize, DataTypes) => {
    let Tasker_Language = sequelize.define('Tasker_Language', {
        // role: DataTypes.STRING
    });
    return Tasker_Language;
}