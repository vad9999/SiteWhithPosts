const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.get("/user/:userId", commentController.getUserComments);
router.get("/post/:postId", commentController.getPostComments);
router.post("/", commentController.addComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
