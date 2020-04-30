const fetch = require('node-fetch');
const users_cases = require("./users");

jest.setTimeout(10000);

let cases = [...users_cases]

let port = 5124  
let URI = () => `http://localhost:${port}/api/v1`

cases.forEach(case_ => {
    describe(case_.title, () => {   
        it(case_.description, async () => {
            if (case_.before) await case_.before()
            let api = `${URI()}${case_.path}`
            case_.request.body = JSON.stringify(case_.request.body)
            let res = await fetch(api,case_.request)
            let data = await res.json()
            if (data.data){
                delete data.data.createdAt
                delete data.data.updatedAt
                delete data.data.password
            }
            expect(JSON.stringify(data))
                .toBe(JSON.stringify(case_.response))        
        })
    })

})
    