const { Post } = require("../models");

const getAllPosts = async (themePostId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const numericId = Number(themePostId);

  const where =
    isNaN(numericId) || numericId === 0 ? {} : { themePostId: numericId };

  const result = await Post.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: result.count,
    posts: result.rows,
  };
};

const createPost = async (post) => {
  return await Post.create(post);
};

const deletePost = async (postId) => {
  const post = await Post.findByPk(postId);
  if (!post) return null;
  await post.destroy();
  return post;
};

const updatePost = async (data, postId) => {
  const post = await Post.findByPk(postId);
  if (!post) return null;
  await post.update(data);
  return post;
};

const getOnePost = async (postId) => {
  return Post.findByPk(postId);
};

const getUserPost = async (userId) => {
  return Post.findAll({ where: { userId: userId } });
};

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getOnePost,
  getUserPost,
};
