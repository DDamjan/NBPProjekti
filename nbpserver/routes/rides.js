var express = require('express');
var router = express.Router();
const webSocket = require('../socket/web-socket.js');
const redisDB = require('../db/redisDB.js');
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
const Neo4jDB= require('../db/Neo4JDB.js');


router.get('/', async (req, res) => {
  let id = req.query.id;
  Neo4jDB.execDriverAllRides(id,res);
});

router.post('/request', async (req, res) => {
<<<<<<< HEAD
  //console.log(req.body);
  redisDB.execPost(req, res, redisDB.makeRequest);
=======
  // console.log(req.body);
  //redisDB.execPost(req, res, redisDB.makeRequest);
  redisDB.makeRequest(req);
>>>>>>> f5da312039735dd7f188a0d95d62980010a019ad
  Neo4jDB.execUpdateClientTrue(req,res);
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
  const payload=  { 
    CID:req.body.clientID,
    DID:req.body.driverID,
    SLat:req.body.pickupLat,
    SLng:req.body.pickupLng,
    DLat:req.body.destinationLat,
    DLng:req.body.destinationLng,
    SLoc:req.body.pickupLocation,
    DLoc:req.body.destinationLocation,
    STime:req.body.startTime,
    Fare:req.body.fare,
    Dist:req.body.distance
}
  //redisDB.pub.publish("AprovedRide", JSON.stringify(req.body));
  Neo4jDB.execCreateRide(req,res,payload);
});

router.post('/finish', async (req, res) => {
    const payload={ 
      RID:req.body.rideID,
      CID:req.body.clientID,
      DID:req.body.driverID,
      DLat:req.body.destinationLat,
      DLng:req.body.destinationLng,
      DLoc:req.body.destinationLocation,
      ETime:req.body.endTime,
      Canc:req.body.isCanceled
  }
  if (req.body.isCanceled==false) {
    Neo4jDB.execFinishRide(req,res,payload)
  } else {
    Neo4jDB.execCancelRide(req,res,payload)
  }
  redisDB.pub.publish("RideStatus", JSON.stringify(req));
})

router.get('/currentid', async (req, res) => {
  //query.execGet(req, res, queryString.CURRENT_ID('rides'));
});

router.post('/adddistancefare', async (req, res) => {
  let ID = req.body.ID;
  let distance = req.body.distance;
  let fare = req.body.fare;
  console.log(ID + ' ' + distance + ' ' + fare);
})

router.get('/rideDelete', async (req, res) => {
  let DriverId = req.query.id;
  Neo4jDB.execRideDelete(DriverId,res);
  //   /all?type=Client,Operator,Driver
});

module.exports = router;