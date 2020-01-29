import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as conn from '../../constants/server-urls';

@Injectable({
    providedIn: 'root'
})export class WebSocketService {

    socket: any;
    readonly uri: string = conn.PUBLIC_WEBSOCKET_DAMJAN;
    // readonly uri: string = conn.LOCAL_WEBSOCKET;
    // readonly uri: string = conn.PUBLIC_WEBSOCKET_PEDJA;

    constructor() {
        this.socket = io(this.uri);
        console.log('Connecting to server...');
    }

    listen(eventName: string) {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }

    emit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }
}
