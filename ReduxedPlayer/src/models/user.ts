import { Playlist } from "./playlist";

export interface User{
    _id: string;
    Username: string;
    Password?: string;
    Playlists: Playlist[];
    Friends?: User[];
    userID?: string;
}   