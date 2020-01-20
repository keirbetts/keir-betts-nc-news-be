const connection = require("../db/connection");

exports.sendAllTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return topics;
    });
};
