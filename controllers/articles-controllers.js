const {
  sendArticleById,
  sendPatchedArticle
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  sendArticleById(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  sendPatchedArticle(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
