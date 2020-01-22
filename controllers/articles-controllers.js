const {
  sendArticleById,
  sendPatchedArticle,
  sendPostedComment,
  sendAllComments,
  sendAllArticles
} = require("../models/articles-models");

exports.getAllArticles = (req, res, next) => {
  sendAllArticles(req.query.sort_by, req.query.order, req.query.author)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  sendArticleById(req.params.article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  sendPatchedArticle(req.params.article_id, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
  sendPostedComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  sendAllComments(req.params, req.query.sort_by, req.query.order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
