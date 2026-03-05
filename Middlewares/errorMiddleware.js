const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    msg: "Server Error",
  });
};

module.exports = errorMiddleware;
