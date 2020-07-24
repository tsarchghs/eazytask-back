
module.exports = {
    "OFFER_RECEIVED": ({ user_2, task }) => 
        `${user_2.first_name} ${user_2.last_name[0]} made an offer at “${task.titlte}”`
}