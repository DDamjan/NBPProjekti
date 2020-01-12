var express = require('express');
var router = express.Router();
const webSocket = require('../socket/web-socket.js');
const redisDB = require('../db/redisDB.js');
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');

router.get('/', async (req, res) => {
  let id = req.query.id;

  //query.execGet(req, res, queryString.GET_RIDES + id);
});

router.post('/request', async (req, res) => {
  let userID = req.body.userID;
  let destinationLat = req.body.destinationLat;
  let destinationLng = req.body.destinationLng;
  let destinationLocation = req.body.destinationLocation;
  let startLat = req.body.startLat;
  let startLng = req.body.startLng;
  let startLocation = req.body.startLocation;
  //RedisdDB funkcija koja pamti koj user trazi voznju
  redisDB.execPost(req, res, "makeRequest");
  // console.log(req.body);
  // console.log("request works!!!!");

  //query.execPost(req, res, queryString.ADD_RIDE(startLat, startLng, startLocation, destinationLat, destinationLng, destinationLocation, ID));
});

router.post('/accept', async (req, res) => {
  let driverID = req.body.driverID;
  let userID = req.body.userID;
  //RedisdDB funkcija koja pamti da ovaj vozac prihvata voznju ovog usera
  console.log(req.body);
  console.log("accept works!!!!");
  //query.execPost(req, res, queryString.ADD_RIDE(startLat, startLng, startLocation, destinationLat, destinationLng, destinationLocation, ID));
  res.json("accepted");
  res.end();
});

router.post('/deny', async (req, res) => {
  let driverID = req.body.driverID;
  let userID = req.body.userID;
  //RedisdDB funkcija koja pamti da ovaj vozac ne prihvata voznju ovog usera

  //query.execPost(req, res, queryString.ADD_RIDE(startLat, startLng, startLocation, destinationLat, destinationLng, destinationLocation, ID));
});

router.post('/chooseDriver', async (req, res) => {
  let driverID = req.body.driverID;
  let userID = req.body.userID;
  //RedisdDB funkcija koja pamti da ovaj vozac vozi ovog usera

  //query.execPost(req, res, queryString.ADD_RIDE(startLat, startLng, startLocation, destinationLat, destinationLng, destinationLocation, ID));
});

router.post('/create', async (req, res) => {
  let ID = req.body.driverID;
  let userID = req.body.userID;
  let destinationLat = req.body.destinationLat;
  let destinationLng = req.body.destinationLng;
  let destinationLocation = req.body.destinationLocation;
  let startLat = req.body.startLat;
  let startLng = req.body.startLng;
  let startLocation = req.body.startLocation;

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
    //query.execPost(req, res, queryString.FINISH_RIDE(ID, driverID, endTime, destinationLat, destinationLng, destinationLocation));
  } else {
    //query.execPost(req, res, queryString.CANCEL_RIDE(ID, driverID, endTime));
  }
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
