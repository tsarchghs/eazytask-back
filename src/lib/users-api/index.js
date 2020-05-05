
const express = require("express");
const app = module.exports = express();

const validateRequest = require("../../middlewares/validateRequest");

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

app.get("/users/:userId", async (req, res) => {
    return res.send(`
        <form method="post" enctype="multipart/form-data" action="/api/v1/users/${req.params.userId}">
            <input type="file" id="profile_image_id" name="profile_image"/>
            <button type="submit">Submit</button>
        </form>
    `)      
})

app.post("/users/:userId", upload.single("profile_image"),(req,res) => res.send(JSON.stringify([req.file,1])))

app.patch("/users/:userId", [validateRequest(patch_users), upload.single("profile_image")], async (req,res) => {
    console.log(req.body, req.file, req.files)
    let user = await patchUser(req.params.userId, { ...req.body, profile_image: req.file });
    return res.json({
        message: "success",
        code: 200,
        data: user
    })
})