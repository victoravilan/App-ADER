import React, { useState, useEffect } from 'react';
import { Trophy, BookOpen, Volume2, ArrowRight, RefreshCw, Heart } from 'lucide-react';

const NIVELES_DATA = [
  {
    id: 1,
    tema: "Alimentación Renal",
    color: "from-green-500 to-emerald-600",
    cartas: [
      '/img/nivel1/n1-manzana.png', '/img/nivel1/n1-pera.png', '/img/nivel1/n1-uvas.png', 
      '/img/nivel1/n1-pina.png', '/img/nivel1/n1-fresas.png', '/img/nivel1/n1-pollo.png', 
      '/img/nivel1/n1-pescado.png', '/img/nivel1/n1-zanahoria.png', '/img/nivel1/n1-brocoli.png', '/img/nivel1/n1-arroz.png'
    ],
    consejos: [
      {
        titulo: "Técnica de la Doble Cocción",
        texto: "¡Excelente trabajo! Controlar el potasio es clave para tu corazón. Un gran truco es la doble cocción: remoja las verduras o legumbres durante horas y luego, al cocerlas, cambia el agua a mitad de cocción. Esto reduce el potasio hasta en un 75%. Además, prefiere frutas como la manzana, la pera o las fresas."
      },
      {
        titulo: "Sabor sin Sal",
        texto: "¡Muy bien! Reducir la sal es vital, pero no significa comer sin sabor. Experimenta con hierbas aromáticas, especias, ajo, cebolla o limón. El perejil, el orégano o el pimentón pueden transformar un plato soso en una delicia. Tu presión arterial te lo agradecerá y descubrirás nuevos sabores."
      },
      {
        titulo: "Ojo con las Etiquetas",
        texto: "¡Genial! Al hacer la compra, conviértete en un detective. Lee las etiquetas y evita productos que tengan aditivos con las palabras 'fosfato' o 'potásico'. Muchos alimentos procesados esconden estos minerales. Cuanto más natural sea tu comida, mejor te sentirás."
      },
      {
        titulo: "Frutas en Conserva",
        texto: "¡Sigue así! Si te apetece fruta en almíbar, hay un truco: tira todo el líquido y lava bien la fruta bajo el grifo. Así eliminas gran parte del potasio. Es una buena alternativa ocasional si la fruta fresca te preocupa, pero recuerda siempre consultar tus raciones con tu nutricionista."
      }
    ]
  },
  {
    id: 2,
    tema: "Control de Líquidos",
    color: "from-blue-500 to-cyan-600",
    cartas: [
      '/img/nivel2/n2-gota.png', '/img/nivel2/n2-hielo.png', '/img/nivel2/n2-limon.png', 
      '/img/nivel2/n2-te.png', '/img/nivel2/n2-stop.png', '/img/nivel2/n2-regla.png', 
      '/img/nivel2/n2-balanza.png', '/img/nivel2/n2-labios.png', '/img/nivel2/n2-calor.png', '/img/nivel2/n2-vaso.png'
    ],
    consejos: [
      {
        titulo: "Control de la Sed",
        texto: "¡Qué buena memoria! Sabemos que controlar la sed es un reto. Un truco es chupar un cubito de hielo con limón. También ayuda usar vasos pequeños, evitar comidas saladas que provocan más sed y mantener los labios hidratados con vaselina. Pesarte a diario te ayudará a saber si estás acumulando líquidos."
      },
      {
        titulo: "Engaña a tu Sed",
        texto: "¡Fantástico! Si la sed aprieta, prueba a masticar chicle sin azúcar o chupar caramelos ácidos (si no eres diabético). Esto estimula la saliva y alivia la sequedad sin beber líquido. También puedes enjuagarte la boca con agua muy fría y escupirla. ¡Tú tienes el control!"
      },
      {
        titulo: "Líquidos Ocultos",
        texto: "¡Bien jugado! Recuerda que no solo cuenta lo que bebes. Sopas, guisos, gelatinas, yogures y frutas como la sandía son casi todo agua. Tenlos en cuenta en tu suma diaria. Si comes un plato de cuchara, reduce el agua del vaso. El equilibrio es la clave."
      },
      {
        titulo: "Hielo con Sabor",
        texto: "¡Excelente! Para hacer más llevadera la restricción hídrica, congela trocitos de fruta permitida (como uvas o trozos de piña) o haz cubitos de hielo con unas gotas de limón o menta. Refrescan mucho más y tardan más en deshacerse en la boca que un trago de agua."
      }
    ]
  },
  {
    id: 3,
    tema: "Vida Activa",
    color: "from-orange-500 to-red-600",
    cartas: [
      '/img/nivel3/n3-caminar.png', '/img/nivel3/n3-yoga.png', '/img/nivel3/n3-bicicleta.png', 
      '/img/nivel3/n3-nadar.png', '/img/nivel3/n3-arbol.png', '/img/nivel3/n3-zapatillas.png', 
      '/img/nivel3/n3-balon.png', '/img/nivel3/n3-baile.png', '/img/nivel3/n3-limpieza.png', '/img/nivel3/n3-perro.png'
    ],
    consejos: [
      {
        titulo: "Movimiento es Vida",
        texto: "¡Bravo! Mantenerse activo es un regalo para tu cuerpo y mente. No necesitas correr un maratón; un paseo diario es perfecto. Si tienes una mascota, salir a caminar con tu perro no solo es un ejercicio fantástico, sino que su compañía es un apoyo emocional incalculable. ¡Encuentra lo que te gusta y muévete!"
      },
      {
        titulo: "Fuerza en Casa",
        texto: "¡Eso es! No hace falta ir al gimnasio. Puedes usar botellas de agua pequeñas o bandas elásticas para hacer ejercicios suaves de fuerza en casa mientras ves la tele. Mantener tus músculos fuertes ayuda a tus huesos y te da más independencia en tu día a día."
      },
      {
        titulo: "Sube Escaleras",
        texto: "¡Muy bien! Si puedes, intenta evitar el ascensor de vez en cuando. Subir un par de pisos por las escaleras es un ejercicio cardiovascular excelente. Si te cansas, para y respira. Lo importante es la constancia, no la velocidad. ¡Cada escalón es salud!"
      },
      {
        titulo: "Estiramientos Diarios",
        texto: "¡Genial! Los calambres pueden ser molestos. Una buena rutina de estiramientos suaves al levantarte y antes de ir a dormir puede ayudar a prevenirlos. Estira gemelos y piernas con suavidad. Tu cuerpo se sentirá más ligero y relajado."
      }
    ]
  },
  {
    id: 4,
    tema: "Hemodiálisis y Acceso",
    color: "from-purple-500 to-indigo-600",
    cartas: [
      '/img/nivel4/n4-jeringuilla.png', '/img/nivel4/n4-tirita.png', '/img/nivel4/n4-estetoscopio.png', 
      '/img/nivel4/n4-jabon.png', '/img/nivel4/n4-guantes.png', '/img/nivel4/n4-hospital.png', 
      '/img/nivel4/n4-sillon.png', '/img/nivel4/n4-termometro.png', '/img/nivel4/n4-sangre.png', '/img/nivel4/n4-escudo.png'
    ],
    consejos: [
      {
        titulo: "Protege tu Fístula",
        texto: "¡Lo has logrado! Tu acceso vascular es tu línea de vida. Lávalo con agua y jabón antes de cada sesión y palpa suavemente la vibración (el 'thrill') todos los días para asegurar que funciona bien. Y recuerda siempre: nada de agujas ni tomas de tensión en el brazo del acceso. ¡Es tu tesoro!"
      },
      {
        titulo: "Ropa Cómoda",
        texto: "¡Perfecto! Cuida tu brazo de la fístula evitando mangas muy ajustadas, relojes apretados o cargar bolsas pesadas de la compra con ese lado. La circulación debe fluir libremente. Mima tu brazo, es el puente que te conecta con tu tratamiento."
      },
      {
        titulo: "Señales de Alerta",
        texto: "¡Bien hecho! Conviértete en un experto de tu acceso. Si notas enrojecimiento, calor, dolor o que el 'thrill' (la vibración) ha desaparecido, no esperes. Acude inmediatamente a urgencias o llama a tu unidad. La rapidez es fundamental para salvar tu acceso."
      },
      {
        titulo: "Ejercicios de Mano",
        texto: "¡Excelente! Si tienes una fístula nueva, usar una pelota de goma antiestrés para hacer ejercicios de apretar y soltar ayuda a que la vena se desarrolle y madure mejor. Pregunta a tu enfermera cuándo y cuánto tiempo debes hacerlo. ¡Fortalece tu línea de vida!"
      }
    ]
  },
  {
    id: 5,
    tema: "Bienestar Emocional",
    color: "from-pink-500 to-rose-600",
    cartas: [
      '/img/nivel5/n5-corazon.png', '/img/nivel5/n5-apreton.png', '/img/nivel5/n5-abrazo.png', 
      '/img/nivel5/n5-hablar.png', '/img/nivel5/n5-familia.png', '/img/nivel5/n5-pintura.png', 
      '/img/nivel5/n5-musica.png', '/img/nivel5/n5-mascota.png', '/img/nivel5/n5-zen.png', '/img/nivel5/n5-regalo.png'
    ],
    consejos: [
      {
        titulo: "Red de Apoyo",
        texto: "¡Maravilloso! Cuidar tus emociones es vital. Permítete sentir, pero no te aísles. Hablar con tu familia, amigos o con nosotros en la Fundación ADER puede aliviar una gran carga. A veces, la mejor terapia es una conversación sincera o un abrazo en el momento justo. No estás solo."
      },
      {
        titulo: "Diario de Gratitud",
        texto: "¡Qué bien! A veces la enfermedad ocupa mucho espacio mental. Prueba a escribir cada noche tres cosas buenas que te hayan pasado hoy, por pequeñas que sean: un café rico, una llamada, un rayo de sol. Enfocarte en lo positivo entrena tu cerebro para el bienestar."
      },
      {
        titulo: "Técnicas de Relax",
        texto: "¡Fantástico! El estrés afecta a tu salud. Dedica 5 minutos al día a respirar. Cierra los ojos, inspira profundo por la nariz hinchando la barriga y suelta el aire muy despacio por la boca. Esta pequeña pausa de 'mindfulness' puede resetear tu día y bajarte la ansiedad."
      },
      {
        titulo: "Pide Ayuda",
        texto: "¡Sigue así! Pedir ayuda no es signo de debilidad, sino de inteligencia. Tus seres queridos quieren apoyarte pero a veces no saben cómo. Diles qué necesitas: 'hoy necesito compañía', 'hoy prefiero estar solo un rato' o 'ayúdame con la compra'. La comunicación honesta une."
      }
    ]
  },
  {
    id: 6,
    tema: "Medicación y Control",
    color: "from-yellow-500 to-amber-600",
    cartas: [
      '/img/nivel6/n6-pastilla.png', '/img/nivel6/n6-inyeccion.png', '/img/nivel6/n6-historial.png', 
      '/img/nivel6/n6-reloj.png', '/img/nivel6/n6-calendario.png', '/img/nivel6/n6-grafica.png', 
      '/img/nivel6/n6-doctor.png', '/img/nivel6/n6-agua.png', '/img/nivel6/n6-comida.png', '/img/nivel6/n6-rinon.png'
    ],
    consejos: [
      {
        titulo: "Los Captores de Fósforo",
        texto: "¡Correcto! La medicación es tu aliada. Para no olvidar ninguna toma, usa un pastillero semanal y pon alarmas en tu móvil. Los captores de fósforo, por ejemplo, son más efectivos si los tomas justo al empezar a comer. ¡Tu constancia es tu fuerza!"
      },
      {
        titulo: "No te Automediques",
        texto: "¡Muy bien! Cuidado con los remedios 'naturales' o hierbas. Que sea natural no significa que sea seguro para tus riñones; algunas infusiones pueden interferir con tu medicación o tener potasio. Antes de tomar cualquier suplemento o vitamina, pregunta siempre a tu nefrólogo."
      },
      {
        titulo: "Organización Semanal",
        texto: "¡Genial! Dedica un momento tranquilo, como el domingo por la tarde, para organizar tu pastillero de toda la semana. Así te aseguras de tener todo listo y no dudas si te tomaste la pastilla o no. El orden te da tranquilidad y seguridad en tu tratamiento."
      },
      {
        titulo: "Lista en el Móvil",
        texto: "¡Excelente! Lleva siempre en tu móvil una foto actualizada de tus medicamentos o una lista escrita. Es muy útil si vas a una consulta de otra especialidad o a urgencias. Así los médicos sabrán exactamente qué tomas y evitarán interacciones. ¡Sé un paciente proactivo!"
      }
    ]
  },
  {
    id: 7,
    tema: "Sueño y Descanso",
    color: "from-slate-700 to-slate-900",
    cartas: [
      '/img/nivel7/n7-luna.png', '/img/nivel7/n7-cama.png', '/img/nivel7/n7-zzz.png', 
      '/img/nivel7/n7-bano.png', '/img/nivel7/n7-libro.png', '/img/nivel7/n7-vela.png', 
      '/img/nivel7/n7-silencio.png', '/img/nivel7/n7-estrellas.png', '/img/nivel7/n7-buho.png', '/img/nivel7/n7-nube.png'
    ],
    consejos: [
      {
        titulo: "Higiene del Sueño",
        texto: "¡Felicidades, completaste el juego! Un buen descanso es reparador. Intenta acostarte y levantarte siempre a la misma hora. Crea un santuario de paz en tu habitación: que esté oscura, silenciosa y fresca. Una hora antes de dormir, apaga las pantallas y opta por un libro o música tranquila."
      },
      {
        titulo: "Cenas Ligeras",
        texto: "¡Enhorabuena! Para dormir mejor, intenta cenar al menos dos horas antes de ir a la cama y evita comidas muy copiosas o picantes. Una digestión pesada es enemiga del sueño. Si tienes hambre antes de dormir, un pequeño snack permitido es mejor que irse con el estómago vacío."
      },
      {
        titulo: "Siestas Cortas",
        texto: "¡Lo lograste! Si necesitas descansar durante el día, intenta que la siesta no pase de 20 o 30 minutos. Si duermes mucho por la tarde, le 'robarás' sueño a la noche. Una cabezadita corta te recarga las pilas sin afectar a tu descanso nocturno."
      },
      {
        titulo: "Rutina Relajante",
        texto: "¡Victoria! Crea un ritual antes de dormir. Puede ser una ducha templada, ponerte crema, leer unas páginas o escuchar un podcast suave. Repetir lo mismo cada noche le dice a tu cerebro: 'es hora de desconectar'. ¡Dulces sueños!"
      }
    ]
  }
];

