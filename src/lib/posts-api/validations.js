
const yup = require("yup")
const common = require("../utils/validations");

let args = [
    "Number",
    "limit must be a string that can be parsed into a number",
    val => val === undefined || !!Number(val)
];

queryLimitOffsetSchema = yup.object().shape({
    query: yup.object().shape({
        limit: yup.string().test(...args),
        offset: yup.string().test(...args),
    })
})

module.exports = {
    get_posts: yup.object().shape({
        queryLimitOffsetSchema
    }),
    get_posts_count: yup.object().shape({
        queryLimitOffsetSchema
    }),
    get_postId: yup.object().shape({
        params: yup.object().shape({
            postId: common.id.required(),
        }).required()
    }),
    post_posts: yup.object().shape({
        requestBody: yup.object().shape({
            title: yup.string().required(),
            content: yup.string()
        })
    }),
    patch_posts: yup.object().shape({
        params: yup.object().shape({
            postId: common.id.required(),
        }).strict(false),
        requestBody: yup.object().shape({
            title: yup.string(),
            content: yup.string(),
            thumbnail: yup.string(),
        })
    }),
    delete_postId: yup.object().shape({
        params: yup.object().shape({
            postId: common.id.required(),
        }).required()
    }),
}