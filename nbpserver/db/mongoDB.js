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



module.exports={
conectToDB: conectToDB
}