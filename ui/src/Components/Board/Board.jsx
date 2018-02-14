import React from 'react';
import _ from 'lodash'

import './style.css'


export default class Board extends React.Component {
  render() {
    return (
      <div className="Board">
        {_.range(16).map(el => <div className="Cell"></div>)}
      </div>
    );
  }
}
