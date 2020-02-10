/* eslint-disable no-unused-expressions */

import { Playlist } from "../../models/playlist";
import { Action } from "redux";
import { FETCH_PLAYLISTS_SUCCESS, ADD_PLAYLIST_SUCCESS, DELETE_PLAYLIST_SUCCESS, CURRENT_PLAYLIST, CURRENT_TRACK, ADD_TRACK_SUCCESS, CURRENT_PLAYLIST_SUCCESS, REMOVE_TRACK_SUCCESS } from "../actions/types";
import { GetPlaylists, GetPlaylistsSuccess, AddPlaylistSuccess, DeletePlaylistSuccess, CurrentPlaylist, CurrentTrack, AddTrackSuccess, CurrentPlaylistSuccess, currentPlaylist, RemoveTrackSuccess } from "../actions/playlistActions";
import { Track } from "../../models/Track";

export interface playlistState {
    currentPlaylist: Playlist;
    playlists: Playlist[];
    currentTrack: Track;
}

const initialState: playlistState = {
    currentPlaylist: { ID: 1, OwnerID: 1, Name: "Name", Tracks: [{ DeezerID: 1, ID: 1, URL: "/", AlbumCover: "/", Album: "Album", Artist: "Artist", Duration: 0, Title: "title" }] },
    playlists: [{ ID: 1, OwnerID: 1, Name: "Name", Tracks: [{ DeezerID: 1, ID: 1, URL: "/", AlbumCover: "/", Album: "Album", Artist: "Artist", Duration: 0, Title: "title" }] }],
    currentTrack: { DeezerID: 1, ID: 1, URL: "/", AlbumCover: "/", Album: "Album", Artist: "Artist", Duration: 0, Title: "title" }
}

export default function (state = initialState, action: Action) {
    switch (action.type) {
        case FETCH_PLAYLISTS_SUCCESS: {
            const { playlists } = action as GetPlaylistsSuccess;
            return {
                ...state,
                playlists: playlists
            };
        }
        case ADD_PLAYLIST_SUCCESS: {
            const { playlist } = action as AddPlaylistSuccess;
            return {
                ...state,
                playlists: [...state.playlists, playlist]
            };
        }
        case DELETE_PLAYLIST_SUCCESS: {
            const { ID } = action as DeletePlaylistSuccess;
            return {
                ...state,
                playlists: state.playlists.filter((playlist: Playlist) => playlist.ID != ID)
            }
        }
        case CURRENT_PLAYLIST_SUCCESS: {
            const { currentPlaylist } = action as CurrentPlaylistSuccess;
            return {
                ...state,
                currentPlaylist
            }
        }
        case CURRENT_TRACK: {
            const { ID } = action as CurrentTrack;
            return {
                ...state,
                currentTrack: state.currentPlaylist.Tracks.filter((track: Track) => track.ID === ID).pop()
            }
        }
        case ADD_TRACK_SUCCESS: {
            const { track } = action as AddTrackSuccess;
            return {
                ...state,
                currentPlaylist: { ...state.currentPlaylist, Tracks: [...state.currentPlaylist.Tracks, track] }
            }
        }
        case REMOVE_TRACK_SUCCESS: {
            const { ID } = action as RemoveTrackSuccess;
            console.log(ID);
            console.log(state.currentPlaylist.Tracks);
            return {
                ...state,
                currentPlaylist: {...state.currentPlaylist, Tracks: [state.currentPlaylist.Tracks.filter((track: Track) => track.ID != ID)]}
            }
        }
        default: return state;
    }
}