import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { User } from "../models/user";
import { connect } from "react-redux";
import { AppState } from "../store/store";
import "../style/register.css"
import { registerUser } from "../store/actions/userActions";
import { Dispatch, Action } from "redux";
import Cookies from "universal-cookie";


interface Props {
    user: User;
    registerUser: (username: string, password: string, passwordConfirm: string) => void;
    error: string;
}

interface State {
    username: string;
    password: string;
    passwordConfirm: string;
    user?: User;
    error?: string;
}

class RegisterComponent extends Component<Props, any> {

    constructor(props: Props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            passwordConfirm: ""
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
        this.props.registerUser(this.state.username, this.state.password, this.state.passwordConfirm);
        debugger;
        if (this.loggedIn()) {
            this.setState({
                redirect: true
            });
            return;
        }
    }

    loggedIn(){
        const cookies = new Cookies();
        let cookie = cookies.get('logedIn');
        return cookie != null;
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    renderErrorMessage() {
        if (this.props.error != null) {
            return (
                <small className="text-danger">
                    {this.props.error}
                </small>
            )
        }
    }

    render() {
        return (
            <div className="Register-container">
                <div className="Register">
                    {this.renderRedirect()}
                    <span>Create account</span>
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
                        <Form.Group controlId="passwordConfirm">
                            <Form.Control
                                placeholder="confirm password"
                                value={this.state.passwordConfirm}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </Form.Group>
                        <Button
                            block
                            disabled={!this.validateForm()}
                            type="submit"
                        >
                            Register
                    </Button>
                    </Form>
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        registerUser: (username: string, password: string, passwordConfirm: string) => dispatch(registerUser(username, password, passwordConfirm))
    }
}
function mapStateToProps(state: AppState) {
    return {
        user: state.user.user,
        error: state.user.error
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);