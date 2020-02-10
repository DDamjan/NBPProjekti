import { Track } from "./Track";

export interface Playlist{
    ID: number;
    Name: string;
    OwnerID: number;
    Tracks: Track[];
}