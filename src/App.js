import React, { useState } from 'react';
import { SCREEN } from './components/constants';
import './App.css';

import Game from './components/game'

function App() {

  const [screen, setScreen] = useState(SCREEN.GAME)

  return (
    <div className="App">
      {screen === SCREEN.GAME ? (
        <Game setScreen={setScreen}/>
      ) : (
        <h2>Game Over...</h2>
      )}
    </div>
  );
}

export default App;
