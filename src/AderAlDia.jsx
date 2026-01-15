import React, { useState } from 'react';
import { MessageCircle, Share2, ChevronDown, ChevronUp, Search } from 'lucide-react';

// Datos simulados del canal de WhatsApp
const NOTICIAS = [
  {
    id: 1,
    fecha: "15 Ene, 2026",
    titulo: "Nutrición Renal: El Arte de Controlar el Potasio sin Perder el Sabor",
    categoria: "Nutrición",
    imagen: "https://placehold.co/800x400/dcfce7/166534?text=Nutricion+Renal",
    texto: `La alimentación es uno de los pilares fundamentales en el tratamiento de la Enfermedad Renal Crónica (ERC). Uno de los mayores desafíos para los pacientes es el control del potasio, un mineral esencial para el funcionamiento muscular y nervioso, pero que en exceso puede resultar peligroso para el corazón cuando los riñones no pueden eliminarlo correctamente.

    Sin embargo, llevar una dieta baja en potasio no significa renunciar a comer rico y variado. La clave está en la selección de alimentos y en las técnicas de cocción adecuadas. Una de las técnicas más efectivas es la "doble cocción" o el remojo prolongado. Para las legumbres y verduras como las patatas, se recomienda pelarlas, cortarlas en trozos pequeños y dejarlas en remojo durante al menos 12 a 24 horas, cambiando el agua varias veces. Posteriormente, al cocinarlas, se debe desechar el agua del primer hervor y terminar la cocción en agua nueva. Este proceso puede reducir el contenido de potasio hasta en un 75%.

    Además de las técnicas de cocina, es vital conocer qué frutas y verduras son naturalmente más bajas en potasio. Manzanas, peras, frutos rojos, piña, coliflor, pimientos y pepinos son excelentes opciones para incluir en el menú diario. Por el contrario, se debe tener precaución con el plátano, el aguacate, las espinacas, los tomates concentrados y los frutos secos.

    Otro aspecto crucial es el uso de hierbas y especias. Al reducir la sal (que favorece la retención de líquidos y aumenta la presión arterial), la comida puede parecer insípida al principio. Aquí es donde entran en juego el ajo, la cebolla, el perejil, el orégano, el romero, la cúrcuma y el limón. Estos potenciadores de sabor naturales no solo hacen que los platos sean deliciosos, sino que también aportan antioxidantes beneficiosos sin cargar los riñones.

    Recuerda que cada paciente es único. Lo que funciona para uno puede no ser adecuado para otro dependiendo de su etapa de la enfermedad y sus niveles en sangre. Por eso, estas guías generales deben ir siempre acompañadas del consejo personalizado de tu nutricionista renal. Comer bien es una forma de respetarte y cuidar tu futuro.`
  },
  {
    id: 2,
    fecha: "14 Ene, 2026",
    titulo: "Cuidando tu Línea de Vida: La Fístula Arteriovenosa",
    categoria: "Salud",
    imagen: "https://placehold.co/800x400/dbeafe/1e40af?text=Cuidado+Fistula",
    texto: `Para los pacientes en hemodiálisis, el acceso vascular, comúnmente conocido como fístula arteriovenosa (FAV), es literalmente su línea de vida. Es el puente que permite que la sangre salga del cuerpo, sea limpiada por la máquina de diálisis y regrese de manera segura. Mantener este acceso en perfectas condiciones es una responsabilidad diaria que puede prevenir complicaciones graves y asegurar la eficacia del tratamiento.

    El cuidado de la fístula comienza con la higiene. Es imperativo lavar el brazo del acceso con agua tibia y jabón antibacterial antes de cada sesión de diálisis para prevenir infecciones. En casa, se debe mantener la piel limpia y bien hidratada, evitando rascarse cerca del sitio de punción.

    La vigilancia diaria es igual de importante. Cada día, debes verificar el funcionamiento de tu fístula sintiendo el "thrill" o vibración característica que indica que la sangre fluye correctamente. Si en algún momento dejas de sentir esta vibración, o notas cambios como enrojecimiento, calor, hinchazón, dolor o secreción, debes contactar a tu unidad de diálisis o acudir a urgencias de inmediato. El tiempo es oro cuando se trata de salvar un acceso vascular.

    Además, hay precauciones físicas que debes integrar en tu rutina. Evita usar ropa con mangas muy ajustadas, relojes o pulseras que aprieten el brazo de la fístula. No cargues objetos pesados (como bolsas de la compra) con ese brazo y evita dormir sobre él para no comprimir el flujo sanguíneo. También es fundamental recordar al personal sanitario que nunca deben tomarte la presión arterial ni realizar extracciones de sangre en ese brazo, a menos que sea estrictamente necesario y autorizado por tu nefrólogo.

    Realizar ejercicios suaves con la mano, como apretar una pelota de goma, puede ayudar a fortalecer la fístula, especialmente en las etapas iniciales de maduración. Consulta siempre con tu equipo de enfermería sobre qué ejercicios son los más adecuados para ti. Tu fístula es un tesoro; cuídala con el mimo que se merece.`
  },
  {
    id: 3,
    fecha: "12 Ene, 2026",
    titulo: "Bienestar Emocional: No Estás Solo en este Camino",
    categoria: "Apoyo",
    imagen: "https://placehold.co/800x400/fce7f3/9d174d?text=Bienestar+Emocional",
    texto: `Recibir un diagnóstico de Enfermedad Renal Crónica (ERC) o vivir dependiendo de la diálisis es una experiencia que transforma la vida, no solo a nivel físico, sino profundamente a nivel emocional y psicológico. Es completamente normal sentir una montaña rusa de emociones: miedo, ira, tristeza, negación y ansiedad son compañeros frecuentes en este viaje. Reconocer y validar estos sentimientos es el primer paso hacia el bienestar emocional.

    La salud mental a menudo se deja en segundo plano frente a las urgencias médicas, los análisis y los tratamientos, pero es igual de vital. El estrés crónico y la depresión pueden afectar negativamente al sistema inmunológico y a la adherencia al tratamiento. Por eso, cuidar de tu mente es cuidar de tus riñones.

    No tienes que llevar esta carga en soledad. Construir una red de apoyo sólida es fundamental. Esto incluye a familiares y amigos, pero también a profesionales de la salud mental y grupos de apoyo de pacientes. Hablar con personas que están pasando por lo mismo que tú puede ser increíblemente liberador; ellos entienden tus miedos y frustraciones sin necesidad de explicaciones largas. En la Fundación ADER, fomentamos estos espacios de encuentro porque sabemos que la empatía cura.

    Buscar actividades que te den placer y sentido fuera de la enfermedad es crucial. Ya sea pintar, leer, escuchar música, pasear o practicar mindfulness, dedica tiempo cada día a algo que no tenga nada que ver con ser un "paciente". Eres una persona completa con sueños, talentos y pasiones, y la enfermedad es solo una parte de tu vida, no el todo.

    Si sientes que la tristeza te impide disfrutar de la vida o realizar tus actividades diarias, no dudes en pedir ayuda profesional. La terapia psicológica puede ofrecerte herramientas para gestionar la incertidumbre y fortalecer tu resiliencia. Recuerda: pedir ayuda no es un signo de debilidad, sino de una inmensa fortaleza y ganas de vivir mejor.`
  },
  {
    id: 4,
    fecha: "10 Ene, 2026",
    titulo: "La Importancia de la Vacunación en Pacientes Renales",
    categoria: "Salud",
    imagen: "https://placehold.co/800x400/e0e7ff/3730a3?text=Vacunacion",
    texto: `El sistema inmunológico de los pacientes con Enfermedad Renal Crónica (ERC) puede estar debilitado, lo que aumenta el riesgo de infecciones. Por ello, mantener el calendario de vacunación al día es una medida de protección esencial.

    Las vacunas más recomendadas suelen incluir la de la gripe (anual), la del neumococo (para prevenir neumonías graves) y la de la hepatitis B, especialmente si estás en diálisis o pre-diálisis. Estas vacunas no solo te protegen a ti, sino que también ayudan a proteger a tu entorno familiar y a otros pacientes en la unidad de diálisis.

    Es común tener dudas sobre la seguridad o los efectos secundarios. En general, estas vacunas son seguras y eficaces para pacientes renales. Sin embargo, siempre debes consultar con tu nefrólogo antes de recibir cualquier vacuna, ya que él conoce tu historial médico detallado y te indicará el momento más adecuado para hacerlo.

    No bajes la guardia. Una simple vacuna puede evitar complicaciones hospitalarias y asegurar que tu tratamiento continúe sin interrupciones. ¡Pregunta en tu próxima consulta!`
  },
  {
    id: 5,
    fecha: "08 Ene, 2026",
    titulo: "Ejercicio Suave: Tu Aliado contra la Fatiga",
    categoria: "Actividad",
    imagen: "https://placehold.co/800x400/ffedd5/9a3412?text=Ejercicio+Suave",
    texto: `A veces, cuando nos sentimos cansados por el tratamiento, lo último que queremos hacer es movernos. Sin embargo, el sedentarismo puede aumentar esa sensación de fatiga y debilitar nuestros músculos y huesos. La actividad física suave y regular es una de las mejores medicinas naturales.

    Caminar es el ejercicio estrella: es gratis, se puede hacer en cualquier lugar y tú controlas el ritmo. Empezar con paseos de 10 o 15 minutos e ir aumentando gradualmente puede mejorar tu circulación, controlar tu presión arterial y elevar tu estado de ánimo gracias a las endorfinas.

    Otros ejercicios recomendados incluyen el yoga suave, el taichí o ejercicios de resistencia con bandas elásticas ligeras. Estos ayudan a mantener la flexibilidad y la fuerza muscular sin sobrecargar el cuerpo.

    Escucha siempre a tu cuerpo. Si sientes mareos, falta de aire o dolor, detente. Y recuerda: el objetivo no es ser un atleta olímpico, sino mantener tu cuerpo funcional y tu mente despejada. ¡Muévete a tu ritmo!`
  },
  {
    id: 6,
    fecha: "05 Ene, 2026",
    titulo: "Hidratación Inteligente: Manejando la Sed",
    categoria: "Consejos",
    imagen: "https://placehold.co/800x400/cffafe/155e75?text=Control+Liquidos",
    texto: `Para muchos pacientes en diálisis, la restricción de líquidos es uno de los aspectos más difíciles del tratamiento. La acumulación de líquido entre sesiones puede causar hinchazón, hipertensión y problemas cardíacos. Pero, ¿cómo combatir la sed sin beber grandes cantidades de agua?

    Aquí tienes algunos trucos efectivos:
    1. **Reduce la sal:** La sal es el principal disparador de la sed. Evita alimentos procesados y embutidos.
    2. **Cubitos de hielo:** Chupar un cubito de hielo refresca más y dura más tiempo en la boca que beber un sorbo de agua, aportando menos líquido total. Puedes hacerlos con unas gotas de limón para estimular la salivación.
    3. **Fruta congelada:** Uvas o trocitos de piña congelados son excelentes "caramelos" naturales que alivian la boca seca.
    4. **Cuida tu boca:** Mantener una buena higiene bucal y usar enjuagues (sin alcohol) ayuda a sentir frescura. Masticar chicle sin azúcar también estimula la saliva.

    Recuerda contar todos los líquidos: sopas, gelatinas, yogures y helados también suman. Llevar un control diario te ayudará a llegar a tu próxima sesión de diálisis en las mejores condiciones posibles.`
  },
  {
    id: 7,
    fecha: "02 Ene, 2026",
    titulo: "Entendiendo tus Análisis: ¿Qué es la Creatinina?",
    categoria: "Educación",
    imagen: "https://placehold.co/800x400/f3f4f6/1f2937?text=Analisis+Clinicos",
    texto: `Cada vez que te haces una analítica, escuchas hablar de la creatinina. Pero, ¿qué es exactamente? La creatinina es un producto de desecho generado por tus músculos como parte de la actividad diaria. En condiciones normales, los riñones sanos filtran la creatinina de la sangre y la expulsan en la orina.

    Cuando los riñones no funcionan bien, la creatinina se acumula en la sangre. Por eso, su nivel en sangre es un indicador clave para medir la función renal. Junto con la edad, el sexo y otros factores, se usa para calcular la Tasa de Filtrado Glomerular (TFG), que nos dice en qué etapa de la enfermedad renal te encuentras.

    Es importante saber que los niveles de creatinina pueden variar ligeramente por factores como la masa muscular (una persona muy musculosa tendrá más creatinina) o la dieta. Por eso, no te alarmes por un solo resultado aislado; lo importante es la tendencia a lo largo del tiempo.

    Entender tus números te empodera. No dudes en pedirle a tu médico que te explique tus resultados. Ser parte activa de tu seguimiento médico es fundamental para tomar mejores decisiones sobre tu salud.`
  }
];

