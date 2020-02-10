import {
    AUTH_USER_SUCCESS,
    GET_USER_SUCCESS
} from 'src/constants/reducers-constants';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector} from '@ngrx/store';
import { Ride } from 'src/app/models/Ride';

export interface RideState extends EntityState<Ride> {
}

const RideAdapter = createEntityAdapter<Ride>({
    selectId: (ride: Ride) => ride.id
});

const RideInitialState: RideState = RideAdapter.getInitialState({
});

export function RideReducer(
    state: RideState = RideInitialState,
    action
) {
    console.log(action.type);
    switch (action.type) {
        case AUTH_USER_SUCCESS: {
            console.log(action.payload);
            return RideAdapter.addOne(action.payload.ride, state = RideInitialState);
        }
        case GET_USER_SUCCESS: {
            return RideAdapter.addOne(action.payload.ride, state = RideInitialState);
        }
        default:
            return state;
    }
}

export const selectRideState = createFeatureSelector<RideState>('ride');

export const { selectAll: selectAllRides, selectIds } = RideAdapter.getSelectors(
    selectRideState
);

// export const getSelectedUser = createSelector(
//     selectUserState,
//     (state, props) => {
//         return state.entities[props.id];
//     }
// );
