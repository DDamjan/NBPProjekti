import { User } from 'src/app/models/User';
import {
    AUTH_USER_SUCCESS,
    GET_USER_SUCCESS,
    AUTH_USER_FAIL,
    REGISTER_USER_SUCCESS
} from 'src/constants/reducers-constants';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector} from '@ngrx/store';

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
        case AUTH_USER_SUCCESS: {
            localStorage.setItem('currentUser', action.payload.id);
            localStorage.setItem('currentUserType', action.payload.type);
            return UserAdapter.addOne(action.payload, state = UserInitialState);
        }
        case AUTH_USER_FAIL: {
            return UserAdapter.addOne(action.payload, state = UserInitialState);
        }
        case GET_USER_SUCCESS: {
            return UserAdapter.addOne(action.payload, state = UserInitialState);
        }
        case REGISTER_USER_SUCCESS: {
            localStorage.setItem('currentUser', action.payload.id);
            localStorage.setItem('currentUserType', action.payload.type);
            return UserAdapter.addOne(action.payload, state = UserInitialState);
        }
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
