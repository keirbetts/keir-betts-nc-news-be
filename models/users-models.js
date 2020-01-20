const connection = require("../db/connection");

exports.sendUserByUsername = user => {
  return connection
    .select("*")
    .from("users")
    .then(user => {
      return user;
    });
};
