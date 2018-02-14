import React from 'react';
import Board from 'Components/Board';

class MyPage extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <span>MyPage component's content </span>
        <Board />
      </div>
    );
  }
}

export default MyPage;
