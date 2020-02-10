import React, { Component } from "react";
import { Track } from "../models/Track";
import { Card, CardContent, Typography, IconButton, CardMedia } from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import '../style/TrackDetailsStyle.css';
import DeleteIcon from '@material-ui/icons/Delete';
import { Dispatch, Action } from "redux";
import { AppState } from "../store/store";
import { connect } from "react-redux";
import { removeTrack } from "../store/actions/playlistActions";

interface Props {
    track: Track;
    removeTrack: (trackID: number) => void;
}

interface State {
    play: boolean;
    progress: number;
    timerStart: number;
    timerTime: number;
}

class TrackDetailsComponent extends Component<Props, State>{
    timer: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            play: false,
            progress: 0,
            timerStart: 0,
            timerTime: 0
        };
    }
    audio = new Audio(this.props.track.URL);

    startTimer() {
        if (this.state.timerTime === 30000) {
            this.setState({
                timerStart: 0,
                timerTime: 0
            });
        }
        this.setState({
            play: true,
            timerTime: this.state.timerTime,
            timerStart: Date.now() - this.state.timerTime
        });

        this.timer = setInterval(() => {
            this.setState({
                timerTime: Date.now() - this.state.timerStart
            })
        }, 10);
    }

    stopTimer = () => {
        this.setState({ play: false });
        clearInterval(this.timer);
    };

    resetTimer = () => {
        this.setState({
            timerStart: 0,
            timerTime: 0
        });
    };

    togglePlay() {
        this.setState({ play: true }, () => {
            this.audio.play();
            this.startTimer();
            const { timerTime } = this.state;
            console.log(timerTime);

        });
    }
    toggleStop() {
        this.setState({ play: false }, () => {
            this.audio.pause();
            this.stopTimer();
        });
        debugger;
        if (this.state.timerTime >= 30000){
            this.resetTimer();
        }
    }

    render() {
        return (
            <div className="card-outline">
                <Card>
                    <div className="card-container">
                        <CardMedia style={{ width: 151, height: 151 }}
                            image={this.props.track.AlbumCover}
                            title="Album cover"
                        />
                        <div className="card-inner">
                            <CardContent>
                                <Typography component="h5" variant="h5">
                                    {this.props.track.Title}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {this.props.track.Album}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {this.props.track.Artist}
                                </Typography>
                            </CardContent>
                            <div>
                                <IconButton aria-label="play" onClick={this.togglePlay.bind(this)}>
                                    <PlayArrowIcon />
                                </IconButton>
                                <IconButton aria-label="stop" onClick={this.toggleStop.bind(this)}>
                                    <StopIcon />
                                </IconButton>
                                <IconButton aria-label="remove" onClick={this.onDelete.bind(this)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div className="progress-bar">
                        <div className="progress" style={{ flexGrow: this.state.timerTime >= 30000 ? 0 : this.state.timerTime / 30000 }}></div>
                    </div>
                </Card >
            </div >
        )
    }

    onDelete() {
        this.props.removeTrack(this.props.track.ID);
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        removeTrack: (ID: number) => dispatch(removeTrack(ID))
    }
}

export default connect(null, mapDispatchToProps)(TrackDetailsComponent);