module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be sign in first!');
        return res.redirect('/login');
    }
    next();
}