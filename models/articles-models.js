const connection = require("../db/connection");

exports.sendAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  const orderArr = ["desc", "asc", undefined];
  if (orderArr.includes(order)) {
    return connection
      .select("articles.*")
      .from("articles")
      .count({ comment_count: "comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify(query => {
        if (author !== undefined) query.where("articles.author", "=", author);
        if (topic !== undefined) query.where("articles.topic", "=", topic);
      })
      .then(articles => {
        return articles;
      });
  } else return Promise.reject({ status: 400, msg: "order not valid" });
};

exports.sendArticleById = id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where({ "articles.article_id": +id })
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Id is non-existent" });
      }
      return article[0];
    });
};

exports.sendPatchedArticle = (id, body) => {
  if (Object.keys(body).length > 0) {
    return connection
      .select("*")
      .from("articles")
      .where("article_id", "=", id)
      .increment("votes", body.inc_votes)
      .returning("*")
      .then(article => {
        if (article.length > 0) return article[0];
        else {
          return Promise.reject({ status: 404, msg: "Id is non-existent" });
        }
      });
  } else {
    return connection
      .select("*")
      .from("articles")
      .where("article_id", "=", id)
      .returning("*")
      .then(article => {
        return article[0];
      });
  }
};

exports.sendPostedComment = (id, body) => {
  body.author = body.username;
  delete body.username;
  body.article_id = id;
  return connection
    .insert(body)
    .into("comments")
    .returning("*")
    .then(comment => {
      if (comment.length > 0) return comment[0];
      else {
        return Promise.reject({ status: 404, msg: "Id is non-existent" });
      }
    });
};

exports.sendAllCommentsByArticleId = (
  id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", id)
    .orderBy(sort_by, order)
    .then(comment => {
      return comment;
    });
};

exports.checkArticleExists = id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", id)
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Id does not exist!" });
      }
    });
};
