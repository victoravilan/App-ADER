import React, { useState, useEffect } from 'react';
import Lobby from './Lobby'; // Import the new Lobby component
import { Trophy, Zap, Timer, RefreshCw } from 'lucide-react';

const NIVELES_DATA = [

    { id: 1, tema: "Alimentación Renal", color: "from-green-500 to-emerald-600", cartas: ['/img/nivel1/n1-arroz.png', '/img/nivel1/n1-brocoli.png', '/img/nivel1/n1-fresas.png', '/img/nivel1/n1-manzana.png', '/img/nivel1/n1-pera.png', '/img/nivel1/n1-pescado.png', '/img/nivel1/n1-pina.png', '/img/nivel1/n1-pinadulce.png', '/img/nivel1/n1-pollo.png', '/img/nivel1/n1-uvas.png', '/img/nivel1/n1-zanahoria.png'], consejos: [{ titulo: "Técnica de la Doble Cocción", texto: "Controlar el potasio es clave. Un gran truco es la doble cocción: remoja las verduras y al cocerlas, cambia el agua a mitad. Esto reduce el potasio hasta en un 75%."}] },

    { id: 2, tema: "Control de Líquidos", color: "from-blue-500 to-cyan-600", cartas: ['/img/nivel2/n2-balanza.png', '/img/nivel2/n2-boca.png', '/img/nivel2/n2-calor.png', '/img/nivel2/n2-gota.png', '/img/nivel2/n2-hielo.png', '/img/nivel2/n2-labios.png', '/img/nivel2/n2-limon.png', '/img/nivel2/n2-regla.png', '/img/nivel2/n2-stop.png', '/img/nivel2/n2-te.png', '/img/nivel2/n2-vaso.png'], consejos: [{ titulo: "Control de la Sed", texto: "Sabemos que controlar la sed es un reto. Un truco es chupar un cubito de hielo con limón. También ayuda usar vasos pequeños y evitar comidas saladas." }] },

    { id: 3, tema: "Actividad Física", color: "from-orange-500 to-amber-600", cartas: ['/img/nivel3/n3-arbol.png', '/img/nivel3/n3-baile.png', '/img/nivel3/n3-balon.png', '/img/nivel3/n3-bicicleta.png', '/img/nivel3/n3-caminar.png', '/img/nivel3/n3-limpieza.png', '/img/nivel3/n3-nadar.png', '/img/nivel3/n3-perro.png', '/img/nivel3/n3-yoga.png', '/img/nivel3/n3-zapatillas.png'], consejos: [{ titulo: "Muévete a tu ritmo", texto: "La actividad física es tu aliada. No necesitas correr una maratón. Caminar, nadar o hacer yoga suavemente mejora la circulación y tu estado de ánimo."}] },

    { id: 4, tema: "Prevención y Cuidados", color: "from-red-500 to-rose-600", cartas: ['/img/nivel4/n4-escudo.png', '/img/nivel4/n4-estetoscopio.png', '/img/nivel4/n4-guantes.png', '/img/nivel4/n4-hospital.png', '/img/nivel4/n4-jabon.png', '/img/nivel4/n4-jeringuilla.png', '/img/nivel4/n4-sangre.png', '/img/nivel4/n4-sillon.png', '/img/nivel4/n4-termometro.png', '/img/nivel4/n4-tirita.png'], consejos: [{ titulo: "La importancia de la higiene", texto: "Una buena higiene, especialmente en el acceso vascular, es fundamental para prevenir infecciones. Lávate siempre las manos antes de manipularlo."}] },

    { id: 5, tema: "Bienestar Emocional", color: "from-purple-500 to-violet-600", cartas: ['/img/nivel5/n5-abrazo.png', '/img/nivel5/n5-apreton.png', '/img/nivel5/n5-corazon.png', '/img/nivel5/n5-familia.png', '/img/nivel5/n5-hablar.png', '/img/nivel5/n5-mascota.png', '/img/nivel5/n5-musica.png', '/img/nivel5/n5-pintura.png', '/img/nivel5/n5-regalo.png', '/img/nivel5/n5-zen.png'], consejos: [{ titulo: "Cuida tu mente", texto: "Hablar de tus sentimientos es tan importante como cuidar tu cuerpo. Busca apoyo en familia, amigos o grupos. ¡No estás solo en esto!"}] },

    { id: 6, tema: "Tu Tratamiento", color: "from-yellow-500 to-lime-600", cartas: ['/img/nivel6/n6-agua.png', '/img/nivel6/n6-calendario.png', '/img/nivel6/n6-comida.png', '/img/nivel6/n6-doctor.png', '/img/nivel6/n6-grafica.png', '/img/nivel6/n6-historial.png', '/img/nivel6/n6-inyeccion.png', '/img/nivel6/n6-pastilla.png', '/img/nivel6/n6-reloj.png', '/img/nivel6/n6-rinon.png'], consejos: [{ titulo: "Adherencia al tratamiento", texto: "Tomar tu medicación y seguir las pautas es vital. Usa alarmas o pastilleros para no olvidar nada. Tu constancia es tu mayor fortaleza."}] },

    { id: 7, tema: "Descanso y Rutinas", color: "from-indigo-500 to-blue-600", cartas: ['/img/nivel7/n7-bano.png', '/img/nivel7/n7-buho.png', '/img/nivel7/n7-cama.png', '/img/nivel7/n7-estrella.png', '/img/nivel7/n7-estrellas.png', '/img/nivel7/n7-libro.png', '/img/nivel7/n7-luna.png', '/img/nivel7/n7-nube.png', '/img/nivel7/n7-silencio.png', '/img/nivel7/n7-vela.png', '/img/nivel7/n7-zzz.png'], consejos: [{ titulo: "El poder de un buen descanso", texto: "Dormir bien ayuda a tu cuerpo a recuperarse y a tu mente a estar despejada. Intenta crear una rutina relajante antes de acostarte."}] },

];



