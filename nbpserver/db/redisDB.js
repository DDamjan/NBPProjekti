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
            if (!driversActivty) {
            } else {
                Object.keys(driversActivty).forEach(key => {
                    if ('false' == driversActivty[key]) {
                        webSocket.io.emit('Driver:' + key, JSON.parse(request)); //Emituje se svim slobodnim drijverima nova voznja
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

    client.hget("requests", clientID, (err, res) => {
        res = JSON.parse(res);
        if (!res.isCanceled) {
            res.driverID = driverID;
            webSocket.io.emit('Client:' + clientID, res);
            webSocket.io.emit('Driver:' + driverID, res);
            client.hmset("driver", driverID, true);
        }
    });

    client.lrange("accepted:" + clientID, 0, -1, (err, driverList) => {
        let driverIDlist = [];
        driverList.forEach((element, i) => {
            driverIDlist[i] = JSON.parse(element).driverID.toString();
        });
        geo.removeLocations(driverIDlist, function (err, reply) {
            if (err) console.error(err)
            else console.log('removed locations', reply)
        })
    });
    client.del("accepted:" + clientID);
    client.del("denied:" + clientID);
    client.hdel("requests", clientID);
    console.log("Deleted request");

    newOperator(operatorID);
});

var subFinishedRide = redis.createClient();
subFinishedRide.subscribe("FinishedRide");
subFinishedRide.on("message", function (channel, body) {
    const newBody = JSON.parse(body);

    client.hmset("client", newBody.clientID, false); //klijent je zavrsio svoju voznju
    client.hmset("driver", newBody.driverID, false); //vozac je slobodan za sledecu voznju

    client.hlen("operator", (err, numOperators) => {
        console.log("operator: " + numOperators);
        if (numOperators != 0) {
            client.hgetall("operator", function (err, operatorsActivty) {
                Object.keys(operatorsActivty).forEach(key => {
                    webSocket.io.emit('Operator:' + key, JSON.parse(newBody)); //Emit svim operaterima
                });
            });
        }
    });
    webSocket.io.emit('Client:' + newBody.clientID, newBody); //Emit clientu kome se upravo zavrsila voznja
});

var subCancelRide = redis.createClient();
subCancelRide.subscribe("CancelRide");
subCancelRide.on("message", function (channel, body) {
    const newBody = JSON.parse(body);
    client.hmset("client", newBody.clientID, false); //klijent je prekinuo svoju voznju

    client.hget("requests", newBody.clientID, (err, res) => {
        res = JSON.parse(res);
        res.client.isCanceled = newBody.isCanceled;
        res.client.isAssigned = newBody.isAssigned;
        client.hmset("requests", newBody.clientID, JSON.stringify(res));
    });
});

var subCancelAssignedRide = redis.createClient();
subCancelAssignedRide.subscribe("CancelAssignedRide");
subCancelAssignedRide.on("message", function (channel, body) {
    const newBody = JSON.parse(body);
    client.hmset("client", newBody.clientID, false); //klijent je prekinuo svoju voznju
    client.hmset("driver", newBody.driverID, false); //vozac je slobodan za sledecu voznju
    webSocket.io.emit('Driver:' + newBody.driverID, newBody); //Emit vozacu kome je upravo prekinuta voznja
});

var subUserAuth = redis.createClient();
subUserAuth.subscribe("UserAuth");
subUserAuth.on("message", function (channel, user) {
    user = JSON.parse(user);
    //console.log("USERRRR: "+ user);
    switch (user.type) {
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

function RequestTest(req) {
    let driver = {};
    driver.id = 5;
    driver.currentLat = 43.318058;
    driver.currentLng = 21.891996;
    driver.currentLocation = "neka";
    driver.isActive = "true";
    driver.firstName = 'Pera';
    driver.lastName = 'Peric';
    webSocket.io.emit('RequestTest', driver);
}

function makeRequest(req) {
    // console.log(req.body);
    client.hmset("client", req.body.client.clientID, true);
    req.body.client = { ...req.body.client, isAssigned: false, isCanceled: false };
    // console.log("PEKIII");
    // console.log(req.body);
    client.hmset("requests", req.body.client.clientID, JSON.stringify(req.body));
    // webSocket.io.emit('User:20', {
    //     ID: 21,
    //     currentLat: 40.20543,
    //     currentLng: 23.56378
    // });
    //client.geopos("requests:"+req.body.clientID, req.body.destinationLng, req.body.destinationLat, "dest", req.body.currentLat, req.body.currentLng, "src",  redis.print);
    //geo.addLocation("dest:"+ req.body.clientID, {latitude: req.body.destinationLat, longitude: req.body.destinationLng});
    geo.addLocation("src:" + req.body.client.clientID, { latitude: req.body.client.pickupLat, longitude: req.body.client.pickupLng });

    pub.publish("ClientRequestToDrivers", req.body.client.clientID); //salje svim driverima request za voznju
    setTimeout(() => { newRequest(req.body.client.clientID); }, 10000); //posle 10 sec salje operateru da prihvati jednog od vozaca
}

function requestAccepted(req) {
    console.log(req.body);
    let driver = {
        driverID: req.body.driverID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        currentLat: req.body.currentLat,
        currentLng: req.body.currentLng,
        currentLocation: req.body.currentLocation,
        distancePickup: req.body.distancePickup,
        distanceNum: req.body.distanceNum
    };
    client.lpush("accepted:" + req.body.clientID, JSON.stringify(driver));
    geo.addLocation(req.body.driverID, { latitude: req.body.currentLat, longitude: req.body.currentLng });
}

function requestDenied(req) {
    client.lpush("denied:" + req.body.clientID, JSON.stringify(req.body.driverID));
}

function newRequest(clientID) {
    client.llen("requestQ", (err, numRequests) => {
        client.llen("notActiveOperators", (err, numOperators) => {
            console.log("notActiveOperators: " + numOperators);
            if (numOperators == 0) {
                //NEMA OPERATORA ZA OVAJ REQUEST
                client.lpush("requestQ", clientID);
            } else {
                if (numRequests == 0) {
                    //radi se slanje requesta operateru
                    NextRequestToNextOperator(clientID);
                } else {
                    //neka zesca greska pune se liste ali se ne prazne
                    console.log("greska u sendOperatorRequest");
                }
            }
        });
    });
}


function newOperator(operatorID) {
    client.llen("requestQ", (err, numRequests) => {
        client.llen("notActiveOperators", (err, numOperators) => {
            if (numRequests == 0) {
                client.lpush("notActiveOperators", operatorID);
                client.hmset("operator", operatorID, false);
            } else {
                if (numOperators == 0) {
                    //uzmi request
                    client.lpush("notActiveOperators", operatorID);
                    client.lpop("requestQ", (err, newClientID) => {
                        NextRequestToNextOperator(newClientID);
                    });
                } else {
                    //neka zesca greska pune se liste ali se ne prazne
                    console.log("greska u AprovedRide")
                }
            }
        });
    });
}


function NextRequestToNextOperator(clientID) {
    client.hget("requests", clientID, function (err, request) {
        if (!request.isCanceled) {
            client.lrange("accepted:" + clientID, 0, -1, (err, driverList) => {
                console.log(driverList);
                if(driverList.length > 0){
                    console.log("driver list nije prazan");
                    request = JSON.parse(request);
                    driverList.forEach((element, i) => {
                        driverList[i] = JSON.parse(element);
                    });
                    request = { ...request, "drivers": driverList };

                    geo.location("src:" + clientID, (err, location) => {
                        if (err) console.error(err);
                        else {
                            geo.removeLocation("src:" + clientID);
                            //geo.removeLocation("dest:"+ clientID);
                            geo.nearby({ latitude: location.latitude, longitude: location.longitude }, 10000, options, (err, locations) => {
                                request.closestDriver = locations[0];
                                client.rpop("notActiveOperators", (err, operator) => {
                                    client.hmset("operator", operator, true);
                                    webSocket.io.emit('Operator:' + operator, request);
                                    console.log(request);
                                });
                                console.error("Operator resolve request");
                            });
                        }
                    });
                }else{
                    console.log("driver list je prazan");
                }
            });
        } else {
            client.del("accepted:" + clientID);
            client.del("denied:" + clientID);
            client.hdel("requests", clientID);
        }
    });
}

function driverArived(body) {
    webSocket.io.emit('Client:' + body.clientID, body);
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
    pub: pub,
    RequestTest: RequestTest,
    makeRequest: makeRequest,
    requestAccepted: requestAccepted,
    requestDenied: requestDenied,
    driverArived: driverArived,
    pub: pub,
    execPost: execPost
}
