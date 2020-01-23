const {
  sendArticleById,
  sendPatchedArticle,
  sendPostedComment,
  sendAllCommentsByArticleId,
  sendAllArticles,
  checkArticleExists
} = require("../models/articles-models");

exports.getAllArticles = (req, res, next) => {
  sendAllArticles(
    req.query.sort_by,
    req.query.order,
    req.query.author,
    req.query.topic
  )
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
  sendPostedComment(req.params.article_id, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  Promise.all([
    sendAllCommentsByArticleId(
      req.params.article_id,
      req.query.sort_by,
      req.query.order
    ),
    checkArticleExists(req.params.article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
