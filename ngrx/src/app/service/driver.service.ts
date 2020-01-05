import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Driver } from '../models/Driver';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DriverService {

    private serverURL = 'http://localhost:8080/drivers/';

    constructor(
        private http: HttpClient) { }

    /* GET drivers from the server */
    getDrivers(): Observable<Driver[]> {
        return this.http.get<Driver[]>(this.serverURL)
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

    /* GET last ID */
    getLastID(): Observable<any> {
        const url = `${this.serverURL}currentid`;
        return this.http.get<any>(url).pipe(
            catchError(this.handleError<any>('getLastID'))
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
        const id = driver.ID;
        const url = `${this.serverURL}delete?id=${id}`;

        this.http.get<Driver>(url, httpOptions).subscribe();

        return of(driver.ID);
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