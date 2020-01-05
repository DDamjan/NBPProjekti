var express = require('express');
var router = express.Router();
const queryString = require('../constants/queryConstants');
const query = require('../db/query');
const sha = require('sha.js');

router.post('/register', async (req, res) => {
  let username = req.body.username;
  let password = sha('sha256').update(req.body.password).digest('hex');

  query.execPost(req, res, queryString.REGISTER_USER(username, password));
});

router.post('/auth', async (req, res) => {
  let username = req.body.username;
  let password = sha('sha256').update(req.body.password).digest('hex');

  query.execGet(req, res, queryString.AUTH_USER(username, password));
});

router.get('/', async (req, res) => {
  let id = req.query.id;

  query.execUser(req, res, id);
});

router.get('/checkuser', async (req, res) => {
  let username = req.query.username;

  query.execGet(req, res, queryString.CHECK_USERNAME(username));
})

module.exports = router;
