var express = require('express');
var router = express.Router();
const webSocket = require('../socket/web-socket.js');
const redisDB = require('../db/redisDB.js');
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
const Neo4jDB= require('../db/Neo4JDB.js');


router.get('/', async (req, res) => {
  let id = req.query.id;
<<<<<<< HEAD
  Neo4jDB.execDriverAllRides(id,res);
=======
>>>>>>> 2e35421beefb4c08ea7b06403cfe6710409178cf
});

router.post('/request', async (req, res) => {
  redisDB.execPost(req, res, redisDB.makeRequest);
});

router.post('/requesttest', async (req, res) => {
  redisDB.execPost(req, res, redisDB.RequestTest);
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
  redisDB.pub.publish("AprovedRide", JSON.stringify(req.body));
  Neo4jDB.execCreateRide(req,res);
});

router.post('/finish', async (req, res) => {
  let ID = req.body.ID;
  let driverID = req.body.driverID;
  let endTime = req.body.endTime;
  let destinationLat = req.body.destinationLat;
  let destinationLng = req.body.destinationLng;
  let destinationLocation = req.body.destinationLocation;

  if (req.body.isCanceled==false) {
    Neo4jDB.execFinishRide(req,res)
  } else {
    Neo4jDB.execCancelRide(req,res)
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
  console.log(ID + ' ' + distance + ' ' + fare)
})


module.exports = router;
