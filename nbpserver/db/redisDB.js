var redis = require("redis");
client = redis.createClient();

async function execPost(req, res, fun) {
    try {
        //[fun](req);
        makeRequest(req);
        res.json("verry nice");
        res.end();
    } catch (err) {
        res.status(500);
        res.send(err.message);
        res.end();
    }
}

function makeRequest(req){
    console.log("wtffffffffff");
}

module.exports = {
    redis: redis,
    client: client,
    execPost: execPost
}
