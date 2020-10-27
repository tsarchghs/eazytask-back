
const schedule = require('node-schedule');
const { sendNotification } = require('../notifications-manager');
const { findTasksWithoutReviews } = require('./reviews-dal');
const { findTaskerOfTask } = require("../taskers-dal")

module.exports = () => {
    let rule = new schedule.RecurrenceRule();
    // rule = '*/3 * * * * *'
    // or 
    rule.hour = 1
    schedule.scheduleJob(rule, async () => {
          console.log('its run');
          let tasks = await findTasksWithoutReviews()
          for (let task of tasks) {
            let asker = task.UserId;
            let tasker = await findTaskerOfTask(task.id);
            if (tasker){
                sendNotification({ 
                    type: "ASKER_TO_TASKER_REVIEW", 
                    user_1_id: asker, 
                    user_2_id: tasker.UserId,
                    task_id: task.id 
                })
                sendNotification({ 
                    type: "TASKER_TO_ASKER_REVIEW", 
                    user_1_id: tasker.UserId,
                    user_2_id: asker, 
                    task_id: task.id 
                })
                task.sent_review_links = true;
                await task.save()
            }
          }
          console.log(tasks.length)
    });
}