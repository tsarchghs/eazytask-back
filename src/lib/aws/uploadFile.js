
const S3_BUCKET = require("./index"); 
const uuid = require("uuid/v1");

module.exports = async (file) => {
    console.log("ENTERING")
    let key = `${uuid()}-${file.originalname}`;
    let data = {
        Bucket: "uxstories",
        Key: key, // file from form
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding
    };
    await S3_BUCKET.upload(data, () => {})
    console.log(`http://uxstories.s3.amazonaws.com/${key}`)
    return `http://uxstories.s3.amazonaws.com/${key}`
}
