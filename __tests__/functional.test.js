

const users_cases = require("./meta/users");
const auth_cases = require("./meta/auth");
const categories_cases = require("./meta/categories");

const request = require('supertest');
const app = require("../src/app")
const agent = request(app);
const models = require("../src/models")

const createToken = require("../src/lib/auth-api/createToken")
const lazyFieldValidation = require("./utils/lazyFieldValidation");

jest.setTimeout(25000);

let cases = [
    ...users_cases, 
    ...auth_cases,
    ...categories_cases
]

let sortObj = obj => {
    // used for sorting to object and comparing after both are stringified, this way
    // we don't get !== when it's not the same order of keys but still get the nice string difference result of jest
    let keys = Object.keys(obj).sort();
    let new_obj = {}
    keys.forEach(k => {
        new_obj[k] = obj[k]
    })
    return new_obj
}

tokens = {}

beforeAll(async done => {
    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await models.sequelize.sync({ force: true });
    let user1 = await models.User.create({
        "first_name": "string",
        "last_name": "string",
        "email": "existing_test_email@example.com",
        "password": "$2b$10$IkAoMh2TGDCzaLiOMq.Dbe8REEk02Hi3.530Ne9FrKmxtwLejJ6yW",
        "isAdmin": false,
        "notification_option": "EMAIL"
    })
    let user2 = await models.User.create({
        "first_name": "string",
        "last_name": "string",
        "email": "admin_test_email@example.com",
        "password": "$2b$10$IkAoMh2TGDCzaLiOMq.Dbe8REEk02Hi3.530Ne9FrKmxtwLejJ6yW",
        "isAdmin": true,
        "notification_option": "EMAIL"
    }).catch(e => console.log(e,91919))
    tokens = {
        normal: "Bearer " + createToken(user1.id),
        admin: "Bearer " + createToken(user2.id)
    }
    done()
})

cases.forEach(case_ => {
    describe(case_.title, () => {
        it(case_.description, async done => {
            console.log({ tokens})
            let Authorization = case_.request.headers["Authorization"] ||
                                (case_.request.fromNormal && tokens["normal"]) ||
                                (case_.request.fromAdmin && tokens["admin"]) || ""
            const res = await agent[case_.request.method.toLowerCase()](`/api/v1/${case_.path}`)
                                    .set("Accept",case_.request.headers["Accept"] || "")
                                    .set("Content-Type",case_.request.headers["Content-Type"] || "")
                                    .set("Authorization",Authorization)
                                    .send(case_.request.body)
            let data = JSON.parse(res.text)
            if (case_.before) await case_.before()
            case_.request.body = JSON.stringify(case_.request.body)
            
            console.log({ lazyField: case_.lazyFieldValidation }, 99919, 99919, 99919, 99919, 99919)
            if (case_.lazyFieldValidation) lazyFieldValidation(case_.lazyFieldValidation,data)

            expect(JSON.stringify(sortObj(data)))
                .toBe(JSON.stringify(sortObj(case_.response)))
            
            done();
        })
    })
})