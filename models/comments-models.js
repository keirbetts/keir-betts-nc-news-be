const connection = require("../db/connection");

exports.sendDeletedComment = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del();
};

exports.sendPatchedComment = (id, body) => {
  if (Object.keys(body).length > 0) {
    return connection
      .select("*")
      .from("comments")
      .where("comment_id", "=", id)
      .increment("votes", body.inc_votes)
      .returning("*")
      .then(comment => {
        if (comment.length > 0) return comment;
        else {
          return Promise.reject({ status: 404, msg: "Id is non-existent" });
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: "Body is incorrect!" });
  }
};
