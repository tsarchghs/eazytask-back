
module.exports = {
    "OFFER_RECEIVED": ({ user_1, user_2, task }) => ({
        body: `${user_2.first_name} ${user_2.last_name[0]} made an offer at “${task.title}”`,
        to: user_1.phone_number
    }),
    "OFFER_ACCEPTED": ({ user_1, user_2, task }) => ({
        body: `${user_2.first_name} ${user_2.last_name[0]} accepted your offer for “${task.title}”`,
        to: user_1.phone_number
    }),
    "NEW_CHAT_MESSAGE": ({ user_1, user_2, task }) => {
        let isAnswer = task.UserId === user_2.id;
        if (isAnswer) {
            let body = `${user_2.first_name} ${user_2.last_name[0]} answered a question in “${task.title}” QA`
            return {
                body,
                to: user_1.phone_number,
            }
        } else {
            let body = `${user_2.first_name} ${user_2.last_name[0]} asked a question in “${task.title}” QA`
            return {
                body,
                to: user_1.phone_number,
            }
        }
    }
}