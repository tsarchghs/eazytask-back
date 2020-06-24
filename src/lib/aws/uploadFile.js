
const S3_BUCKET = require("./index"); 
const uuid = require("uuid/v1");

module.exports = async (file) => {
    console.log("ENTERING")
    let key = `${uuid()}-${file.originalname}`;
    let data = {
        Bucket: process.env.S3_BUCKET, //"uxstories",
        Key: key, // file from form
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
        ACL: "public-read"
    };
    await S3_BUCKET.upload(data, () => {})
    console.log(`http://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`)
    return `http://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`
}
