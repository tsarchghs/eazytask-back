// let { User } = require("../../src/models")[process.env.MYSQL_DATABASE_TESTING] 

const getPostRequest = require("../utils/getPostRequest");

module.exports = [
    {
        id: "users_1",
        title: "[1] POST /users with no body",
        description: "Return errors",
        path: "/users",
        request: getPostRequest({}),
        response: {
            "status": "error",
            "message": "Validation error",
            "code": 403,
            "errors": [
                "requestBody.first_name is a required field",
                "requestBody.last_name is a required field",
                "requestBody.email is a required field",
                "requestBody.password is a required field"
            ]
        }
    },
    {
        id: "users_2",
        title: "[2] POST /users with invalid email/password",
        description: "Return errors",
        path: "/users",
        request: {
            body: getPostRequest({
                "email": "user",
                "password": "123"
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        },
        response: {
            "status": "error",
            "message": "Validation error",
            "code": 403,
            "errors": [
                "requestBody.first_name is a required field",
                "requestBody.last_name is a required field",
                "requestBody.email must be a valid email",
                "requestBody.password must be at least 6 characters"
            ]
        }
    },
    {
        id: "users_3",
        title: "[3] POST /users with valid data",
        description: "Return created resource",
        path: "/users",
        request: getPostRequest({
            "first_name": "string",
            "last_name": "string",
            "email": "example1@example.com",
            "password": "string"
        }),
        response: {
            "message": "success",
            "code": 201,
            "data": {
                "first_name": "string",
                "last_name": "string",
                "email": "example1@example.com",
                "notification_option": "EMAIL",
                "isAdmin": false,
            }
        },
        lazyFieldValidation: ["data.id","data.createdAt","data.updatedAt"]
    },
    {
        id: "users_4",
        title: "[4] POST /users with existing email",
        description: "Return 409 error",
        path: "/users",
        request: getPostRequest({
            "first_name": "string",
            "last_name": "string",
            "email": "existing_test_email@example.com",
            "password": "string"
        }),
        before: async () => {
            // await User.create({
            //     "first_name": "string",
            //     "last_name": "string",
            //     "email": "existing_test_email@example.com",
            //     "password": "$2b$10$IkAoMh2TGDCzaLiOMq.Dbe8REEk02Hi3.530Ne9FrKmxtwLejJ6yW",
            //     "isAdmin": false,
            //     "notification_option": "EMAIL"
            // }).catch(err => console.log("Test 3 already ran"))

        },
        response: {
            "status": "error",
            "code": 409,
            "message": "Cannot create resource because it conflicts with the current state of the server.",
            "errors": [
                "users.email must be unique"
            ]
        }
    },
    {
        id: "users_5",
        title: "[5] POST /users with existing email",
        description: "Return 409 error",
        path: "/users",
        request: getPostRequest({
            "first_name": "string",
            "last_name": "string",
            "email": "existing_test_email@example.com",
            "password": "string"
        }),
        before: async () => {
            // await User.create({
            //     "first_name": "string",
            //     "last_name": "string",
            //     "email": "existing_test_email@example.com",
            //     "password": "$2b$10$IkAoMh2TGDCzaLiOMq.Dbe8REEk02Hi3.530Ne9FrKmxtwLejJ6yW",
            //     "isAdmin": false,
            //     "notification_option": "EMAIL"
            // }).catch(err => console.log("Test 3 already ran"))

        },
        response: {
            "status": "error",
            "code": 409,
            "message": "Cannot create resource because it conflicts with the current state of the server.",
            "errors": [
                "users.email must be unique"
            ]
        }
    }
]
