exports.handle400s = (err, req, res, next) => {
  //console.log(err);
  const codes = ["22P02", "42703", "23502"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request-You have done something wrong!" });
  } else next(err);
};

exports.handle422s = (err, req, res, next) => {
  const codes = ["23503"];
  if (codes.includes(err.code)) {
    res.status(422).send({ msg: "Reference id does not exist" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handle500s = (err, req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: "server error" });
};
