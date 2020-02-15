import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import { Action, Dispatch } from "redux";
import { getUserByID } from "../store/actions/userActions";
import { addPlaylist } from "../store/actions/playlistActions";
import { AppState } from "../store/store";
import { connect } from "react-redux";
import '../style/nav.css'

interface Props {
    currentUser: any;
    fetchUser: (ID: string) => void;
}

interface State {
    redirect: boolean
}

class NavComponent extends Component<Props, State>{
    componentDidMount() {
        const cookies = new Cookies();
        let id = cookies.get('logedIn');
        this.props.fetchUser(id);

    }

    // renderRedirect() {
    //     if (this.state.redirect) {
    //         return <Redirect to='/' />
    //         //{this.renderRedirect()}
    //     }
    // }

    render() {
        return (
            <div className="container">
                <div className="title">

                    <Link to="/" style={{ textDecoration: 'none', color: 'white' }}><h1>Reduxed player</h1></Link>
                    {this.renderName()}
                    <div className="options">
                        <h6><Link to="/friends" style={{ cursor: 'pointer', color: 'white' }}>Friends</Link></h6>
                        <h6 onClick={this.logout.bind(this)}><Link to="/login" style={{ cursor: 'pointer', color: 'white' }}>Log out</Link></h6>
                    </div>
                </div>
            </div>
        );
    }

    renderName() {
        if (this.props.currentUser.user !== undefined) {
            return (<h3>Welcome {this.props.currentUser.user.Username}</h3>);
        }
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
        currentUser: state.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavComponent);