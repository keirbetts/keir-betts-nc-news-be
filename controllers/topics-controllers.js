const { sendAllTopics } = require("../models/topics-models");

exports.getAllTopics = (req, res, next) => {
  sendAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
