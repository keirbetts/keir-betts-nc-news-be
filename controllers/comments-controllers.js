const {
  sendDeletedComment,
  sendPatchedComment
} = require("../models/comments-models");

exports.deleteCommentById = (req, res, next) => {
  sendDeletedComment(req.params.comment_id)
    .then(deleteCount => {
      if (deleteCount > 0) res.sendStatus(204);
      else
        return Promise.reject({
          status: 404,
          msg: "comment_id does not exist!"
        });
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  sendPatchedComment(req.params.comment_id, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
