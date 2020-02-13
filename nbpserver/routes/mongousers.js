var express = require('express');
var router = express.Router();
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
const sha = require('sha.js');
const mongoDB = require('../db/mongoDB.js');

router.post('/register', async (req, res) => {
  req.body.password = sha('sha256').update(req.body.password).digest('hex');
  mongoDB.execPost(req, res, mongoDB.REGISTER_USER);
});

router.post('/auth', async (req, res) => {
  //req.body.password = sha('sha256').update(req.body.password).digest('hex');
  mongoDB.execPost(req, res, mongoDB.AUTH_USER);
});

router.get('/', async (req, res) => {
  mongoDB.execGet(req, res, mongoDB.USER_BY_ID);
});

router.get('/checkuser', async (req, res) => {
  mongoDB.execGet(req, res, mongoDB.CHECK_USERNAME);
})

module.exports = router;