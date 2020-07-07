const express = require("express");
const app = module.exports = express();

const {
    allowCrossDomain,
    validateRequest,
    jwtRequired,
    passUserFromJWT,
    adminRequired
} = require("../../middlewares");

const { get_posts, get_postId, post_posts, patch_posts, delete_postId } = require("./validations");

const { findAll, countAll, createPost, findOne, patchPost } = require("./posts-dal");

const { ErrorHandler } = require("../../utils/error")

const formatMulterAny = require("../utils/formatMulterAny");

const multer = require('multer')
const upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 }
});

app.use(allowCrossDomain)

app.get('/posts', validateRequest(get_posts), async (req, res) => {
    let { limit, offset } = req.query;

    if (limit) limit = Number(limit);
    if (offset) offset = Number(offset);

    let posts = await findAll({ limit, offset });
    return res.json({
        message: "success",
        status: 200,
        data: posts
    })
});

app.post('/posts', [
    upload.any(),
    validateRequest(post_posts),
    jwtRequired,
    passUserFromJWT,
    adminRequired,
], async (req, res) => {
    let { title, content } = req.body;
    let files = formatMulterAny(req.files); 
    let post = await createPost({ title, content, thumbnail: files["thumbnail"] });
    return res.json({
        message: "success",
        status: 201,
        data: post
    })
});

app.patch('/posts/:postId',
    [
        validateRequest(patch_posts,false),
        upload.any(),
        jwtRequired,
        passUserFromJWT,
        adminRequired
    ], async (req, res) => {
        console.log(req.body)
        let files = req.files ? formatMulterAny(req.files) : undefined; 
        let postId = Number(req.params.postId)
        let post = await findOne(postId)
        if (!post) throw new ErrorHandler(404, "Post not found");
        post = await patchPost(post,{
            ...req.body, thumbnail: files.thumbnail
        });
        return res.json({
            message: "success",
            status: 200,
            data: post
        })
});

app.delete('/posts/:postId',
    [
        validateRequest(delete_postId,false),
        jwtRequired,
        passUserFromJWT,
        adminRequired
    ], async (req, res) => {
        let postId = Number(req.params.postId)
        let post = await findOne(postId)
        if (!post) throw new ErrorHandler(404, "Post not found");
        post = await patchPost(post,{ deleted: true });
        return res.json({
            message: "success",
            status: 204,
        })
});


app.get("/posts/count", async (req, res) => {
    let count = await countAll();
    return res.json({
        message: "success",
        status: 200,
        data: { count }
    })
})

app.get('/posts/:postId', validateRequest(get_postId, false), async (req, res) => {
    let postId = Number(req.params.postId);
    let posts = await findOne(postId, req.query);
    return res.json({
        message: "success",
        status: 200,
        data: posts
    })
});

// app.get("/posts", validateRequest)