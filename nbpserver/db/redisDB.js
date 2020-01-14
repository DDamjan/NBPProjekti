const webSocket = require('../socket/web-socket.js');
var redis = require("redis");
client = redis.createClient();

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

function makeRequest(req){
    //console.log(req.body);
    client.hmset("requests", req.body.userID, JSON.stringify(req.body), redis.print);
    //client.lrange("accepted:"+req.body.userID, 0, -1, redis.print);

    client.hget("requests", req.body.userID, function (err, res) {
        //console.log(JSON.parse(res));
        webSocket.io.emit('incomingRequest', JSON.parse(res));
      });
      //query.execPost(req, res, queryString.ADD_RIDE(startLat, startLng, startLocation, destinationLat, destinationLng, destinationLocation, ID));
      setTimeout(()=>{
        client.hget("requests", req.body.userID, function (err, request) {
            client.lrange("accepted:"+req.body.userID, 0, -1, (err, driverList)=>{
            request = JSON.parse(request);
            request.drivers = driverList;
            console.log(request);
            webSocket.io.emit('approveRequest', request);
            });
        });
      },10000);
}

function requestAccepted(req){
    client.lpush("accepted:"+req.body.userID, req.body.driverID, redis.print);
    //client.lrange("accepted:"+req.body.userID, 0, -1, redis.print);
}

function requestDenied(req){
    //console.log(req.body);
    client.lpush("denied:"+req.body.userID, JSON.stringify(req.body.driverID), redis.print);
    client.lrange("denied:"+req.body.userID, 0, -1, redis.print);
}

function requestFinished(req){
    client.hget("requests", req.body.userID, (err, res) => {
        res = JSON.parse(res);
        res.driverID = req.body.driverID;
        webSocket.io.emit('approvedRide', res);
        client.hmset("requests", req.body.userID, JSON.stringify(res), redis.print);
    });
    client.del("accepted:"+req.body.userID, redis.print)
    console.log("DELETED accepted");
    client.del("denied:"+req.body.userID, redis.print)
    console.log("DELETED denied");
    client.del("requests", req.body.userID, redis.print);
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
