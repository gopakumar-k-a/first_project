const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.render("../views/error/500");
  };
  
  module.exports = { errorHandler };