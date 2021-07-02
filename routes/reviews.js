const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.create));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.delete));

module.exports = router;
