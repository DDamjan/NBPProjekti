import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Driver } from '../models/Driver';
import * as conn from '../../constants/server-urls';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DriverService {

    private serverURL = conn.PUBLIC_SERVER_DAMJAN + 'users/';
    // private serverURL = conn.LOCAL_SERVER + 'drivers/';
    // private serverURL = conn.PUBLIC_SERVER_PEDJA + 'drivers/';

    constructor(
        private http: HttpClient) { }

    /* GET drivers from the server */
    getDrivers(): Observable<Driver[]> {
        return this.http.get<Driver[]>(this.serverURL + 'all?type=driver')
            .pipe(
                catchError(this.handleError('getDrivers', []))
            );
    }

    /* GET driver by id. */
    getDriver(id: number): Observable<Driver> {
        const url = `${this.serverURL}?id=${id}`;
        return this.http.get<Driver>(url).pipe(
            catchError(this.handleError<Driver>(`getDriver id=${id}`))
        );
    }

    //////// Save methods //////////

    /* POST: add a new driver to the server */
    addDriver(driver: Driver): Observable<Driver> {
        const url = `${this.serverURL}create`;
        return this.http.post<Driver>(url, driver, httpOptions).pipe(
            catchError(this.handleError<Driver>('addDriver'))
        );
    }

    /* UPDATE: update driver on the server */
    updateDriver(driver: Driver): Observable<Driver> {
        const url = `${this.serverURL}update`;
        return this.http.post<Driver>(url, driver, httpOptions).pipe(
            catchError(this.handleError<Driver>('updateDriver'))
        );
    }

    /* DELETE: delete the driver from the server */
    deleteDriver(driver: Driver): Observable<number> {
        const id = driver.id;
        const url = `${this.serverURL}delete?id=${id}`;

        this.http.get<Driver>(url, httpOptions).subscribe();

        return of(driver.id);
    }

    /*
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
