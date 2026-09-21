const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middlewares/middleware.js");
const userController = require("../controllers/users.controller.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.registerUser));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    userController.loginUser,
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
