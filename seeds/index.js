
const mongoose = require('mongoose');
const CampGround = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/pitch-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await CampGround.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new CampGround({
            author: '60dd65bd312b64d34ec9162f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt dolore assumenda magni doloribus harum! Consequatur tempora modi, tenetur perspiciatis esse voluptas ad? Laboriosam neque, ratione cum aspernatur itaque architecto molestiae!',
            price 
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

