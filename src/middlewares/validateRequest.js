
const { ErrorHandler } = require("../utils/error")

module.exports = yupSchema => {
    return async (req,res,next) => {
        console.log({ body: req.body.body ? req.body.body : req.body})
       try {
           await yupSchema.validate({
                requestBody: req.body.body ? req.body.body : req.body,
                query: req.query,
                params: req.params
           }, { abortEarly: false, strict: true})
       } catch (err) {
           throw new ErrorHandler(403,"Validation error",err.errors)
       }
        next()
    }
}