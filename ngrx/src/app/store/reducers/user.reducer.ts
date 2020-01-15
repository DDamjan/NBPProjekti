import { User } from 'src/app/models/User';
import {
    AUTH_USER_SUCCESS,
    GET_USER_SUCCESS,
    AUTH_USER_FAIL,
} from 'src/constants/reducers-constants';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Router } from '@angular/router';

export interface UserState extends EntityState<User> {
}

const UserAdapter = createEntityAdapter<User>({
    selectId: (user: User) => user.id
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
            localStorage.setItem('currentUser', action.payload.id);
            localStorage.setItem('currentUserType', action.payload.type);
            UserAdapter.removeAll(state);
            console.log(action.payload);
            return UserAdapter.addOne(action.payload, state);
        case AUTH_USER_FAIL:
            UserAdapter.removeAll(state);
            return UserAdapter.addOne(action.payload, state);
        case GET_USER_SUCCESS:
            return UserAdapter.addAll(action.payload, state);
        default:
            return state;
    }
}

export const selectUserState = createFeatureSelector<UserState>('user');

export const { selectAll: selectAllUsers, selectIds } = UserAdapter.getSelectors(
    selectUserState
);

// export const getSelectedUser = createSelector(
//     selectUserState,
//     (state, props) => {
//         return state.entities[props.id];
//     }
// );
