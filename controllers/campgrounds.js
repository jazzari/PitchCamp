const CampGround = require('../models/campground');
const { cloudinary } = require('../Cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAXBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds, title: 'All Campgrounds' });
};

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')};

module.exports.create = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new CampGround(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images =  req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
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
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }, { new: true });
    }
    req.flash('success', 'Successfully updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.delete = async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground Deleted!');
    res.redirect('/campgrounds');
};

