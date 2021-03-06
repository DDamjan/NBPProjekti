var express = require('express');
var router = express.Router();
const redisDB = require('../db/redisDB.js');
const Neo4jDB = require('../db/Neo4JDB.js');


router.get('/', async (req, res) => {
  let id = req.query.id;
  Neo4jDB.execDriverAllRides(id, res);
});

router.post('/request', async (req, res) => {
  const payload = {
    CID: req.body.client.clientID,
    Lat: req.body.client.pickupLat,
    Lng: req.body.client.pickupLng,
    Loc: req.body.client.pickupLocation,
    DLat: req.body.client.destinationLat,
    DLng: req.body.client.destinationLng,
    DLoc: req.body.client.destinationLocation
  }
  Neo4jDB.execUpdateClientTrue(payload, res);
  redisDB.makeRequest(req);
});

router.post('/requesttest', async (req, res) => {
  redisDB.execPost(req, res, redisDB.RequestTest);
});

router.post('/accept', async (req, res) => {
  redisDB.execPost(req, res, redisDB.requestAccepted);
});

router.post('/deny', async (req, res) => {
  redisDB.execPost(req, res, redisDB.requestDenied);
});

router.post('/create', async (req, res) => {
  const payload = {
    CID: req.body.clientID,
    DID: req.body.driverID,
    SLat: req.body.pickupLat,
    SLng: req.body.pickupLng,
    DLat: req.body.destinationLat,
    DLng: req.body.destinationLng,
    SLoc: req.body.pickupLocation,
    DLoc: req.body.destinationLocation,
    STime: req.body.startTime,
    Fare: req.body.fare,
    Dist: req.body.distance
  }
  redisDB.pub.publish("AprovedRide", JSON.stringify(req.body));
  Neo4jDB.execCreateRide(req, res, payload);
});

router.post('/arrive', async (req, res) => {
  const payload={
    DID:req.body.driverID,
    Lat:req.body.pickupLat,
    Lng:req.body.pickupLng,
    Loc:req.body.pickupLocation,
  }
  Neo4jDB.execDriverUpdateArrival(payload, res);
  redisDB.driverArived(req.body);
});

router.post('/finish', async (req, res) => {
  const isAssigned = req.body.isAssigned;
  if (isAssigned) {
    const payload = {
      RID: req.body.rideID,
      CID: req.body.clientID,
      DID: req.body.driverID,
      DLat: req.body.destinationLat,
      DLng: req.body.destinationLng,
      DLoc: req.body.destinationLocation,
      ETime: req.body.endTime,
      Canc: req.body.isCanceled
    }
    if (req.body.isCanceled == false) {
      Neo4jDB.execFinishRide(req, res, payload);
      redisDB.pub.publish("FinishedRide", JSON.stringify(req.body));
    } else {
      Neo4jDB.execCancelRide(req, res, payload);
      redisDB.pub.publish("CancelAssignedRide", JSON.stringify(req.body));
    }
  } else {
    Neo4jDB.execCancelRideNC(req.body.clientID, res);
    redisDB.pub.publish("CancelRide", JSON.stringify(req.body));
  }
});

router.get('/currentid', async (req, res) => {
  query.execGet(req, res, queryString.CURRENT_ID('rides'));
});

// router.post('/adddistancefare', async (req, res) => {
//   let ID = req.body.ID;
//   let distance = req.body.distance;
//   let fare = req.body.fare;
//   console.log(ID + ' ' + distance + ' ' + fare);
// })

router.get('/rideDelete', async (req, res) => {
  let DriverId = req.query.id;
  Neo4jDB.execRideDelete(DriverId, res);
  //   /all?type=Client,Operator,Driver
});

module.exports = router;