// Seeded random number generator

function mulberry32(a) {

    return function() {

      var t = a += 0x6D2B79F5;

      t = Math.imul(t ^ t >>> 15, t | 1);

      t ^= t + Math.imul(t ^ t >>> 7, t | 61);

      return ((t ^ t >>> 14) >>> 0) / 4294967296;

    }

}



// Seeded shuffle function

function shuffleWithSeed(array, seed) {

    // Use a slice to avoid modifying the original array if it's passed directly

    const a = array.slice();

    const random = seed ? mulberry32(parseInt(seed.substring(seed.length - 8), 10)) : Math.random;

    

    let currentIndex = a.length, randomIndex;

    

    while (currentIndex !== 0) {

        randomIndex = Math.floor(random() * currentIndex);

        currentIndex--;

        [a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]];

    }

    return a;

}





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

  const [gameSeed, setGameSeed] = useState(null);

  const [gridCols, setGridCols] = useState(4);



  const nivelActual = NIVELES_DATA[nivelIdx];



  const resetGame = (levelIndex, seed) => {

    setGameSeed(seed);

    

    const numPairs = 8 + (levelIndex * 4);



    let cardPool = [];

    for (let i = 0; i <= levelIndex; i++) {

        cardPool = [...cardPool, ...NIVELES_DATA[i].cartas];

    }



    const shuffledPool = shuffleWithSeed(cardPool, seed || Date.now().toString());

    const barajaInicial = shuffledPool.slice(0, numPairs);



    const shuffledDeck = shuffleWithSeed([...barajaInicial, ...barajaInicial], seed);

    const baraja = shuffledDeck.map((img, i) => ({ id: i, img }));

    

    const numCartas = baraja.length;

    if (numCartas <= 16) setGridCols(4);

    else if (numCartas <= 24) setGridCols(4);

    else if (numCartas <= 32) setGridCols(4);

    else if (numCartas <= 40) setGridCols(5);

    else if (numCartas <= 48) setGridCols(6);

    else if (numCartas <= 56) setGridCols(7);

    else setGridCols(8);





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

        resetGame(nivelIdx, gameSeed);

    }

  }, [nivelIdx]); // Removed gameStarted from dependency array to prevent re-shuffle on lobby exit

  

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

    if (nivelIdx < NIVELES_DATA.length - 1) {

        setNivelIdx((prev) => prev + 1);

        setGameSeed(null); 

        resetGame((nivelIdx + 1) % NIVELES_DATA.length, null);

    } else {

        // Handle game completion, maybe show a final screen or restart from level 1

        setNivelIdx(0);

        setGameStarted(false); // Go back to lobby

    }

  };



  const startGame = (seed = null) => {

    setGameStarted(true);

    resetGame(nivelIdx, seed);

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

        {gameSeed && <p className="text-xs text-slate-500 font-mono mt-1">ID de partida: {gameSeed}</p>}

      </header>



      {!mostrarInfo ? (

        <>

            <div className="flex justify-center items-center gap-6 mb-4 text-sm text-slate-400">

                <div className="flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> <span className="font-bold">{moves}</span> Mov.</div>

            </div>

            <div 

                className="grid gap-3 max-w-md mx-auto aspect-square"

                style={{gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`}}

            >

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

          <button onClick={handleNextLevel} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">

            {nivelIdx < NIVELES_DATA.length - 1 ? 'SIGUIENTE NIVEL' : 'FINALIZAR JUEGO'}

          </button>

        </div>

      )}

      

      <button onClick={() => resetGame(nivelIdx, gameSeed)} className="mx-auto mt-8 flex items-center gap-2 text-slate-500 text-xs">

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
