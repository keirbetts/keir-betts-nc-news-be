const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topics-router");
const usersRouter = require("../routers/users-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
