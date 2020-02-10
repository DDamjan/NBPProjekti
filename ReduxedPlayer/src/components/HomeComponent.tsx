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

interface Props {
    currentUser: any;
    fetchUser: (ID: number) => void;
    addPlaylist: (payload: any) => void;
}

interface State {
    playlistName: string;
}

class HomeComponent extends Component<Props, any>{

    constructor(props: Props) {
        super(props);
        this.state = {
            playlistName: "",
            redirect: false
        }
    }

    componentDidMount() {
        const cookies = new Cookies();
        let id = cookies.get('logedIn');

        this.props.fetchUser(id);

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
                        <h3>Playlists</h3>
                    </div>
                    <div className="form-container">
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                            <Form.Group controlId="playlistName"  >
                                <Form.Control
                                    type='text'
                                    placeholder="Playlist name"
                                    autoFocus
                                    value={this.state.playlistName}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Button
                                block
                                disabled={!this.validateForm()}
                                type="submit"
                            >
                                Add playlist
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

    renderName() {
        if (this.props.currentUser.user !== undefined) return (<h3>Welcome {this.props.currentUser.user.Username}</h3>);
    }

    renderCards() {
        if (this.props.currentUser.user !== undefined && this.props.currentUser.user.playlists) {
            return this.props.currentUser.user.playlists.map(playlist => {
                return (<PlaylistComponent playList={playlist} key={playlist.ID} />)
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
            ownerID: this.props.currentUser.user.ID
        }

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
        fetchUser: (ID: number) => dispatch(getUserByID(ID)),
        addPlaylist: (payload: any) => dispatch(addPlaylist(payload))
    }
}

function mapStateToProps(state: AppState) {
    return {
        currentUser: state.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);