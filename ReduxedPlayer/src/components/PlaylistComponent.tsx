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
    playList: Playlist;
    deletePlaylist: (playlistID: number) => void;
}

interface State {
    user: User
}

class PlaylistComponent extends Component<Props, State>{

    render() {
        return (
            <div className="card-outline">
                <Card>  
                    <CardContent>
                        <Typography variant="body2" component="p">
                            {this.props.playList.Name}
                            <br />
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link to={"/playlist/" + this.props.playList.ID} >
                            <Button variant="light">Open</Button>
                        </Link>
                        <Button variant="light" onClick={this.handleDelete.bind(this)}>Delete</Button>
                    </CardActions>
                </Card>
            </div>
        );
    }

    handleDelete() {
        this.props.deletePlaylist(this.props.playList.ID);
    }

}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        deletePlaylist: (playlistID: number) => dispatch(deletePlaylist(playlistID))
    }
}
function mapStateToProps(state: AppState) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistComponent);