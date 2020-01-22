const connection = require("../db/connection");

exports.sendAllArticles = (sort_by = "created_at", order = "desc", author) => {
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
      return article;
    });
};

//.count({ comment_count: "comments.article_id" })
//.leftJoin("comments", "articles.article_id", "comments.article_id")
//.groupBy("articles.article_id")

//add comment count to each article .count() select comments.belongsTo
//join to comments table leftjoin comments.belongsto
//group by

exports.sendPatchedArticle = (id, body) => {
  if (Object.keys(body).length > 0) {
    return connection
      .select("*")
      .from("articles")
      .where("article_id", "=", id)
      .increment("votes", body.inc_votes)
      .returning("*")
      .then(article => {
        if (article.length > 0) return article;
        else {
          return Promise.reject({ status: 404, msg: "Id is non-existent" });
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: "Body is incorrect!" });
  }
};

exports.sendPostedComment = (id, body) => {
  if (id.article_id < 13) {
    body.username = body.author;
    delete body.username;
    return connection
      .where("article_id", "=", id)
      .insert(body)
      .into("comments")
      .returning("*")
      .then(comment => {
        let newComm = { ...comment };
        newComm.article_id = comment.id;
        return newComm;
      });
  } else {
    return Promise.reject({ status: 404, msg: "Id is non-existent" });
  }
};

exports.sendAllComments = (id, sort_by = "created_at", order = "desc") => {
  //console.log(+id.article_id === typeof Number);
  if (id.article_id < 13) {
    return connection
      .select("*")
      .from("comments")
      .where(id, "=", "article_id")
      .orderBy(sort_by, order)
      .then(comment => {
        return comment;
      });
  } else {
    return Promise.reject({ status: 404, msg: "Id does not exist!" });
  }
};
