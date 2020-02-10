import { Action } from "redux";
import { FETCH_PLAYLISTS, FETCH_PLAYLISTS_SUCCESS, ADD_PLAYLIST, ADD_PLAYLIST_SUCCESS, DELETE_PLAYLIST, DELETE_PLAYLIST_SUCCESS, CURRENT_PLAYLIST, CURRENT_TRACK, ADD_TRACK, ADD_TRACK_SUCCESS, FIND_TRACK, REMOVE_TRACK, CURRENT_PLAYLIST_SUCCESS, FIND_TRACK_SUCCESS, REMOVE_TRACK_SUCCESS } from "./types";
import { Playlist } from "../../models/playlist";
import { Track } from "../../models/Track";

export interface GetPlaylists extends Action {
    ID: number;
}

export function getPlaylists(ID: number): GetPlaylists {
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
    ID: number;
}

export function deletePlaylist(ID: number): DeletePlaylist {
    return {
        type: DELETE_PLAYLIST,
        ID
    };
}

export interface DeletePlaylistSuccess extends Action {
    ID: number;
}

export function deletePlaylistSuccess(ID: number): DeletePlaylistSuccess {
    return{
        type: DELETE_PLAYLIST_SUCCESS,
        ID
    };
}

export interface CurrentPlaylist extends Action{
    ID: number;
}

export function currentPlaylist(ID: number): CurrentPlaylist{
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
    ID: number;
}

export function currentTrack(ID: number): CurrentTrack{
    return {
        type: CURRENT_TRACK,
        ID
    }
}

export interface AddTrack extends Action{
    track: Track;
    playlistID: number;
}

export function addTrack(track: Track, playlistID: number): AddTrack{
    return {
        type: ADD_TRACK,
        track,
        playlistID
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
    playlistID: number;
}

export function findTrack(query: string, playlistID: number): FindTrack{
    return{
        type: FIND_TRACK,
        query,
        playlistID
    };
}

export interface FindTrackSuccess extends Action{
    track: Track;
    playlistID: number;
}

export function findTrackSuccess(track: any, playlistID: number): FindTrackSuccess{
    return{
        type: FIND_TRACK_SUCCESS,
        track,
        playlistID
    };
}

export interface RemoveTrack extends Action{
    ID: number;
}

export function removeTrack(ID: number): RemoveTrack{
    return {
        type: REMOVE_TRACK,
        ID
    }
}

export interface RemoveTrackSuccess extends Action{
    ID: number;
}

export function RemoveTrackSuccess(ID: number): RemoveTrackSuccess{
    return {
        type: REMOVE_TRACK_SUCCESS,
        ID
    }
}