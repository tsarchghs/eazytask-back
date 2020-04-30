

module.exports = yupSchema => {
    return async (req,res,next) => {
        yupSchema.validate({
            requestBody: req.body,
            query: req.query
        },{abortEarly: false}).catch(err => {
            console.log({err})
            return res.send({
                message: "Validation error",
                code: 403,
                errors: err.errors
            })
        }).then(() => next())
    }
}