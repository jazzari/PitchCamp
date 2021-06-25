const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const { clearCache } = require('ejs');
const campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/pitch-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds, title: 'All Campgrounds' });
}));
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
}));
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground, title: campground.title });
}));
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground, title: campground.title });
}));
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.render('campgrounds/show', { campground });
}));
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`); 
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Sorry, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on Port 3000');
});