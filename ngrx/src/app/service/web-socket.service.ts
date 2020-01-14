import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
    providedIn: 'root'
})export class WebSocketService {

    socket: any;
    readonly uri: string = 'ws://localhost:4201';

    constructor() {
        this.socket = io(this.uri);
        console.log('Connecting to server...');
    }

    listen(eventName: string) {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
                console.log('  ');
            });
        });
    }

    emit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }
}
