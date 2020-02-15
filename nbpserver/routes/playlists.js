var express = require('express');
var router = express.Router();
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
//const sha = require('sha.js');
const mongoDB = require('../db/mongoDB.js');

router.post('/add', async (req, res) => {
  let name = req.body.name;
  let ownerID = req.body.ownerID;
  //console.log("REPCUGA 1");
  //console.log(req.body);
  mongoDB.execQuery(req.body,res, mongoDB.ADD_PLAYLIST);
  //query.execPost(req, res, queryString.ADD_PLAYLIST(name, ownerID));
});

router.get('/', async (req, res) => {
  let id = req.query.id;
 mongoDB.execQuery(req.query,res,mongoDB.GET_PLAYLISTS);
 // query.execGet(req, res, queryString.GET_PLAYLISTS + id);
});

router.post('/delete', async (req, res)=> {
  mongoDB.execQuery(req.body,res,mongoDB.DELETE_PLAYLIST);
  //query.execPost(req, res, queryString.DELETE_PLAYLIST(id));
});

router.get('/details/', async (req, res)=>{
  let id = req.query.id;
 // mongoDB.execGet(req,res,mongoDB.GET_DETAILS);

  //query.execPlaylists(req, res, id);
});

router.post('/addtrack', async (req, res)=>{
  let track = req.body.track;
  let playlistID = req.body.playlistID;
  mongoDB.execQuery(req.body,res,mongoDB.ADD_TRACK);

  //query.execPost(req, res, queryString.ADD_TRACK(track, playlistID));
});

router.post('/removetrack', async(req, res)=>{
  let id = req.body.ID;
  console.log(id.ID);
  mongoDB.execQuery(req.body,res,mongoDB.REMOVE_TRACK);

  //query.execPost(req, res, queryString.REMOVE_TRACK+id);
})

module.exports = router;
