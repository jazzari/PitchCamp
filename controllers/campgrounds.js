const CampGround = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds, title: 'All Campgrounds' });
};

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')};

module.exports.create = async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`campgrounds/${campground._id}`);
};

module.exports.show = async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground, title: campground.title });
};

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground, title: campground.title });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated Campground!');
    res.render('campgrounds/show', { campground });
};

module.exports.delete = async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground Deleted!');
    res.redirect('/campgrounds');
};

