
module.exports = {
    "OFFER_RECEIVED": ({ user_1, user_2, task }) => ({
        text: `${user_2.first_name} ${user_2.last_name[0]} made an offer at “${task.title}”`,
        to: user_1.email,
        html: `${user_2.first_name} ${user_2.last_name[0]} made an offer at “${task.title}”`,
        subject: `Eazytask: Offer received for “${task.title}”`
    }),
    "OFFER_ACCEPTED": ({ user_1, user_2, task }) => ({
        text: `${user_2.first_name} ${user_2.last_name[0]} accepted your offer for “${task.title}”`,
        to: user_1.email,
        html: `${user_2.first_name} ${user_2.last_name[0]} accepted your offer for “${task.title}”`,
        subject: `Eazytask: Offer accepted for “${task.title}”`
    }),
    "NEW_CHAT_MESSAGE": ({ user_1, user_2, task }) => {
        let isAnswer = task.UserId === user_2.id;
        if (isAnswer) {
            let text = `${user_2.first_name} ${user_2.last_name[0]} answered a question in “${task.title}” QA`
            return {
                text, html: text,
                to: user_1.email,
                subject: `Eazytask: New answer in “${task.title}” QA`
            }
        } else {
            let text = `${user_2.first_name} ${user_2.last_name[0]} asked a question in “${task.title}” QA`
            return {
                text, html: text,
                to: user_1.email,
                subject: `Eazytask: New question in “${task.title}” QA`
            }
        }
    },
}