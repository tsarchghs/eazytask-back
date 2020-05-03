
const { ErrorHandler } = require("../../utils/error")
const bcrypt = require("bcrypt")

let { User } = require("../../models")

const INVALID_CREDENTIALS_ERROR = new ErrorHandler(400, "Invalid credentials", [
    "The email address or password is incorrect. Please try again."
])

module.exports = async ({email,password}) => {
    let user = await User.findOne({ where: { email: email.toLowerCase() } })
    if (!user) throw INVALID_CREDENTIALS_ERROR
    const match = await bcrypt.compare(password, user.password);
    console.log({ match })
    user.password = undefined
    if (match) return user;
    else throw INVALID_CREDENTIALS_ERROR

}