import * as fromDriver from './driver.reducer';
import * as fromUser from './user.reducer';
import * as fromRide from './ride.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface State {
    drivers: fromDriver.DriverState;
    user: fromUser.UserState;
    ride: fromRide.RideState;
}

export const reducers: ActionReducerMap<State> = {
    drivers: fromDriver.DriverReducer,
    user: fromUser.UserReducer,
    ride: fromRide.RideReducer
};

