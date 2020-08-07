
const S3_BUCKET = require("./index"); 
const uuid = require("uuid/v1");

const sharp = require('sharp');
const fetch = require("node-fetch")

module.exports = async (file) => {
    console.log("ENTERING")
    let key = `${uuid()}-${file.originalname}`;
    let keys = [
        key,
        "small-" + key,
        "medium-" + key,
        "large-" + key
    ]
    let data = {
        Bucket: process.env.S3_BUCKET, //"uxstories",
        Key: keys[0], // file from form
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
        ACL: "public-read"
    }
    let args = [
        {
            resize: [350, 350],
            data: {
                ...data,
                Key: keys[1],
            }
        },
        {
            resize: [600, 600],
            data: {
                ...data,
                Key: keys[2],
            }
        },
        {
            resize: [1300, 500],
            data: {
                ...data,
                Key: keys[3],
            }
        }
    ]
    S3_BUCKET.upload(data, async () => {})
    const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`
    // let res = await fetch(url, { compress: true })
    // let buffer = await res.buffer()
    // console.log(buffer,"buff",typeof(buffer))
    console.log("file.buffer", file.buffer)
    for (let arg of args) {
        let data = await sharp(file.buffer).resize(arg.resize[0], arg.resize[1]).toBuffer()
        console.log("SHARP DONE")
        arg.data.Body = data;
        await S3_BUCKET.upload(arg.data, () => { })
        console.log("S3 DONE")
    }
    return key
}
