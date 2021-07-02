const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require('passport');
const users = require('../controllers/users');

router.get("/register", users.register);

router.post("/register", catchAsync(users.create)
);
router.get('/login', users.login);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginCreate);

router.get('/logout', users.logout);

module.exports = router;
