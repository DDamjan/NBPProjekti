var express = require('express');
var router = express.Router();
//const queryString = require('../constants/queryConstants');
//const query = require('../db/query');
const sha = require('sha.js');
const mongoDB = require('../db/mongoDB.js');

router.post('/register', async (req, res) => {
  req.body.password = sha('sha256').update(req.body.password).digest('hex');
  mongoDB.execQuery(req.body, res, mongoDB.REGISTER_USER);
});

router.post('/auth', async (req, res) => {
  req.body.password = sha('sha256').update(req.body.password).digest('hex');
  mongoDB.execQuery(req.body, res, mongoDB.AUTH_USER);
});

router.get('/', async (req, res) => {
  console.log(req.query);
  mongoDB.execQuery(req.query, res, mongoDB.USER_BY_ID);
});

router.get('/checkuser', async (req, res) => {
  mongoDB.execQuery(req.query, res, mongoDB.CHECK_USERNAME);
})

router.post('/addfriend', async (req, res) => {
  mongoDB.execQuery(req.body, res, mongoDB.ADD_FRIEND);
  console.log("11111111");
});

router.post('/removefriend', async (req, res) => {
  mongoDB.execQuery(req.body, res, mongoDB.REMOVE_FRIEND);
})

module.exports = router;