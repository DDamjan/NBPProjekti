import { User } from 'src/app/models/User';
import {
    AUTH_USER_SUCCESS,
    GET_USER_SUCCESS,
} from 'src/constants/reducers-constants';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface UserState extends EntityState<User> {
}

const UserAdapter = createEntityAdapter<User>({
    selectId: (user: User) => user.ID
});

const UserInitialState: UserState = UserAdapter.getInitialState({
});

export function UserReducer(
    state: UserState = UserInitialState,
    action
) {
    console.log(action.type);
    switch (action.type) {
        case AUTH_USER_SUCCESS:
            return UserAdapter.addOne(action.payload, state);
        case GET_USER_SUCCESS:
            return UserAdapter.addAll(action.payload, state);
        default:
            return state;
    }
}

export const selectUserState = createFeatureSelector<UserState>('users');

export const { selectAll: selectAllUsers, selectIds } = UserAdapter.getSelectors(
    selectUserState
);

export const getSelectedUser = createSelector(
    selectUserState,
    (state, props) => {
        return state.entities[props.id];
    }
);
