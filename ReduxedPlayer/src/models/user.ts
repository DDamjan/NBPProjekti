import { Playlist } from "./playlist";

export interface User{
    ID: number;
    Username: string;
    Password?: string;
    playlists: Playlist[];
}   