import { Track } from "./Track";

export interface Playlist{
    _id: string;
    Name: string;
    OwnerID: string;
    Tracks: Track[];
}