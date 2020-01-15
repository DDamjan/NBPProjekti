const webSocket = require('../socket/web-socket.js');
var redis = require("redis");
client = redis.createClient();
var geo = require('georedis').initialize(client);

client.on("error", function (err) {
    console.log("Error " + err);
});

// let driverID = req.body.driverID;
// let userID = req.body.userID;
// let destinationLat = req.body.destinationLat;
// let destinationLng = req.body.destinationLng;
// let destinationLocation = req.body.destinationLocation;
// let startLat = req.body.startLat;
// let startLng = req.body.startLng;
// let startLocation = req.body.startLocation;

var options = {
    withCoordinates: false, // Will provide coordinates with locations, default false
    withHashes: false, // Will provide a 52bit Geohash Integer, default false
    withDistances: true, // Will provide distance from query, default false
    order: 'ASC', // or 'DESC' or true (same as 'ASC'), default false
    units: 'm', // or 'km', 'mi', 'ft', default 'm'
    count: 1, // Number of results to return, default undefined
    accurate: true // Useful if in emulated mode and accuracy is important, default false
  }

function makeRequest(req){
    //console.log(req.body);
    client.hmset("requests", req.body.userID, JSON.stringify(req.body));
    //client.lrange("accepted:"+req.body.userID, 0, -1, redis.print);

    //client.geopos("requests:"+req.body.userID, req.body.destinationLng, req.body.destinationLat, "dest", req.body.startLat, req.body.startLng, "src",  redis.print);
    geo.addLocation("dest:"+ req.body.userID, {latitude: req.body.destinationLat, longitude: req.body.destinationLng});
    geo.addLocation("src:"+ req.body.userID, {latitude: req.body.startLat, longitude: req.body.startLng});

    client.hget("requests", req.body.userID, function (err, res) {
        webSocket.io.emit('incomingRequest', JSON.parse(res));
    });

      setTimeout(()=>{
        client.hget("requests", req.body.userID, function (err, request) {
            client.lrange("accepted:"+req.body.userID, 0, -1, (err, driverList)=>{

                request = JSON.parse(request);
                driverList.forEach((element, i) => {
                    driverList[i] = JSON.parse(element);
                });
                request.drivers = driverList;

                geo.location("src:"+ req.body.userID, (err, location) => {
                    if(err) console.error(err);
                    else{
                        geo.removeLocation("src:"+ req.body.userID);
                        geo.removeLocation("dest:"+ req.body.userID);
                        geo.nearby({latitude: location.latitude, longitude: location.longitude}, 10000, options, (err, locations) => {
                            request.closestDriver = locations[0];
                            webSocket.io.emit('approveRequest', request);
                          })
                    }
                });
            });
        });
      },10000);
}

function requestAccepted(req){
    let driver = {};
    driver.driverID =  req.body.driverID;
    driver.destinationLat =  req.body.startLat;
    driver.destinationLng =  req.body.startLng;
    driver.destinationLocation =  req.body.startLocation;
    client.lpush("accepted:"+req.body.userID, JSON.stringify(driver));
    geo.addLocation(req.body.driverID, {latitude: req.body.startLat, longitude: req.body.startLng});
    //client.lpop("accepted:"+req.body.userID, redis.print);
}

function requestDenied(req){
    //console.log(req.body);
    client.lpush("denied:"+req.body.userID, JSON.stringify(req.body.driverID));
    //client.lrange("denied:"+req.body.userID, 0, -1, redis.print);
}

function requestFinished(req){
    client.hget("requests", req.body.userID, (err, res) => {
        res = JSON.parse(res);
        res.driverID = req.body.driverID;
        webSocket.io.emit('approvedRide', res);
        client.hmset("requests", req.body.userID, JSON.stringify(res));
    });
    client.del("accepted:"+req.body.userID)
    client.del("denied:"+req.body.userID)
    client.hdel("requests", req.body.userID);
    // geo.removeLocations(['New York', 'St. John\'s', 'San Francisco'], function(err, reply){
    //     if(err) console.error(err)
    //     else console.log('removed locations', reply)
    //   })
    console.log("DELETED request");
}

async function execPost(req, res, fun) {
    try {
        //console.log(fun);
        fun(req);
        res.json("Post successful");
        res.end();
    } catch (err) {
        res.status(500);
        res.send(err.message);
        res.end();
    }
}

module.exports = {
    redis: redis,
    client: client,
    execPost: execPost,
    makeRequest: makeRequest,
    requestAccepted: requestAccepted,
    requestDenied: requestDenied,
    requestFinished: requestFinished
}
