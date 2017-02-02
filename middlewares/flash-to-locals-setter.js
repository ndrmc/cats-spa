module.exports = function(req, res, next) {

  if( req.locals) { 
    req.locals.flash_message = req.flash('message');
    req.locals.flash_error = req.flash('error');
    req.locals.flash_success = req.flash('success');
  }

  next();
}; 