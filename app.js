const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  handle400s,
  handle500s,
  handleCustomErrors,
  handle422s,
  send405Error
} = require("./errors");

app.use(express.json());
app.use("/api", apiRouter).all(send405Error);

app.use(handle400s);
app.use(handle422s);
app.use(handleCustomErrors);
app.use(handle500s);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
});

module.exports = app;
