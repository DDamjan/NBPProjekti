var express = require('express');
var router = express.Router();
const webSocket = require('../socket/web-socket.js');
const redisDB = require('../db/redisDB.js');
const Neo4jDB= require('../db/Neo4JDB.js');

//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
router.get('/', async (req, res) => {
  query.execGet(req, res, queryString.GET_DRIVERS);
  webSocket.io.emit('test', "ovde ide kurac");
  redisDB.client.set("string key", "string val", redisDB.redis.print);
  redisDB.client.hset("hash key", "hashtest 1", "some value", redisDB.redis.print);
  redisDB.client.hset(["hash key", "hashtest 2", "some other value"], redisDB.redis.print);
  redisDB.client.hkeys("hash key", function (err, replies) {
      console.log(replies.length + " replies:");
      replies.forEach(function (reply, i) {
          console.log("    " + i + ": " + reply);
      });
      client.quit();
    });

  
});

router.get('/byid', async (req, res) => {
      let id = req.query.id;
  //   query.execGet(req, res, queryString.GET_DRIVER + id);
    Neo4jDB.execGetDriverById(id,res);
});

router.post('/create', async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let phone = req.body.phone;
  let car = req.body.car;
  let color = req.body.color;
  let licencePlate = req.body.licencePlate;
  let currentLat = req.body.currentLat;
  let currentLng = req.body.currentLng;
  let currentLocation = req.body.currentLocation;
  Neo4jDB.execTestCreate();
  //query.execPost(req, res, queryString.ADD_DRIVER(firstName, lastName, phone, car, color, licencePlate, currentLat, currentLng, currentLocation));
});

router.post('/update', async(req, res)=>{
  let ID = req.body.ID;
  let pickupLat = req.body.pickupLat;
  let pickupLng = req.body.pickupLng;
  let pickupLocation = req.body.pickupLocation;

  //query.execPost(req, res, queryString.UPDATE_DRIVER(pickupLat, pickupLng, pickupLocation, ID));
})

router.get('/delete', async (req, res) => {
  let id = req.query.id;

  //query.execGet(req, res, queryString.DELETE_DRIVER(id));
});


router.get('/currentid', async (req, res) => {
  //query.execGet(req, res, queryString.CURRENT_ID('driver'));
});

router.get('/picture', async (req, res) => {
  let picId = req.query.picId;
  if (picId === null || picId === undefined) {
    picId = 'Cab.png';
  }
  console.log(queryString.REPO_PATH+picId);
  
  //query.execFile(res, queryString.REPO_PATH + picId);
});

module.exports = router;