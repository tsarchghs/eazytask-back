
module.exports = {
    "OFFER_RECEIVED": ({ user_1, user_2, task }) => ({
        body: `${user_2.first_name} ${user_2.last_name[0]} made an offer at “${task.title}”\nTask: ${process.env.BASE_URL}/task/${task.id}`,
        to: user_1.phone_number
    }),
    "OFFER_ACCEPTED": ({ user_1, user_2, task }) => ({
        body: `${user_2.first_name} ${user_2.last_name[0]} accepted your offer for “${task.title}”`,
        to: user_1.phone_number
    }),
    "AFTER_OFFER_ACCEPTED": ({ user_1, user_2, task }) => {
        let body = `Contact Information for ${user_2.first_name} ${user_2.last_name[0]}. :\n`
        body += `${user_2.phone_number == "+41" ? "" : `Number: ${user_2.phone_number}\n`}Email: ${user_2.email}\nFull Name: ${user_2.first_name} ${user_2.last_name}\n
        `
        return {
            body, to: user_1.phone_number
        }
    },
    "NEW_CHAT_MESSAGE": ({ user_1, user_2, task }) => {
        let isAnswer = task.UserId === user_2.id;
        if (isAnswer) {
            let body = `${user_2.first_name} ${user_2.last_name[0]} answered a question in “${task.title}” QA\nTask: ${process.env.BASE_URL}/task/${task.id}`
            return {
                body,
                to: user_1.phone_number,
            }
        } else {
            let body = `${user_2.first_name} ${user_2.last_name[0]} asked a question in “${task.title}” QA\nTask: ${process.env.BASE_URL}/task/${task.id}`
            return {
                body,
                to: user_1.phone_number,
            }
        }
    }
}