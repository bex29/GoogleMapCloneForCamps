const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const { campgroundSchema } = require("./Schemas");

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

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const camps = await campground.find();
    res.render("campgrounds/index", { camps });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await campground.findById(id);
    res.render("campgrounds/show", { foundCamp });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await campground.findcatchAsyncById(id);
    res.render("campgrounds/edit", { foundCamp });
  })
);

app.put(
  "/campgrounds/:id/edit",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    data = req.body;
    console.log(data);
    await campground.findByIdAndUpdate(id, data);
    res.redirect(`/campgrounds/${id}`);
  })
);

app.post(
  "/campgrounds/new",
  validateCampground,
  catchAsync(async (req, res, next) => {
    data = req.body;
    const newCamp = new campground(data);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`);
  })
);

app.delete(
  "/campgrounds/:id/delete",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { statusCode, message, err });
});

app.listen("3000", () => {
  console.log("LISTEING ON PORT 3000");
});
