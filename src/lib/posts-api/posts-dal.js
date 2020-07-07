const { Post } = require("../../models")
const uploadFile = require("../aws/uploadFile");

module.exports = {
    countAll: () => Post.count(),
    findAll: ({limit,offset}) => Post.findAll({ limit, offset }),
    findOne: async id => await Post.findOne({ where: { id }}),
    createPost: async ({ title, content, thumbnail }) => await Post.create({ 
        title, 
        content,
        thumbnail: thumbnail ? await uploadFile(thumbnail) : undefined  
    }),
    patchPost: async (post,{title, content, thumbnail, deleted }) => {
        let data = {}
        if (title) data.title = title;
        if (content) data.content = content;
        if (deleted) data.deleted = deleted;
        if (thumbnail) data.thumbnail = await uploadFile(thumbnail);
        return post.update(data);
    }
}