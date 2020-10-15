const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
//const auth = require("./auth.js");

//const users = require("./users.js");
//const User = users.model;

const carSchema = new mongoose.Schema({
  /*user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },*/
  year: String,
  make: String,
  model: String,
  mileage: Number,
  averageMPY: Number,
  oil: Number,
  tire: Number,
  engine: Number,
  transmission: Number,
  coolant: Number,
  created: {
    type: Date,
    default: Date.now
  },
});

const Car = mongoose.model('Car', carSchema);

router.post("/add", /*auth.verifyToken, User.verify, */async (req, res) => {

  const car = new Car({
    //user: req.user,
    year: req.body.year,
    make: req.body.make,
    model: req.body.model,
    mileage: req.body.mileage,
    averageMPY: req.body.averageMPY,
    oil: req.body.oil,
    tire: req.body.tire,
    engine: req.body.engine,
    transmission: req.body.transmission,
    coolant: req.body.coolant
  });
  try {
    await car.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
/*
// get my photos
router.get("/display/:carid", auth.verifyToken, User.verify, async (req, res) => {
  // return photos
  try {
    let photos = await Photo.find({
      user: req.user
    }).sort({
      created: -1
    });
    return res.send(photos);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});*/

// get one photos
router.get("/car/:carid", async (req, res) => {
  try {
    let cars = [];
    let car = await car.findOne({
      _id: req.params.id
    }).populate('user');
    cars.push(car);
    return res.send(car);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
})
module.exports = {
  model: Car,
  routes: router,
}