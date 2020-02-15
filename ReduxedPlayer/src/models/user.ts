import { Playlist } from "./playlist";

export interface User{
    _id: string;
    Username: string;
    Password?: string;
    playlists: Playlist[];
    friends?: User[];
}   