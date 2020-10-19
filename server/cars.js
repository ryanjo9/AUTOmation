const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const router = express.Router();
const auth = require('./auth.js');

const users = require('./users.js');
const User = users.model;

const { intervals } = require('./constants')

const carSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
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


//--------HELPER FUNCIONS--------//
/**
 * Returns the mileage the service is next due based on 
 * when it was last done and the interval
 * @param {number} currentMileage - the current mileage of the car
 * @param {number} interval - how often the service is done (miles)
 * @param {number} lastDone - the mileage the service was last done
 */
const getNextService = (currentMileage, interval, lastDone) => {
  // If user didn't provide the last service date return the 
  // next closest interval after current mileage. i.e. if current 
  // mileage is 8,000 and interval is 5,000 return 10,000
  if (!lastDone) {
    const milesTilNext = interval - (currentMileage % interval)
    return currentMileage + milesTilNext
  }

  // Next service is the interval since last done
  return lastDone + interval
}

/**
 * Based on when the car was registered and average miles driver per year,
 * returns the estimated current mileage on the car
 * @param {*} carMileage - the mileage of the car when it was registered
 * @param {number} milesPerYear - miles driven in the car each year
 * @param {*} registerDate - the date the car was registered with us
 */
const calculateCurrentMileage = (carMileage, milesPerYear, registerDate) => {
  const daysSince = moment().diff(registerDate, 'days')
  const yearsSince = daysSince / 365

  return Math.round(carMileage + (milesPerYear * yearsSince))
}


//------ROUTES-------//
router.post('/', auth.verifyToken, User.verify, async (req, res) => {
  try {
    const car = new Car({
      user: req.user,
      year: req.body.year,
      make: req.body.make,
      model: req.body.model,
      mileage: req.body.mileage,
      averageMPY: req.body.averageMPY || 12000,
      oil: req.body.oil,
      tire: req.body.tire,
      engine: req.body.engine,
      transmission: req.body.transmission,
      coolant: req.body.coolant
    });

    await car.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get cars
router.get('/', auth.verifyToken, User.verify, async (req, res) => {
  // return cars
  try {
    let cars = await Car.find({
      user: req.user
    }).sort({
      created: -1
    });

    return res.send(cars);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get one car
router.get('/:carId', auth.verifyToken, User.verify, async (req, res) => {
  try {
    let car = await Car.findOne({
      _id: req.params.carId
    });

    const nextOil = getNextService(car.mileage, intervals.OIL, car.oil);
    const nextTransmission = getNextService(car.mileage, intervals.TRANSMISSION,car.transmission);
    const nextTire = getNextService(car.mileage, intervals.TIRE_ROTATION, car.tire);
    const nextCoolant = getNextService(car.mileage, intervals.COOLANT, car.coolant);
    const nextAir = getNextService(car.mileage, intervals.AIR_FILTER, car.engine);

    car._doc.maintenanceItems = [
      {
        title: 'Oil Change',
        next: nextOil,
        percent: Math.round(car.mileage / nextOil),
        color: '#ec407a'
      },
      {
        title: 'Transmission Fluid',
        next: nextTransmission,
        percent: Math.round((car.mileage / nextTransmission) * 100),
        color: '#f4511e'
      },
      {
        title: 'Tire Rotation',
        next: nextTire, 
        percent: Math.round((car.mileage / nextTire) * 100),
        color: '#512da8'
      },
      {
        title: 'Air Filter',
        next: nextAir, 
        percent: Math.round((car.mileage / nextAir) * 100),
        color: '#f57c00'
      },
      {
        title: 'Coolant Flush',
        next: nextCoolant, 
        percent: Math.round((car.mileage / nextCoolant) * 100),
        color: '#0288d1'
      }
    ]

    car._doc.estimatedCurrentMileage = calculateCurrentMileage(car._doc.mileage, car._doc.averageMPY, car._doc.created)

    return res.send(car);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

function getMessage(percent){
  if (percent > 100){
    return "Overdue!";
  }
}
module.exports = {
  model: Car,
  routes: router,
}