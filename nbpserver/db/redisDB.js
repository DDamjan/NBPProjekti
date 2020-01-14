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
    console.log(req.body);
    client.hmset("requests", req.body.userID, JSON.stringify(req.body), redis.print);
    client.hkeys("requests", function (err, replies) {
        console.log(replies.length + " keys in requests:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
    });
}

function requestAccepted(req){
    console.log(req.body);
    // client.hmset("requests", req.body.userID, JSON.stringify(req.body), redis.print);
    // client.hkeys("requests", function (err, replies) {
    //     console.log(replies.length + " keys in requests:");
    //     replies.forEach(function (reply, i) {
    //         console.log("    " + i + ": " + reply);
    //     });
    // });
}

function requestDenied(req){
    console.log(req.body);
    // client.hmset("requests", req.body.userID, JSON.stringify(req.body), redis.print);
    // client.hkeys("requests", function (err, replies) {
    //     console.log(replies.length + " keys in requests:");
    //     replies.forEach(function (reply, i) {
    //         console.log("    " + i + ": " + reply);
    //     });
    // });
}

function requestFinished(req){
    console.log(req.body);
    // client.hmset("requests", req.body.userID, JSON.stringify(req.body), redis.print);
    // client.hkeys("requests", function (err, replies) {
    //     console.log(replies.length + " keys in requests:");
    //     replies.forEach(function (reply, i) {
    //         console.log("    " + i + ": " + reply);
    //     });
    // });
}

async function execPost(req, res, fun) {
    try {
        //console.log(fun);
        fun(req);
        res.json("Request acknowledged");
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
    requestDenied: requestDenied
}
