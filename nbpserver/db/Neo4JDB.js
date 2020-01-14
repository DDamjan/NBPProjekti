var neo4j = require('neo4j-driver');
let conn = require('../constants/connectionConstants');
const driver = neo4j.driver(conn.NEO4J_URL, neo4j.auth.basic(conn.NEO4J_USER, conn.NEO4J_PASS));
const query = require('../constants/queryStrings');

async function execAllDrivers(req,res) {
  var session=driver.session();
  session.run(query.GET_ALL_DRIVERS)
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

async function returnDriverById(id)
{
  var session=driver.session();
   let prom;
   session
  .run('match (n:User {type:"Driver"}) where id(n)=$ID return n', {ID: neo4j.int(id)})
  .then(result => {
      result.records.forEach(record => {
        let l=record.get('n');
        let s=l.properties;
        s.id=l.identity.low;
        delete s.password;
        prom =s;
        //console.log(prom);
        })
  })
  .catch(error => {
    console.log(error)
  })
  .then(() => {
    session.close();
    //console.log(prom);
    return prom;
  })

}

async function execGetDriverById(id,res) {
  var session=driver.session()
  session.run(query.GET_DRIVER_BY_ID, {ID: neo4j.int(id)})
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

async function execTestCreate(){
  var session=driver.session();
  session.run('CREATE(n:Person {name:$Ime})', {Ime:'Feget'})
  .then(result => {
    result.records.forEach(record => {
      console.log(record.get('n'));
    })
  })
  .catch(error => {
    console.log(error);
  })
  .then(() => session.close())
}

async function execAuth(username,password,res){
  var session=driver.session();
  session.run(query.USER_AUTH, {user: username , pass: password})
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
  // var session=driver.session()
  // session.run('CREATE(a:User {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"Driver",isActive:"true",phone:$Tel,car:$Car,carColor:$Color,licencePlate:$Plate,currentLat:$cLat,currentLng:$cLng,currentLocation:$cLoc,pickupLat:$pLat,pickupLng:$pLng,pickupLocation:$pLoc})',
  //  {Ime:req.body.firstName,
  //   Prez:req.body.lastName,
  //   User:req.body.username,
  //   Pass:sha('sha256').update(req.body.password).digest('hex'),
  //   Tel:req.body.phone,
  //   Car:
  //   Color
  //   Plate
  //   cLat

  
  
  
  
  
  
  
  // })
  // .then(result => {
  //   result.records.forEach(record => {
  //     let l=record.get('n');
  //     let s=l.properties;
  //     s.id=l.identity.low;
  //     delete s.password;
  //     res.json(s);
  //     res.end();
  //   })
  // })
  // .catch(error => {
  //   res.status(500);
  //   res.send(error.message);
  //   res.end();
  //   console.log(error);
  // })
  // .then(() => session.close())

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

module.exports={
    execGetDriverById: execGetDriverById,
    execTestCreate: execTestCreate,
    execAuth: execAuth,
    execReturnById: execReturnById,
    execAllDrivers: execAllDrivers,
    returnDriverById: returnDriverById,
    execCreateDriver: execCreateDriver,
    execCheckUser: execCheckUser
}