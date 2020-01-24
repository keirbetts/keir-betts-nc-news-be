const { sendUserByUsername, sendAllUsers } = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  sendAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  sendUserByUsername(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
