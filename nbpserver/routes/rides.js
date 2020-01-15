var express = require('express');
var router = express.Router();
const webSocket = require('../socket/web-socket.js');
const redisDB = require('../db/redisDB.js');
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
const Neo4jDB= require('../db/Neo4JDB.js');


router.get('/', async (req, res) => {
  let id = req.query.id;
  //query.execGet(req, res, queryString.GET_RIDES + id);
});

router.post('/request', async (req, res) => {
  redisDB.execPost(req, res, redisDB.makeRequest);
});

router.post('/accept', async (req, res) => {
  redisDB.execPost(req, res, redisDB.requestAccepted);
  //LOG how many requests accepted by a driver
});

router.post('/deny', async (req, res) => {
  redisDB.execPost(req, res, redisDB.requestDenied);
  //LOG how many requests denied by a driver
});

router.post('/create', async (req, res) => {

  Neo4jDB.execCreateRide(req,res);
 // redisDB.requestFinished(req);
  //query.execPost(req, res, queryString.ADD_RIDE(startLat, startLng, startLocation, destinationLat, destinationLng, destinationLocation, ID));
});

router.post('/finish', async (req, res) => {
  let ID = req.body.ID;
  let driverID = req.body.driverID;
  let endTime = req.body.endTime;
  let destinationLat = req.body.destinationLat;
  let destinationLng = req.body.destinationLng;
  let destinationLocation = req.body.destinationLocation;

  if (!req.body.isCanceled) {
    Neo4jDB.execFinishRide(req,res)
    //query.execPost(req, res, queryString.FINISH_RIDE(ID, driverID, endTime, destinationLat, destinationLng, destinationLocation));
  } else {
    Neo4jDB.execCancelRide(req,res)
    //query.execPost(req, res, queryString.CANCEL_RIDE(ID, driverID, endTime));
  }
  let ride;
  ride.ID = req.body.ID;
  ride.isCanceled = req.body.isCanceled;
  ride.driverID = req.body.driverID;
  webSocket.io.emit('rideStatus', ride);
})

router.get('/currentid', async (req, res) => {
  //query.execGet(req, res, queryString.CURRENT_ID('rides'));
});

router.post('/adddistancefare', async (req, res) => {
  let ID = req.body.ID;
  let distance = req.body.distance;
  let fare = req.body.fare;
  console.log(ID + ' ' + distance + ' ' + fare)
  //query.execPost(req, res, queryString.ADD_DISTANCE_FARE(distance, fare, ID));
})


module.exports = router;
