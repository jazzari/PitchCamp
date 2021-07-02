const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.create));

router.get('/new', isLoggedIn, campgrounds.newForm);

router.route('/:id')
    .get( catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit));

module.exports = router;