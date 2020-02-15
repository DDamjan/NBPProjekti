/* eslint-disable no-unused-expressions */
import { User } from "../../models/user";
import { Action } from "redux";
import { REGISTER_USER_SUCCESS, AUTH_USER_SUCCESS, GET_USER_BY_ID_SUCCESS, REGISTER_USER_FAIL, ADD_PLAYLIST_SUCCESS, DELETE_PLAYLIST_SUCCESS, REMOVE_FRIEND_SUCCESS, ADD_FRIEND_SUCCESS, GET_FRIEND } from "../actions/types";
import { AuthUserSuccess, RegisterUserSuccess, GetUserByIDSuccess, RegisterUserFail, RemoveFriendSuccess, AddFriendSuccess, GetFriend } from "../actions/userActions";
import { AddPlaylistSuccess, DeletePlaylistSuccess } from "../actions/playlistActions";
import { Playlist } from "../../models/playlist";

export interface userState {
  user?: User;
  error?: string;
  currentFriend?: User;
}

const initialState: userState = {
  user: undefined,
  error: "",
  currentFriend: undefined
}

export default function (state = initialState, action: Action): userState {
  switch (action.type) {
    case AUTH_USER_SUCCESS: {
      const { user } = action as AuthUserSuccess;
      return {
        ...state,
        user: user
      };
    }
    case ADD_PLAYLIST_SUCCESS: {
      const { playlist } = action as AddPlaylistSuccess;
      return {
        ...state,
        user: {...state.user, Playlists:[...state.user.Playlists, playlist] }
      };
    }
    case DELETE_PLAYLIST_SUCCESS: {
      const { ID } = action as DeletePlaylistSuccess;
      return {
        ...state,
        user: {...state.user, Playlists: state.user.Playlists.filter((playlist: Playlist)=> playlist._id != ID) }
      };
    }
    case REGISTER_USER_SUCCESS: {
      const { user } = action as RegisterUserSuccess;
      return {
        ...state,
        user: user
      }
    }
    case REGISTER_USER_FAIL: {
      const { error } = action as RegisterUserFail;
      return {
        ...state,
        error
      }
    }
    case GET_USER_BY_ID_SUCCESS: {
      const { user } = action as GetUserByIDSuccess;
      return {
        ...state,
        user: user
      }
    }
    case REMOVE_FRIEND_SUCCESS: {
      const { friendID } = action as RemoveFriendSuccess;
      return {
        ...state,
        user: {...state.user, Friends: state.user.Friends.filter((friend: User)=> friend._id != friendID) }
      }
    }
    case ADD_FRIEND_SUCCESS: {
      const { friend } = action as AddFriendSuccess;
      return {
        ...state,
        user: {...state.user, Friends: [...state.user.Friends, friend] }
      }
    }
    case GET_FRIEND: {
      const { friendID } = action as GetFriend;
      return {
        ...state,
        currentFriend: state.user.Friends.find(x => x._id == friendID)
      }
    }
    default: return state;
  }
}