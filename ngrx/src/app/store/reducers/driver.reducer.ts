import { Driver } from 'src/app/models/Driver';
import {
    ADD_DRIVER_SUCCESS,
    GET_DRIVERS_SUCCESS,
    UPDATE_DRIVER_SUCCESS,
    DELETE_DRIVER_SUCCESS,
} from 'src/constants/reducers-constants';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface DriverState extends EntityState<Driver> {
    selectedDriverId: number | null;
}

const DriverAdapter = createEntityAdapter<Driver>({
    selectId: (driver: Driver) => driver.ID
});

const driverInitialState: DriverState = DriverAdapter.getInitialState({
    selectedDriverId: null
});

export function DriverReducer(
    state: DriverState = driverInitialState,
    action
) {
    console.log(action.type);
    switch (action.type) {
        case ADD_DRIVER_SUCCESS:
            return DriverAdapter.addOne(action.payload, state);
        case GET_DRIVERS_SUCCESS:
            return DriverAdapter.addAll(action.payload, state);
        case UPDATE_DRIVER_SUCCESS:
            return DriverAdapter.updateOne(action.payload, state);
        case DELETE_DRIVER_SUCCESS:
            return DriverAdapter.removeOne(action.payload, state);
        default:
            return state;
    }
}

export const selectDriverState = createFeatureSelector<DriverState>('drivers');

export const { selectAll: selectAllDrivers, selectIds } = DriverAdapter.getSelectors(
    selectDriverState
);

export const getSelectedDriver = createSelector(
    selectDriverState,
    (state, props) => {
        return state.entities[props.id];
    }
);
