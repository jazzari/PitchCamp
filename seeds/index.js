
const mongoose = require('mongoose');
const CampGround = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await CampGround.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new CampGround({
            // YOUR USER ID
            author: '60f043ba03c89200155e543e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt dolore assumenda magni doloribus harum! Consequatur tempora modi, tenetur perspiciatis esse voluptas ad? Laboriosam neque, ratione cum aspernatur itaque architecto molestiae!',
            price, 
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dy4d5g7in/image/upload/v1625651197/PitchCamp/u2irwwyl9oc4elf87ei6.jpg',
                  filename: 'PitchCamp/u2irwwyl9oc4elf87ei6'
                },
                {  
                  url: 'https://res.cloudinary.com/dy4d5g7in/image/upload/v1626098773/PitchCamp/vrusfwx2xiunxpwlz8q2.jpg',
                  filename: 'PitchCamp/xngcvfe1spknlxvlkncp'
                }
              ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

