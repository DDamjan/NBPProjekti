/* eslint-disable no-unused-expressions */

import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import PlaylistComponent from "./PlaylistComponent";
import { Dispatch, Action } from "redux";
import { AppState } from "../store/store";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { getUserByID, getFriend } from "../store/actions/userActions";
import '../style/home.css';
import { addPlaylist } from "../store/actions/playlistActions";
import { Grid } from "@material-ui/core";
import NavComponent from "./NavComponent";
import { User } from "../models/user";
import { Playlist } from "../models/playlist";
import FriendPlaylistComponent from "./FriendPlaylistComponent";

interface Props {
    currentUser: any;
    fetchFriend: (ID: string) => void;
    match: any;
    friend: User;
}

interface State {
}

class FriendHomeComponent extends Component<Props, any>{

    constructor(props: Props) {
        super(props);

    }

    componentDidMount() {
        const { id } = this.props.match.params;
        console.log("COMPONENT");
        if (id !== undefined) {
            this.props.fetchFriend(id);
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
                        <h3>{this.renderName()}</h3>
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

    renderName() {
        if (this.props.friend !== undefined) return (<h3>{this.props.friend.Username}'s playlists</h3>);
    }

    renderCards() {
        console.log("Friend");
        
        if (this.props.friend !== undefined && this.props.friend.Playlists) {
            return this.props.friend.Playlists.map(playlist => {
                return (<FriendPlaylistComponent playList={playlist} key={playlist._id} />)
            })
        }
        return null;
    }

    validateForm() {
        return this.state.playlistName.length > 0;
    }

    handleChange = (event: any) => {
        this.setState({
            playlistName: event.target.value
        });
    }

    logout() {
        const cookies = new Cookies();
        cookies.remove('logedIn');
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        fetchFriend: (ID: string) => dispatch(getFriend(ID))
    }
}

function mapStateToProps(state: AppState) {
    console.log("current friend");
    console.log(state.user.currentFriend);
    return {
        currentUser: state.user,
        friend: state.user.currentFriend
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendHomeComponent);