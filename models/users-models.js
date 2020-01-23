const connection = require("../db/connection");

exports.sendUserByUsername = user => {
  return connection
    .select("*")
    .from("users")
    .where(user, "=", "username")
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 400, msg: "Username is non existent" });
      }
      return user[0];
    });
};
