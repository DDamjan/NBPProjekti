import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { User } from "../models/user";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { AppState } from "../store/store";
import "../style/login.css"
import { authUserSuccess } from "../store/actions/userActions";
import { Dispatch, Action } from "redux";
import { dbAuthUser } from "../service/userService";


interface Props {
    user: User;
    authUser: (user: User) => void;
}

interface State {
    username: string;
    password: string;
    user?: User;
}

class LoginComponent extends Component<Props, any> {

    constructor(props: Props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = (event: any) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        dbAuthUser(this.state.username, this.state.password).then(user => {
            if (user.length === 0) {
                this.setState({
                    password: "",
                    error: "Invalid username or password."
                })
            } else {
                this.props.authUser(user);
                const cookies = new Cookies();
                cookies.set('logedIn', user[0].ID, { path: '/' });

                this.setState({
                    redirect: true
                });
                return;
            }
        });

    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    renderErrorMessage() {
        if (this.state.error != null) {
            return (
                <small className="text-danger">
                    {this.state.error}
                </small>
            )
        }
    }

    render() {
        return (
            <div className="Login-container">
                <div className="Login">
                    {this.renderRedirect()}
                    <span>Reduxed Player</span>
                    <Form onSubmit={this.handleSubmit}>
                        {this.renderErrorMessage()}
                        <Form.Group controlId="username"  >
                            <Form.Control
                                placeholder="username"
                                autoFocus
                                type="text"
                                value={this.state.username}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Control
                                placeholder="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </Form.Group>
                        <Button
                            block
                            disabled={!this.validateForm()}
                            type="submit"
                        >
                            Login
                    </Button>
                    </Form>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        authUser: (user: User) => dispatch(authUserSuccess(user))
    }
}
function mapStateToProps(state: AppState) {
    return {
        user: state.user.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);