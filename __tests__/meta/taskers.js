const getPostRequest = require("../utils/getPostRequest");

let validRequest = {
    body: {
        "area_of_activity": "Kosovo",
        "languages": ["lang-1", "lang-2"],
        "skills": ["skill-1"]
    },
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    method: "POST",
    fromNormal: true
}

let GET_VALID_RESPONSE = {
    "status": 200,
    "message": "success",
    "data": {
        "id": 1,
        "area_of_activity": "Kosovo",
        "UserId": 1,
        "Languages": [
            {
                "name": "lang-1",
                "createdByUser": true,
                "Tasker_Language": { TaskerId: 1 },
            },
            {
                "name": "lang-2",
                "createdByUser": true,
                "Tasker_Language": { TaskerId: 1 },
            }
        ],
        "Skills": [
            {
                "name": "skill-1",
                "createdByUser": true,
                "Tasker_Skill": { TaskerId: 1 },
            }
        ]
    }
}
let POST_VALID_RESPONSE = {
    "status": 200,
    "message": "success",
    "data": {
        "id": 1,
        "UserId": 1,
        "area_of_activity": "Kosovo",
        "Languages": [
            {
                "name": "lang-1",
                "createdByUser": true
            },
            {
                "name": "lang-2",
                "createdByUser": true
            }
        ],
        "Skills": [
            {
                "name": "skill-1",
                "createdByUser": true
            }
        ]
    }
}

let POST_VALID_FIELD_VALIDATION = [
    "data.createdAt",
    "data.updatedAt",
    "data.Languages.[item].id",
    "data.Languages.[item].updatedAt",
    "data.Languages.[item].createdAt",
    "data.Skills.[item].id",
    "data.Skills.[item].createdAt",
    "data.Skills.[item].updatedAt",
]

let GET_VALID_FIELD_VALIDATION = [
    "data.createdAt",
    "data.updatedAt",
    "data.Languages.[item].id",
    "data.Languages.[item].updatedAt",
    "data.Languages.[item].createdAt",
    "data.Languages.[item].Tasker_Language.LanguageId",
    "data.Languages.[item].Tasker_Language.createdAt",
    "data.Languages.[item].Tasker_Language.updatedAt",
    "data.Skills.[item].id",
    "data.Skills.[item].createdAt",
    "data.Skills.[item].updatedAt",
    "data.Skills.[item].Tasker_Skill.SkillId",
    "data.Skills.[item].Tasker_Skill.createdAt",
    "data.Skills.[item].Tasker_Skill.updatedAt",

]

module.exports = [
    {
        id: "taskers_1",
        title: "[1] POST /taskers with correct body and correct headers",
        description: "Return data",
        path: "/taskers",
        request: validRequest,
        response: POST_VALID_RESPONSE,
        lazyFieldValidation: POST_VALID_FIELD_VALIDATION
    },
    {
        id: "taskers_2",
        title: "[2] POST /taskers with user id already having a tasker assigned",
        description: "Return data",
        path: "/taskers",
        request: validRequest,
        response: {
            "status": "error",
            "code": 409,
            "message": "Cannot create resource because it conflicts with the current state of the server.",
            "errors": [
                "taskers.UserId must be unique (there is already a tasker assigned to this user"
            ]
        },
    },
    {
        id: "taskers_3",
        title: "[3] GET /taskers",
        description: "Return data",
        path: "/taskers/1",
        request: {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            method: "GET",
        },
        response: GET_VALID_RESPONSE,
        lazyFieldValidation: GET_VALID_FIELD_VALIDATION
    },
]