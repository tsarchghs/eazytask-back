const getPostRequest = require("../utils/getPostRequest");

module.exports = [
    {
        id: "categories_1",
        title: "[1] POST /categories with no body",
        description: "Return errors",
        path: "/categories",
        request: getPostRequest({}),
        response: {
            "status": "error",
            "code": 403,
            "message": "Validation error",
            "errors": [
                "requestBody.name is a required field"
            ]
        }
    },
    {
        id: "categories_2",
        title: "[2] POST /categories with correct body but without admin access",
        description: "Return errors",
        path: "/categories",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-category-name" },
            fromUser: true
        },
        response: {
            "status": "error",
            "message": "Unauthorized",
            "code": 401,
        }
    },
    {
        id: "categories_3",
        title: "[3] POST /categories with body and admin access",
        description: "Return created category",
        path: "/categories",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-category-name" },
            fromAdmin: true
        },
        response: {
            "message": "success",
            "status": 200,
            "data": {
                "id": 1,
                "name": "new-category-name",
                "createdByUser": false
            }
        },
        lazyFieldValidation: ["data.updatedAt", "data.createdAt"]
    },
    {
        id: "categories_4",
        title: "[4] POST /categories with duplicate name and admin access",
        description: "Return created category",
        path: "/categories",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-category-name" },
            fromAdmin: true
        },
        before: async models => {
            while (true) {
                console.log("[Category] SEARCHIN....")
                let categories = await models.Category.findAll()
                if (categories.length) break;
            }
            return;
        },
        response: {
            "status": "error",
            "code": 409,
            "message": "Cannot create resource because it conflicts with the current state of the server.",
            "errors": [
                "category.name must be unique"
            ]
        },
    },
    {
        id: "categories_5",
        title: "[5] GET /categories",
        description: "Return list of categories",
        path: "/categories",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "GET",
        },
        before: async models => {
            while (true){
                console.log("[Category] SEARCHIN....")
                let categories = await models.Category.findAll()
                if (categories.length) break;
            }
            return;
        },
        response: {
            "message": "success",
            "status": 200,
            "data": [
                {
                    "id": 1,
                    "name": "new-category-name",
                    "createdByUser": false
                }
            ]
        },
        lazyFieldValidation: ["data.[item].updatedAt", "data.[item].createdAt"]
    },
]