const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('MONGO CONNECTION OPEN!!!!');
})
.catch(err => {
    console.log('OH NOO!, MONGO CONNECTION ERROR!!!');
    console.log(err);
})
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log('Serving on Port 3000');
})