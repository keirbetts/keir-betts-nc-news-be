const { sendUserByUsername } = require("../models/users-models");

exports.getUserByUsername = (req, res, next) => {
  sendUserByUsername(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
