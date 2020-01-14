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
  session.run(query.GET_DRIVER_BY_ID, {ID: neo4j.int(id)})
  .then(result => {
      result.records.forEach(record => {
        let l=record.get('n');
        let s=l.properties;
        s.id=l.identity.low;
        delete s.password;
      });
  })
  .catch(error => {
    console.log(error);
  })
    session.close();
    //console.log(error)
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

module.exports={
    execGetDriverById: execGetDriverById,
    execTestCreate: execTestCreate,
    execAuth: execAuth,
    execReturnById: execReturnById,
    execAllDrivers: execAllDrivers,
    returnDriverById: returnDriverById
}