import React from 'react';

import { Link } from 'react-router-dom';

import './style.css'


class Navigation extends React.Component {
  render() {
    return (
      <div class="Navigation">
        <ul class="Navigation-list">
          <li class="Nav-item">
            <span>
              <Link to="/my-game">Start new game</Link>
            </span>
          </li>
          <li class="Nav-item">
            <span>
              <Link to="/dashboard">Dashboard</Link>
            </span>
          </li>
        </ul>
      </div>
    )
  }
}

export default Navigation;
