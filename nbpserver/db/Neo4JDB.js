var neo4j = require('neo4j-driver');
let conn = require('../constants/connectionConstants');
const driver = neo4j.driver(conn.NEO4J_URL, neo4j.auth.basic(conn.NEO4J_USER, conn.NEO4J_PASS));
const query = require('../constants/queryStrings');
const sha = require('sha.js');
const redisDB = require('../db/redisDB.js');


async function execAllUsersByType(type,res) {
  var session=driver.session();
  session.run(query.GET_ALL_USERS_TYPE, {Type:type})
  .then(result => {
      let n=[];
      result.records.forEach(record => {
      let l=record.get('n');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      n.push(s);
      });
    res.json(n);
    res.end();
  })
  .catch(error => {
    errorHandler(error,res);
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
      redisDB.pub.publish("UserAuth", JSON.stringify(s));//authed user
      res.json(s);
      res.end();
    })}
  })
  .catch(error => {
    errorHandler(error,res);
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
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execCreateDriver(req,res,payload){
  var session=driver.session()
  session.run(query.CREATE_DRIVER, payload)
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
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execCreateClient(req,res,payload){
  var session=driver.session()
  session.run(query.CREATE_CLIENT, payload)
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
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execCheckUser(username,res){
  var session=driver.session();
  session.run(query.CHECK_USER, {user: username})
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
    errorHandler(error,res);
  })
  .then(() => session.close())
} 
 
async function execCreateRide(req,res,payload){
  var session=driver.session()
  console.log(req.body.destinationLocation);
  session.run(query.CREATE_RIDE,payload)
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('r');
      res.json(l);
      res.end();
    })
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execFinishRide(req,res,payload){
  var session=driver.session()
  session.run(query.FINISH_RIDE,payload)
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('r');
      let s=l.properties;
      s.id=l.identity.low;
      res.json(s);
      res.end();
    })
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execCancelRide(req,res,paylaod)
{
  var session=driver.session()
  session.run(query.CANCEL_RIDE,paylaod)
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('r');
      let s=l.properties;
      s.id=l.identity.low;
      res.json(s);
      res.end();
    })
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execDriverAllRides(driverID,res){
var session=driver.session();
  session.run(query.DRIVER_ALL_RIDES, {DID:neo4j.int(driverID)})
  .then(result => {
      let n=[];
      console.log(result.records);
      result.records.forEach(record => {
      let l=record.get('r');
      let s=l.properties;
      s.id=l.identity.low;
      n.push(s);
      });
    res.json(n);
    res.end();
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execClientAllDestLoc(clientID,res){

  var session=driver.session();
  session.run(query.CLIENT_ALL_DEST_LOC, {CID:neo4j.int(clientID)})
  .then(result => {
      let n=[];
      result.records.forEach(record => {
      let l=record.get('r.destinationLocation');
      n.push(l);
      });
    res.json(n);
    res.end();
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execDriversWithRides(res)
{
  var session=driver.session();
  session.run(query.ALL_DRIVERS_WITH_RIDES)
  .then(result => {
      let n=[];
      result.records.forEach(record => {
      let l=record.get('n');
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
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execDispatch(req,res,payload){
  var session=driver.session()
  //console.log(req.body.destinationLocation);
  session.run(query.DISPATCH,payload)
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('r');
      let s=l.properties;
      s.id=l.identity.low;
      res.json(s);
      res.end();
    })
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execClientTopLocations(id,res){
  var session=driver.session()
  session.run(query.TOP_LOCATIONS,{CID:neo4j.int(id)})
  .then(result => {
    console.log(result.records);
    let m=[];
    result.records.forEach(record => {
      let l= { count: record.get('count(r)').low ,location: record.get('r.destLoc')};
      m.push(l);
    })
    res.json(m);
    res.end();
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function errorHandler(err,res)
{
    res.status(500);
    res.send(err.message);
    res.end();
    console.log(err);
}

module.exports={
    execAuth: execAuth,
    execReturnById: execReturnById,
    execAllUsersByType: execAllUsersByType,
    execCheckUser: execCheckUser,
    execCreateDriver: execCreateDriver,
    execCreateClient: execCreateClient,
    execCreateRide: execCreateRide,
    execFinishRide: execFinishRide,
    execCancelRide: execCancelRide,
    execDriverAllRides: execDriverAllRides,
    execClientAllDestLoc: execClientAllDestLoc,
    execDriversWithRides: execDriversWithRides,
    execDispatch: execDispatch,
    errorHandler: errorHandler,
    execClientTopLocations: execClientTopLocations 
}