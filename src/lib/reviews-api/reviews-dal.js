
const { Op } = require("sequelize");
const { Review, Task } = require("../../models");
const moment = require("moment");

module.exports = {
    createReview: async ({
        reliability, punctuality,
        accuracy, quality,
        friendliness, cleanliness,
        comment, TaskId
    }) => {
        let args = {
            reliability, punctuality,
            accuracy, quality,
            friendliness, cleanliness,
            comment, TaskId
        }
        let review = await Review.create(args)
        return review;
    },
    findOne: async ({
        UserId, TaskId
    }) => {
        let review = await Review.findOne({ where: { UserId, TaskId } })
        return review;
    },
    findTasksWithoutReviews: async () => {
        let tasks = await Task.findAll({ 
            where: {
                status: {
                    [Op.and]: [
                        {
                            [Op.not]: "DELETED"
                        },
                        {
                            [Op.not]: "DEACTIVATED"
                        }
                    ]
                },
                due_date: {
                    [Op.lte]: moment().subtract(1,"days")
                },
                sent_review_links: false
            }
        })
        return tasks;
    }
}