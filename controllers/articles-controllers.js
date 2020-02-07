const {
  sendArticleById,
  sendPatchedArticle,
  sendPostedComment,
  sendAllCommentsByArticleId,
  sendAllArticles,
  checkArticleExists,
  sendDeleted,
  checkTopicExists,
  checkAuthorExists
} = require("../models/articles-models");

exports.getAllArticles = (req, res, next) => {
  const promiseArr = [
    sendAllArticles(
      req.query.sort_by,
      req.query.order,
      req.query.author,
      req.query.topic
    )
  ];
  if (req.query.topic !== undefined) {
    promiseArr.push(checkTopicExists(req.query.topic));
  }
  if (req.query.author !== undefined) {
    promiseArr.push(checkAuthorExists(req.query.author));
  }
  Promise.all(promiseArr)
    .then(([articles]) => {
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

exports.deleteArticleById = (req, res, next) => {
  sendDeleted(req.params.article_id)
    .then(deleteCount => {
      if (deleteCount > 0) res.sendStatus(204);
      else {
        return Promise.reject({
          status: 404,
          msg: "article_id does not exist!"
        });
      }
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
