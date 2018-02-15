import React from 'react';
import Board from 'components/Board';

import './styles.css';

class MyGame extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <h1 className="main-header">Start game</h1>
        <Board enablePlaying={true} />
      </div>
    );
  }
}

export default MyGame;
