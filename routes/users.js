const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.register)
    .post(catchAsync(users.create));

router.route('/login')
    .get(users.login)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginCreate);

router.get('/logout', users.logout);

module.exports = router;
