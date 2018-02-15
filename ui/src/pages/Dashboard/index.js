import React from 'react';
import io from 'socket.io-client';
import Board from 'components/Board';

import './styles.css';

class Dashboard extends React.Component {
  state = {
    socket: io.connect('http://localhost:3001'),
    games: {}
  };

  setupSocket = socket => {
    socket.on('connected', () => {
      console.log('connected successfully');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('userDisconnected', data => {
      this.setState(prevState => {
        delete prevState.games[data.socketId];
        return prevState;
      });
    });

    socket.on('newGameStarted', data => {
      console.log('new game started');
      const {socketId, value} = data;

      this.setState(prevState => {
        prevState.games[socketId] = value.data.values;
        return prevState;
      }, this.forceUpdate);
    });
    socket.on('updateValues', data => {
      console.log('other game values are being updated');
      const {socketId, value} = data;

      this.setState(prevState => {
        prevState.games[socketId] = value.data.values;
        return prevState;
      }, this.forceUpdate);
    });
  };

  componentDidMount() {
    this.setupSocket(this.state.socket);
  }

  render() {
    const {games} = this.state;
    const otherBoards = Object.keys(games).map(key => (
      <div className="board-section">
        <h2 className="socket-id-header">Game for SocketID = "{key}"</h2>
        <Board
          enablePlaying={false}
          updateValues={() => null}
          values={games[key]}
        />
      </div>
    ));

    return (
      <div>
        <h1 class="dashboard-header">Currently playing users</h1>
      <div className="dashboard-section">
        {otherBoards}
      </div>
      </div>
    );
  }
}

export default Dashboard;
