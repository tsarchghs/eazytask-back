
const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");

const { post_users, patch_users } = require("./validations")
const { createUser, patchUser } = require("./users-dal")

const multer = require('multer')
const upload = multer();

app.post("/users", validateRequest(post_users), async (req,res) => {
    let user = await createUser(req.body);
    return res.json({
        message: "success",
        code: 201,
        data: user
    })
})

app.post("/users/:userId", upload.single("profile_image"),(req,res) => res.send(JSON.stringify([req.file,1])))

app.patch("/users/:userId", 
    [
        validateRequest(patch_users), 
        upload.single("profile_image"),
        jwtRequired,
        passUserFromJWT
    ], async (req,res) => {
        if (req.user.id !== req.params.userId) throw new ErrorHandler(401, "Unauthorized")
        let user = await patchUser(req.params.userId, { ...req.body, profile_image: req.file });
        return res.json({
            message: "success",
            code: 200,
            data: user
        })
})