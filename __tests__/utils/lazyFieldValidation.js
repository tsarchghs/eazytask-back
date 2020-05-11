
const lazyFieldValidation = (fields, data,log) => {
    if (log) console.log({ fields, data },"9999999999999999999999999")
    fields.forEach(field => {
        let path = field.split(".");
        let end = path[path.length - 1]
        path = path.slice(0, -1);
        let dest = data
        path.forEach((p,i) => {
            console.log({p})
            if (p === "[item]"){
                let new_path = path.slice(i+1,path.length);
                let new_field = new_path.join(".")
                console.log({path,i,path_length:path.length,new_path,new_field,dest})
                for (item in dest) lazyFieldValidation([new_field],dest,true)
                return;
            } else {
                dest = dest[p];
            }
            if (dest === undefined) {
                throw new Error(`[1] Failed lazy field validation: ${field}`)
            }
        })
        if (dest[end]) delete dest[end]
        else {
            throw new Error(`[2] Failed lazy field validation: ${field}`)
        }
    })
}


module.exports = lazyFieldValidation