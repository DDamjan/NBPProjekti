import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, tap, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../models/User';
import * as conn from '../../constants/server-urls';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../store/reducers/user.reducer';
import * as actions from '../store/actions';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

    // private serverURL = conn.PUBLIC_SERVER_DAMJAN + 'users/';
    // private RserverURL = conn.PUBLIC_SERVER_DAMJAN + 'rides/';
    // private serverURL = conn.LOCAL_SERVER + 'users/';
    private serverURL = conn.PUBLIC_SERVER_PEDJA + 'users/';
    private RserverURL = conn.PUBLIC_SERVER_PEDJA + 'rides/';

    constructor(
        private http: HttpClient) { }

    /* GET user by id. */
    getUser(payload: any): Observable<User> {
        console.log(payload);
        const url = `${this.serverURL}?id=${payload.id}&auth=${payload.auth}`;
        return this.http.get<User>(url).pipe(
            catchError(this.handleError<User>(`getUser id=${payload.id}`))
        );
    }

    // /* GET last ID */
    // getLastID(): Observable<any> {
    //     const url = `${this.serverURL}currentid`;
    //     return this.http.get<any>(url).pipe(
    //         catchError(this.handleError<any>('getLastID'))
    //     );
    // }

    //////// Save methods //////////

    /* POST: add a new user to the server */
    registerUser(user: User): Observable<User> {
        const url = `${this.serverURL}create`;
        return this.http.post<User>(url, user, httpOptions).pipe(
            catchError(this.handleError<User>('registerUser'))
        );
    }

    /* POST: Authenticate a user */
    authUser(data: object): Observable<User> {
        const url = `${this.serverURL}auth`;
        return this.http.post<User>(url, data, httpOptions).pipe(
            catchError(this.handleError<User>('authUser'))
        );
    }

     /* POST: Check the username */
     checkUsername(data: object): Observable<boolean> {
        const url = `${this.serverURL}checkuser`;
        return this.http.post<boolean>(url, data, httpOptions).pipe(
            catchError(this.handleError<boolean>('authUser'))
        );
    }

    requestRide(payload: any): Observable<User> {
        const url = `${this.RserverURL}request`;
        return this.http.post<User>(url, payload, httpOptions).pipe(
            catchError(this.handleError<User>('requesttest'))
        );
    }

    acceptRide(payload: any): Observable<any> {
        const url = `${this.RserverURL}accept`;
        return this.http.post<User>(url, payload, httpOptions).pipe(
            catchError(this.handleError<User>('requesttest'))
        );
    }

    // /* UPDATE: update driver on the server */
    // updateDriver(driver: User): Observable<Driver> {
    //     const url = `${this.serverURL}update`;
    //     return this.http.post<Driver>(url, driver, httpOptions).pipe(
    //         catchError(this.handleError<Driver>('updateDriver'))
    //     );
    // }

    // /* DELETE: delete the driver from the server */
    // deleteDriver(driver: Driver): Observable<number> {
    //     const id = driver.ID;
    //     const url = `${this.serverURL}delete?id=${id}`;

    //     this.http.get<Driver>(url, httpOptions).subscribe();

    //     return of(driver.ID);
    // }

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
