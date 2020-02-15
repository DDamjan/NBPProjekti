/* eslint-disable no-unused-expressions */

import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import PlaylistComponent from "./PlaylistComponent";
import { Dispatch, Action } from "redux";
import { AppState } from "../store/store";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { getUserByID } from "../store/actions/userActions";
import '../style/home.css';
import { addPlaylist } from "../store/actions/playlistActions";
import { Grid } from "@material-ui/core";
import NavComponent from "./NavComponent";
import { User } from "../models/user";

interface Props {
    currentUser: any;
    fetchFriend: (ID: string) => void;
    fetchUser: (ID: string) => void;
    addPlaylist: (payload: any) => void;
    playlists: any;
    match: any;
    friend: User;
}

interface State {
}

class FriendPlaylistComponent extends Component<Props, any>{

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.currentUser != undefined) {
            const cookies = new Cookies();
            let id = cookies.get('logedIn');
            console.log("id");
            console.log(id);
            this.props.fetchUser(id);
        }
        const { id } = this.props.match.params;
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
                        <h3>{this.props.friend.Username}'s playlists</h3>
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
        if (this.props.currentUser.user !== undefined) return (<h3>Welcome {this.props.currentUser.user.Username}</h3>);
    }

    renderCards() {
        if (this.props.currentUser.user !== undefined && this.props.playlists.playlists) {
            console.log(this.props.playlists);
            return this.props.playlists.playlists.map(playlist => {
                return (<PlaylistComponent playList={playlist} key={playlist._id} />)
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

    handleSubmit(event: any) {
        event.preventDefault();
        const payload = {
            name: this.state.playlistName,
            ownerID: this.props.currentUser.user._id
        }
        console.log("payload");
        console.log(payload);

        this.props.addPlaylist(payload);
        this.forceUpdate();
    }

    logout() {
        const cookies = new Cookies();
        cookies.remove('logedIn');
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        fetchUser: (ID: string) => dispatch(getUserByID(ID)),
        addPlaylist: (payload: any) => dispatch(addPlaylist(payload))
    }
}

function mapStateToProps(state: AppState) {
    return {
        currentUser: state.user,
        playlists: state.playlists
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPlaylistComponent);