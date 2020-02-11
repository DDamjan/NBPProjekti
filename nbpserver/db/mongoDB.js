const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoose = require('mongoose');
 
const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

// Connection URL
const url = 'mongodb://localhost:27017/player';
 
async function conectToDB(){
    await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });
}

// const mySchema = new Schema({
//     name: { type: String, default: 'hahaha' },
//     age: { type: Number, min: 18, index: true },
//     bio: { type: String, match: /[a-z]/ },
//     date: { type: Date, default: Date.now },
//     buff: Buffer
// });

const trackSchema = new Schema({
    ID: Number,
    DeezerID: Number,
    Artist: { type: String, default: '' },
    Title: { type: String, default: '' },
    AlbumCover: String,
    Album: String,
    URL: String
});
const Track = mongoose.model('Track', trackSchema);

const playlistSchema = new Schema({
    ID: Number,
    Name: { type: String, default: 'hahaha' },
    OwnerID: Number,
    Tracks: trackSchema
});
const Playlist = mongoose.model('Playlist', playlistSchema);

const userSchema = new Schema({
    ID: Number,
    Username: { type: String, default: 'hahaha' },
    Password: { type: String, default: 'hahaha' },
    playlists: playlistSchema
});
const User = mongoose.model('User', userSchema);


const instanceT = new Track();
instanceT.Title = 'In the air';
instanceT.save(function (err) {
    console.log("saved Tracks");
    Track.find({}, function (err, playlists) {
        console.log("ima Tracks");
        console.log(playlists);
    });
});

const instanceP = new Playlist();
instanceP.Name = 'PLAYLISTAAAAAAA';
instanceP.save(function (err) {
    console.log("saved playlistu");
    Playlist.find({}, function (err, playlists) {
        console.log("ima playlista");
        console.log(playlists);
    });
});

const instanceU = new User();
instanceU.Username = 'hello';
instanceU.save(function (err) {
    console.log("saved users");
    User.find({}, function (err, users) {
        console.log("ima Usera");
        console.log(users);
    });
});

async function REGISTER_USER(body){
    //return `insert into reduxedUsers (Username, Password) 
    //values ('${Username}', '${Password}'); 
    //Select ID, Username from reduxedUsers where Username like '${Username}'`;
    const instanceU = new User();
    instanceU.Username = body.username;
    instanceU.Username = body.password;
    instanceU.save(function (err) {
        console.log("User registerd");
        console.log(err);
        return err;
    });
}

async function CHECK_USERNAME(body){
    console.log(body);
    return User.find({Username: body.username}, function (err, users) {
        console.log("ime Usera");
        console.log({"users": users});
        return JSON.stringify({"users": users});
    });
}

async function exec(req, res, fun) {
    try {
        var result = await fun(req.body);
        console.log(result);
        if (result== undefined){
          res.json(req);
          res.send();
        }
        else{
          res.json(result);
          res.end();
        }
    } catch (err) {
      console.log("ERROR");
      res.status(500);
      res.send(err.message);
      res.end();
    }
  }

async function execGet(req, res, query) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('input_parameter', sql.Int, req.query.input_parameter)
        .query(query);
        if (result.recordset== undefined){
          res.json(req.query);
          res.send();
        }
        else{
          res.json(result.recordset);
          res.end();
        }
    } catch (err) {
      res.status(500);
      res.send(err.message);
      res.end();
    }
  }
  
  async function execPost(req, res, query) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('input_parameter', sql.Int, req.query.input_parameter)
        .query(query);
        if (result.recordset== undefined){
          res.json(req.body);
          res.send();
        }
        else{
          res.json(result.recordset);
          res.end();
        }
    } catch (err) {
      res.status(500);
      res.send(err.message);
      res.end();
    }
  }
  
  async function execFile(res, path) {
    try {
      res.sendFile(path);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  }
  
  async function returnArray(req, res, query) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('input_parameter', sql.Int, req.query.input_parameter)
        .query(query);
      return result.recordset;
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  }
  
  async function execUser(req, res, ID) {
    let user = await returnArray(req, res, queryString.GET_USER_BY_ID + ID);
    let playlists = await returnArray(req, res, queryString.GET_PLAYLISTS + ID);
  
    let data = {
      ID: user[0].ID,
      Username: user[0].Username,
      playlists: playlists
    }
  
    res.json(data);
  }
  
  async function execPlaylists(req, res, ID){
    let playlist = await returnArray(req, res, queryString.CURRENT_PLAYLIST + ID);
    let tracks = await returnArray(req, res, queryString.TRACKS_PLAYLIST+ ID);
  
    let data = {
      ID: playlist[0].ID,
      Name: playlist[0].Name,
      OwnerID: playlist[0].OwnerID,
      Tracks: tracks
    }
  
    res.json(data);
  }
  
  module.exports = {
    conectToDB: conectToDB,
    exec: exec,
    execGet: execGet,
    execPost: execPost,
    execFile: execFile,
    execUser: execUser,
    execPlaylists:execPlaylists,
    REGISTER_USER: REGISTER_USER,
    CHECK_USERNAME: CHECK_USERNAME
  }