export default function JuegoMemoria() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [cartas, setCartas] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [consejoMostrar, setConsejoMostrar] = useState(null);

  const nivelActual = NIVELES_DATA[nivelIdx];

  // Inicializar juego
  useEffect(() => {
    const baraja = [...nivelActual.cartas, ...nivelActual.cartas]
      .sort(() => Math.random() - 0.5)
      .map((img, i) => ({ id: i, img }));
    setCartas(baraja);
    setSolved([]);
    setFlipped([]);
    setMostrarInfo(false);
    setConsejoMostrar(null);
  }, [nivelIdx]);

  // Función para leer el consejo con voz sintética
  const leerConsejo = (texto) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancelar cualquier audio previo
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.rate = 0.95;    // Velocidad ligeramente ajustada para naturalidad
    utterance.pitch = 1.0;    // Tono natural

    const voices = window.speechSynthesis.getVoices();
    
    // Lista de prioridad de voces de alta calidad (Natural/Premium)
    const vocesPreferidas = [
      'Google español',      // Android/Chrome (Suele ser la mejor)
      'Microsoft Helena',    // Windows (Muy natural)
      'Microsoft Laura',     // Windows
      'Paulina',             // macOS/iOS (Excelente calidad)
      'Monica'               // macOS/iOS
    ];

    let vozSeleccionada = null;

    // 1. Buscar coincidencia exacta con voces premium
    for (const nombre of vocesPreferidas) {
      vozSeleccionada = voices.find(v => v.name.includes(nombre));
      if (vozSeleccionada) break;
    }

    // 2. Si no, buscar cualquier voz en español (preferiblemente Google o Femenina)
    if (!vozSeleccionada) {
      vozSeleccionada = voices.find(v => v.lang.includes('es') && (v.name.includes('Google') || v.name.includes('Female')));
    }

    // 3. Fallback: Cualquier voz en español disponible
    if (!vozSeleccionada) {
      vozSeleccionada = voices.find(v => v.lang.includes('es'));
    }

    if (vozSeleccionada) {
      utterance.voice = vozSeleccionada;
      utterance.lang = vozSeleccionada.lang; // Importante: usar el dialecto de la voz (ES o LATAM)
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cartas.find(c => c.id === newFlipped[0]);
      const card2 = cartas.find(c => c.id === newFlipped[1]);

      if (card1.img === card2.img) {
        setSolved([...solved, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (solved.length === cartas.length && cartas.length > 0) {
      // Seleccionar consejo aleatorio
      const randomTip = nivelActual.consejos[Math.floor(Math.random() * nivelActual.consejos.length)];
      setConsejoMostrar(randomTip);
      setTimeout(() => setMostrarInfo(true), 500);
    }
  }, [solved, cartas]);

  return (
    <div className="min-h-screen bg-slate-50 p-5 pb-28">
      <header className="text-center mb-6 pt-2">
        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${nivelActual.color} text-white text-[10px] font-bold uppercase mb-2 shadow-sm`}>
          Nivel {nivelActual.id} de 7
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{nivelActual.tema}</h2>
      </header>

      {!mostrarInfo ? (
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {cartas.map((carta) => (
            <div
              key={carta.id}
              onClick={() => handleCardClick(carta.id)}
              className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm overflow-hidden
                ${flipped.includes(carta.id) || solved.includes(carta.id) 
                  ? 'bg-white border border-blue-100 scale-100 shadow-md rotate-0' 
                  : `bg-gradient-to-br ${nivelActual.color} text-transparent scale-95 hover:scale-100 rotate-180`}`}
            >
              {(flipped.includes(carta.id) || solved.includes(carta.id)) && (
                <img src={carta.img} alt="memoria" className="w-full h-full object-cover p-1" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-sm mx-auto bg-white rounded-3xl p-6 shadow-xl shadow-slate-200 border border-slate-100 text-center animate-in zoom-in duration-300">
          <Trophy className="mx-auto text-yellow-500 mb-3" size={48} />
          <h3 className="text-xl font-bold text-slate-800 mb-3">{consejoMostrar?.titulo}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">"{consejoMostrar?.texto}"</p>
          
          <button 
            onClick={() => leerConsejo(consejoMostrar?.texto)}
            className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-3 text-sm hover:bg-blue-100 transition-colors"
          >
            <Volume2 size={20} /> ESCUCHAR CONSEJO
          </button>

          <button 
            onClick={() => setNivelIdx((prev) => (prev + 1) % NIVELES_DATA.length)}
            className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg text-sm"
          >
            SIGUIENTE TEMA <ArrowRight size={20} />
          </button>
        </div>
      )}
      
      <button onClick={() => window.location.reload()} className="mx-auto mt-8 flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
        <RefreshCw size={14} /> Reiniciar Juego
      </button>
    </div>
  );
}