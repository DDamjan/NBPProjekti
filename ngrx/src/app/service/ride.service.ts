import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Ride } from '../models/Ride';
import * as cons from '../../constants/server-urls';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RideService {

    private serverURL = cons.PUBLIC_SERVER_DAMJAN + 'rides/';
    private uServerURL = cons.PUBLIC_SERVER_DAMJAN + 'users/';

    // private serverURL = cons.LOCAL_SERVER + 'rides/';
    // private uServerURL = cons.LOCAL_SERVER + 'users/';

    // private serverURL = cons.PUBLIC_SERVER_PEDJA + 'rides/';
    // private uSserverURL = cons.PUBLIC_SERVER_PEDJA + 'users/';

    constructor(
        private http: HttpClient) { }

    /* GET ride by id. */
    getRide(id: number): Observable<Ride[]> {
        const url = `${this.serverURL}?id=${id}`;
        return this.http.get<Ride[]>(url).pipe(
            catchError(this.handleError<Ride[]>(`getRide id=${id}`))
        );
    }

    //////// Save methods //////////

    /** POST: add a new ride to the server */
    addRide(ride: Ride): Observable<Ride> {
        const url = `${this.serverURL}create`;
        return this.http.post<Ride>(url, ride, httpOptions).pipe(
            catchError(this.handleError<Ride>('addRide'))
        );
    }

    /** POST: update the ride on the server */
    updateRide(ride: Ride): Observable<any> {
        const url = `${this.serverURL}finish`;
        return this.http.post(url, ride, httpOptions).pipe(
            catchError(this.handleError<any>('updateRide'))
        );
    }

    /* POST add distance and fare to the ride */
    addDistanceFare(distance: string, fare: number, ID: number): Observable<any> {
        const url = `${this.serverURL}adddistancefare`;
        const body = {
            distance,
            fare,
            ID
        };
        return this.http.post(url, body, httpOptions).pipe(
            catchError(this.handleError<any>('addDistanceFare'))
        );
    }

    finishRide(payload: any): Observable<any> {
        const url = `${this.serverURL}finish`;
        return this.http.post<any>(url, payload, httpOptions).pipe(
            catchError(this.handleError<any>('requesttest'))
        );
    }

    findRideAddress(params): Observable<any> {
        const url = cons.HERE_API_AUTOCOMPLETE + params;
        return this.http.get<any>(url);
    }

    getTopRides(id: number): Observable<Ride[]> {
        const url = `${this.uServerURL}topLoc?id=${id}`;
        return this.http.get<Ride[]>(url).pipe(
            catchError(this.handleError<Ride[]>(`getTopRides id=${id}`))
        );
    }

    getRideHistory(id: number): Observable<Ride[]> {
        const url = `${this.uServerURL}allLoc?id=${id}`;
        return this.http.get<Ride[]>(url).pipe(
            catchError(this.handleError<Ride[]>(`getRideHistory id=${id}`))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
