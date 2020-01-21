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

    //private serverURL = cons.PUBLIC_SERVER + 'rides/';
    private serverURL = cons.LOCAL_SERVER + 'rides/';

    constructor(
        private http: HttpClient) { }

    /* GET ride by id. */
    getRide(id: number): Observable<Ride[]> {
        const url = `${this.serverURL}?id=${id}`;
        return this.http.get<Ride[]>(url).pipe(
            catchError(this.handleError<Ride[]>(`getRide id=${id}`))
        );
    }

    /* GET last ID */
    getLastID(): Observable<any> {
        const url = `${this.serverURL}currentid`;
        return this.http.get<any>(url).pipe(
            catchError(this.handleError<any>('getLastID'))
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

    requestRide(payload: any): Observable<Ride> {
        const url = `${this.serverURL}request`;
        return this.http.post<Ride>(url, payload, httpOptions).pipe(
            catchError(this.handleError<Ride>('requesttest'))
        );
    }

    findRideAddress(params): Observable<any> {
        const url = cons.HERE_API_AUTOCOMPLETE + params;
        return this.http.get<any>(url);
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
