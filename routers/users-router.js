const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users-controllers");
const { send405Error } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
