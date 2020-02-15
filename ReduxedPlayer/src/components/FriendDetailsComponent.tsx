/* eslint-disable no-unused-expressions */

import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import PlaylistComponent from "./PlaylistComponent";
import { Dispatch, Action } from "redux";
import { AppState } from "../store/store";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { getUserByID, addFriend } from "../store/actions/userActions";
import '../style/home.css';
import { addPlaylist } from "../store/actions/playlistActions";
import { Grid } from "@material-ui/core";
import NavComponent from "./NavComponent";
import FriendComponent from "./FriendComponent";

interface Props {
    currentUser: any;
    addFriend: (payload: any) => void;
    match: any;
}

interface State {
    friendUsername: string;
}

class FriendDetailsComponent extends Component<Props, any>{

    constructor(props: Props) {
        super(props);
        this.state = {
            friendUsername: "",
            redirect: false
        }
    }

    // componentDidMount() {
    //     const { id } = this.props.match.params;
    //     if (id !== undefined) {
    //         this.props.fetchFriend(id);
    //     }
    // }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    render() {
        return (
            <div className="container">
                <NavComponent></NavComponent>
                <div className="addFriend">
                    <div className="friend-container">
                        <h3>Friends</h3>
                    </div>
                    <div className="form-container">
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                            <Form.Group controlId="friendUsername"  >
                                <Form.Control
                                    type='text'
                                    placeholder="Username"
                                    autoFocus
                                    value={this.state.friendUsername}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Button
                                block
                                disabled={!this.validateForm()}
                                type="submit"
                            >
                                Add Friend
                            </Button>
                        </Form>
                    </div>
                </div>
                <div className="FriendsGrid">
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

    renderCards() {
        if (this.props.currentUser.user !== undefined && this.props.currentUser[0].friends) {
            return this.props.currentUser[0].friends.map(friend => {
                return (<FriendComponent user={friend} key={friend._id} />)
            })
        }
        return null;
    }

    validateForm() {
        return this.state.friendUsername.length > 0;
    }

    handleChange = (event: any) => {
        this.setState({
            friendUsername: event.target.value
        });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        const payload = {
            name: this.state.friendUsername,
            userID: this.props.currentUser.user[0]._id
        }
        console.log("payload");
        console.log(payload);

        this.props.addFriend(payload);
        this.forceUpdate();
    }

    logout() {
        const cookies = new Cookies();
        cookies.remove('logedIn');
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        addFriend: (payload: any) => dispatch(addFriend(payload))
    }
}

function mapStateToProps(state: AppState) {
    return {
        currentUser: state.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendDetailsComponent);