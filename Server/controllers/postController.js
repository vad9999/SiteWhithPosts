const postService = require("../services/postService");

const getPosts = async (req, res) => {
  try {
    const themePostId = req.query.themePostId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const { total, posts } = await postService.getAllPosts(
      themePostId,
      page,
      limit
    );

    res.status(200).json({
      posts,
      total,
    });
  } catch (e) {
    console.error("Ошибка получения постов:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const addPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (e) {
    console.error("Ошибка создания поста:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await postService.deletePost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }
    res.status(200).json(post);
  } catch (e) {
    console.error("Ошибка удаления поста:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await postService.updatePost(req.body, req.params.id);
    if (!updatedPost) {
      return res.status(404).json({ error: "Пост не найден" });
    }
    res.status(200).json(updatedPost);
  } catch (e) {
    console.error("Ошибка обновления поста:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const getOnePost = async (req, res) => {
  try {
    const post = await postService.getOnePost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }
    res.status(200).json(post);
  } catch (e) {
    console.error("Ошибка получения поста:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const getUserPost = async (req, res) => {
  try {
    const posts = await postService.getUserPost(req.params.userId);
    res.status(200).json(posts);
  } catch (e) {
    console.error("Ошибка получения постов пользователя:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  getPosts,
  addPost,
  deletePost,
  updatePost,
  getOnePost,
  getUserPost,
};
