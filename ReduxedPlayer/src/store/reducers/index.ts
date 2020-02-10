import { combineReducers } from 'redux';
import userReducer from './userReducer';
import playlistReducer from './playlistReducer';

export default combineReducers({
    user: userReducer,
    playlists: playlistReducer
});