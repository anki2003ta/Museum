const User = require("../models/user");
const { validationResult } = require('express-validator');

const renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

const signup = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        req.flash("error", error.msg);
      });
      return res.redirect("/signup");
    }

    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registered Successfully!!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

const renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

const login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust! You are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

// Render the password recovery form
const renderForgotPasswordForm = (req, res) => {
  res.render('users/forgot.ejs');
};

// Handle the password recovery form submission
const forgotPassword = (req, res) => {
  req.flash('info', 'If an account with that email exists, you will receive an email with instructions to reset your password.');
  res.redirect('/forgot');
};

module.exports = {
  renderSignupForm,
  signup,
  renderLoginForm,
  login,
  logout,
  renderForgotPasswordForm,
  forgotPassword
};