import React, { Component } from 'react';

import logo from './logo.png';
import './App.css';

import Navigation from 'components/Navigation'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div clasName="Logo-image-box">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <h1 className="App-title">2048 multiplayer</h1>
        </header>
        <div className='Content'>
          <Navigation/>
        </div>
      </div>
    );
  }
}

export default App;
