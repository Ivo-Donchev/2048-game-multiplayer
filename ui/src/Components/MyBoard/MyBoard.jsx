import React from 'react';

import Board from '../Board';

import './style.css'

export default class MyBoard extends React.Component {
  render() {
    return (
      <div className="MyBoard">
        <Board />
      </div>
    );
  }
}
