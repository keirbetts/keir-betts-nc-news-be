const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topics-router");
const usersRouter = require("../routers/users-router");
const articlesRouter = require("../routers/articles-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
