"use strict"

const { NonNullString, NonNullStatusField } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let options = {
        defaultScope: {
            where: { deleted: false }
        },
    }
    let Post = sequelize.define("Post", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: DataTypes.TEXT('long'),
        thumbnail: DataTypes.TEXT,
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, options)
    return Post;
}