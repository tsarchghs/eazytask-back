
module.exports = {
    "ASKER_TO_TASKER_REVIEW": ({ user_1, user_2, task }) => ({
        body: `${user_1.first_name} ${user_1.last_name[0]} please give us a review for “${task.title}” (Optional) \nClick on this link to review the tasker: ${process.env.BASE_URL}/task/${task.id}/review`,
        to: user_1.phone_number
    }),
    "TASKER_TO_ASKER_REVIEW": ({ user_1, user_2, task }) => ({
        body: `${user_1.first_name} ${user_1.last_name[0]} please give us a review for “${task.title}” (Optional) \nClick on this link to review the asker: ${process.env.BASE_URL}/task/${task.id}/review`,
        to: user_1.phone_number
    }),
    "OFFER_RECEIVED": ({ user_1, user_2, task }) => ({
        body: `${user_2.first_name} ${user_2.last_name[0]} hat ein Angebot für “${task.title}” \nTask: ${process.env.BASE_URL}/task/${task.id}`,
        to: user_1.phone_number
    }),
    "OFFER_ACCEPTED": ({ user_1, user_2, task }) => ({
        body: `${user_2.first_name} ${user_2.last_name[0]} hat dein Angebot für “${task.title}” angenommen`,
        to: user_1.phone_number
    }),
    "AFTER_OFFER_ACCEPTED": ({ user_1, user_2, task }) => {
        let body = `Gerne senden wir dir die Kontaktinformationen von ${user_2.first_name} ${user_2.last_name[0]}. :\n`
        body += `${user_2.phone_number == "+41" ? "" : `Telefonnummer: ${user_2.phone_number}\n`}E-Mail-Adresse: ${user_2.email}\nVor- und Nachname: ${user_2.first_name} ${user_2.last_name}\n
        `
        return {
            body, to: user_1.phone_number
        }
    },
    "NEW_CHAT_MESSAGE": ({ user_1, user_2, task }) => {
        let isAnswer = task.UserId === user_2.id;
        if (isAnswer) {
            let body = `${user_2.first_name} ${user_2.last_name[0]} hat eine Frage in “${task.title}” beantwortet QA\nTask: ${process.env.BASE_URL}/task/${task.id}`
            return {
                body,
                to: user_1.phone_number,
            }
        } else {
            let body = `${user_2.first_name} ${user_2.last_name[0]} hat eine Frage in “${task.title}” gestellt QA\nTask: ${process.env.BASE_URL}/task/${task.id}`
            return {
                body,
                to: user_1.phone_number,
            }
        }
    }
}