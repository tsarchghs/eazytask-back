

const isArray = i => i.length !== undefined && typeof(i) === "object";

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
                let new_path = path.slice(i+1,99);
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
                console.log({end,path,data})
                throw new Error(`[2] Failed lazy field validation: ${field}`)
            }
        }
        if (dest[end] && typeof(dest[end]) !== "object") {
            delete dest[end]
        }
        else {
            throw new Error(`[3] Failed lazy field validation: ${field}`)
        }
    })
}
if (require.main === module) {
    let data = {
        "case_.lazyFieldValidation": [
            "data.createdAt",
            "data.updatedAt",
            "data.Languages.[item].id",
            "data.Languages.[item].updatedAt",
            "data.Languages.[item].createdAt",
            "data.Languages.[item].Tasker_Language.createdAt",
            "data.Languages.[item].Tasker_Language.updatedAt",
            "data.Skills.[item].id",
            "data.Skills.[item].createdAt",
            "data.Skills.[item].updatedAt",
            "data.Skills.[item].Tasker_Skill.SkillId",
            "data.Skills.[item].Tasker_Skill.createdAt",
            "data.Skills.[item].Tasker_Skill.updatedAt"
        ],
        "orig_data": {
            "status": 200,
            "message": "success",
            "data": {
                "id": 1,
                "UserId": 1,
                "area_of_activity": "Kosovo",
                "updatedAt": "2020-05-13T23:01:37.315Z",
                "createdAt": "2020-05-13T23:01:37.315Z",
                "Languages": [
                    {
                        "id": 3,
                        "name": "lang-1",
                        "createdByUser": true,
                        "updatedAt": "2020-05-13T23:01:37.261Z",
                        "createdAt": "2020-05-13T23:01:37.261Z"
                    },
                    {
                        "id": 4,
                        "name": "lang-2",
                        "createdByUser": true,
                        "updatedAt": "2020-05-13T23:01:37.276Z",
                        "createdAt": "2020-05-13T23:01:37.276Z"
                    }
                ],
                "Skills": [
                    {
                        "id": 3,
                        "name": "skill-1",
                        "createdByUser": true,
                        "updatedAt": "2020-05-13T23:01:37.300Z",
                        "createdAt": "2020-05-13T23:01:37.300Z"
                    }
                ]
            }
        }
    }
    let obj = lazyFieldValidation(
        data["case_.lazyFieldValidation"],
        data["orig_data"],
    ) 
}
module.exports = lazyFieldValidation