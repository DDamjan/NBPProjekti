var express = require('express');
var router = express.Router();
const queryString = require('../constants/queryConstants');
const query = require('../db/query');

router.get('/', async (req, res) => {
  let id = req.query.id;

  query.execGet(req, res, queryString.GET_RIDES + id);
});

router.post('/create', async (req, res) => {
  let ID = req.body.driverID;
  let destinationLat = req.body.destinationLat;
  let destinationLng = req.body.destinationLng;
  let destinationLocation = req.body.destinationLocation;
  let startLat = req.body.startLat;
  let startLng = req.body.startLng;
  let startLocation = req.body.startLocation;


  query.execPost(req, res, queryString.ADD_RIDE(startLat, startLng, startLocation, destinationLat, destinationLng, destinationLocation, ID));
});

router.post('/finish', async (req, res) => {
  let ID = req.body.ID;
  let driverID = req.body.driverID;
  let endTime = req.body.endTime;
  let destinationLat = req.body.destinationLat;
  let destinationLng = req.body.destinationLng;
  let destinationLocation = req.body.destinationLocation;

  if (!req.body.isCanceled) {
    query.execPost(req, res, queryString.FINISH_RIDE(ID, driverID, endTime, destinationLat, destinationLng, destinationLocation));
  } else {
    query.execPost(req, res, queryString.CANCEL_RIDE(ID, driverID, endTime));
  }
})

router.get('/currentid', async (req, res) => {
  query.execGet(req, res, queryString.CURRENT_ID('rides'));
});

router.post('/adddistancefare', async (req, res) => {
  let ID = req.body.ID;
  let distance = req.body.distance;
  let fare = req.body.fare;
  console.log(ID + ' ' + distance + ' ' + fare)
  query.execPost(req, res, queryString.ADD_DISTANCE_FARE(distance, fare, ID));
})


module.exports = router;
