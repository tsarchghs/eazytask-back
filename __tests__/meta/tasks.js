const getPostRequest = require("../utils/getPostRequest");

let UNAUTHORIZED_RESPONSE = {
    "code": 401,
    "message": "Unauthorized",
    "status": "error"
}

module.exports = [
    {
        id: "tasks_1",
        title: "[1] POST /tasks with no body and no headers",
        description: "Return errors",
        path: "/tasks",
        request: getPostRequest({}),
        response: UNAUTHORIZED_RESPONSE
    },
    {
        id: "tasks_2",
        title: "[2] POST /tasks with no body and correct headers",
        description: "Return errors",
        path: "/tasks",
        request: {
            body: {},
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            fromAdmin: true
        },
        response: {
            "status": "error",
            "code": 403,
            "message": "Validation error",
            "errors": [
                "category is a required field",
                "title is a required field",
                "location is a required field",
                "description is a required field",
                "due_date_type is a required field",
                "due_date is a required field"
            ]
        }
    },
    {
        id: "tasks_3",
        title: "[3] POST /tasks with correct body and correct headers",
        description: "Return errors",
        path: "/tasks",
        request: {
            body: {
                category: "category-name",
                title: "task-title",
                description: "task-description",
                location: "location",
                due_date_type: "UNTIL_DATE",
                due_date: "05/05/2005"
            },
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            fromNormal: true
        },
        response: {
            "message": "success",
            "status": 201,
            "data": {
                "title": "task-title",
                "description": "task-description",
                "due_date_type": "UNTIL_DATE",
                "due_date": "2005-05-05T00:00:00.000Z",
                "location": "location",
                "status": "ACTIVE",
            }
        },
        lazyFieldValidation: ["data.createdAt", "data.updatedAt", "data.id", "data.UserId", "data.CategoryId"]
    },
    {
        id: "tasks_4",
        title: "[4] GET /tasks",
        description: "Return data",
        path: "/tasks",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "GET",
        },
        response: {
            "message": "success",
            "status": 200,
            "data": [
                {
                    "thumbnail": null,
                    "gallery": null,
                    "expected_price": null,
                    "status": "ACTIVE",
                }
            ]
        },
        lazyFieldValidation: [
            "data.[item].id",
            "data.[item].UserId",
            "data.[item].title",
            "data.[item].description",
            "data.[item].due_date_type",
            "data.[item].due_date",
            "data.[item].location",
            "data.[item].CategoryId",
            "data.[item].createdAt",
            "data.[item].updatedAt",
        ]
    },
    {
        id: "tasks_4.1",
        title: "[4.1] PATCH /tasks/1",
        description: "Return data",
        path: "/tasks/1",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "PATCH",
            body: { expected_price: 500 },
            fromNormal: true
        },
        response: {
            "message": "success",
            "status": 200,
            "data": {
                "thumbnail": null,
                "gallery": null,
                "expected_price": 500,
                "status": "ACTIVE",
            }
        },
        lazyFieldValidation: [
            "data.id",
            "data.UserId",
            "data.title",
            "data.description",
            "data.due_date_type",
            "data.due_date",
            "data.location",
            "data.CategoryId",
            "data.createdAt",
            "data.updatedAt",
        ]
    },
    {
        id: "tasks_4.2",
        title: "[4.2] PATCH /tasks/1",
        description: "Return validation error",
        path: "/tasks/1",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "PATCH",
            body: { due_date: "05/05/2005dasdas" },
            fromNormal: true
        },
        response: {
            "status": "error",
            "code": 403,
            "message": "Validation error",
            "errors": [
                "due_date must be a `date` type, but the final value was: `Invalid Date` (cast from the value `\"05/05/2005dasdas\"`)."
            ]
        }
    },
    {
        id: "tasks_4.2",
        title: "[4.2] PATCH /tasks/1",
        description: "Return unauthorized",
        path: "/tasks/1",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "PATCH",
            body: { expected_price: 500 },
            fromAdmin: true
        },
        response: UNAUTHORIZED_RESPONSE
    },
    {
        id: "tasks_5",
        title: "[5] GET /tasks/1",
        description: "Return data",
        path: "/tasks/1",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "GET",
        },
        response: {
            "message": "success",
            "status": 200,
            "data": {
                "id": 1,
                "thumbnail": null,
                "gallery": null,
                "title": "task-title",
                "description": "task-description",
                "due_date_type": "UNTIL_DATE",
                "due_date": "2005-05-05T00:00:00.000Z",
                "location": "location",
                "expected_price": 500,
                "status": "ACTIVE",
            }
        },
        lazyFieldValidation: [
            "data.UserId",
            "data.CategoryId",
            "data.createdAt",
            "data.updatedAt",
        ]
    },
    {
        id: "tasks_6",
        title: "[6] GET /tasks/1",
        description: "Return unauthorized",
        path: "/tasks/1",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "DELETE",
            fromAdmin: true
        },
        response: UNAUTHORIZED_RESPONSE
    },
    {
        id: "tasks_7",
        title: "[7] GET /tasks/1",
        description: "Return data with DELETED status",
        path: "/tasks/1",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "DELETE",
            fromNormal: true
        },
        response: {
            "message": "success",
            "status": 200,
            "data": {
                "id": 1,
                "thumbnail": null,
                "gallery": null,
                "title": "task-title",
                "description": "task-description",
                "due_date_type": "UNTIL_DATE",
                "due_date": "2005-05-05T00:00:00.000Z",
                "location": "location",
                "expected_price": 500,
                "status": "DELETED",
            }
        },
        lazyFieldValidation: [
            "data.UserId",
            "data.CategoryId",
            "data.createdAt",
            "data.updatedAt",
        ]
    },
]
// "data.title",
// "data.description",
// "data.due_date_type",
// "data.due_date",
// "data.location",