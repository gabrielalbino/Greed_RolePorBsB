import React, {useRef, useEffect, useState } from 'react';
import './App.css';
import { GameController } from './Controllers/GameController';
import setupGame from './setupGame';

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [gameController, setGameController] = useState<GameController | null>(null);
  const setup = () => {
    const { current: canvasObject } = canvas;
    if (!canvasObject) return;
    setupGame(canvasObject);
    setGameController(new GameController(canvas.current))
  }
  console.log(gameController);

  useEffect(setup, []);
  return (
    <div className="App">
      <canvas ref={canvas}/>
    </div>
  );
}

export default App;
