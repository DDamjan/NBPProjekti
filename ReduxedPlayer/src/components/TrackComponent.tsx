import React, { Component } from "react";
import { Playlist } from "../models/playlist";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Track } from "../models/Track";

interface Props {
    track: Track;
}

interface State {
}

class TrackComponent extends Component<Props, State>{

    render() {
        return (
            <Card>
                <Card.Body>
                    <Card.Img variant="top" src={this.props.track.AlbumCover} />
                    <Card.Title>
                        {this.props.track.Title} - {this.props.track.Artist}
                        <Link to={"/track/" + this.props.track.ID}><i className="fas fa-play-circle"></i></Link>
                        <a onClick={this.deleteTrack}><i className="fas fa-trash-alt"></i></a>
                    </Card.Title>
                    <Card.Text>
                        {this.props.track.Album}
                        Duration: {this.props.track.Duration}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    deleteTrack() {

    }
}

export default TrackComponent;