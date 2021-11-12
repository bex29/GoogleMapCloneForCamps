const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const camps = await campground.find();
  res.render("campgrounds/index", { camps });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const foundCamp = await campground.findById(id);
  res.render("campgrounds/show", { foundCamp });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const foundCamp = await campground.findById(id);
  res.render("campgrounds/edit", { foundCamp });
});

app.put("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  data = req.body;
  console.log(data);
  await campground.findByIdAndUpdate(id, data);
  res.redirect(`/campgrounds/${id}`);
});

app.post("/campgrounds/new", async (req, res, next) => {
  try {
    data = req.body;
    const newCamp = new campground(data);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`);
  } catch (e) {
    next(e);
  }
});

app.delete("/campgrounds/:id/delete", async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.send("ERROR RECEIVED IN ERROR HANDLING FUNCTION LINE 73 IN APP JS");
});

app.listen("3000", () => {
  console.log("LISTEING ON PORT 3000");
});
