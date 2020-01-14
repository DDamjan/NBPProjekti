import { Action } from '@ngrx/store';
import {
    ADD_DRIVER,
    DELETE_DRIVER,
    UPDATE_DRIVER,
    ADD_DRIVER_SUCCESS,
    GET_DRIVERS,
    GET_DRIVERS_SUCCESS,
    UPDATE_DRIVER_SUCCESS,
    DELETE_DRIVER_SUCCESS,
    GET_USER,
    GET_USER_SUCCESS,
    AUTH_USER,
    AUTH_USER_SUCCESS
} from 'src/constants/reducers-constants';
import { Driver } from '../models/driver';
import { User } from '../models/User';

export class AddDriver implements Action {
    readonly type = ADD_DRIVER;
    constructor(public payload: Driver) { }
}

export class AddDriverSuccess implements Action {
    readonly type = ADD_DRIVER_SUCCESS;
    constructor(public payload: Driver) { }
}

export class GetDrivers implements Action {
    readonly type = GET_DRIVERS;
}

export class GetDriversSuccess implements Action {
    readonly type = GET_DRIVERS_SUCCESS;
    constructor(public payload: Driver[]) { }
}

export class UpdateDriver implements Action {
    readonly type = UPDATE_DRIVER;
    constructor(public payload: Driver) { }
}

export class UpdateDriverSuccess implements Action {
    readonly type = UPDATE_DRIVER_SUCCESS;
    constructor(public payload: Driver) { }
}

export class DeleteDriver implements Action {
    readonly type = DELETE_DRIVER;
    constructor(public payload: Driver) { }
}

export class DeleteDriverSuccess implements Action {
    readonly type = DELETE_DRIVER_SUCCESS;
    constructor(public payload: number) { }
}

export class GetUser implements Action {
    readonly type = GET_USER;
    constructor(public payload: User) { }
}

export class GetUserSuccess implements Action {
    readonly type = GET_USER_SUCCESS;
    constructor(public payload: User) { }
}

export class AuthUser implements Action {
    readonly type = AUTH_USER;
    constructor(public payload: object) { }
}

export class AuthUserSuccess implements Action {
    readonly type = AUTH_USER_SUCCESS;
    constructor(public payload: User) { }
}
