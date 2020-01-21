var express = require('express');
var router = express.Router();
const webSocket = require('../socket/web-socket.js');
const redisDB = require('../db/redisDB.js');
const Neo4jDB= require('../db/Neo4JDB.js');

//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');



router.post('/update', async(req, res)=>{
  let ID = req.body.ID;
  let pickupLat = req.body.pickupLat;
  let pickupLng = req.body.pickupLng;
  let pickupLocation = req.body.pickupLocation;

  //query.execPost(req, res, queryString.UPDATE_DRIVER(pickupLat, pickupLng, pickupLocation, ID));
})

router.post('/dispatch', async(req, res)=>{
  const payload= { 
    OID:req.body.operatorID,
    DID:req.body.driverID,
  }
  Neo4jDB.execDispatch(req,res,payload);
  
})




module.exports = router;