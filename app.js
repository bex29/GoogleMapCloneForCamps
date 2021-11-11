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

app.post("/campgrounds/new", async (req, res) => {
  data = req.body;
  const newCamp = new campground(data);
  console.log(data);
  console.log(data.campground);
  await newCamp.save();
  res.redirect(`/campgrounds/${newCamp.id}`);
});

app.delete("/campgrounds/:id/delete", async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.get("*", (req, res) => {
  res.send("INVALID ADDRESS");
});
app.listen("3000", () => {
  console.log("LISTEING ON PORT 3000");
});
