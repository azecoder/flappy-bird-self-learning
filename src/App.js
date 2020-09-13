import React, { Component } from 'react';
import './App.css';

import Game from './components/game'

class App extends Component {

  render() {
    return (
      <div className="Game">
        <h1>FlappyBird - Self Learning</h1>
        <Game/>
      </div>
    );
  }

}

export default App;
