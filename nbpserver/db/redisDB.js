const webSocket = require('../socket/web-socket.js');
var redis = require("redis");
var client = redis.createClient();
var pub = redis.createClient();
var geo = require('georedis').initialize(client);
var options = {
    withDistances: true,
    order: 'ASC',
    units: 'm',
    count: 1,
    accurate: true 
}

client.on("error", function (err) {
    console.log("Error " + err);
});

//-------------------------------------------------------------------------------------

var subClientRequestToDrivers = redis.createClient();
subClientRequestToDrivers.subscribe("ClientRequestToDrivers");
subClientRequestToDrivers.on("message", function (channel, clientID) {
    client.hget("requests", clientID, function (err, request) {
        client.hgetall("driver", function (err, driversActivty) {
            if(!driversActivty){
            }else{
                Object.keys(driversActivty).forEach(key => {
                    if('false' == driversActivty[key]) {
                        webSocket.io.emit('Driver:'+key, JSON.parse(request)); //Emituje se svim slobodnim drijverima nova voznja
                    }
                });
            }
        });
    });
});

var subAprovedRide = redis.createClient();
subAprovedRide.subscribe("AprovedRide");
subAprovedRide.on("message", function (channel, body) {
    body = JSON.parse(body);
    let clientID = body.clientID;
    let driverID = body.driverID;
    let operatorID = body.operatorID;
    client.hmset("driver", driverID, true);

    client.hget("requests", clientID, (err, res) => {
        res = JSON.parse(res);
        res.driverID = driverID;
        webSocket.io.emit('Client:'+clientID, res);
        webSocket.io.emit('Driver:'+driverID, res);
    });

    client.lrange("accepted:"+clientID, 0, -1, (err, driverList)=>{
        let driverIDlist = [];
        driverList.forEach((element, i) => {
            driverIDlist[i] = JSON.parse(element).driverID.toString();
        });
         geo.removeLocations(driverIDlist, function(err, reply){
            if(err) console.error(err)
            else console.log('removed locations', reply)
        })
    });
    client.del("accepted:" + clientID);
    client.del("denied:" + clientID);
    client.hdel("requests", clientID);
    console.log("Deleted request");

    newOperator(operatorID);
});

var subRideStatus = redis.createClient();
subRideStatus.subscribe("RideStatus");
subRideStatus.on("message", function (channel, body) {
    if(!body.driverID){console.log('UNDEFINEEEEEEEEEEEED');}
    client.hmset("driver", body.driverID, false); //driver je slobodan za sledecu voznju
    client.hmset("client", body.clientID, false); //klijent je zavrsio svoju voznju

    let ride;
    ride.ID = body.ID;
    ride.isCanceled = body.isCanceled;
    ride.driverID = body.driverID;
    ride.clientID = body.clientID;
    client.hgetall("operator", function (err, operatorsActivty) {
        Object.keys(operatorsActivty).forEach(key => {
            webSocket.io.emit('Operator:'+key, JSON.parse(ride)); //Emit svim operaterima
        });
    });
    webSocket.io.emit('Client:'+body.clientID, ride); //Emit clientu kome se upravo zavrsila voznja
});

var subUserAuth = redis.createClient();
subUserAuth.subscribe("UserAuth");
subUserAuth.on("message", function (channel, user) {
    user = JSON.parse(user);
    //console.log("USERRRR: "+ user);
    switch(user.type){
        case "operator": 
            //client.lpush("notActiveOperators", user.id);
            client.hmset("operator", user.id, false);
            console.log("Operator authenticated");
            newOperator(user.id);
        break;
        case "driver": 
            client.hmset("driver", user.id, false);
            console.log("Driver authenticated");
        break;
        case "client": 
            client.hmset("client", user.id, false);
            console.log("Client authenticated");
        break;
        default: break;
    }
});
 


//-------------------------------------------------------------------------------------

function RequestTest(req){
    let driver ={};
    driver.id = 5;
    driver.currentLat = 43.318058;
    driver.currentLng = 21.891996;
    driver.currentLocation = "neka";
    driver.isActive = "true";
    driver.firstName = 'Pera';
    driver.lastName = 'Peric';
    webSocket.io.emit('RequestTest',driver);
}

