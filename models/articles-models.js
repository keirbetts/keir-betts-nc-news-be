const connection = require("../db/connection");

exports.sendArticleById = id => {
  return connection
    .select("*")
    .from("articles")
    .where(id, "=", "article_id")
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Id is non-existent" });
      }
      return article;
    });
};

//add comment count to each article .count() select comments.belongsTo
//join to comments table leftjoin comments.belongsto
//group by

exports.sendPatchedArticle = (id, body) => {
  return connection
    .select("*")
    .from("articles")
    .where(id, "=", "article_id")
    .increment("votes", body.inc_votes)
    .returning("*")
    .then(article => {
      return article;
    });
};
