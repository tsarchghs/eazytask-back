
const getPostRequest = require("../utils/getPostRequest");

let GET_POST_AUTH_RES = {
    "status": "success",
    "code": 200,
    "message": "Authorized",
    "data": {
        "user": {
            "email": "existing_test_email@example.com",
            "first_name": "string",
            "last_name": "string",
            "gender": null,
            "date_of_birth": null,
            "short_biography": null,
            "country": null,
            "city": null,
            "address": null,
            "profile_image": null,
            "notification_option": "EMAIL",
            "isAdmin": false
        },
        "expires_in": 10000
    }
}

module.exports = [
    {
        id: "auth_1",
        title: "[1] POST /auth with no body",
        description: "Return errors",
        path: "/auth",
        request: getPostRequest({}),
        response: {
            "status": "error",
            "message": "Validation error",
            "code": 403,
            "errors": [
                "requestBody.email is a required field",
                "requestBody.password is a required field"
            ]
        }
    },
    {
        id: "auth_2",
        title: "[2] POST /auth with invalid email",
        description: "Return errors",
        path: "/auth",
        request: getPostRequest({
            "email": "existing_test_email"
        }),
        response: {
            "status": "error",
            "message": "Validation error",
            "code": 403,
            "errors": [
                "requestBody.email must be a valid email",
                "requestBody.password is a required field"
            ]
        }
    },
    {
        id: "auth_3",
        title: "[3] POST /auth with valid data",
        description: "Return user data and token",
        path: "/auth",
        request: getPostRequest({
            "email": "existing_test_email@example.com",
            "password": "string"
        }),
        response: GET_POST_AUTH_RES,
        lazyFieldValidation: ["data.user.id","data.token","data.user.createdAt","data.user.updatedAt"]
    },
    {
        id: "auth_4",
        title: "[4] POST /auth with valid email but invalid password",
        description: "Return errors",
        path: "/auth",
        request: getPostRequest({
            "email": "existing_test_email@gmail.com",
            "password": "testing"
        }),
        response: {
            "status": "error",
            "code": 400,
            "message": "Invalid credentials",
            "errors": [
                "The email address or password is incorrect. Please try again."
            ]
        }
    },
    {
        id: "auth_5",
        title: "[5] GET /auth with no bearer token in headers",
        description: "Return errors",
        path: "/auth",
        request: {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
        response: {
            "status": "error",
            "message": "Unauthorized",
            "code": 401,
        }
    },
    {
        id: "auth_6",
        title: "[6] GET /auth with valid token in headers",
        description: "Return errors",
        path: "/auth",
        request: {
            body: {},
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU4ODU4ODU1MH0.ZqAxUtrI-kPmNrM_azJwkauiij9hOaCYafHydsdnFfU"
            },
            method: "GET"
        },
        response: GET_POST_AUTH_RES,
        lazyFieldValidation: ["data.user.id", "data.token", "data.user.createdAt", "data.user.updatedAt"]
    },
]
