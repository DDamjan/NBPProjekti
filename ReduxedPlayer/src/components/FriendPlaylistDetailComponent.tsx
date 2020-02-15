/* eslint-disable no-unused-expressions */

import React, { Component } from "react";
import { Playlist } from "../models/playlist";
import { Link, Redirect } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { Grid } from "@material-ui/core";
import { Track } from "../models/Track";
import Cookies from "universal-cookie";
import { searchTracks } from "../service/deezerService";
import TrackDetailsComponent from "./TrackDetailsComponent";
import { connect } from "react-redux";
import { Dispatch, Action } from "redux";
import { addTrack, currentPlaylist, findTrack } from "../store/actions/playlistActions";
import { AppState } from "../store/store";
import '../style/home.css';
import NavComponent from "./NavComponent";
import { User } from "../models/user";

interface Props {
    currentFriend: User;
    currentUser: User;
    currentPlaylist: Playlist;
    match: any;
    fetchFriendPlaylist: (ID: string) => void;
}

interface State {
    trackName: string;
    redirect: boolean
}


class FriendPlaylistDetailComponent extends Component<Props, any>{

    constructor(props: Props) {
        super(props);
        this.state = {
            trackName: "",
            redirect: false
        }
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    render() {
        return (
            <div className="container">
                <NavComponent></NavComponent>
                <div className="addPlaylist">
                    <div className="playlist-container">
                        {this.renderPlayListName()}
                    </div>
                </div>
                <div className="PlaylistGrid">
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        {this.renderCards()}
                    </Grid>

                </div>
            </div>
        )
    }

    logout() {
        const cookies = new Cookies();
        cookies.remove('logedIn');
    }

    handleChange = (event: any) => {
        this.setState({
            trackName: event.target.value
        });
    }

    validateForm() {
        return this.state.trackName.length > 0;
    }

    renderCards() {
        const { id } = this.props.match.params;
        const currentPlaylist = this.props.currentFriend.Playlists.find(x => x._id == id);
        if (currentPlaylist != undefined) {
            return currentPlaylist.Tracks.map(track => {
                return (<TrackDetailsComponent track={track} key={track._id} />)
            })
        }
        return null;
    }

    renderPlayListName() {
        const { id } = this.props.match.params;
        const currentPlaylist = this.props.currentFriend.Playlists.find(x => x._id == id);
        if (currentPlaylist !== undefined) {
            return (<h3>{currentPlaylist.Name}</h3>);
        }
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        fetchFriendPlaylist: (ID: string) => dispatch(currentPlaylist(ID))
    }
}
function mapStateToProps(state: AppState) {
    return {
        currentFriend: state.user.currentFriend,
        currentUser: state.user.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPlaylistDetailComponent);