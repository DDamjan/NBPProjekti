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

interface Props {
    user: User;
    removeFriend: (id: string) => void;
}

interface State {
}

class FriendComponent extends Component<Props, State>{

    render() {
        return (
            <div className="card-outline">
                <Card>  
                    <CardContent>
                        <Typography variant="body2" component="p">
                            {this.props.user.Username}
                            <br />
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link to={"/user/" + this.props.user._id} >
                            <Button variant="light">Open</Button>
                        </Link>
                        <Button variant="light" onClick={this.handleDelete.bind(this)}>Delete</Button>
                    </CardActions>
                </Card>
            </div>
        );
    }

    handleDelete() {
        this.props.removeFriend(this.props.user._id);
    }

}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        removeFriend: (id: string) => dispatch(deletePlaylist(id))
    }
}
function mapStateToProps(state: AppState) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendComponent);