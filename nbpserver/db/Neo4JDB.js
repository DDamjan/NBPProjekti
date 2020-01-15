var neo4j = require('neo4j-driver');
let conn = require('../constants/connectionConstants');
const driver = neo4j.driver(conn.NEO4J_URL, neo4j.auth.basic(conn.NEO4J_USER, conn.NEO4J_PASS));
const query = require('../constants/queryStrings');
const sha = require('sha.js');


async function execAllUsersByType(type,res) {
  var session=driver.session();
  session.run(query.GET_ALL_USERS_TYPE, {Type:type})
  .then(result => {
    let n=[];
      result.records.forEach(record => {
      let l=record.get('n');
      //console.log(l);
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      n.push(s);
      });
    // console.log(n);
    res.json(n);
    res.end();
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())
}

async function execAuth(username,password,res){
  var session=driver.session();
  session.run(query.USER_AUTH, {user: username , pass: password})
  .then(result => {
    if(result.records.length==0){
      const failed = {
        id: -1,
        firstName: 'error',
        lastName: 'error',
        username: 'error',
        type: 'error'
      };
      res.json(failed);
      res.end();
    }
    else
    {
    result.records.forEach(record => {
      let l=record.get('n');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
    
    })}
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
   console.log(error);
  })
  .then(() => session.close())

}

async function execReturnById(id,res){
  var session=driver.session();
  session.run(query.GET_USER_BY_ID, {ID: neo4j.int(id)})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('n');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
    })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())

}

async function execCreateDriver(req,res){
  var session=driver.session()
  session.run(query.CREATE_DRIVER,
  {Ime:req.body.firstName,
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
})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('a');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
    })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())

}

async function execCreateClient(req,res){
  var session=driver.session()
  session.run(query.CREATE_CLIENT,
  {Ime:req.body.firstName,
    Prez:req.body.lastName,
    User:req.body.username,
    Pass:sha('sha256').update(req.body.password).digest('hex'),
    cLat:req.body.currentLat,
    cLng:req.body.currentLng,
    cLoc:req.body.currentLoc,
    pLat:req.body.pickupLat,
    pLng:req.body.pickupLng,
    pLoc:req.body.pickupLoc
})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('a');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
    })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())

}

async function execCreateOperator(req,res){
  var session=driver.session()
  session.run(query.CREATE_DRIVER,
  {Ime:req.body.firstName,
    Prez:req.body.lastName,
    User:req.body.username,
    Pass:sha('sha256').update(req.body.password).digest('hex'),
})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('a');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
    })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())

}


async function execCheckUser(username,res){
  var session=driver.session();
  session.run('match (n:User {username:$user}) return n', {user: username})
  .then(result => {
    if(result.records.length==0){
      let l=false;
      res.json(l);
      res.end();
    }
    else{
      let l=true;
      res.json(l);
      res.end();
    }
    
    })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
   console.log(error);
  })
  .then(() => session.close())

}  
async function execCreateRide(req,res){
  var session=driver.session()
  console.log(req.body.destinationLocation);
  session.run(query.CREATE_RIDE,
  { CID:req.body.clientID,
    DID:req.body.driverID,
    sLat:req.body.startLat,
    SLng:req.body.startLng,
    DLat:req.body.destinationLat,
    DLng:req.body.destinationLng,
    SLoc:req.body.startLocation,
    DLoc:req.body.destinationLocation,
    STime:req.body.startTime,
    Fare:req.body.fare,
    Dist:req.body.distance,
})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('r');
      res.json(l);
      res.end();
    })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())

}

async function execFinishRide(req,res){
  var session=driver.session()
  session.run(query.FINISH_RIDE,
  { 
    CID:req.body.clientID,
    DID:req.body.driverID,
    DLat:req.body.destinationLat,
    DLng:req.body.destinationLng,
    DLoc:req.body.destinationLocation,
    ETime:req.body.endTime
})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('r');
      res.json(l);
      res.end();
    })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())

}

async function execCancelRide(req,res)
{

  var session=driver.session()
  session.run(query.CANCEL_RIDE,
  { 
    CID:req.body.clientID,
    DID:req.body.driverID,
    ETime:req.body.endTime
})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('r');
      res.json(l);
      res.end();
    })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
    console.log(error);
  })
  .then(() => session.close())

}



module.exports={
    execAuth: execAuth,
    execReturnById: execReturnById,
    execAllUsersByType: execAllUsersByType,
    execCheckUser: execCheckUser,
    execCreateDriver: execCreateDriver,
    execCreateClient: execCreateClient,
    execCreateOperator: execCreateOperator,
    execCreateRide: execCreateRide,
    execFinishRide: execFinishRide,
    execCancelRide: execCancelRide
}