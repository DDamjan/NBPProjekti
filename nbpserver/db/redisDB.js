var redis = require("redis");
client = redis.createClient();

exports.redis = redis; 
exports.client = client; 
