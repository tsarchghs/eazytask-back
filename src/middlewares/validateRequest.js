
const { ErrorHandler } = require("../utils/error")

module.exports = (yupSchema,strict = true) => {
    return async (req,res,next) => {
        console.log({
            requestBody: req.body.body ? req.body.body : req.body,
            query: req.query,
            params: req.params
        })
       try {
           await yupSchema.validate({
                requestBody: req.body.body ? req.body.body : req.body,
                query: req.query,
                params: req.params
           }, { abortEarly: false, strict })
       } catch (err) {
           throw new ErrorHandler(403,"Validation error",err.errors)
       }
        next()
    }
}