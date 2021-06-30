module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be sign in first!');
        return res.redirect('/login');
    }
    next();
}