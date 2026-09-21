const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username }); // username is required by passport-local-mongoose plugin
    const registeredUser = await User.register(user, password); //register method is provided by passport-local-mongoose plugin, it hashes the password and saves the user to the database

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to TravelStay!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/users/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back to TravelStay!");
  res.redirect(res.locals.redirectUrl || "/listings"); // Redirect to the saved URL or default to /listings
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};
