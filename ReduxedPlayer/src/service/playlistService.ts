import { Track } from '../models/Track';

const baseURL = 'http://localhost:8080/playlists/';

export function dbGetPlaylists(ID: number) {
    const url = baseURL + `?ID=${ID}`;

    return fetch(url).
        then(res => res.json());
}

export function dbAddPlaylist(payload: any) {
    const url = baseURL + "add";

    return fetch(url, { method: "POST", body: JSON.stringify(payload.payload), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbDeletePlaylist(ID: number) {
    const url = baseURL + "delete";

    const payload = {
        ID
    }
    console.log(payload);

    return fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbAddTrack(track: Track, playlistID: number) {
    const url = baseURL + "addtrack";
    const data = {
        track,
        playlistID
    }

    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbRemoveTrack(ID: number) {
    const url = baseURL + "removetrack";
    const data = {
        ID
    }

    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbFetchCurrentPlaylist(ID: number) {
    const url = baseURL + "details/?id=" + ID;

    return fetch(url).
        then(res => res.json());
}