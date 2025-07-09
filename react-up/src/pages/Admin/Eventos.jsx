import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiFilter,
  FiDownload,
  FiPlusCircle,
  FiSearch
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import xss from "xss";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Eventos = () => {
  useEffect(() => {
    AOS.init({
      duration: 1500, // Duración de 1500ms
      easing: 'linear',
      once: true
    });
  }, []);

  const [eventos, setEventos] = useState([
    {
      foto: "https://edit.org/img/blog/n/4s2-1024-plantilla-imagen-portada-evento-facebook.webp", // URL de imagen de ejemplo
      nombreEvento: "Concierto de Rock Extremo",
      generoMusical: "Rock/Metal",
      descripcion: "¡Prepárense para una noche de puro poder! Bandas locales destrozando el escenario con los riffs más pesados y una energía inigualable. ¡El headbanging está garantizado!",
      ubicacion: "Auditorio A, Centro de Convenciones El Volcán",
      fecha: "2025-02-10",
      contacto: "rockextremo@example.com",
      capacidad: 1200,
      artistas: "Bandas locales: La Furia Eléctrica, Ruido Cero, Almas Oxidadas",
      estado: true,
    },
    {
      foto: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/fb-cover-for-the-party-festival-design-template-e557f7cec2750b6e8995031080f35477_screen.jpg?ts=1566566381", // URL de imagen de ejemplo
      nombreEvento: "Festival de Jazz Nocturno",
      generoMusical: "Jazz Fusión",
      descripcion: "Sumérgete en la elegancia del jazz bajo las estrellas. Artistas de talla mundial te transportarán con melodías improvisadas y ritmos envolventes. Una experiencia única para los amantes del buen jazz.",
      ubicacion: "Teatro B, Centro Cultural Metropolitano Solaris",
      fecha: "2025-03-20",
      contacto: "jazzsolaris@example.com",
      capacidad: 450,
      artistas: "Artistas internacionales: El Cuarteto Lunar, Sofía Valdés (voz)",
      estado: true,
    },
    {
      foto: "https://marketplace.canva.com/EAFi9oE5Pek/1/0/1600w/canva-fiesta-de-cumplea%C3%B1os-dj-en-la-ciudad-portada-de-facebook-Y0j1-N24k-s.jpg",
      nombreEvento: "Explosión Electrónica 2025",
      generoMusical: "Electrónica/Techno",
      descripcion: "La noche vibrará al ritmo de los beats más innovadores. Una experiencia visual y sonora con los DJs más vanguardistas que te harán bailar hasta el amanecer.",
      ubicacion: "Club Nocturno The Matrix",
      fecha: "2025-04-05",
      contacto: "thematrixbeats@example.com",
      capacidad: 900,
      artistas: "DJs: DJ Cypher, Synthia Groove, Beats Quantum",
      estado: false, // Ejemplo de evento inactivo
    },
     {
      foto: "https://i.pinimg.com/736x/87/42/1d/87421d5a7101859c0490b76e1a498522.jpg",
      nombreEvento: "Noche de Comedia Stand-Up",
      generoMusical: "Comedia",
      descripcion: "¡Risas garantizadas! Los mejores comediantes del circuito local e internacional se unen para una noche de humor irreverente y carcajadas sin fin.",
      ubicacion: "Teatro Capitol",
      fecha: "2025-05-15",
      contacto: "comedianight@example.com",
      capacidad: 350,
      artistas: "Comediantes: Pepito Risas, La Chistosa, Monologuista Incógnito",
      estado: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    nombreEvento: "",
    generoMusical: "",
    descripcion: "",
    ubicacion: "",
    fecha: "",
    contacto: "",
    capacidad: "",
    artistas: "",
  });
  const [currentEvento, setCurrentEvento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [errors, setErrors] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 140, 0.7), 0 0 35px rgba(0, 255, 140, 0.5)" }, // Brillo más intenso
    tap: { scale: 0.95 }
  };

  const iconButtonVariants = {
    hover: { scale: 1.2, color: "#39FF14", filter: "drop-shadow(0 0 8px rgba(57, 255, 20, 0.8))" }, // Icono más grande y con brillo
    tap: { scale: 0.8 }
  };

  const handleSearchChange = (e) => setSearchTerm(xss(e.target.value));

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEventos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Eventos");
    XLSX.writeFile(workbook, "eventos.xlsx");
  };

  const handleFilterChange = () => {
    setFilterActive(prev => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  const handleSortByDate = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const filteredEventos = eventos
    .filter(evento =>
      evento.nombreEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.generoMusical.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.artistas.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(evento => {
      if (filterActive === "all") return true;
      return filterActive === "active" ? evento.estado : !evento.estado;
    })
    .sort((a, b) => sortOrder === "asc" ?
      new Date(a.fecha) - new Date(b.fecha) :
      new Date(b.fecha) - new Date(a.fecha)
    );

  const openModalCrear = () => {
    setFormData({
      foto: null,
      nombreEvento: "",
      generoMusical: "",
      descripcion: "",
      ubicacion: "",
      fecha: "",
      contacto: "",
      capacidad: "",
      artistas: "",
    });
    setErrors({}); // Limpiar errores al abrir el modal de creación
    setModalCrear(true);
  };

  const openModalEditar = (index) => {
    setCurrentEvento(index);
    // Asegurarse de que 'foto' sea URL de cadena o objeto File al editar
    setFormData({
      ...eventos[index],
      foto: eventos[index].foto || null // Manejar casos donde 'foto' podría ser indefinido
    });
    setErrors({}); // Limpiar errores al abrir el modal de edición
    setModalEditar(true);
  };

  const openModalVer = (index) => {
    setCurrentEvento(index);
    setModalVer(true);
  };

  const closeModal = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalVer(false);
    setErrors({}); // Limpiar errores cuando cualquier modal se cierra
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "foto" ? files[0] : xss(value)
    }));
    // Limpiar el error para el campo específico mientras se escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreEvento.trim()) newErrors.nombreEvento = "El nombre del evento es obligatorio.";
    if (!formData.generoMusical.trim()) newErrors.generoMusical = "El género musical es obligatorio.";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.ubicacion.trim()) newErrors.ubicacion = "La ubicación es obligatoria.";
    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria.";
    if (!formData.contacto.trim()) newErrors.contacto = "El contacto es obligatorio.";
    if (!formData.capacidad || formData.capacidad <= 0) newErrors.capacidad = "La capacidad debe ser un número positivo.";
    if (!formData.artistas.trim()) newErrors.artistas = "El campo de artistas es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEvento = () => {
    if (!validateForm()) {
      Swal.fire("Error", "Por favor, complete todos los campos requeridos.", "error");
      return;
    }
    setEventos([...eventos, { ...formData, estado: true }]);
    Swal.fire("¡Éxito!", "Evento agregado correctamente.", "success");
    closeModal();
  };

  const handleUpdateEvento = () => {
    if (!validateForm()) {
      Swal.fire("Error", "Por favor, complete todos los campos requeridos.", "error");
      return;
    }
    const updated = [...eventos];
    updated[currentEvento] = formData;
    setEventos(updated);
    Swal.fire("¡Éxito!", "Evento actualizado correctamente.", "success");
    closeModal();
  };

  const handleDeleteEvento = (index) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡desactivar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = [...eventos];
        updated[index].estado = false;
        setEventos(updated);
        Swal.fire(
          'Desactivado!',
          'El evento ha sido desactivado.',
          'info'
        );
      }
    });
  };

  const handleRestoreEvento = (index) => {
    Swal.fire({
      title: '¿Activar evento?',
      text: "¿Quieres activar este evento nuevamente?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡activar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = [...eventos];
        updated[index].estado = true;
        setEventos(updated);
        Swal.fire(
          'Activado!',
          'El evento ha sido activado.',
          'success'
        );
      }
    });
  };

  return (
    <div
      className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden"
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="1500"
    >
      <div className="absolute inset-0 z-0 opacity-20" style={{
        background: `radial-gradient(circle at top left, #39FF14 0%, transparent 30%), radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
        backgroundSize: "200% 200%",
        animation: "bg-pan 20s ease infinite",
      }}></div>

      <style jsx>{`
        @keyframes bg-pan {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          border-radius: 1.5rem;
        }
        .glass-table-header {
          background: rgba(0, 255, 140, 0.2);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 255, 140, 0.3);
        }
        /* Brillo de texto Neón */
        .neon-text-glow {
          text-shadow: 0 0 8px #00FF8C, 0 0 15px #00FF8C, 0 0 25px #00FF8C, 0 0 40px rgba(0, 255, 140, 0.6);
        }
        /* Brillo de foco de entrada mejorado */
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(0, 255, 140, 0.6), 0 0 15px rgba(0, 255, 140, 0.9);
        }
        /* Efecto hover en fila de tabla */
        .table-row-hover:hover {
          transform: translateY(-3px); /* Pequeño levantamiento */
          box-shadow: 0 8px 20px rgba(0, 255, 140, 0.3); /* Brillo debajo */
          transition: all 0.3s ease-in-out;
          background: rgba(0, 255, 140, 0.07); /* Ligero fondo neón */
        }
        .button-glow-hover:hover {
          box-shadow: 0 0 20px rgba(0, 255, 140, 0.7), 0 0 35px rgba(0, 255, 140, 0.5);
        }
        /* Clases para el texto de estado en la tabla principal (manteniendo el estilo de pastilla) */
        .status-badge-active {
            @apply px-4 py-1.5 rounded-full text-xs font-bold bg-green-700 text-white shadow-lg shadow-green-600/40;
        }
        .status-badge-inactive {
            @apply px-4 py-1.5 rounded-full text-xs font-bold bg-red-700 text-white shadow-lg shadow-red-600/40;
        }
        /* Clases para el texto de estado en el ModalVer (solo texto y color) */
        .status-text-active-modal {
            color: #39FF14; /* Verde neón brillante */
            font-weight: bold;
            text-shadow: 0 0 5px rgba(57, 255, 20, 0.3); /* Sutil brillo */
        }
        .status-text-inactive-modal {
            color: #FF4500; /* Naranja rojizo para inactivo */
            font-weight: bold;
            text-shadow: 0 0 5px rgba(255, 69, 0, 0.3); /* Sutil brillo */
        }
      `}</style>
      <div className="relative z-10">
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h1 className="text-4xl font-bold neon-text-glow">Gestión de Eventos</h1>
          <p className="text-lg opacity-90">Administra los eventos del sistema con un toque futurista.</p>
        </motion.div>

        <motion.div
          className="glass-card p-4 mb-8 flex justify-center"
          variants={itemVariants}
        >
          <nav className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-[#00FF8C] hover:underline hover:neon-text-glow transition duration-300">
              Inicio
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">Eventos</span>
          </nav>
        </motion.div>

        <motion.div
          className="glass-card p-6 mb-8 flex flex-wrap gap-4"
          variants={itemVariants}
        >
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              placeholder="Buscar evento por nombre, género o ubicación..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C] input-glow transition duration-300"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2 text-gray-900 font-semibold transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleFilterChange}
            >
              <FiFilter />
              {filterActive === "all" ? "Mostrar Todos" : filterActive === "active" ? "Mostrar Activos" : "Mostrar Inactivos"}
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2 text-gray-900 font-semibold transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSortByDate}
            >
              <FiFilter />
              {sortOrder === "asc" ? "Fecha Ascendente" : "Fecha Descendente"}
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg flex items-center gap-2 text-gray-900 font-semibold transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleExportToExcel}
            >
              <FiDownload /> Exportar a Excel
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center gap-2 text-gray-900 font-semibold transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openModalCrear}
            >
              <FiPlusCircle /> Crear Nuevo Evento
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-6 overflow-x-auto"
          variants={itemVariants}
        >
          <table className="w-full">
            <thead>
              <tr className="glass-table-header">
                <th className="py-3 px-6 text-left">Foto</th>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Género</th>
                <th className="py-3 px-6 text-left">Descripción</th>
                <th className="py-3 px-6 text-left">Ubicación</th>
                <th className="py-3 px-6 text-left">Fecha</th>
                <th className="py-3 px-6 text-left">Contacto</th>
                <th className="py-3 px-6 text-left">Capacidad</th>
                <th className="py-3 px-6 text-left">Artistas</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredEventos.map((evento, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-gray-700 table-row-hover"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <td className="py-4 px-6">
                      {evento.foto ? (
                        <img
                          src={typeof evento.foto === 'string' ? evento.foto : URL.createObjectURL(evento.foto)}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-[#00FF8C] shadow-lg shadow-[#00FF8C]/50"
                          alt="Evento"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400 border-2 border-gray-600">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-medium">{evento.nombreEvento}</td>
                    <td className="py-4 px-6">{evento.generoMusical}</td>
                    <td className="py-4 px-6 text-sm opacity-80">{evento.descripcion.substring(0, 50)}{evento.descripcion.length > 50 ? '...' : ''}</td>
                    <td className="py-4 px-6">{evento.ubicacion}</td>
                    <td className="py-4 px-6">{evento.fecha}</td>
                    <td className="py-4 px-6 text-sm">{evento.contacto}</td>
                    <td className="py-4 px-6">{evento.capacidad}</td>
                    <td className="py-4 px-6 text-sm opacity-80">{evento.artistas.substring(0, 50)}{evento.artistas.length > 50 ? '...' : ''}</td>
                    {/* EN LA TABLA PRINCIPAL, MANTENEMOS EL ESTILO DE PASTILLA COMO ESTABA ORIGINALMENTE */}
                    <td className="py-4 px-6 text-center">
                      <span className={evento.estado ? "status-badge-active" : "status-badge-inactive"}>
                        {evento.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex justify-center items-center gap-2">
                      <motion.button
                        whileTap="tap"
                        variants={iconButtonVariants}
                        whileHover="hover"
                        className="p-2 bg-blue-700 rounded-full shadow-lg shadow-blue-600/40"
                        onClick={() => openModalVer(index)}
                      >
                        <FiEye className="text-white"/>
                      </motion.button>
                      <motion.button
                        whileTap="tap"
                        variants={iconButtonVariants}
                        whileHover="hover"
                        className="p-2 bg-yellow-700 rounded-full shadow-lg shadow-yellow-600/40"
                        onClick={() => openModalEditar(index)}
                      >
                        <FiEdit className="text-white"/>
                      </motion.button>
                      {evento.estado ? (
                        <motion.button
                          whileTap="tap"
                          variants={iconButtonVariants}
                          whileHover="hover"
                          className="p-2 bg-red-700 rounded-full shadow-lg shadow-red-600/40"
                          onClick={() => handleDeleteEvento(index)}
                        >
                          <FiTrash2 className="text-white"/>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap="tap"
                          variants={iconButtonVariants}
                          whileHover="hover"
                          className="p-2 bg-green-700 rounded-full shadow-lg shadow-green-600/40"
                          onClick={() => handleRestoreEvento(index)}
                        >
                          <FiRefreshCcw className="text-white"/>
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredEventos.length === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-400 py-8 text-xl italic"
            >
              No se encontraron eventos que coincidan con su búsqueda.
            </motion.p>
          )}
        </motion.div>

        <AnimatePresence>
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddEvento}
              errors={errors}
              title="Crear Nuevo Evento"
            />
          )}

          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleUpdateEvento}
              errors={errors}
              title="Editar Detalles del Evento"
            />
          )}

          {modalVer && (
            <ModalVer
              data={eventos[currentEvento]}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave, errors, title }) => {
  const [previewFotoUrl, setPreviewFotoUrl] = useState(null);

  useEffect(() => {
    if (formData.foto instanceof File) {
      const objectUrl = URL.createObjectURL(formData.foto);
      setPreviewFotoUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof formData.foto === 'string') {
      setPreviewFotoUrl(formData.foto);
    } else {
      setPreviewFotoUrl(null);
    }
  }, [formData.foto]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white border-opacity-20"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center neon-text-glow">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 text-center col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Imagen del Evento</label>
            {previewFotoUrl && (
              <img
                src={previewFotoUrl}
                alt="Vista previa"
                className="w-32 h-32 rounded-lg object-cover mx-auto mb-4 border-2 border-[#00FF8C] shadow-lg shadow-[#00FF8C]/50"
              />
            )}
            <label
              htmlFor="foto"
              className="inline-block bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 px-5 py-2.5 rounded-lg cursor-pointer hover:from-[#39FF14] hover:to-[#00FF8C] transition duration-300 font-bold"
            >
              {previewFotoUrl ? "Cambiar Imagen" : "Subir Imagen"}
              <input
                id="foto"
                type="file"
                name="foto"
                onChange={onChange}
                className="hidden"
                accept="image/*"
              />
            </label>
            {errors.foto && (
              <p className="text-red-500 text-sm mt-1">{errors.foto}</p>
            )}
          </div>

          {[
            { label: "Nombre del Evento", name: "nombreEvento", type: "text" },
            { label: "Género Musical", name: "generoMusical", type: "text" },
            { label: "Ubicación", name: "ubicacion", type: "text" },
            { label: "Fecha", name: "fecha", type: "date" },
            { label: "Contacto", name: "contacto", type: "text" },
            { label: "Capacidad", name: "capacidad", type: "number" },
            { label: "Artistas Participantes", name: "artistas", type: "text", colSpan: "col-span-2" },
            { label: "Descripción Detallada", name: "descripcion", type: "textarea", colSpan: "col-span-2" },
          ].map((field) => (
            <div key={field.name} className={field.colSpan || ""}>
              <label className="block text-sm font-semibold mb-1 text-gray-300">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={onChange}
                  className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] input-glow transition duration-300 ${errors[field.name] ? "border-red-500" : ""}`}
                  rows="4"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={onChange}
                  className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] input-glow transition duration-300 ${errors[field.name] ? "border-red-500" : ""}`}
                />
              )}
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-gray-600 hover:to-gray-700 transition duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(255, 255, 255, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={onSave}
            className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg button-glow-hover transition duration-300"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            Guardar Evento
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ModalVer = ({ data, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white border-opacity-20"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center neon-text-glow">Detalles del Evento</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center col-span-2">
            {data.foto ? (
              <img
                src={typeof data.foto === 'string' ? data.foto : URL.createObjectURL(data.foto)}
                alt="Evento"
                className="w-40 h-40 rounded-lg object-cover mx-auto border-2 border-[#00FF8C] shadow-xl shadow-[#00FF8C]/60"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-700 rounded-lg flex items-center justify-center mx-auto border-2 border-gray-600">
                <span className="text-gray-400 text-lg">Sin foto</span>
              </div>
            )}
          </div>

          {[
            { label: "Nombre del Evento", value: data.nombreEvento },
            { label: "Género Musical", value: data.generoMusical },
            { label: "Ubicación", value: data.ubicacion },
            { label: "Fecha del Evento", value: data.fecha },
            { label: "Contacto Principal", value: data.contacto },
            { label: "Capacidad Máxima", value: data.capacidad },
            { label: "Artistas / Bandas", value: data.artistas, colSpan: "col-span-2" },
            { label: "Descripción Completa", value: data.descripcion, colSpan: "col-span-2" },
          ].map((item) => (
            <div key={item.label} className={item.colSpan || ""}>
              <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
              <p className="text-lg text-white break-words p-2 bg-gray-800 rounded-md border border-gray-700">{item.value}</p>
            </div>
          ))}

          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-300">Estado Actual</label>
            {/* CAMBIO CRÍTICO: Aquí quitamos las clases de pastilla y usamos solo las de texto */}
            <span className={`font-bold text-lg ${data.estado ? "status-text-active-modal" : "status-text-inactive-modal"}`}>
              {data.estado ? "Activo y Visible" : "Inactivo y Oculto"}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg button-glow-hover transition duration-300"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            Cerrar Detalles
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Eventos;