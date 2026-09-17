const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username }); // username is required by passport-local-mongoose plugin
      const registeredUser = await User.register(user, password); //register method is provided by passport-local-mongoose plugin, it hashes the password and saves the user to the database
      console.log(registeredUser);
      req.flash("success", "Welcome to TravelStay!");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/users/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to TravelStay!");
    res.redirect("/listings");
  },
);

module.exports = router;
