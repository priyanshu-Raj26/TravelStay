module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL in the session
    req.flash("error", "You must be logged in to create a new listing!");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available in res.locals
  }
  next();
};
