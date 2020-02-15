const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

// Connection URL
const url = 'mongodb://localhost:27017/player';

async function conectToDB() {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  User.find({}, function (err, users) {
    console.log("ima users");
    console.log(users);
  });
}


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
  OwnerID: String,
  Tracks: [trackSchema]
});
const Playlist = mongoose.model('Playlist', playlistSchema);

const friendSchema = new Schema({
  ID: Number,
  Username: { type: String, default: 'hahaha' },
  Playlists: [playlistSchema]
});
const Friend = mongoose.model('Friend', friendSchema);

const userSchema = new Schema({
  ID: Number,
  Username: { type: String, default: 'hahaha' },
  Password: { type: String, default: 'hahaha' },
  Playlists: [playlistSchema],
  Friends: [friendSchema]
});
const User = mongoose.model('User', userSchema);


// const instanceT = new Track();
// instanceT.Title = 'In the air';
// instanceT.save(function (err) {
//     console.log("saved Tracks");
//     Track.find({}, function (err, playlists) {
//         console.log("ima Tracks");
//         console.log(playlists);
//     });
// });

// const instanceP = new Playlist();
// instanceP.Name = 'PLAYLISTAAAAAAA';
// instanceP.save(function (err) {
//     console.log("saved playlistu");
//     Playlist.find({}, function (err, playlists) {
//         console.log("ima playlista");
//         console.log(playlists);
//     });
// });

function REGISTER_USER(body) {
  return new Promise((resolve, reject) => {
    console.log("REGISTER_USER");
    console.log(body);
    const instanceU = new User();
    instanceU.Username = body.username;
    instanceU.Password = body.password;
    instanceU.save(function (err, user) {
      console.log("User registerd");
      console.log(user);
      resolve(user);
    });
  });
}


async function AUTH_USER(body) {
  return new Promise((resolve, reject) => {
    console.log("AUTH_USER");
    console.log(body);
    User.findOne({ Username: body.username }, function (err, user) {
      if (err) throw err;
      if (user.Password === body.password) {
        resolve(user);
      } else resolve([]);
    });
  });
}

async function USER_BY_ID(query) {
  return new Promise((resolve, reject) => {
    console.log("USER_BY_ID");
    console.log(query);
    User.find({ _id: query.id }, '-Password', function (err, user) {
      resolve(user[0]);
    });
  });
}

async function CHECK_USERNAME(query) {
  return new Promise((resolve, reject) => {
    console.log("CHECK_USERNAME");
    console.log(query);
    User.find({ _id: query.id }, function (err, users) {
      resolve(users);
    });
  });
}

async function ADD_PLAYLIST(body) {
  return new Promise((resolve, reject) => {
    instancePL = {
      Name: body.name,
      OwnerID: body.ownerID
    };
    Playlist.create(instancePL, function (err, playlist) {
      //console.log("PLAYLISTS");
      //console.log(playlist);
      if (err) console.log(err);
      User.findById(playlist.OwnerID, function (err, user) {
        // console.log(user);
        if (err) console.log(err);
        user.Playlists.push(playlist);
        //console.log(user);
        user.save();
        resolve(playlist);
      });
    });
  });

}

async function ADD_TRACK(body) {
  return new Promise((resolve, reject) => {
    instanceT = {
      DeezerID: body.track.DeezerID,
      Artist: body.track.Artist,
      Title: body.track.Title,
      AlbumCover: body.track.AlbumCover,
      Album: body.track.Album,
      URL: body.track.URL
    }
    let idU =
      Track.create(instanceT, function (err, track) {
        if (err) console.log(err);
        User.findOne({ _id: body.userID }, function (err, user) {
          if (err) console.log(err);
          user.Playlists.find(x => x._id == body.playlistID).Tracks.push(track);
          user.save();
          resolve(track);
        });
        // });
      });

  });
}

