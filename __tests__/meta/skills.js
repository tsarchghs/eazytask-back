const getPostRequest = require("../utils/getPostRequest");

module.exports = [
    {
        id: "skills_1",
        title: "[1] POST /skills with no body",
        description: "Return errors",
        path: "/skills",
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
        id: "skills_2",
        title: "[2] POST /skills with correct body but without admin access",
        description: "Return errors",
        path: "/skills",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-skill-name" },
            fromUser: true
        },
        response: {
            "status": "error",
            "message": "Unauthorized",
            "code": 401,
        }
    },
    {
        id: "skills_3",
        title: "[3] POST /skills with body and admin access",
        description: "Return created skill",
        path: "/skills",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-skill-name" },
            fromAdmin: true
        },
        response: {
            "message": "success",
            "status": 200,
            "data": {
                "id": 1,
                "name": "new-skill-name",
                "createdByUser": false
            }
        },
        lazyFieldValidation: ["data.updatedAt", "data.createdAt"]
    },
    {
        id: "skills_4",
        title: "[4] GET /skills",
        description: "Return skills",
        path: "/skills",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "GET",
        },
        response: {
            "message": "success",
            "status": 200,
            "data": [
                {
                    "id": 1,
                    "name": "new-skill-name",
                    "createdByUser": false
                }
            ]
        },
        lazyFieldValidation: ["data.[item].updatedAt", "data.[item].createdAt"]
    },
    {
        id: "skills_5",
        title: "[5] POST /skills with duplicate name and admin access",
        description: "Return created skill",
        path: "/skills",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "POST",
            body: { name: "new-skill-name" },
            fromAdmin: true
        },
        before: async models => {
            while (true) {
                console.log("[Skill] SEARCHIN....")
                let skills = await models.Skill.findAll()
                if (skills.length) break;
            }
            return;
        },
        response: {
            "status": "error",
            "code": 409,
            "message": "Cannot create resource because it conflicts with the current state of the server.",
            "errors": [
                "skill.name must be unique"
            ]
        },
    },
]