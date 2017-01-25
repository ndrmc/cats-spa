module.exports = function(req, res, next) {

  req.locals.flash_message = req.flash('message');

  next();
}; 