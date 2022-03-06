import React, {useRef, useEffect, useState } from 'react';
import './App.css';
import { GameController } from './Controllers/GameController';
import setupGame from './Controllers/setupGame';
import cincocentavos from "./images/dinheiro/cincocentavos.png";
import dezcentavos from "./images/dinheiro/dezcentavos.png";
import vintecincocentavos from "./images/dinheiro/vintecincocentavos.png";
import cinquentacentavos from "./images/dinheiro/cinquentacentavos.png";
import umreal from "./images/dinheiro/umreal.png";
import doisreais from "./images/dinheiro/doisreais.png";
import cincoreais from "./images/dinheiro/cincoreais.png";
import dezreais from "./images/dinheiro/dezreais.png";
import vintereais from "./images/dinheiro/vintereais.png";
import cinquentareais from "./images/dinheiro/cinquentareais.png";
import { Image } from './Models/types';

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ref5Centavos = useRef<HTMLImageElement>(null);
  const ref10Centavos = useRef<HTMLImageElement>(null);
  const ref25Centavos = useRef<HTMLImageElement>(null);
  const ref50Centavos = useRef<HTMLImageElement>(null);
  const ref1Real = useRef<HTMLImageElement>(null);
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
      '0.05': new Image(ref5Centavos.current, 486, 485),
      '0.10': new Image(ref10Centavos.current, 547, 456 ),
      '0.25': new Image(ref25Centavos.current, 878, 878),
      '0.50': new Image(ref50Centavos.current, 536, 536),
      '1.00': new Image(ref1Real.current, 1000, 1000),
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
        <img ref={ref5Centavos} id="cincocentavos" src={cincocentavos} alt="" />
        <img ref={ref10Centavos} id="dezcentavos" src={dezcentavos} alt="" />
        <img ref={ref25Centavos} id="vintecincocentavos" src={vintecincocentavos} alt="" />
        <img ref={ref50Centavos} id="cinquentacentavos" src={cinquentacentavos} alt="" />
        <img ref={ref1Real} id="umreal" src={umreal} alt="" />
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
