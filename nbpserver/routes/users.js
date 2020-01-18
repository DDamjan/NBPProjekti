var express = require('express');
var router = express.Router();
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
const sha = require('sha.js');
const webSocket = require('../socket/web-socket.js');
const redisDB = require('../db/redisDB.js');
const Neo4jDB= require('../db/Neo4JDB.js');



router.post('/auth', async (req, res) => {
  let username = req.body.username;
  let password = sha('sha256').update(req.body.password).digest('hex');
  //console.log("username:"+username+", password: "+password);
  Neo4jDB.execAuth(username,password,res);
});

router.get('/', async (req, res) => {
  let id = req.query.id;
  console.log(id);
  Neo4jDB.execReturnById(id,res);
});

router.get('/all', async (req, res) => {
  let type = req.query.type;
  Neo4jDB.execAllUsersByType(type,res);
  //   /all?type=Client,Operator,Driver
});

router.get('/checkuser', async (req, res) => {
  let username = req.query.username;
  Neo4jDB.execCheckUser(username,res);
})

router.post('/create/driver', async (req, res) => {
  const payload= {
      Ime:req.body.firstName,
      Prez:req.body.lastName,
      User:req.body.username,
      Pass:sha('sha256').update(req.body.password).digest('hex'),
      Tel:req.body.phone,
      Car:req.body.car,
      Color:req.body.carColor,
      Plate:req.body.licencePlate,
      cLat:req.body.currentLat,
      cLng:req.body.currentLng,
      cLoc:req.body.currentLoc,
      pLat:req.body.pickupLat,
      pLng:req.body.pickupLng,
      pLoc:req.body.pickupLoc
  }
  Neo4jDB.execCreateDriver(req,res, payload);
});


router.post('/create/client', async (req, res) => {
  const payload=  
  {
    Ime:req.body.firstName,
    Prez:req.body.lastName,
    User:req.body.username,
    Pass:sha('sha256').update(req.body.password).digest('hex'),
    cLat:req.body.currentLat,
    cLng:req.body.currentLng,
    cLoc:req.body.currentLoc,
    pLat:req.body.pickupLat,
    pLng:req.body.pickupLng,
    pLoc:req.body.pickupLoc
 }
  Neo4jDB.execCreateClient(req,res,payload);
});

router.get('/allLoc', async (req, res) => {
  let id = req.query.id;
  Neo4jDB.execClientAllDestLoc(id,res);
  //   /all?type=Client,Operator,Driver
});

router.get('/driversWrides', async (req, res) => {
  Neo4jDB.execDriversWithRides(res);
  //   /all?type=Client,Operator,Driver
});


module.exports = router;
