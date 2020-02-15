import { Action } from "redux";
import { REGISTER_USER, REGISTER_USER_SUCCESS, AUTH_USER, AUTH_USER_SUCCESS, GET_USER_BY_ID, GET_USER_BY_ID_SUCCESS, REGISTER_USER_FAIL, REMOVE_FRIEND, REMOVE_FRIEND_SUCCESS, ADD_FRIEND_SUCCESS, ADD_FRIEND } from "./types";
import { User } from "../../models/user";

export interface AuthUser extends Action {
    username: string;
    password: string;
}

export function authUser(username: string, password: string): AuthUser {
    return {
        type: AUTH_USER,
        username,
        password
    };
}

export interface AuthUserSuccess extends Action {
    user: User;
}

export function authUserSuccess(_user: User): AuthUserSuccess {
    return {
        type: AUTH_USER_SUCCESS,
        user: _user
    };
}

export interface RegisterUser extends Action {
    user: any
}

export function registerUser(username: string, password: string, confirmPassword: string): RegisterUser {
    return {
        type: REGISTER_USER,
        user: {
            Username: username,
            Password: password,
            confirmPassword
        }
    };
}

export interface RegisterUserSuccess extends Action {
    user: User;
}

export function registerUserSuccess(_user: User): RegisterUserSuccess {
    return {
        type: REGISTER_USER_SUCCESS,
        user: _user
    };
}

export interface RegisterUserFail extends Action {
    error: string;
}

export function registerUserFail(error: string): RegisterUserFail {
    return {
        type: REGISTER_USER_FAIL,
        error
    };
}

export interface GetUserByID extends Action {
    ID: string;
}

export function getUserByID(ID: string): GetUserByID {
    return {
        type: GET_USER_BY_ID,
        ID
    };
}

export interface GetUserByIDSuccess extends Action {
    user: User;
}

export function getUserByIDSuccess(user: User): GetUserByIDSuccess {
    return {
        type: GET_USER_BY_ID_SUCCESS,
        user
    }
}

export interface RemoveFriend extends Action {
    payload: any;
}

export function removeFriend(payload: any): RemoveFriend {
    return {
        type: REMOVE_FRIEND,
        payload
    }
}

export interface RemoveFriendSuccess extends Action {
    friendID: string;
}

export function removeFriendSuccess(friendID: string): RemoveFriendSuccess {
    return {
        type: REMOVE_FRIEND_SUCCESS,
        friendID
    }
}

export interface AddFriend extends Action {
    payload: any;
}

export function addFriend(payload: any): AddFriend {
    return {
        type: ADD_FRIEND,
        payload
    }
}

export interface AddFriendSuccess extends Action {
    friend: User;
}

export function addFriendSuccess(friend: User): AddFriendSuccess {
    return {
        type: ADD_FRIEND_SUCCESS,
        friend
    }
}

export interface GetFriend extends Action {
    friendID: string;
}

export function getFriend(friendID: string): GetFriend {
    return {
        type: ADD_FRIEND,
        friendID
    }
}