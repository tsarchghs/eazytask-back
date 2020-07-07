
module.exports = files => {
    console.log(files)
    let obj = {}
    for (let fileObj of files) {
        let { fieldname } = fileObj;
        let isArray = fieldname.indexOf("[]") !== -1;
        if (isArray) {
            if (!obj[fieldname]) obj[fieldname] = []
            obj[fieldname].push(fileObj)
        } else {
            obj[fieldname] = fileObj
        }
    }
    console.log(obj, "objobj")
    return obj;
}