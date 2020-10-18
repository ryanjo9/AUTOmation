const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('./auth.js');

const users = require('./users.js');
const User = users.model;

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

router.post('/', auth.verifyToken, User.verify, async (req, res) => {
  try {
    const car = new Car({
      user: req.user,
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

    let nextOil = getNextOil(car.mileage, car.oil||0);
    let nextTransmission = getNextTransmission(car.mileage, car.transmission||0);
    let nextTire = getNextTire(car.mileage, car.tire||0);
    let nextCoolant = getNextCoolant(car.mileage, car.coolant||0);
    let nextAir = getNextFilter(car.mileage, car.engine||0);

    car.maintenanceItems = [
      {
        title: 'Oil Change',
        nextOil,
        percent: Math.round(car.mileage / nextOil),
        color: '#ec407a'
      },
      {
        title: 'Transmission Fluid',
        nextTransmission,
        percent: Math.round((car.mileage / nextTransmission) * 100),
        color: '#f4511e'
      },
      {
        title: 'Tire Rotation',
        nextTire, 
        percent: Math.round((car.mileage / nextTire) * 100),
        color: '#512da8'
      },
      {
        title: 'Air Filter',
        nextAir, 
        percent: Math.round((car.mileage / nextAir) * 100),
        color: '#f57c00'
      },
      {
        title: 'Coolant Flush',
        nextCoolant, 
        percent: Math.round((car.mileage / nextCoolant) * 100),
        color: '#0288d1'
      }
    ]

    console.log(car);
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

function getNextOil(mileage, oil){

  while (oil < mileage)
  {
    oil += 3000;
  }
  oil += 3000;
  
  return oil;
}

function getNextTransmission(mileage, transmission){
  while (transmission < mileage)
  {
    transmission += 30000;
  }
  transmission += 30000;
  return transmission;
}

function getNextTire(mileage, tire){
  while (tire < mileage)
  {
    tire += 3000;
  }
  tire += 3000;

  return tire;
}

function getNextFilter(mileage, engine){
  while (engine < mileage)
  {
    engine += 15000;
  }
  engine += 15000;

  return engine;
}

function getNextCoolant(mileage, coolant){
  while (coolant < mileage)
  {
    coolant += 30000;
  }
  coolant += 30000;
  return coolant;
}

skills:[
  { lang:"Oil Change",  percent:90,    	color:"#ec407a"	},
  { lang:"Transmission Fluid", 			percent:76,   color:"#f4511e"	},
  { lang:"Tire Rotation", 	percent:84,   color:"#512da8"	},
  { lang:"Air Filter",	percent:94,   color:"#f57c00"	},
  { lang:"Coolant Flush",		 	percent:93,   color:"#0288d1"	}
  ]

module.exports = {
  model: Car,
  routes: router,
}