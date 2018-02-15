import React from 'react';
import Board from 'components/Board';
import io from 'socket.io-client';

import './styles.css';

class MyGame extends React.Component {
  state = {
    socket: io.connect('http://localhost:3001'),
    otherGames: {}
  };

  setupSocket = () => {
    console.log(this.state);
    const {socket} = this.state;

    socket.on('connected', () => {
      console.log('connected successfully');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('userDisconnected', data => {
      this.setState(prevState => {
        delete prevState.otherGames[data.socketId];
        return prevState;
      });
    });

    socket.on('newGameStarted', data => {
      console.log('new game started');
      const {socketId, value} = data;

      if (this.state.socket.id !== socketId) {
        this.setState(
          {
            otherGames: {
              [socketId]: value.data.values
            }
          },
          this.forceUpdate
        );
      }
    });
    socket.on('updateValues', data => {
      console.log('other game values are being updated');
      const {socketId, value} = data;

      if (this.state.socket.id !== socketId) {
        this.setState(
          {
            otherGames: {
              [socketId]: value.data.values
            }
          },
          this.forceUpdate
        );
      }
    });
  };

  newGame = values => {
    this.state.socket.emit('newGameStarted', {values});
  };

  updateValues = values => {
    const {socket} = this.state;
    socket.emit('updateValues', {values});
  };

  componentDidMount() {
    this.setupSocket();
  }

  render() {
    const otherBoards = Object.values(this.state.otherGames).map(values => (
      <Board enablePlaying={false} updateValues={() => null} values={values} />
    ));

    return (
      <div>
        <h1 className="main-header">Start game</h1>
        <Board
          enablePlaying={true}
          updateValues={this.updateValues}
          newGame={this.newGame}
        />
        <h1>Other games</h1>
        {otherBoards.map(board => <div>{board}</div>)}
      </div>
    );
  }
}

export default MyGame;
