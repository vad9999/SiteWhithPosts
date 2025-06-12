const commentService = require("../services/commentService");

const addComment = async (req, res) => {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (e) {
    console.error("Ошибка создания комментария:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const getUserComments = async (req, res) => {
  try {
    const comments = await commentService.getUserComment(req.params.userId);
    res.status(200).json(comments);
  } catch (e) {
    console.error("Ошибка получения комментариев пользователя:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const getPostComments = async (req, res) => {
  try {
    const comments = await commentService.getPostComment(req.params.postId);
    res.status(200).json(comments);
  } catch (e) {
    console.error("Ошибка получения комментариев поста:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await commentService.deleteComment(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Комментарий не найден" });
    }
    res.status(200).json(comment);
  } catch (e) {
    console.error("Ошибка удаления комментария:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await commentService.updateComment(req.body, req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Комментарий не найден" });
    }
    res.status(200).json(comment);
  } catch (e) {
    console.error("Ошибка обновления комментария:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  addComment,
  getUserComments,
  getPostComments,
  deleteComment,
  updateComment,
};
