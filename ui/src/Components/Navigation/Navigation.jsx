import React from 'react';

import { Link } from 'react-router-dom';

import './style.css'


export default class Navigation extends React.Component {
  render() {
    return (
      <div class="Navigation">
        <ul class="Navigation-list">
          <li class="Nav-item">
            <span>
              <Link to="/play">Start new game</Link>
            </span>
          </li>
          <li class="Nav-item">
            <span>Go to dashboard</span>
          </li>
          <li class="Nav-item">
            <span>History</span>
          </li>
        </ul>
      </div>
    )
  }
}
