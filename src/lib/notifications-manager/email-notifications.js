
module.exports = {
    "ASKER_TO_TASKER_REVIEW": ({ user_1, user_2, task }) => ({
        text: `${user_1.first_name} ${user_1.last_name[0]} please give us a review for “${task.title}” (Optional) \nClick on this link to review the tasker: ${process.env.BASE_URL}/task/${task.id}/review`,
        to: user_1.email,
        html: `${user_1.first_name} ${user_1.last_name[0]} please give us a review for “${task.title}” (Optional) \nClick on this link to review the tasker: ${process.env.BASE_URL}/task/${task.id}/review`,
        subject: `eazytask: Angebot für “${task.title}” erhalten`
    }),
    "TASKER_TO_ASKER_REVIEW": ({ user_1, user_2, task }) => ({
        text: `${user_1.first_name} ${user_1.last_name[0]} please give us a review for “${task.title}” (Optional) \nClick on this link to review the asker: ${process.env.BASE_URL}/task/${task.id}/review`,
        to: user_1.email,
        html: `${user_1.first_name} ${user_1.last_name[0]} please give us a review for “${task.title}” (Optional) \nClick on this link to review the asker: ${process.env.BASE_URL}/task/${task.id}/review`,
        subject: `eazytask: Angebot für “${task.title}” erhalten`
    }),
    "OFFER_RECEIVED": ({ user_1, user_2, task }) => ({
        text: `${user_2.first_name} ${user_2.last_name[0]} hat ein Angebot für “${task.title}” abgegeben<br/>
        `,
        to: user_1.email,
        html: `${user_2.first_name} ${user_2.last_name[0]} hat ein Angebot für “${task.title}” abgegeben`,
        subject: `eazytask: Angebot für “${task.title}” erhalten`
    }),
    "OFFER_ACCEPTED": ({ user_1, user_2, task }) => ({
        text: `${user_2.first_name} ${user_2.last_name[0]} hat dein Angebot für “${task.title}” angenommen`,
        to: user_1.email,
        html: `${user_2.first_name} ${user_2.last_name[0]} hat dein Angebot für “${task.title}” angenommen`,
        subject: `eazytask: Angebot für “${task.title}” wurde angenommen`
    }),
    "AFTER_OFFER_ACCEPTED": ({ user_1, user_2, task }) => {
        let text = `Gerne senden wir dir die Kontaktinformationen von ${user_2.first_name} ${user_2.last_name[0]}. zu: <br/>
        Telefonnummer: ${ user_2.phone_number === "+41" ? "" : `Number: ${user_2.phone_number}<br/>`}
        E-Mail-Adresse: ${user_2.email}
        Vor- und Nachname: ${user_2.first_name} ${user_2.last_name}\n`
        `Contact Information for ${user_2.first_name} ${user_2.last_name[0]}. :<br/>`
        return {
            text: text,
            html: text,
            to: user_1.email,
            subject: "eazytask: Kontaktinformationen"
        }
    },
    "NEW_CHAT_MESSAGE": ({ user_1, user_2, task }) => {
        let isAnswer = task.UserId === user_2.id;
        if (isAnswer) {
            let text = `${user_2.first_name} ${user_2.last_name[0]} hat eine Frage in “${task.title}” beantwortet QA<br/>
            Task: ${process.env.BASE_URL}/task/${task.id}`
            return {
                text, html: text,
                to: user_1.email,
                subject: `eazytask: Neue Antwort in “${task.title}” QA`
            }
        } else {
            let text = `${user_2.first_name} ${user_2.last_name[0]} hat eine Frage in  “${task.title}” gestellt QA<br/>
            Task: ${process.env.BASE_URL}/task/${task.id}`
            return {
                text, html: text,
                to: user_1.email,
                subject: `eazytask: Neue Frage in “${task.title}” QA`
            }
        }
    },
}