

module.exports = yupSchema => {
    return async (req,res,next) => {
        yupSchema.validate({
            requestBody: req.body.body ? req.body.body : req.body,
            query: req.query
        },{abortEarly: false}).catch(err => {
            console.log({res:{
                message: "Validation error",
                code: 403,
                errors: err.errors
            }, withBody: req.body.body ? req.body.body : req.body})
            return res.send({
                message: "Validation error",
                code: 403,
                errors: err.errors
            })
        }).then(() => next())
    }
}