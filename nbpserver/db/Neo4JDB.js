var neo4j = require('neo4j-driver')
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'))


async function execGetDriverById(id,res) {
  var session=driver.session()
  session
  .run('match (n:User {type:"Driver"}) where id(n)=$ID return n', {ID: neo4j.int(id)})
  .then(result => {
      result.records.forEach(record => {
        let l=record.get('n');
        let s=l.properties;
        s.id=l.identity.low;
        delete s.password;
          res.json(s),
          res.end()
        })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
   console.log(error)
  })
  .then(() => session.close())
}

async function execTestCreate(){
  var session=driver.session()

  session
  .run('CREATE(n:Person {name:$Ime})', {Ime:'Feget'})
  .then(result => {
      result.records.forEach(record => {
          console.log(record.get('n'))
        })
  })
  .catch(error => {
    console.log(error)
  })
  .then(() => session.close())

}

async function execAuth(username,password,res){
  var session=driver.session()
  session
  .run('match (n:User {username:$user,password:$pass}) return n', {user: username , pass: password})
  .then(result => {
      result.records.forEach(record => {
        let l=record.get('n');
        let s=l.properties;
        s.id=l.identity.low;
        delete s.password;
          res.json(s),
          res.end()
        })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
   // console.log(error)
  })
  .then(() => session.close())

}

async function execReturnById(id,res){
  var session=driver.session()
  session
  .run('MATCH (n:User) WHERE id(n)=$ID RETURN n', {ID: neo4j.int(id)})
  .then(result => {
      result.records.forEach(record => {
        let l=record.get('n');
        let s=l.properties;
        s.id=l.identity.low;
        delete s.password;
          res.json(s),
          res.end()
        })
  })
  .catch(error => {
    res.status(500);
    res.send(error.message);
    res.end();
   console.log(error)
  })
  .then(() => session.close())

}

module.exports={
    execGetDriverById: execGetDriverById,
    execTestCreate: execTestCreate,
    execAuth: execAuth,
    execReturnById: execReturnById

}