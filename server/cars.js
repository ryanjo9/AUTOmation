const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const router = express.Router();
const auth = require('./auth.js');

const users = require('./users.js');
const User = users.model;

const { intervals } = require('./constants');
const e = require('express');


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
  airFilter: Number,
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
 * Returns the mileage the service is next due based on
 * when it was last done and the interval
 * @param {number} percentage - the current percentage
 */
const getColor = (percentage) => {

  if (percentage <= 20){
    return '#36BC29'
  }
  else if (percentage <= 40){
    return '#84C329'
  }
  else if (percentage <= 60){
    return '#D8DC23'
  }
  else if (percentage <= 80){
    return '#DC9423'
  }
  else {
    return '#DC2923'
  }
}

const getMessage = (percentage, next, name) => {

  if (percentage == 100){
    return 'Your ' + name + ' is overdue!\n' + 'Your ' + name + ' was supposed to be checked at: ' + next + ' miles';
  } 
  else if (percentage > 80){
    return 'Your ' + name + ' needs to be checked soon.\n' + 'Your next ' + name + ' change is: ' + next + ' miles'; 
  }
  else {
    return 'Your next ' + name + ' change is: ' + next + ' miles';
  }

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
      airFilter: req.body.airFilter,
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
    const nextAir = getNextService(car.mileage, intervals.AIR_FILTER, car.airFilter);

    const oilColor = getColor(Math.min(Math.round((car.mileage / nextOil) * 100), 100));
    const transmissionColor = getColor(Math.min(Math.round((car.mileage / nextTransmission) * 100), 100));
    const tireColor = getColor(Math.min(Math.round((car.mileage / nextTire) * 100), 100));
    const coolantColor = getColor(Math.min(Math.round((car.mileage / nextAir) * 100), 100));
    const airColor = getColor(Math.min(Math.round((car.mileage / nextCoolant) * 100), 100));

    const oilMessage = getMessage(Math.min(Math.round((car.mileage / nextOil) * 100), 100), nextOil, 'oil change');
    const transmissionMessage = getMessage(Math.min(Math.round((car.mileage / nextTransmission) * 100), 100), nextTransmission, 'transmission fluid');
    const tireMessage = getMessage(Math.min(Math.round((car.mileage / nextTire) * 100), 100), nextTire, 'tire rotation');
    const coolantMessage = getMessage(Math.min(Math.round((car.mileage / nextCoolant) * 100), 100), nextCoolant, 'coolant fluid');
    const airMessage = getMessage(Math.min(Math.round((car.mileage / nextAir) * 100), 100), nextAir, 'air filter');

    car._doc.maintenanceItems = [
      {
        title: 'Oil Change',
        last: car.oil,
        next: nextOil,
        percent: Math.min(Math.round((car.mileage / nextOil) * 100), 100),
        color: oilColor,
        logo: 'Oil_Change',
        name: 'engine oil',
        message: oilMessage
      },
      {
        title: 'Transmission Fluid',
        last: car.transmission,
        next: nextTransmission,
        percent: Math.min(Math.round((car.mileage / nextTransmission) * 100), 100),
        color: transmissionColor,
        logo: 'Transmission_Fluid',
        name: 'transmission fluid',
        message: transmissionMessage 
      },
      {
        title: 'Tire Rotation',
        last: car.tire,
        next: nextTire,
        percent: Math.min(Math.round((car.mileage / nextTire) * 100), 100),
        color: tireColor,
        logo: 'Tire_Rotation',
        name: 'tire rotation',
        message: tireMessage
      },
      {
        title: 'Air Filter',
        last: car.airFilter,
        next: nextAir,
        percent: Math.min(Math.round((car.mileage / nextAir) * 100), 100),
        color: coolantColor,
        logo: 'Air_Filter',
        name: 'air filter',
        message: airMessage
      },
      {
        title: 'Coolant Flush',
        last: car.coolant,
        next: nextCoolant,
        percent: Math.min(Math.round((car.mileage / nextCoolant) * 100), 100),
        color: airColor,
        logo: 'Coolant_Flush',
        name: 'coolant',
        message: coolantMessage
      }
    ]
    car._doc.estimatedCurrentMileage = calculateCurrentMileage(car._doc.mileage, car._doc.averageMPY, car._doc.created)

    return res.send(car);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// remove a car
router.delete("/:carId", auth.verifyToken, User.verify, async (req, res) => {
  try {
		await Car.deleteOne({ _id: req.param("carId") });
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

module.exports = {
  model: Car,
  routes: router,
}