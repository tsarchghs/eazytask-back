const fetch = require('node-fetch');
const users_cases = require("./users");

const { setup: setupDevServer } = require('jest-dev-server')
const { teardown: teardownDevServer } = require('jest-dev-server')

jest.setTimeout(25000);

let cases = [...users_cases]

let port = 5124  
let URI = () => `http://localhost:${port}/api/v1`

beforeAll(async () => {
    setupDevServer({
        command: `node ./testServer.js`,
        launchTimeout: 50000,
        port: 3000,
    })
    await new Promise(resolve => setTimeout(resolve, 5000));
})

afterAll(async done => {
    teardownDevServer()
    done()
})

cases.forEach(case_ => {
    describe(case_.title, () => {   
        it(case_.description, async done => {
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
            done()     
        })
    })

})
    