const User = require("../models/user");

module.exports.register = (req, res) => {
    res.render("users/register");
  };

module.exports.create = async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash("success", "Welcome to PitchCamp!");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  };

module.exports.login = (req, res) => {
    res.render('users/login');
};

module.exports.loginCreate = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  };
