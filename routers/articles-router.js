const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  patchArticleById,
  postCommentToArticle,
  getAllComments,
  deleteArticleById
} = require("../controllers/articles-controllers");
const { send405Error } = require("../errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentToArticle)
  .get(getAllComments)
  .all(send405Error);

module.exports = articlesRouter;
