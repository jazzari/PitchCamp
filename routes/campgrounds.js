const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const CampGround = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds, title: 'All Campgrounds' });
}));
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`campgrounds/${campground._id}`);
}));
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await (await CampGround.findById(req.params.id).populate('reviews').populate('author'));
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground, title: campground.title });
}));
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground, title: campground.title });
}));
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated Campground!');
    res.render('campgrounds/show', { campground });
}));
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground Deleted!');
    res.redirect('/campgrounds');
}));

module.exports = router;