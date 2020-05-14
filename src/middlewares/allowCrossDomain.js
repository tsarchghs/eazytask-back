
module.exports = function (req, res, next) {
    console.log("SETTING HEADERS")
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, Accept, Authorization, Content-Type, Access-Control-Allow-Headers, X-Requested-With");
    next();
}
