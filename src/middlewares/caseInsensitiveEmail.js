
module.exports = (req, res, next) => {
    if (req.body.email) req.body.email = req.body.email.toLowerCase()
    next();
}