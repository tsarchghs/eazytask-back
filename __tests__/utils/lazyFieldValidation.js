

const lazyFieldValidation = (fields, data,log=false) => {
    fields.forEach(field => {
        let path = field.split(".");
        if (path.length === 1) {
            if (data[path[0]]) delete data[path[0]]
            else throw new Error(`[1] Failed lazy field validation: ${field}`)
            return;
        } 
        let end = path[path.length - 1]
        path = path.slice(0, -1);
        let dest = data
        for (let i=0;i<path.length;i++){
            let p = path[i]
            if (p === "[item]"){
                let new_path = path.slice(2,99);
                new_path.push(end);
                let new_field = new_path.join(".")
                for (item of dest){
                    lazyFieldValidation([new_field],item,true)
                }
                return;
            } else {
                dest = dest[p];
            }
            if (dest === undefined) {
                throw new Error(`[2] Failed lazy field validation: ${field}`)
            }
        }
        if (dest[end]) delete dest[end]
        else {
            throw new Error(`[3] Failed lazy field validation: ${field}`)
        }
    })
}
if (require.main === module) {
    let obj = lazyFieldValidation(
        ["data.[item].createdAt", "b", "data2.a", "data.[item].updatedAt"],
        {
            b: 5,
            data2: { a: 5 } ,
            data: [
                {
                    id: 1,
                    createdAt: new Date().toDateString(),
                    updatedAt: new Date().toDateString()
                }
            ]
        }
    )
    console.log({obj})
}
module.exports = lazyFieldValidation