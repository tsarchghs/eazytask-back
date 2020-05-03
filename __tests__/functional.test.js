const fetch = require('node-fetch');
const users_cases = require("./meta/users");
const auth_cases = require("./meta/auth");

const { setup: setupDevServer } = require('jest-dev-server')
const { teardown: teardownDevServer } = require('jest-dev-server')

jest.setTimeout(10000);

let cases = [...users_cases, ...auth_cases]
console.log(JSON.stringify(cases))
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
            let res = await fetch(api, case_.request)
            let data = await res.json()
            if (data.data) {
                delete data.data.createdAt
                delete data.data.updatedAt
                delete data.data.password
            }
            if (case_.lazyFieldValidation) {
                case_.lazyFieldValidation.forEach(field => {
                    let path = field.split(".");
                    let end = path[path.length - 1]
                    path = path.slice(0, -1);
                    let dest = data
                    path.forEach(p => {
                        dest = dest[p];
                        if (dest === undefined)
                            done.fail(new Error(`Failed lazy field validation: ${field}`));
                    })
                    // console.log({ path, dest, end, val: dest[end]})
                    if (dest[end]) delete dest[end]
                    else done.fail(new Error(`Failed lazy field validation: ${field}`));
                })
            }
            expect(JSON.stringify(data))
                .toBe(JSON.stringify(case_.response))
            done();
        })
    })
})