function makeRequest(req){
    //console.log(req.body);
    client.hmset("client", req.body.clientID, true);
    client.hmset("requests", req.body.clientID, JSON.stringify(req.body));
    // webSocket.io.emit('User:20', {
    //     ID: 21,
    //     currentLat: 40.20543,
    //     currentLng: 23.56378
    // });
    //client.geopos("requests:"+req.body.clientID, req.body.destinationLng, req.body.destinationLat, "dest", req.body.currentLat, req.body.currentLng, "src",  redis.print);
    //geo.addLocation("dest:"+ req.body.clientID, {latitude: req.body.destinationLat, longitude: req.body.destinationLng});
    geo.addLocation("src:"+ req.body.clientID, {latitude: req.body.currentLat, longitude: req.body.currentLng});

    pub.publish("ClientRequestToDrivers", req.body.clientID); //salje svim driverima request za voznju
    setTimeout(() => { sendOperatorRequest(req.body.clientID);},10000); //posle 10 sec salje operateru da prihvati jednog od vozaca
}

function requestAccepted(req){
    let driver = {};
    driver.driverID =  req.body.driverID;
    driver.destinationLat =  req.body.currentLat;
    driver.destinationLng =  req.body.currentLng;
    driver.destinationLocation =  req.body.currentLocation;
    client.lpush("accepted:"+req.body.clientID, JSON.stringify(driver));
    geo.addLocation(req.body.driverID, {latitude: req.body.currentLat, longitude: req.body.currentLng});
}

function requestDenied(req){
    client.lpush("denied:"+req.body.clientID, JSON.stringify(req.body.driverID));
}

function sendOperatorRequest(clientID){
    let shouldSendRequest = false;
    console.log("slanje operateru");
    client.llen("requestQ",(err,numRequests)=>{
        client.llen("notActiveOperators",(err,numOperators)=>{        
            if(numOperators == 0){
                //NEMA OPERATORA ZA OVAJ REQUEST
                client.lpush("requestQ", clientID);
            }else{
                if(numRequests == 0){
                    //radi se slanje requesta operateru
                    shouldSendRequest = true;
                }else{
                   //neka zesca greska pune se liste ali se ne prazne
                   console.log("greska u sendOperatorRequest");
                }
            }
        });
    });
    if(shouldSendRequest){
        console.log("slanje operateru2");
        NextRequestToNextOperator(clientID);
    }
}


function NextRequestToNextOperator(clientID){
    client.hget("requests", clientID, function (err, request) {
        client.lrange("accepted:"+clientID, 0, -1, (err, driverList)=>{

            request = JSON.parse(request);
            driverList.forEach((element, i) => {
                driverList[i] = JSON.parse(element);
            });
            request = {...request, "drivers" : driverList};
            //request.drivers = driverList;

            geo.location("src:"+ clientID, (err, location) => {
                if(err) console.error(err);
                else{ 
                    geo.removeLocation("src:"+ clientID);
                    //geo.removeLocation("dest:"+ clientID);
                    geo.nearby({latitude: location.latitude, longitude: location.longitude}, 10000, options, (err, locations) => {
                        request.closestDriver = locations[0];
                        client.rpop("notActiveOperators", (err, operator)=>{
                            client.hmset("operator", operator, true);
                            webSocket.io.emit('Operator:'+operator, request);
                        });
                        console.error("Operator resolve request");
                    });
                }
            });
        });
    });
}

function newOperator(operatorID){
    client.llen("requestQ",(err,numRequests)=>{
        client.llen("notActiveOperators",(err,numOperators)=>{        
            if(numRequests == 0){
                client.lpush("notActiveOperators", operatorID);
                client.hmset("operator", operatorID, false);
            }else{
                if(numOperators == 0){
                    //uzmi request
                    client.lpush("notActiveOperators", operatorID);
                    client.lpop("requestQ",(err, newClientID) => {
                        NextRequestToNextOperator(newClientID);
                    });
                }else{
                   //neka zesca greska pune se liste ali se ne prazne
                   console.log("greska u AprovedRide")
                }
            }
        });
    });
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
    pub: pub,
    RequestTest: RequestTest
}