async function ADD_FRIEND(body) {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: body.userID }, function (err, user) {
      User.findOne({ Username: body.friendName }, '-Password -Friends', function (err, friend) {
        if (friend !== null){
          const friendParse = new Friend();
          friendParse.Username = friend.Username;
          friendParse.ID = friend.ID;
          friendParse.Playlists = friend.Playlists;
          friendParse.save();
          console.log(user);
          user.Friends.push(friendParse);
          user.save();
          resolve(user.Friends.find(x=> x.Username == body.friendName));
        }else{
          resolve([]);
        }
        
      });
    });

  });
}

async function REMOVE_FRIEND(body) {
  return new Promise((resolve, reject) => {
    return User.findOne({ _id: body.userID }, async function (err, user) {
      const payload = await user.Friends.filter(x => x._id != body.friendID);
      await user.updateOne({ Friends: payload });
      resolve(body.friendID);
    });
  });
}

async function REMOVE_TRACK(body) {
  return new Promise((resolve, reject) => {
    return User.findOne({ _id: body.userID }, async function (err, user) {
      user.Playlists.findOne({ _id: body.playlistID }, async function (err, playlist) {
        const payload = await playlist.Tracks.filter(x => x._id != body.trackID);
        await playlist.updateOne({ Tracks: payload });
        //resolve({friendID: body.friendID});
      });
    });
  });

}

async function GET_PLAYLISTS(query) {
  return new Promise((resolve, reject) => {
    console.log("WTFFFF");
    Playlist.find({ OwnerID: query.id }, function (err, playlists) {
      console.log("Playliste");
      console.log({ "playlists": playlists });
      resolve(playlists);
    });

  });

}

async function DELETE_PLAYLIST(body) {
  return new Promise((resolve, reject) => {
    return User.findOne({ _id: body.ownerID }, async function (err, user) {
      const payload = await user.Playlists.filter(x => x._id != body.playlistID);
      await user.updateOne({ Playlists: payload });
      resolve({ playlistID: body.playlistID });
    });
  });

}

async function GET_DETAILS(query) {
  return new Promise((resolve, reject) => {
    console.log("WTFFFF");
    return Playlist.find({ _id: query.id }, function (err, playlists) {
      console.log("Playliste"); ~
        console.log({ "playlists": playlists });
      resolve(playlists);

    });
  });

}

function execQuery(req, res, fun) {
  try {
    fun(req).then((result) => {
      if (result == undefined) {
        res.json([]);
        res.send();
      }
      else {
        console.log("result");
        console.log(result);
        res.json(result);
        res.end();
      }
    });
  } catch (err) {
    console.log("ERROR");
    res.status(500);
    res.send(err.message);
    res.end();
  }
}

// async function execPost(req, res, fun) {
//   try {
//     fun(req.body).subscribe((result)=>{
//       if (result== undefined){
//         console.log("req.body");
//         console.log(req.body);
//         res.json(req.body);
//         res.send();
//       }
//       else{
//         console.log("result");
//         console.log(result);
//         res.json(result);
//         res.end();
//       }
//     });
//   } catch (err) {
//     console.log("ERROR");
//     res.status(500);
//     res.send(err.message);
//     res.end();
//   }
// }


async function execFile(res, path) {
  try {
    res.sendFile(path);
  } catch (err) {
    console.log("ERROR");
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

async function execPlaylists(req, res, ID) {
  let playlist = await returnArray(req, res, queryString.CURRENT_PLAYLIST + ID);
  let tracks = await returnArray(req, res, queryString.TRACKS_PLAYLIST + ID);

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
  execQuery: execQuery,
  execFile: execFile,
  execUser: execUser,
  execPlaylists: execPlaylists,
  REGISTER_USER: REGISTER_USER,
  AUTH_USER: AUTH_USER,
  USER_BY_ID: USER_BY_ID,
  CHECK_USERNAME: CHECK_USERNAME,
  ADD_PLAYLIST: ADD_PLAYLIST,
  GET_PLAYLISTS: GET_PLAYLISTS,
  DELETE_PLAYLIST: DELETE_PLAYLIST,
  GET_DETAILS: GET_DETAILS,
  ADD_TRACK: ADD_TRACK,
  ADD_FRIEND: ADD_FRIEND,
  REMOVE_FRIEND: REMOVE_FRIEND,
  REMOVE_TRACK: REMOVE_TRACK
}