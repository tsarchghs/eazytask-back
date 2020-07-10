const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
    },
});

module.exports = {
    createForgetPasswordEmail: ({to,code}) => {
        let from = "alerts@eazytask.ch"
        let text = `Your verification code is: ${code}, valid for 5 hours.`
        let html = `Your verification code is: ${code}<br/>Valid for 5 hours`
        let subject = "Eazytask: Forget password"
        return { from, to, subject, text, html }
    },
    sendEmail: async ({from,to,subject,text,html}) => {
        return await transporter.sendMail({ from, to, subject, text, html });
    }
}