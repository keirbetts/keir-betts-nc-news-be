const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getAllUsers
} = require("../controllers/users-controllers");
const { send405Error } = require("../errors");

usersRouter
  .route("/")
  .get(getAllUsers)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
