import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import MyGame from './pages/MyGame'
import Dashboard from './pages/Dashboard';


ReactDOM.render((
  <BrowserRouter>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/my-game" component={MyGame}/>
      <Route path="/dashboard" component={Dashboard}/>
    </div>
  </BrowserRouter>
  ), document.getElementById('root'));
registerServiceWorker();
