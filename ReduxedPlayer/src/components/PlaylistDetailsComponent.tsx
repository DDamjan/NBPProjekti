/* eslint-disable no-unused-expressions */

import React, { Component } from "react";
import { Playlist } from "../models/playlist";
import { Link, Redirect } from "react-router-dom";
import TrackComponent from "./TrackComponent";
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
    currentPlaylist: Playlist;
    currentUser: User;
    match: any;
    fetchPlaylist: (ID: string) => void;
    addTrack: (track: string, playlistID: string, userID: string) => void;
}

interface State {
    trackName: string;
    redirect: boolean
}


class PlaylistDetailsComponent extends Component<Props, any>{

    constructor(props: Props) {
        super(props);
        this.state = {
            trackName: "",
            redirect: false
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if (id !== undefined) {
            this.props.fetchPlaylist(id);
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
                    <div className="form-container">
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                            <Form.Group controlId="playlistName"  >
                                <Form.Control
                                    type='text'
                                    placeholder="Track name"
                                    autoFocus
                                    value={this.state.trackName}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Button
                                block
                                disabled={!this.validateForm()}
                                type="submit"
                            >
                                Add track
                            </Button>
                        </Form>
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

    handleSubmit(event: any) {
        event.preventDefault();
        this.props.addTrack(this.state.trackName, this.props.currentPlaylist._id, this.props.currentUser._id);
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
        if (this.props.currentPlaylist.Tracks != undefined) {
            return this.props.currentPlaylist.Tracks.map(track => {
                return (<TrackDetailsComponent track={track} key={track._id} />)
            })
        }
        return null;
    }

    renderPlayListName() {
        if (this.props.currentPlaylist !== undefined) {
            return (<h3>{this.props.currentPlaylist.Name}</h3>);
        }
        

    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        fetchPlaylist: (ID: string) => dispatch(currentPlaylist(ID)),
        addTrack: (payload: string, playlistID: string, userID: string) => dispatch(findTrack(payload, playlistID, userID))
    }
}
function mapStateToProps(state: AppState) {
    return {
        currentPlaylist: state.playlists.currentPlaylist,
        currentUser: state.user.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDetailsComponent);