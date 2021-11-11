const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const arrayElem = Math.floor(Math.random() * places.length);
    const randomPrice = Math.floor(Math.random() * 50);
    const newCamp = new campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${descriptors[arrayElem]} ${places[arrayElem]}`,
      image: "https://source.unsplash.com/collection/484351",
      description: "No description Yet",
      price: randomPrice,
    });
    await newCamp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("database closed");
});
