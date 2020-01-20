exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};
