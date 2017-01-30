module.exports = function(req, res, next) {

  if( req.locals) { 
    req.locals.flash_message = req.flash('message');
  }

  next();
}; 