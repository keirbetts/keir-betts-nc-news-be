const connection = require("../db/connection");

exports.sendAllUsers = () => {
  return connection.select("*").from("users");
};

exports.sendUserByUsername = user => {
  return connection
    .select("*")
    .from("users")
    .where(user, "=", "username")
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 404, msg: "Username is non existent" });
      }
      return user[0];
    });
};
