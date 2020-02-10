var neo4j = require('neo4j-driver');
let conn = require('../constants/connectionConstants');
const driver = neo4j.driver(conn.NEO4J_URL, neo4j.auth.basic(conn.NEO4J_USER, conn.NEO4J_PASS),  {
  maxTransactionRetryTime: 30000
});
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
  const transaction=session.beginTransaction();
  try {
    let l={};
    const result1=await transaction.run(query.USER_AUTH_WAR,{user: username , pass: password});
     if(result1.records.length!=0){
    result1.records.forEach(record => {
      let n=record.get('n');
      let r=record.get('r');
      let n1=n.properties;
      n1.id=n.identity.low;
      delete n1.password;
      l.user = n1;
      let r1=r.properties;
      r1.id=r.identity.low;
      l.ride = r1;
      res.json(l);
      res.end();
     console.log('First option query completed');
    })
     }
     else{
      const result2=await transaction.run(query.USER_AUTH,{user: username , pass: password});
      if(result2.records.length==0)
      {
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
      else{
      result2.records.forEach(record => {
        let n=record.get('n');
        let n1=n.properties;
        n1.id=n.identity.low;
        delete n1.password;
        l.user=n1;
        l.ride={};
        res.json(l);
        res.end();
        console.log('Second option query completed');
      })
    }
  }
  }
  catch(error){
    console.log(error);
    await transaction.rollback();
    console.log('rolled back');
  }
  finally { 
    await session.close();
  }
}

