import React, {useRef, useEffect, useState } from 'react';
import './App.css';
import { GameController } from './Controllers/GameController';
import setupGame from './Controllers/setupGame';
import doisreais from "./images/notas/doisreais.png";
import cincoreais from "./images/notas/cincoreais.png";
import dezreais from "./images/notas/dezreais.png";
import vintereais from "./images/notas/vintereais.png";
import cinquentareais from "./images/notas/cinquentareais.png";
import { Image } from './Models/types';

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ref2Reais = useRef<HTMLImageElement>(null);
  const ref5Reais = useRef<HTMLImageElement>(null);
  const ref10Reais = useRef<HTMLImageElement>(null);
  const ref20Reais = useRef<HTMLImageElement>(null);
  const ref50Reais = useRef<HTMLImageElement>(null);
  const [gameController, setGameController] = useState<GameController | null>(null);
  const setup = () => {
    const { current: canvasObject } = canvas;
    if (!canvasObject) return;
    setupGame(canvasObject);
    const moneyImagesObject = {
      '0.05': new Image(document.createElement("image") as HTMLImageElement, 0, 0),
      '0.10': new Image(document.createElement("image") as HTMLImageElement, 0, 0),
      '0.25': new Image(document.createElement("image") as HTMLImageElement, 0, 0),
      '0.50': new Image(document.createElement("image") as HTMLImageElement, 0, 0),
      '1.00': new Image(document.createElement("image") as HTMLImageElement, 0, 0),
      '2.00': new Image(ref2Reais.current, 342, 183),
      '5.00': new Image(ref5Reais.current, 358, 182),
      '10.00': new Image(ref10Reais.current, 378, 182),
      '20.00': new Image(ref20Reais.current, 398, 184),
      '50.00': new Image(ref50Reais.current, 422, 193)
    }
    setGameController(new GameController(canvas.current, moneyImagesObject))
  }
  console.log(gameController);

  useEffect(setup, []);
  return (
    <>
      <div className="aux">
        <img ref={ref2Reais} id="doisreais" src={doisreais} alt="" />
        <img ref={ref5Reais} id="cincoreais" src={cincoreais} alt="" />
        <img ref={ref10Reais} id="dezreais" src={dezreais} alt="" />
        <img ref={ref20Reais} id="vintereais" src={vintereais} alt="" />
        <img ref={ref50Reais} id="cinquentareais" src={cinquentareais} alt="" />
      </div>
      <div className="App">
        <canvas ref={canvas}/>
      </div>
    </>
  );
}

export default App;
