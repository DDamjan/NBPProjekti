import * as fromDriver from './driver.reducer';
import * as fromUser from './user.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface State {
    drivers: fromDriver.DriverState;
    user: fromUser.UserState;
}

export const reducers: ActionReducerMap<State> = {
    drivers: fromDriver.DriverReducer,
    user: fromUser.UserReducer
};