async function execReturnById(req,res){
  var session=driver.session();
  const transaction=session.beginTransaction();
  try {
    let l={};
    const result1=await transaction.run(query.GET_USER_BY_ID_WAR,{ID: neo4j.int(req.id)});
     if(result1.records.length!=0){
    result1.records.forEach(record => {
      let n=record.get('n');
      let r=record.get('r');
      let n1=n.properties;
      n1.id=n.identity.low;
      delete n1.password;
      l.user = n1;
      let r1=r.properties;
      r1.id=r.identity.low;
      l.ride = r1;
     console.log('First option query completed');
    })
     }
     else{
      const result2=await transaction.run(query.GET_USER_BY_ID,{ID: neo4j.int(req.id)});
      result2.records.forEach(record => {
        let n=record.get('n');
        let n1=n.properties;
        n1.id=n.identity.low;
        delete n1.password;
        l.user=n1;
        l.ride={};
        console.log('Second option query completed');
      })
     }
     if(req.auth){
      redisDB.pub.publish("UserAuth", JSON.stringify(l));//authed user
    }
    res.json(l);
    res.end();
  }
  catch(error){
    console.log(error);
    await transaction.rollback();
    console.log('rolled back');
  }
  finally { 
    await session.close();
  }
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

async function execCheckUser(payload,res){
  var session=driver.session();
  session.run(query.CHECK_USER, {user: payload.username, type: payload.type})
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
  var session=driver.session();
  const transaction=session.beginTransaction();
  //console.log(req.body.destinationLocation);
  try {
    let l;
    const result=await transaction.run(query.CREATE_RIDE,payload);
     result.records.forEach(record => {
      l=record.get('r');
    })
    console.log('First query completed')
    const result1=await transaction.run(query.RIDE_DISPACHED,{OID:neo4j.int(req.body.operatorID),RID:neo4j.int(l.identity.low)});
     result1.records.forEach(record => {
     console.log(record);
    })
    console.log('Second query completed')
    const result2=await transaction.run(query.RIDE_DRIVEN,{DID:neo4j.int(req.body.driverID),RID:neo4j.int(l.identity.low)});
     result2.records.forEach(record => {
     console.log(record);
    })
    console.log('Third query completed')
    const result3=await transaction.run(query.RIDE_REQUESTED,{CID:neo4j.int(req.body.clientID),RID:neo4j.int(l.identity.low)});
     result3.records.forEach(record => {
     console.log(record);
    })
    console.log('Fourth query completed')
    const result4=await transaction.run(query.UPDATE_DRIVER_TRUE,{DID:neo4j.int(req.body.driverID),SLat:req.body.pickupLat,SLng:req.body.pickupLng,SLoc:req.body.pickupLocation});
     result4.records.forEach(record => {
     console.log(record);
    })
    console.log('Fifth query completed')
    await transaction.commit();
    console.log('committed');
    let s=l.properties;
    s.id=l.identity.low;
    res.json(s);
    res.end();
  }
  catch(error) {
    console.log(error);
    await transaction.rollback();
    console.log('rolled back');
  }
  finally { 
    await session.close();
  }
}

async function execFinishRide(req,res,payload)
{
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

async function execCancelRide(req,res,payload)
{
  var session=driver.session()
  session.run(query.CANCEL_RIDE,payload)
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
        let r=record.get('r').properties;
        let l={
          pickupLat:r.pickupLat,
          pickupLng:r.pickupLng,
          pickupLocation:r.pickupLocation,
          destinationLat:r.destinationLat,
          destinationLng:r.destinationLng,
          destinationLocation:r.destinationLocation,
          fare:r.fare,
          distance:r.distance
        }
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


async function execClientTopLocations(id,res){
  var session=driver.session()
  session.run(query.TOP_LOCATIONS,{CID:neo4j.int(id)})
  .then(result => {
    console.log(result.records);
    let m=[];
    result.records.forEach(record => {
      let r=record.get('r').properties;
      let l={
        pickupLat:r.pickupLat,
        pickupLng:r.pickupLng,
        pickupLocation:r.pickupLocation,
        destinationLat:r.destinationLat,
        destinationLng:r.destinationLng,
        destinationLocation:r.destinationLocation,
        fare:r.fare,
        distance:r.distance,
        count:record.get('count(r)').low
      }
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

async function execRideDelete(id,res){
  var session=driver.session()
  session.run(query.DELETE_RIDE,{RID:neo4j.int(id)})
  .then(result => {
    if(result.records.length==0){
      let rideID= Number(id);
      res.json(rideID);
      res.end();
    }
  })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execUpdateClientTrue(payload,res){
  var session=driver.session()
  session.run(query.UPDATE_CLIENT_TRUE,payload)
  .then(result => {
    // console.log("RESULT");
    // console.log(result);
    // console.log("RESULTRECORDS");
    // console.log(result.records);
    result.records.forEach(record => {
      let l=record.get('c');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
      });
    })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execCancelRideNC(clientID,res)
{
  var session=driver.session();
  session.run(query.CANCEL_RIDE_NOT_CREATED,{CID:neo4j.int(clientID)})
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('c');
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

async function execDriverUpdateArrival(payload,res){
  var session=driver.session()
  session.run(query.DRIVER_UPDATE_ARRIVAL,payload)
  .then(result => {
    result.records.forEach(record => {
      let l=record.get('d');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
      });
    })
  .catch(error => {
    errorHandler(error,res);
  })
  .then(() => session.close())
}

async function execDriverByRide(clientID,rideID,res){
  var session=driver.session()
  session.run(query.DRIVER_BT_RIDE,{CID:neo4j.int(clientID),RID:neo4j.int(rideID)})
  .then(result => {
    console.log(result);
    result.records.forEach(record => {
      let l=record.get('d');
      let s=l.properties;
      s.id=l.identity.low;
      delete s.password;
      res.json(s);
      res.end();
      });
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
    errorHandler: errorHandler,
    execClientTopLocations: execClientTopLocations ,
    execRideDelete: execRideDelete,
    execUpdateClientTrue: execUpdateClientTrue,
    execCancelRideNC: execCancelRideNC,
    execDriverUpdateArrival: execDriverUpdateArrival,
    execDriverByRide: execDriverByRide
}