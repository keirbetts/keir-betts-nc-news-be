const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById
} = require("../controllers/comments-controllers");
const { send405Error } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById)
  .all(send405Error);

module.exports = commentsRouter;
