import React from 'react';
import Board from 'components/Board';

class MyGame extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <h1>Start game</h1>
        <Board />
      </div>
    );
  }
}

export default MyGame;
