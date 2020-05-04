

const users_cases = require("./meta/users");
const auth_cases = require("./meta/auth");

const request = require('supertest');
const app = require("../src/app")
const agent = request(app);
const  models = require("../src/models")

jest.setTimeout(5000);

let cases = [...users_cases, ...auth_cases]

beforeAll(async () => {
    await models.sequelize.sync({ force: true });
    await models.User.create({
        "first_name": "string",
        "last_name": "string",
        "email": "existing_test_email@example.com",
        "password": "$2b$10$IkAoMh2TGDCzaLiOMq.Dbe8REEk02Hi3.530Ne9FrKmxtwLejJ6yW",
        "isAdmin": false,
        "notification_option": "EMAIL"
    })
})

cases.forEach(case_ => {
    describe(case_.title, () => {
        it(case_.description, async done => {
            const res = await agent[case_.request.method.toLowerCase()](`/api/v1/${case_.path}`)
                                    .set("Accept",case_.request.headers["Accept"] || "")
                                    .set("Content-Type",case_.request.headers["Content-Type"] || "")
                                    .set("Authorization",case_.request.headers["Authorization"] || "")
                                    .send(case_.request.body)
            // expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
            let data = JSON.parse(res.text)
            if (case_.before) await case_.before()
            case_.request.body = JSON.stringify(case_.request.body)
            

            if (case_.lazyFieldValidation) {
                case_.lazyFieldValidation.forEach(field => {
                    let path = field.split(".");
                    let end = path[path.length - 1]
                    path = path.slice(0, -1);
                    let dest = data
                    path.forEach(p => {
                        dest = dest[p];
                        if (dest === undefined){
                            console.log(data,911)
                            done.fail(new Error(`[1] Failed lazy field validation: ${field}`));
                        }
                    })
                    if (dest[end]) delete dest[end]
                    else {
                        console.log(data, 912)
                        done.fail(new Error(`[2] Failed lazy field validation: ${field}`));
                    }
                })
            }

            expect(JSON.stringify(data))
                .toBe(JSON.stringify(case_.response))
            
            done();
        })
    })
})