import { RegisterUser, registerUserSuccess, AuthUser, authUserSuccess, GetUserByID, getUserByIDSuccess, registerUserFail, RemoveFriend, AddFriend, removeFriendSuccess, addFriendSuccess } from "./actions/userActions";
import { dbAuthUser, dbRegisterUser, dbGetUserByID, dbCheckUsername, dbRemoveFriend, dbAddFriend } from "../service/userService";
import { dbGetPlaylists, dbAddPlaylist, dbDeletePlaylist, dbAddTrack, dbRemoveTrack, dbFetchCurrentPlaylist } from "../service/playlistService";
import { put } from "redux-saga/effects";
import { GetPlaylists, getPlaylistsSuccess, AddPlaylist, addPlaylistSuccess, DeletePlaylist, deletePlaylistSuccess, AddTrack, addTrackSuccess, RemoveTrack, RemoveTrackSuccess, CurrentPlaylist, currentPlaylistSuccess, FindTrack, findTrackSuccess } from "./actions/playlistActions";
import Cookies from "universal-cookie";
import { searchTracks } from '../service/deezerService';
import { Track } from "../models/Track";

//users
export function* sAuthUser(user: AuthUser) {
    const dbUser = yield dbAuthUser(user.username, user.password);
    yield put(authUserSuccess(dbUser));

}

export function* sRegisterUser(user: RegisterUser) {
    console.log("sRegisterUser");
    const username = yield dbCheckUsername(user.user.Username);
    if (username.length === 0) {
        if (user.user.Password === user.user.confirmPassword) {
            const dbUser = yield dbRegisterUser(user.user.Username, user.user.Password);
            const cookies = new Cookies();
            cookies.set('logedIn', dbUser._id, { path: '/' });
            yield put(registerUserSuccess(dbUser));
        }
        else {
            yield put(registerUserFail("Passwords did not match!"));
        }
    }
    else {
        yield put(registerUserFail("Username already exists!"));
    }
}

export function* sGetUserByID(user: GetUserByID) {
    const dbUser = yield dbGetUserByID(user.ID);
    yield put(getUserByIDSuccess(dbUser));
}

export function* sRemoveFriend(user: RemoveFriend) {
    const dbUser = yield dbRemoveFriend(user.id);
    yield put(removeFriendSuccess(dbUser));
}

export function* sAddFriend(friend: AddFriend) {
    const dbFriend = yield dbAddFriend(friend.payload);
    yield put(addFriendSuccess(dbFriend));
}


//playlists
export function* sFetchPlaylists(playlist: GetPlaylists) {
    const dbPlaylist = yield dbGetPlaylists(playlist.ID);
    yield put(getPlaylistsSuccess(dbPlaylist));
}

export function* sAddPlaylists(playlist: AddPlaylist) {
    const dbPlaylist = yield dbAddPlaylist(playlist);
    yield put(addPlaylistSuccess(dbPlaylist));
}

export function* sDeletePlaylist(playlist: DeletePlaylist) {
    const deletedPlaylistID = yield dbDeletePlaylist(playlist.playlistID, playlist.ownerID);
    yield put(deletePlaylistSuccess(deletedPlaylistID.playlistID));
}

export function* sAddTrack(track: AddTrack) {
    const dbTrack = yield dbAddTrack(track.track, track.playlistID, track.userID);
    yield put(addTrackSuccess(dbTrack));
}

export function* sFindTrack(query: FindTrack) {
    const dzTrack = yield searchTracks(query.query);

    const track = {
        DeezerID: dzTrack.data[0].id,
        Artist: dzTrack.data[0].artist.name,
        Duration: dzTrack.data[0].duration,
        Title: dzTrack.data[0].title,
        AlbumCover: dzTrack.data[0].album.cover_big,
        Album: dzTrack.data[0].album.title,
        URL: dzTrack.data[0].preview
    }

    yield put(findTrackSuccess(track, query.playlistID, query.userID));
}

export function* sRemoveTrack(track: RemoveTrack) {
    const dbTrack = yield dbRemoveTrack(track.ID);
    yield put(RemoveTrackSuccess(dbTrack));
}

export function* sCurrentPlaylist(ID: CurrentPlaylist) {
    const dbCurrentPlaylist = yield dbFetchCurrentPlaylist(ID.ID);
    yield put(currentPlaylistSuccess(dbCurrentPlaylist));
}