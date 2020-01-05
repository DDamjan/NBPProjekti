import { Action } from '@ngrx/store';
import {
    ADD_DRIVER,
    DELETE_DRIVER,
    UPDATE_DRIVER,
    ADD_DRIVER_SUCCESS,
    GET_DRIVERS,
    GET_DRIVERS_SUCCESS,
    UPDATE_DRIVER_SUCCESS,
    DELETE_DRIVER_SUCCESS
} from 'src/constants/reducers-constants';
import { Driver } from '../models/driver';

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