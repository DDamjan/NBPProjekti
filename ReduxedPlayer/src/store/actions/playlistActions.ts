import { Action } from "redux";
import { FETCH_PLAYLISTS, FETCH_PLAYLISTS_SUCCESS, ADD_PLAYLIST, ADD_PLAYLIST_SUCCESS, DELETE_PLAYLIST, DELETE_PLAYLIST_SUCCESS, CURRENT_PLAYLIST, CURRENT_TRACK, ADD_TRACK, ADD_TRACK_SUCCESS, FIND_TRACK, REMOVE_TRACK, CURRENT_PLAYLIST_SUCCESS, FIND_TRACK_SUCCESS, REMOVE_TRACK_SUCCESS } from "./types";
import { Playlist } from "../../models/playlist";
import { Track } from "../../models/Track";

export interface GetPlaylists extends Action {
    ID: string;
}

export function getPlaylists(ID: string): GetPlaylists {
    return {
        type: FETCH_PLAYLISTS,
        ID
    };
}

export interface GetPlaylistsSuccess extends Action {
    playlists: Playlist[];
}

export function getPlaylistsSuccess(playlists: Playlist[]): GetPlaylistsSuccess {
    return {
        type: FETCH_PLAYLISTS_SUCCESS,
        playlists
    };
}

export interface AddPlaylist extends Action {
    payload: any;
}

export function addPlaylist(payload: any): AddPlaylist {
    return {
        type: ADD_PLAYLIST,
        payload
    };
}

export interface AddPlaylistSuccess extends Action {
    playlist: Playlist;
}

export function addPlaylistSuccess(playlist: Playlist): AddPlaylistSuccess {
    return {
        type: ADD_PLAYLIST_SUCCESS,
        playlist
    };
}

export interface DeletePlaylist extends Action {
    playlistID: string;
    ownerID: string;
}

export function deletePlaylist(playlistID: string, ownerID: string): DeletePlaylist {
    return {
        type: DELETE_PLAYLIST,
        playlistID,
        ownerID
    };
}

export interface DeletePlaylistSuccess extends Action {
    ID: string;
}

export function deletePlaylistSuccess(ID: string): DeletePlaylistSuccess {
    return{
        type: DELETE_PLAYLIST_SUCCESS,
        ID
    };
}

export interface CurrentPlaylist extends Action{
    ID: string;
}

export function currentPlaylist(ID: string): CurrentPlaylist{
    return {
        type: CURRENT_PLAYLIST,
        ID
    };
}

export interface CurrentPlaylistSuccess extends Action{
    currentPlaylist: Playlist;
}

export function currentPlaylistSuccess(currentPlaylist: Playlist): CurrentPlaylistSuccess{
    return {
        type: CURRENT_PLAYLIST_SUCCESS,
        currentPlaylist
    };
}

export interface CurrentTrack extends Action{
    ID: string;
}

export function currentTrack(ID: string): CurrentTrack{
    return {
        type: CURRENT_TRACK,
        ID
    }
}

export interface AddTrack extends Action{
    track: Track;
    playlistID: string;
    userID: string;
}

export function addTrack(track: Track, playlistID: string, userID: string): AddTrack{
    return {
        type: ADD_TRACK,
        track,
        playlistID,
        userID
    };
}

export interface AddTrackSuccess extends Action{
    track: Track;
}

export function addTrackSuccess(track: Track): AddTrackSuccess{
    return{
        type: ADD_TRACK_SUCCESS,
        track
    };
}

export interface FindTrack extends Action{
    query: string;
    playlistID: string;
    userID: string;
}

export function findTrack(query: string, playlistID: string, userID: string): FindTrack{
    return{
        type: FIND_TRACK,
        query,
        playlistID,
        userID
    };
}

export interface FindTrackSuccess extends Action{
    track: Track;
    playlistID: string;
    userID: string;
}

export function findTrackSuccess(track: any, playlistID: string, userID: string): FindTrackSuccess{
    return{
        type: FIND_TRACK_SUCCESS,
        track,
        playlistID,
        userID
    };
}

export interface RemoveTrack extends Action{
    ID: string;
}

export function removeTrack(ID: string): RemoveTrack{
    return {
        type: REMOVE_TRACK,
        ID
    }
}

export interface RemoveTrackSuccess extends Action{
    ID: string;
}

export function RemoveTrackSuccess(ID: string): RemoveTrackSuccess{
    return {
        type: REMOVE_TRACK_SUCCESS,
        ID
    }
}