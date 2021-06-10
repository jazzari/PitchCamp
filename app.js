const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/pitch-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
});
const methodOverride = require('method-override');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
});
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.listen(3000, () => {
    console.log('Serving on Port 3000');
})