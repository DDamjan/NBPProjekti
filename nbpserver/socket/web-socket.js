const app = require('../app.js');
const www = require('../bin/www');

var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4201;
var server = http.listen(port, function () {
    console.log("Express server listening on port " + port);
});

io.on('connection', function (socket) {
    console.log('new user connected');
    var user;
    socket.emit('ngdispatcher-connection', 'Connected to the server');
    socket.on('UserConnected', function(body) {
      if(!user){
        user = body;
      }
    });

    socket.on('disconnecting', (reason) => {
        console.log('user disonnected');
        client.hdel(use.type, user.id);
        console.log(user.type +" deleted");
      });
});

exports.io = io; 