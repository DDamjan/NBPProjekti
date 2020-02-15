import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Button } from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import { Playlist } from '../models/playlist';
import { User } from '../models/user';
import { AppState } from '../store/store';
import { Dispatch, Action } from "redux";
import { connect } from "react-redux";
import { deletePlaylist } from '../store/actions/playlistActions';
import { Link } from 'react-router-dom';
import { removeFriend } from '../store/actions/userActions';

interface Props {
    friend: User;
    removeFriend: (payload: any) => void;
    currentUser: User;
}

interface State {
}

class FriendComponent extends Component<Props, State>{

    render() {
        console.log(this.props.friend);
        return (
            <div className="card-outline">
                <Card>
                    <CardContent>
                        <Typography variant="body2" component="p">
                            {this.props.friend.Username}
                            <br />
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link to={"/friends/" + this.props.friend._id} >
                            <Button variant="light">Open</Button>
                        </Link>
                        <Button variant="light" onClick={this.handleDelete.bind(this)}>Delete</Button>
                    </CardActions>
                </Card>
            </div>
        );
    }

    handleDelete() {
        const payload = {
            friendID: this.props.friend._id,
            userID: this.props.currentUser._id
        };
        this.props.removeFriend(payload);
    }

}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        removeFriend: (payload: any) => dispatch(removeFriend(payload))
    }
}
function mapStateToProps(state: AppState) {
    return {
        currentUser: state.user.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendComponent);