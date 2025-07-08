// Importación de funciones de animación de Framer Motion
import { motion, AnimatePresence } from "framer-motion";
// Hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importar AOS y su CSS
import AOS from "aos";
import "aos/dist/aos.css"; // Asegúrate de que esta ruta sea correcta

// Datos de estadísticas modificados para artista
const stats = [
  { label: "Oyentes Mensuales", value: "120K", icon: "👥", trend: "up", change: 8 },
  { label: "Ingresos (USD)", value: "4.3K", icon: "💸", trend: "up", change: 12 },
  { label: "Reproducciones Totales", value: "2.1M", icon: "🎧", trend: "up", change: 15 },
  { label: "Nuevos Seguidores", value: 850, icon: "➕", trend: "up", change: 5 },
];

// Lista de álbumes (reemplaza a artistas destacados)
const myAlbums = [
  {
    id: 1,
    title: "Ecos del Alma",
    artist: "Yo",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    year: "2023",
    songs: 12,
    streams: "1.4M",
  },
  {
    id: 2,
    title: "Noches Blancas",
    artist: "Yo",
    image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=400&q=80",
    year: "2022",
    songs: 10,
    streams: "890K",
  },
  {
    id: 3,
    title: "Primeros Pasos",
    artist: "Yo",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
    year: "2021",
    songs: 8,
    streams: "560K",
  },
  {
    id: 4,
    title: "Demo Sessions",
    artist: "Yo",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    year: "2020",
    songs: 5,
    streams: "320K",
  },
];

// Lista de mis canciones (reemplaza nuevos lanzamientos)
const mySongs = [
  {
    id: 1,
    title: "Canción Más Popular",
    album: "Ecos del Alma",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
    streams: "540K",
    duration: "3:45",
  },
  {
    id: 2,
    title: "Segundo Single",
    album: "Noches Blancas",
    cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=300&q=80",
    streams: "320K",
    duration: "4:12",
  },
  {
    id: 3,
    title: "Colaboración",
    album: "Primeros Pasos",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
    streams: "280K",
    duration: "3:22",
  },
  {
    id: 4,
    title: "Primer Hit",
    album: "Demo Sessions",
    cover: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=300&q=80",
    streams: "150K",
    duration: "3:58",
  },
];

// Componente principal del dashboard
const Dashboard = () => {
  // Inicializa AOS cuando el componente se monta
  useEffect(() => {
    AOS.init({
      // Puedes ajustar las configuraciones globales aquí
      duration: 1000, // Duración predeterminada de la animación
      once: true, // Si la animación debe ocurrir solo una vez
    });
  }, []);

  // Estados del reproductor y UI
  const [playingId, setPlayingId] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [activeTab, setActiveTab] = useState("mis canciones");
  const [expandedCard, setExpandedCard] = useState(null);

  // Efecto que simula el progreso de una canción mientras se reproduce
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Función para iniciar reproducción de canción
  const playSong = (songId) => {
    setCurrentSong(mySongs.find(s => s.id === songId));
    setPlayingId(songId);
    setIsPlaying(true);
    setProgress(0);
  };

  // Función para pausar/reanudar reproducción
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Formatea segundos a MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Expande o colapsa tarjeta de álbum
  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Retorna el JSX del dashboard con su estructura completa
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
      {/* Background Animated Gradient (Conceptual - requires more advanced CSS/JS) */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        background: `radial-gradient(circle at top left, #39FF14 0%, transparent 80%),
                      radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
        backgroundSize: '200% 200%',
        animation: 'bg-pan 20s ease infinite'
      }}></div>

      <style jsx>{`
        @keyframes bg-pan {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>

      {/* Header superior con logo y búsqueda */}
      {/* Aplica la animación AOS al header */}
      <header
        className="flex justify-between items-center mb-12"
        data-aos="fade-down"
        data-aos-easing="linear"
        data-aos-duration="1500"
      >
        {/* Animación de entrada del logo y título */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center ml-72"
        >
          <div className="text-4xl mr-3">🎧</div>
          <h1 className="text-3xl font-bold text-[#1FBF55]">
            Mi Perfil Musical
          </h1>
        </motion.div>

        {/* Input de búsqueda y avatar de usuario */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#09804C] flex items-center justify-center cursor-pointer">
            <span className="text-xl">👤</span>
          </div>
        </motion.div>
      </header>

      {/* Contenedor principal con espacio para sidebar (256px) */}
      <div className="flex">
        {/* Contenido principal desplazado */}
        <div className="flex-1 ml-80 pr-6 bg-[#010012]">
          {/* Navegación por pestañas modificada */}
          <motion.div
            className="flex mb-8 border-b border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {["mis canciones", "estadísticas"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 relative capitalize ${activeTab === tab ? 'text-[#1FBF55]' : 'text-gray-400 hover:text-white'}`}
              >
                {tab}
                {/* Subrayado animado en la pestaña activa */}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1FBF55]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Contenido según la pestaña activa */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* --- PESTAÑA MIS CANCIONES --- */}
              {activeTab === "mis canciones" && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center text-[#1FBF55]">
                    Mis Álbumes
                    <span className="ml-auto text-sm text-gray-400">
                      {myAlbums.length} álbumes
                    </span>
                  </h2>

                  {/* Grid de tarjetas de álbumes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {myAlbums.map((album) => (
                      <motion.div
                        key={album.id}
                        className={`relative rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300
                        ${expandedCard === album.id ? 'lg:col-span-2 lg:row-span-2 max-h-[450px]' : 'max-h-[350px]'}`}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => toggleExpandCard(album.id)}
                        layout
                      >
                        {/* Imagen del álbum */}
                        <img
                          src={album.image}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Gradiente y contenido */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                          <div className="flex justify-between items-end">
                            <div>
                              <h3 className="font-bold text-xl">{album.title}</h3>
                              <p className="text-sm opacity-80">{album.year} • {album.songs} canciones</p>
                            </div>
                            {/* Mostrar streams si está expandido */}
                            {expandedCard === album.id && (
                              <div className="text-right">
                                <p className="text-xs opacity-70">Reproducciones: {album.streams}</p>
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4"
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSong(album.id);
                                    }}
                                    className="bg-[#09804C] hover:bg-[#0a6e42] text-white px-4 py-2 rounded-full text-sm flex items-center"
                                  >
                                    <span className="mr-2">▶</span> Reproducir álbum
                                  </button>
                                </motion.div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Lista de mis canciones */}
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-4 text-[#1FBF55]">Mis Canciones</h3>
                    <div className="bg-gray-800/30 rounded-xl overflow-hidden">
                      {mySongs.map((song, i) => (
                        <div
                          key={`song-${song.id}`}
                          className={`flex items-center p-4 hover:bg-gray-700/50 cursor-pointer ${i !== mySongs.length - 1 ? 'border-b border-gray-700/50' : ''}`}
                          onClick={() => playSong(song.id)}
                        >
                          <span className="text-gray-500 w-8">{i + 1}</span>
                          <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-md mr-4" />
                          <div className="flex-1">
                            <h4 className="font-medium">{song.title}</h4>
                            <p className="text-sm text-gray-400">{song.album}</p>
                          </div>
                          <span className="text-gray-500 text-sm">{song.duration}</span>
                          <button className="ml-4 text-gray-400 hover:text-white">
                            <span className="text-xl">⋯</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* --- PESTAÑA ESTADÍSTICAS --- */}
              {activeTab === "estadísticas" && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-[#1FBF55]">Mis Estadísticas</h2>

                  {/* Tarjetas de estadísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {stats.map(({ label, value, icon, trend, change }, i) => (
                      <motion.div
                        key={label}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
                        className="relative bg-gray-800/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border border-gray-700/50 cursor-default hover:border-[#1FBF55]/40 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="uppercase opacity-80 text-xs tracking-wider">{label}</p>
                            <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
                          </div>
                          <div className="text-3xl">{icon}</div>
                        </div>

                        {trend && (
                          <div className={`mt-3 text-xs flex items-center ${trend === 'up' ? 'text-[#1FBF55]' : trend === 'down' ? 'text-[#C90000]' : 'text-yellow-400'}`}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                            {change && ` ${change}%`} {!change && 'Sin cambios'}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Sección de ingresos */}
                  <h2 className="text-2xl font-bold mb-6 text-[#1FBF55]">Ingresos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-800/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border border-gray-700/50"
                    >
                      <p className="uppercase opacity-80 text-xs tracking-wider">Ingresos este mes</p>
                      <p className="text-3xl font-bold tracking-tight mt-1">$2,450</p>
                      <div className="text-xs text-[#1FBF55] mt-3 flex items-center">
                        ↑ 12% respecto al mes anterior
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gray-800/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border border-gray-700/50"
                    >
                      <p className="uppercase opacity-80 text-xs tracking-wider">Ingresos anuales</p>
                      <p className="text-3xl font-bold tracking-tight mt-1">$18,760</p>
                      <div className="text-xs text-[#1FBF55] mt-3 flex items-center">
                        ↑ 24% respecto al año anterior
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-800/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border border-gray-700/50"
                    >
                      <p className="uppercase opacity-80 text-xs tracking-wider">Próximo pago</p>
                      <p className="text-3xl font-bold tracking-tight mt-1">$1,120</p>
                      <div className="text-xs text-gray-400 mt-3">
                        Estimado para el 15 del próximo mes
                      </div>
                    </motion.div>
                  </div>

                  {/* Tabla de transacciones */}
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-[#1FBF55]">Últimas Transacciones</h3>
                    <div className="bg-gray-800/30 rounded-xl overflow-hidden">
                      {[
                        { id: 1, date: "15/06/2023", description: "Spotify - Reproducciones", amount: "$845", status: "Completado" },
                        { id: 2, date: "10/06/2023", description: "YouTube - Visualizaciones", amount: "$320", status: "Completado" },
                        { id: 3, date: "05/06/2023", description: "Apple Music - Descargas", amount: "$610", status: "Completado" },
                        { id: 4, date: "01/06/2023", description: "Amazon Music - Streams", amount: "$275", status: "Pendiente" },
                      ].map((transaction, i) => (
                        <div
                          key={transaction.id}
                          className={`flex items-center p-4 hover:bg-gray-700/50 ${i !== 3 ? 'border-b border-gray-700/50' : ''}`}
                        >
                          <div className="flex-1">
                            <p className="font-medium">{transaction.date}</p>
                            <p className="text-sm text-gray-400">{transaction.description}</p>
                          </div>
                          <p className="font-medium mx-4">{transaction.amount}</p>
                          <span className={`px-3 py-1 rounded-full text-xs ${transaction.status === "Completado" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"
                            }`}>
                            {transaction.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Reproductor fijo en la parte inferior */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-sm"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center p-4">

          {/* Imagen del álbum o canción en reproducción */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-lg mr-4">
            <img
              src={currentSong?.cover || myAlbums[0].image}
              alt={currentSong?.title || "No song selected"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Información de la canción actual */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {currentSong?.title || "Selecciona una canción"}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {currentSong?.album || myAlbums[0].title}
            </p>
          </div>

          {/* Controles de reproducción */}
          <div className="flex items-center space-x-6 mx-4">
            {/* Botón anterior */}
            <button className="text-gray-400 hover:text-white">
              <span className="text-xl">⏮</span>
            </button>

            {/* Botón play/pausa */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#09804C] flex items-center justify-center hover:bg-[#0a6e42]"
            >
              <span className="text-xl">{isPlaying ? "⏸" : "▶"}</span>
            </button>

            {/* Botón siguiente */}
            <button className="text-gray-400 hover:text-white">
              <span className="text-xl">⏭</span>
            </button>
          </div>

          {/* Barra de progreso de la canción */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            {/* Tiempos: actual y duración total */}
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{formatTime((progress / 100) * 220)}</span>
              <span>{currentSong?.duration || "0:00"}</span>
            </div>

            {/* Barra visual de progreso */}
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-[#1FBF55] h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Control de volumen */}
          <div className="hidden md:flex items-center space-x-2 ml-4 w-24">
            <span className="text-gray-400">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full accent-[#1FBF55]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;