export default function AderAlDia() {
  const [expandedPosts, setExpandedPosts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const togglePost = (id) => {
    setExpandedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredNoticias = NOTICIAS.filter(post => 
    post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.texto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = async (post) => {
    const shareData = {
      title: post.titulo,
      text: `${post.titulo}\n\n${post.texto.substring(0, 150)}...\n\nLeído en App Red Renal ADER`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error al compartir:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n${shareData.url}`);
        alert('¡Texto copiado! Puedes pegarlo en tu red social favorita.');
      } catch (err) {
        alert('No se pudo compartir automáticamente.');
      }
    }
  };

  return (
    <div className="p-5 bg-slate-50 min-h-screen pb-24">
      <header className="mb-6 pt-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600 shadow-sm">
            <MessageCircle size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">ADER al Día</h2>
            <p className="text-slate-500 text-sm font-medium">Novedades en tiempo real</p>
          </div>
        </div>
        
        <a 
          href="https://whatsapp.com/channel/0029VbBszfGFi8xjHl3Tul23" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-green-100 text-sm hover:bg-[#20bd5a] transition-colors"
        >
          <MessageCircle size={18} />
          UNIRME AL CANAL DE WHATSAPP
        </a>

        {/* Buscador */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por tema..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm"
          />
        </div>
      </header>

      <div className="space-y-4">
        {filteredNoticias.length > 0 ? (
          filteredNoticias.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-2 duration-500">
            {post.imagen && (
              <div className="mb-4 rounded-xl overflow-hidden h-48 bg-slate-100">
                <img 
                  src={post.imagen} 
                  alt={post.titulo} 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'} 
                />
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                {post.fecha}
              </span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${
                post.categoria === 'Aviso' ? 'text-red-500 bg-red-50' : 
                post.categoria === 'Nutrición' ? 'text-green-600 bg-green-50' : 
                post.categoria === 'Salud' ? 'text-purple-600 bg-purple-50' :
                post.categoria === 'Actividad' ? 'text-orange-600 bg-orange-50' :
                post.categoria === 'Consejos' ? 'text-cyan-600 bg-cyan-50' :
                post.categoria === 'Educación' ? 'text-indigo-600 bg-indigo-50' :
                'text-blue-600 bg-blue-50'
              }`}>
                {post.categoria}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">
                {post.titulo}
            </h3>

            <div className={`text-slate-700 text-sm leading-relaxed mb-4 text-justify whitespace-pre-line ${!expandedPosts[post.id] ? 'line-clamp-4' : ''}`}>
              {post.texto}
            </div>

            <div className="flex justify-between items-center border-t border-slate-50 pt-4">
               <button 
                 onClick={() => togglePost(post.id)}
                 className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
               >
                 {expandedPosts[post.id] ? (
                    <>LEER MENOS <ChevronUp size={16} /></>
                 ) : (
                    <>LEER ARTÍCULO COMPLETO <ChevronDown size={16} /></>
                 )}
               </button>

               <button 
                 onClick={() => handleShare(post)}
                 className="text-slate-400 hover:text-green-600 transition-colors flex items-center gap-1 text-xs font-bold px-2"
               >
                 <Share2 size={16} />
               </button>
            </div>
          </article>
        ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            No se encontraron noticias que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}