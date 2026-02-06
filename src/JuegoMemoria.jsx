import React, { useState, useEffect } from 'react';
import Lobby from './Lobby'; // Import the new Lobby component
import { Trophy, Zap, Timer, RefreshCw } from 'lucide-react';

const NIVELES_DATA = [
    { id: 1, tema: "Alimentación Renal", color: "from-green-500 to-emerald-600", cartas: ['img/nivel1/n1-manzana.png', 'img/nivel1/n1-pera.png', 'img/nivel1/n1-uvas.png', 'img/nivel1/n1-pina.png', 'img/nivel1/n1-fresas.png', 'img/nivel1/n1-pollo.png', 'img/nivel1/n1-pescado.png', 'img/nivel1/n1-zanahoria.png'], consejos: [{ titulo: "Técnica de la Doble Cocción", texto: "Controlar el potasio es clave. Un gran truco es la doble cocción: remoja las verduras y al cocerlas, cambia el agua a mitad. Esto reduce el potasio hasta en un 75%."}] },
    { id: 2, tema: "Control de Líquidos", color: "from-blue-500 to-cyan-600", cartas: ['img/nivel2/n2-gota.png', 'img/nivel2/n2-hielo.png', 'img/nivel2/n2-limon.png', 'img/nivel2/n2-te.png', 'img/nivel2/n2-stop.png', 'img/nivel2/n2-regla.png', 'img/nivel2/n2-balanza.png', 'img/nivel2/n2-labios.png'], consejos: [{ titulo: "Control de la Sed", texto: "Sabemos que controlar la sed es un reto. Un truco es chupar un cubito de hielo con limón. También ayuda usar vasos pequeños y evitar comidas saladas." }] },
    // Add more levels...
];

export default function JuegoMemoria() {
  const [gameStarted, setGameStarted] = useState(false); // New state to control game start
  const [nivelIdx, setNivelIdx] = useState(0);
  const [cartas, setCartas] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [consejoMostrar, setConsejoMostrar] = useState(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [score, setScore] = useState(0);

  const nivelActual = NIVELES_DATA[nivelIdx];

  const resetGame = (levelIndex) => {
    const nivel = NIVELES_DATA[levelIndex];
    const barajaInicial = nivel.cartas.slice(0, 8);
    const baraja = [...barajaInicial, ...barajaInicial].sort(() => Math.random() - 0.5).map((img, i) => ({ id: i, img }));
    setCartas(baraja);
    setSolved([]);
    setFlipped([]);
    setMostrarInfo(false);
    setConsejoMostrar(null);
    setMoves(0);
    setStartTime(Date.now());
    setTimeTaken(0);
    setScore(0);
  };

  useEffect(() => {
    if(gameStarted) {
        resetGame(nivelIdx);
    }
  }, [nivelIdx, gameStarted]);
  
  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const card1 = cartas.find(c => c.id === newFlipped[0]);
      const card2 = cartas.find(c => c.id === newFlipped[1]);
      if (card1.img === card2.img) {
        setSolved(prev => [...prev, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1200);
      }
    }
  };

  useEffect(() => {
    if (gameStarted && cartas.length > 0 && solved.length === cartas.length) {
      const endTime = Date.now();
      const elapsed = Math.round((endTime - startTime) / 1000);
      setTimeTaken(elapsed);
      const calculatedScore = Math.max(10, 1000 - (moves * 20) - (elapsed * 2));
      setScore(calculatedScore);
      const randomTip = nivelActual.consejos[Math.floor(Math.random() * nivelActual.consejos.length)];
      setConsejoMostrar(randomTip);
      setTimeout(() => setMostrarInfo(true), 500);
    }
  }, [solved, cartas, moves, startTime, nivelActual, gameStarted]);

  const handleNextLevel = () => {
    setNivelIdx((prev) => (prev + 1) % NIVELES_DATA.length);
  };

  const startGame = () => {
    setGameStarted(true);
    resetGame(nivelIdx);
  };

  if (!gameStarted) {
    return (
        <div className="min-h-screen p-5 pb-28 flex flex-col justify-center">
            <Lobby onStartGame={startGame} />
        </div>
    );
  }

  return (
    <div className="min-h-screen p-5 pb-28">
      <header className="text-center mb-4 pt-2">
        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${nivelActual.color} text-white text-[10px] font-bold`}>
          Nivel {nivelActual.id} / {NIVELES_DATA.length}
        </div>
        <h2 className="text-2xl font-bold text-slate-100">{nivelActual.tema}</h2>
      </header>

      {!mostrarInfo ? (
        <>
            <div className="flex justify-center items-center gap-6 mb-4 text-sm text-slate-400">
                <div className="flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> <span className="font-bold">{moves}</span> Mov.</div>
            </div>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto aspect-square">
              {cartas.map((carta) => (
                <div key={carta.id} className="perspective">
                    <div
                        onClick={() => handleCardClick(carta.id)}
                        className={`card ${flipped.includes(carta.id) || solved.includes(carta.id) ? 'flipped' : ''}`}
                    >
                        <div className={`card-face card-front rounded-xl bg-gradient-to-br ${nivelActual.color}`}></div>
                        <div className="card-face card-back rounded-xl bg-slate-800 p-1">
                            <img src={carta.img} alt="memoria" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
              ))}
            </div>
        </>
      ) : (
        <div className="max-w-sm mx-auto bg-slate-800 rounded-3xl p-6 text-center animate-in zoom-in-95">
          <Trophy className="mx-auto text-yellow-400" size={48} />
          <h3 className="text-xl font-bold mt-2">¡Nivel Completado!</h3>
          <div className="flex justify-around my-4 bg-slate-900/50 p-3 rounded-xl border-slate-700">
             <div><p className="text-xs text-slate-400">Puntuación</p><p className="font-bold text-lg flex items-center gap-1"><Zap size={16} className="text-yellow-400"/> {score}</p></div>
             <div><p className="text-xs text-slate-400">Movimientos</p><p className="font-bold text-lg">{moves}</p></div>
             <div><p className="text-xs text-slate-400">Tiempo</p><p className="font-bold text-lg flex items-center gap-1"><Timer size={16}/> {timeTaken}s</p></div>
          </div>
          <p className="text-slate-300 text-sm italic mb-6">"{consejoMostrar?.texto}"</p>
          <button onClick={handleNextLevel} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">SIGUIENTE NIVEL</button>
        </div>
      )}
      
      <button onClick={() => resetGame(nivelIdx)} className="mx-auto mt-8 flex items-center gap-2 text-slate-500 text-xs">
        <RefreshCw size={14} /> Reiniciar Nivel
      </button>
       <button onClick={() => setGameStarted(false)} className="mx-auto mt-4 flex items-center gap-2 text-slate-500 text-xs">
        Volver a la sala
      </button>
      <style jsx>{`
        .perspective { perspective: 1000px; }
        .card { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.6s; cursor: pointer; }
        .card.flipped { transform: rotateY(180deg); }
        .card-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; }
        .card-back { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}