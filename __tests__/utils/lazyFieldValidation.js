

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
    // let obj = lazyFieldValidation(
    //     ["data.[item].createdAt", "b", "data2.a", "data.[item].updatedAt"],
    //     {
    //         b: 5,
    //         data2: { a: 5 } ,
    //         data: [
    //             {
    //                 id: 1,
    //                 createdAt: new Date().toDateString(),
    //                 updatedAt: new Date().toDateString()
    //             }
    //         ]
    //     }
    // )
//   let obj = lazyFieldValidation(
//       ["data.createdAt", "data.updatedAt", "data.id", "data.UserId", "data.CategoryId" ],
//       { 
//           "message": "success", 
//           "status": 201, 
//           "data": { 
//               "id": 1, 
//               "UserId": 2, 
//               "CategoryId": 3, 
//               "title": "task-title", 
//               "description": "task-description", 
//               "due_date_type": "UNTIL_DATE", 
//               "due_date": "2005-05-04T22:00:00.000Z", 
//               "location": "location", 
//               "status": "ACTIVE", 
//               "updatedAt": "2020-05-13T15:04:28.088Z", 
//               "createdAt": "2020-05-13T15:04:28.088Z" 
//             } 
//         }
//     )
//     console.log({obj})
    let obj = lazyFieldValidation(
        [
            "data.[list].id",
            "data.[list].UserId",
            "data.[list].title",
            "data.[list].description",
            "data.[list].due_date_type",
            "data.[list].due_date",
            "data.[list].location",
            "data.[list].CategoryId",
            "data.[list].createdAt",
            "data.[list].updatedAt", 
        ],
        {
            "message": "success",
            "status": 200,
            "data": [
                {
                    "id": 1,
                    "thumbnail": null,
                    "gallery": null,
                    "title": "new_titlesdadas",
                    "description": "sdasad12312",
                    "due_date_type": "UNTIL_DATE",
                    "due_date": "2000-05-03T22:00:00.000Z",
                    "location": "Kosovo",
                    "expected_price": null,
                    "status": "ACTIVE",
                    "createdAt": "2020-05-12T17:56:11.000Z",
                    "updatedAt": "2020-05-12T17:56:11.000Z",
                    "CategoryId": 1,
                    "UserId": 1
                },
                {
                    "id": 2,
                    "thumbnail": null,
                    "gallery": null,
                    "title": "new_titlesdadas",
                    "description": "sdasad12312",
                    "due_date_type": "UNTIL_DATE",
                    "due_date": "2000-05-03T22:00:00.000Z",
                    "location": "Kosovo",
                    "expected_price": null,
                    "status": "ACTIVE",
                    "createdAt": "2020-05-13T14:37:24.000Z",
                    "updatedAt": "2020-05-13T14:37:24.000Z",
                    "CategoryId": 1,
                    "UserId": 1
                },
                {
                    "id": 3,
                    "thumbnail": null,
                    "gallery": null,
                    "title": "new_titlesdadas",
                    "description": "sdasad12312",
                    "due_date_type": "UNTIL_DATE",
                    "due_date": "2000-05-03T22:00:00.000Z",
                    "location": "Kosovo",
                    "expected_price": null,
                    "status": "ACTIVE",
                    "createdAt": "2020-05-13T14:55:23.000Z",
                    "updatedAt": "2020-05-13T14:55:23.000Z",
                    "CategoryId": 1,
                    "UserId": 1
                },
                {
                    "id": 4,
                    "thumbnail": null,
                    "gallery": null,
                    "title": "new_titlesdadas",
                    "description": "sdasad12312",
                    "due_date_type": "UNTIL_DATE",
                    "due_date": "2005-05-04T22:00:00.000Z",
                    "location": "Kosovo",
                    "expected_price": null,
                    "status": "ACTIVE",
                    "createdAt": "2020-05-13T14:56:52.000Z",
                    "updatedAt": "2020-05-13T14:56:52.000Z",
                    "CategoryId": 1,
                    "UserId": 1
                }
            ]
        }
    ) 
}
module.exports = lazyFieldValidation