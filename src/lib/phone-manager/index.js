const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID, 
    process.env.TWILIO_AUTH_TOKEN
);

const getPhoneVerificationCodeSMS = ({ code, to }) => {
    return {
        from: process.env.TWILIO_NUMBER, to,
        body: "Verification code: " + code
    }
}

const sendSMS = async ({ body, from, to }) => {
    return await client.messages.create({
        body, from: from || process.env.TWILIO_NUMBER, to
    })
}

const sendPhoneVerificationCodeSMS =  async ({ code, to }) => {
    let args = getPhoneVerificationCodeSMS({ code, to })
    await sendSMS(args);
}

module.exports = {
    getPhoneVerificationCodeSMS,
    sendPhoneVerificationCodeSMS,
    sendSMS
}