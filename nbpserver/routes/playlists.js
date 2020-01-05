var express = require('express');
var router = express.Router();
const queryString = require('../constants/queryConstants');
const query = require('../db/query');
const sha = require('sha.js');

router.post('/add', async (req, res) => {
  let name = req.body.name;
  let ownerID = req.body.ownerID;

  query.execPost(req, res, queryString.ADD_PLAYLIST(name, ownerID));
});

router.get('/', async (req, res) => {
  let id = req.query.id;

  query.execGet(req, res, queryString.GET_PLAYLISTS + id);
});

router.post('/delete', async (req, res)=> {
  let id = req.body.ID;

  console.log(id);

  query.execPost(req, res, queryString.DELETE_PLAYLIST(id));
});

router.get('/details/', async (req, res)=>{
  let id = req.query.id;

  query.execPlaylists(req, res, id);
});

router.post('/addtrack', async (req, res)=>{
  let track = req.body.track;
  let playlistID = req.body.playlistID;

  query.execPost(req, res, queryString.ADD_TRACK(track, playlistID));
});

router.post('/removetrack', async(req, res)=>{
  let id = req.body.ID;
  console.log(id.ID);

  query.execPost(req, res, queryString.REMOVE_TRACK+id);
})

module.exports = router;
