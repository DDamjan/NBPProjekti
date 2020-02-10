/* eslint-disable no-unused-expressions */
import { User } from "../../models/user";
import { Action } from "redux";
import { REGISTER_USER_SUCCESS, AUTH_USER_SUCCESS, GET_USER_BY_ID_SUCCESS, REGISTER_USER_FAIL, ADD_PLAYLIST_SUCCESS, DELETE_PLAYLIST_SUCCESS } from "../actions/types";
import { AuthUserSuccess, RegisterUserSuccess, GetUserByIDSuccess, RegisterUserFail } from "../actions/userActions";
import { AddPlaylistSuccess, DeletePlaylistSuccess } from "../actions/playlistActions";
import { Playlist } from "../../models/playlist";

export interface userState {
  user?: User;
  error?: string;
}

const initialState: userState = {
  user: undefined,
  error: ""
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
        user: {...state.user, playlists:[...state.user.playlists, playlist] }
      };
    }
    case DELETE_PLAYLIST_SUCCESS: {
      const { ID } = action as DeletePlaylistSuccess;
      return {
        ...state,
        user: {...state.user, playlists: state.user.playlists.filter((playlist: Playlist)=> playlist.ID != ID) }
      };
    }
    case REGISTER_USER_SUCCESS: {
      const { user } = action as RegisterUserSuccess;
      console.log(action);
      return {
        ...state,
        user: user
      }
    }
    case REGISTER_USER_FAIL: {
      const { error } = action as RegisterUserFail;
      console.log(action);
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
    default: return state;
  }
}