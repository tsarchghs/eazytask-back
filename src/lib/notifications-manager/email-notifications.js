
module.exports = {
    "OFFER_RECEIVED": ({ user_1, user_2, task }) => ({
        text: `${user_2.first_name} ${user_2.last_name[0]} made an offer at “${task.title}”<br/>
        `,
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
    "AFTER_OFFER_ACCEPTED": ({ user_1, user_2, task }) => {
        let text = `Contact Information for ${user_2.first_name} ${user_2.last_name[0]}. :<br/>`
        text += `${user_2.phone_number === "+41" ? "" : `Number: ${user_2.phone_number}<br/>`}
        Email: ${user_2.email}<br/>
        Full Name: ${user_2.first_name} ${user_2.last_name}\n`
        return {
            text: text,
            html: text,
            to: user_1.email,
            subject: "Eazytask: Contact information exchange"
        }
    },
    "NEW_CHAT_MESSAGE": ({ user_1, user_2, task }) => {
        let isAnswer = task.UserId === user_2.id;
        if (isAnswer) {
            let text = `${user_2.first_name} ${user_2.last_name[0]} answered a question in “${task.title}” QA<br/>
            Task: ${process.env.BASE_URL}/task/${task.id}`
            return {
                text, html: text,
                to: user_1.email,
                subject: `Eazytask: New answer in “${task.title}” QA`
            }
        } else {
            let text = `${user_2.first_name} ${user_2.last_name[0]} asked a question in “${task.title}” QA<br/>
            Task: ${process.env.BASE_URL}/task/${task.id}`
            return {
                text, html: text,
                to: user_1.email,
                subject: `Eazytask: New question in “${task.title}” QA`
            }
        }
    },
}