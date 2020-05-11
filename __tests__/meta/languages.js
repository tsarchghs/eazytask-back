const getPostRequest = require("../utils/getPostRequest");

module.exports = [
    {
        id: "languages_1",
        title: "[1] POST /languages with no body",
        description: "Return errors",
        path: "/languages",
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
        id: "languages_2",
        title: "[2] POST /languages with correct body but without admin access",
        description: "Return errors",
        path: "/languages",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-language-name" },
            fromUser: true
        },
        response: {
            "status": "error",
            "message": "Unauthorized",
            "code": 401,
        }
    },
    {
        id: "languages_3",
        title: "[3] POST /languages with body and admin access",
        description: "Return errors",
        path: "/languages",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-language-name" },
            fromAdmin: true
        },
        response: {
            "message": "success",
            "status": 200,
            "data": {
                "id": 1,
                "name": "new-language-name",
                "createdByUser": false
            }
        },
        lazyFieldValidation: ["data.updatedAt", "data.createdAt"]
    },
    {
        id: "languages_4",
        title: "[4] GET /languages",
        description: "Return languages",
        path: "/languages",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "GET",
        },
        before: async models => {
            while (true) {
                console.log("[Language] SEARCHIN....")
                let languages = await models.Language.findAll()
                if (languages.length) break;
            }
            return;
        },
        response: {
            "message": "success",
            "status": 200,
            "data": [
                {
                    "id": 1,
                    "name": "new-language-name",
                    "createdByUser": false
                }
            ]
        },
        lazyFieldValidation: ["data.[item].updatedAt", "data.[item].createdAt"]
    },
    {
        id: "languages_5",
        title: "[5] POST /languages with duplicate name and admin access",
        description: "Return created language",
        path: "/languages",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-language-name" },
            fromAdmin: true
        },
        before: async models => {
            while (true) {
                console.log("[Language] SEARCHIN....")
                let languages = await models.Language.findAll()
                if (languages.length) break;
            }
            return;
        },
        response: {
            "status": "error",
            "code": 409,
            "message": "Cannot create resource because it conflicts with the current state of the server.",
            "errors": [
                "language.name must be unique"
            ]
        },
    },
]