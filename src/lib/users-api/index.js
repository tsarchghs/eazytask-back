
const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");

const { post_users, patch_users } = require("./validations")
const { createUser, patchUser } = require("./users-dal")

const { ErrorHandler } = require("../../utils/error")

const multer = require('multer')
const upload = multer();

const uploadMiddleware = upload.fields([
    { name: 'profile_image', maxCount: 1 }, 
    { name: 'cover_image', maxCount: 1 }
])

// const uploadMiddleware = upload.fields([
//     { name: 'profile_image', maxCount: 1 }, 
//     { name: 'gallery', maxCount: 8 }
// ])

app.post("/users", validateRequest(post_users), async (req,res) => {
    let user = await createUser(req.body);
    return res.json({
        message: "success",
        code: 201,
        data: user
    })
})

// app.post("/users/:userId", upload.single("profile_image"),(req,res) => res.send(JSON.stringify([req.file,1])))

app.patch("/users/:userId", 
    [
        validateRequest(patch_users), 
        uploadMiddleware, // upload.single("profile_image"),
        jwtRequired,
        passUserFromJWT
    ], async (req,res) => {
        let files = {};
        if (req.files) {
            if (req.files["profile_image"] && req.files["profile_image"].length) files["profile_image"] = req.files["profile_image"][0];
            if (req.files["cover_image"] && req.files["cover_image"].length) files["cover_image"] = req.files["cover_image"][0];
        }
        if (req.user.id != req.params.userId) throw new ErrorHandler(401, "Unauthorized")
        let user = await patchUser(req.params.userId, { ...req.body, ...files });
        return res.json({
            message: "success",
            code: 200,
            data: user
        })
})