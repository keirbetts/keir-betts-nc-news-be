const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const { handle500s } = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);

//ERRORS
app.use(handle500s);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
});

module.exports = app;
