let { User } = require("../models")[process.env.MYSQL_DATABASE_TESTING] 

let getPostRequest = body => ({
    body,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    method: "POST"
})

module.exports = [
    {
        id: "users_1",
        title: "[1] POST /users with no body",
        description: "Return errors",
        path: "/users",
        request: getPostRequest({}),
        response: {
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
        title: "[3] POST /users with valid data",
        description: "Return created resource",
        path: "/users",
        request: getPostRequest({
            "first_name": "string",
            "last_name": "string",
            "email": "user@example.com",
            "password": "string"
        }),
        response: {
            "message": "success",
            "code": 201,
            "data": {
                "id": 1,
                "first_name": "string",
                "last_name": "string",
                "email": "user@example.com",
                "notification_option": "EMAIL",
                "isAdmin": false,
            }
        }
    },
    {
        title: "[4] POST /users with existing email",
        description: "Return 409 error",
        path: "/users",
        request: getPostRequest({
            "first_name": "string",
            "last_name": "string",
            "email": "existing_test_email@example.com",
            "password": "string"
        }),
        before: () => {
            User.create({
                "first_name": "string",
                "last_name": "string",
                "email": "existing_test_email@example.com",
                "password": "string",
                "isAdmin": false,
                "notification_option": "EMAIL"
            })

        },
        response: {
            "code": 409,
            "message": "Cannot create resource because it conflicts with the current state of the server.",
            "errors": [
                "users.email must be unique"
            ]
        }
    }
]
