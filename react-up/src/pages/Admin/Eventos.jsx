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
  FiSearch,
  FiArrowUp, // Icon for ascending sort
  FiArrowDown // Icon for descending sort
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
      once: true, // Animations only run once
      mirror: false, // Do not repeat on reverse scroll
    });
    AOS.refresh(); // Force refresh of animations
  }, []);

  const [eventos, setEventos] = useState([
    {
      id: 'e1', // Unique ID for each event
      foto: "https://edit.org/img/blog/n/4s2-1024-plantilla-imagen-portada-evento-facebook.webp", // URL de imagen de ejemplo
      nombreEvento: "Concierto de Rock",
      generoMusical: "Rock",
      descripcion: "Un concierto explosivo con las mejores bandas de rock locales y nacionales. ¡No te lo pierdas!",
      ubicacion: "Auditorio Principal, Centro de Convenciones",
      fecha: "2025-02-10",
      contacto: "info@conciertorock.com / 1234567890",
      capacidad: 500,
      artistas: "Banda Sonora, Los Rítmicos, Ecos del Tiempo",
      estado: true,
    },
    {
      id: 'e2', // Unique ID
      foto: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/fb-cover-for-the-party-festival-design-template-e557f7cec2750b6e8995031080f35477_screen.jpg?ts=1566566381", // URL de imagen de ejemplo
      nombreEvento: "Festival de Jazz Internacional",
      generoMusical: "Jazz",
      descripcion: "Una noche elegante de jazz con artistas de renombre mundial. Disfruta de la música en un ambiente único.",
      ubicacion: "Teatro Nacional Sucre",
      fecha: "2025-03-20",
      contacto: "jazzfest@example.com / 0987654321",
      capacidad: 300,
      artistas: "Cuarteto Azul, Sonya Smith Trio, Big Band Jazz Fusion",
      estado: true,
    },
    {
      id: 'e3', // Unique ID
      foto: "https://t3.ftcdn.net/jpg/03/61/47/43/360_F_361474343_gC8Q1vUu8S9PzV4K0L9Lw8FzS7K2y3rD.jpg",
      nombreEvento: "Exposición de Arte Moderno",
      generoMusical: "Arte", // Considerar si 'generoMusical' es el campo adecuado para esto o si se necesita uno nuevo
      descripcion: "Descubre las últimas tendencias en arte moderno de artistas emergentes y consolidados.",
      ubicacion: "Galería de la Ciudad",
      fecha: "2025-04-05",
      contacto: "arteurbano@galeria.com / 1122334455",
      capacidad: 150,
      artistas: "Varios artistas contemporáneos",
      estado: false, // Example of inactive event
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
  const [currentEvento, setCurrentEvento] = useState(null); // Stores the full event object
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); // For sorting by date
  const [errors, setErrors] = useState({});

  const generosMusicales = [
    "Rock", "Pop", "Jazz", "Electrónica", "Hip-Hop", "Reggae", "Metal",
    "Blues", "Country", "Folk", "R&B", "Soul", "Funk", "Latina", "Reggaeton",
    "Clásica", "Alternativo", "Indie", "Cumbia", "Salsa", "Merengue", "Bachata",
    "World Music", "Otros"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 255, 140, 0.3)"
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" },
    tap: { scale: 0.95 }
  };

  const handleSearchChange = (e) => setSearchTerm(xss(e.target.value));

  const handleExportToExcel = () => {
    const dataToExport = filteredEventos.map(({ foto, ...rest }) => rest); // Exclude foto for Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
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
    setErrors({});
    setModalCrear(true);
  };

  const openModalEditar = (eventoToEdit) => {
    setCurrentEvento(eventoToEdit);
    setFormData(eventoToEdit);
    setErrors({});
    setModalEditar(true);
  };

  const openModalVer = (eventoToView) => {
    setCurrentEvento(eventoToView);
    setModalVer(true);
  };

  const closeModal = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalVer(false);
    setCurrentEvento(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "foto" ? files[0] : xss(value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreEvento) newErrors.nombreEvento = "Nombre del evento es obligatorio.";
    if (!formData.generoMusical) newErrors.generoMusical = "Género musical es obligatorio.";
    if (!formData.descripcion) newErrors.descripcion = "Descripción es obligatoria.";
    if (!formData.ubicacion) newErrors.ubicacion = "Ubicación es obligatoria.";
    if (!formData.fecha) newErrors.fecha = "Fecha es obligatoria.";
    if (!formData.contacto) newErrors.contacto = "Contacto es obligatorio.";
    if (!formData.capacidad || isNaN(formData.capacidad) || formData.capacidad <= 0) {
      newErrors.capacidad = "Capacidad debe ser un número positivo.";
    }
    if (!formData.artistas) newErrors.artistas = "Artistas son obligatorios.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEvento = () => {
    if (!validateForm()) return;
    setEventos([...eventos, { ...formData, id: Date.now().toString(), estado: true }]);
    Swal.fire("Éxito", "Evento agregado exitosamente", "success");
    closeModal();
  };

  const handleUpdateEvento = () => {
    if (!validateForm()) return;
    setEventos(prevEventos => prevEventos.map(evento =>
      evento.id === currentEvento.id ? { ...formData, id: currentEvento.id } : evento
    ));
    Swal.fire("Éxito", "Evento actualizado exitosamente", "success");
    closeModal();
  };

  const handleDeleteEvento = (eventoToDelete) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¡Estás a punto de desactivar "${eventoToDelete.nombreEvento}"! No podrás revertir esto directamente desde aquí.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactívalo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setEventos(prevEventos => prevEventos.map(evento =>
          evento.id === eventoToDelete.id ? { ...evento, estado: false } : evento
        ));
        Swal.fire(
          'Desactivado!',
          `El evento "${eventoToDelete.nombreEvento}" ha sido desactivado.`,
          'success'
        );
      }
    });
  };

  const handleRestoreEvento = (eventoToRestore) => {
    Swal.fire({
      title: '¿Quieres activar este evento?',
      text: `El evento "${eventoToRestore.nombreEvento}" estará visible de nuevo.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actívalo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setEventos(prevEventos => prevEventos.map(evento =>
          evento.id === eventoToRestore.id ? { ...evento, estado: true } : evento
        ));
        Swal.fire(
          'Activado!',
          `El evento "${eventoToRestore.nombreEvento}" ha sido activado.`,
          'success'
        );
      }
    });
  };

  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden font-inter">
      <div className="absolute inset-0 z-0 opacity-20" style={{
        background: `radial-gradient(circle at top left, #39FF14 0%, transparent 50%),
                     radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
        backgroundSize: "200% 200%",
        animation: "bg-pan 20s ease infinite",
      }}></div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #00FF8C;
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="relative z-10">
        <motion.div
          className="glass-card p-8 mb-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 md:mb-0">Gestión de Eventos</h1>
            <p className="text-lg opacity-90">Administra los eventos del sistema</p>
          </div>

          <motion.div
            className="glass-card p-3 rounded-lg flex items-center mt-4 md:mt-0"
            variants={cardVariants}
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="1500"
          >
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/dashboard" className="text-[#00FF8C] hover:underline">
                Inicio
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-white">Eventos</span>
            </nav>
          </motion.div>
        </motion.div>

        <motion.div
          className="glass-card p-6 mb-8 flex flex-wrap gap-4 items-center justify-between"
          variants={cardVariants}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <div className="relative flex-grow max-w-full md:max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar evento por nombre, género, ubicación o artistas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2 text-white font-semibold"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleFilterChange}
            >
              <FiFilter />
              {filterActive === "all" ? "Todos" : filterActive === "active" ? "Activos" : "Inactivos"}
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2 text-white font-semibold"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSortByDate}
            >
              {sortOrder === "asc" ? <FiArrowUp /> : <FiArrowDown />} Fecha {sortOrder === "asc" ? "Asc" : "Desc"}
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg flex items-center gap-2 text-white font-semibold"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleExportToExcel}
            >
              <FiDownload /> Exportar
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center gap-2 text-white font-semibold"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openModalCrear}
            >
              <FiPlusCircle /> Agregar Evento
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          data-aos="fade-up"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <AnimatePresence>
            {filteredEventos.length > 0 ? (
              filteredEventos.map((evento, index) => (
                <EventoCard
                  key={evento.id}
                  evento={evento}
                  index={index}
                  cardVariants={cardVariants}
                  openModalVer={openModalVer}
                  openModalEditar={openModalEditar}
                  handleDeleteEvento={handleDeleteEvento}
                  handleRestoreEvento={handleRestoreEvento}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full text-center text-gray-400 text-xl py-10"
              >
                No se encontraron eventos que coincidan con tu búsqueda o filtros.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddEvento}
              generosMusicales={generosMusicales}
              errors={errors}
              title="Agregar Evento"
            />
          )}

          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleUpdateEvento}
              generosMusicales={generosMusicales}
              errors={errors}
              title="Editar Evento"
            />
          )}

          {modalVer && (
            <ModalVer
              data={currentEvento}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- EventoCard Component ---
const EventoCard = ({ evento, index, cardVariants, openModalVer, openModalEditar, handleDeleteEvento, handleRestoreEvento }) => {
  return (
    <motion.div
      key={evento.id}
      className="glass-card p-6 rounded-t-3xl rounded-br-3xl rounded-bl-xl shadow-md transition-all duration-300 hover:scale-[1.015] flex flex-col"
      variants={cardVariants}
      whileHover="hover"
      layout
      data-aos="fade-up"
      data-aos-delay={index * 50}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{evento.nombreEvento}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${evento.estado ? "bg-green-500" : "bg-red-500"}`}>
              {evento.estado ? "Activo" : "Inactivo"}
            </span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
              onClick={() => openModalVer(evento)}
              title="Ver detalles"
            >
              <FiEye className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
              onClick={() => openModalEditar(evento)}
              title="Editar evento"
            >
              <FiEdit className="text-white" />
            </motion.button>
            {evento.estado ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                onClick={() => handleDeleteEvento(evento)}
                title="Desactivar evento"
              >
                <FiTrash2 className="text-white" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                onClick={() => handleRestoreEvento(evento)}
                title="Activar evento"
              >
                <FiRefreshCcw className="text-white" />
              </motion.button>
            )}
          </div>
        </div>

        <div className="mb-4 rounded-lg overflow-hidden flex-shrink-0">
          {evento.foto ? (
            <img
              src={typeof evento.foto === 'string' ? evento.foto : URL.createObjectURL(evento.foto)}
              className="w-full h-48 object-cover rounded-lg"
              alt={evento.nombreEvento}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/333333/FFFFFF?text=Sin+Imagen"; }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>

        <div className="flex-grow space-y-3">
          <div>
            <p className="text-sm text-gray-400">Género Musical</p>
            <p className="font-medium">{evento.generoMusical}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Ubicación</p>
            <p className="font-medium">{evento.ubicacion}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Fecha</p>
            <p className="font-medium">{evento.fecha}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Artistas</p>
            <p className="font-medium truncate">{evento.artistas}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- ModalFormulario Component ---
const ModalFormulario = ({ formData, onClose, onChange, onSave, generosMusicales, errors, title }) => {
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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto my-8 border border-white border-opacity-20 relative"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">{title}</h2>

        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="mb-4 text-center">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Imagen</label>
            {previewFotoUrl && (
              <img
                src={previewFotoUrl}
                alt="Vista previa"
                className="w-32 h-32 rounded-lg object-cover mx-auto mb-4 border border-gray-600"
              />
            )}
            <label
              htmlFor="foto"
              className="inline-block bg-[#00FF8C] text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#39FF14] transition font-semibold"
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
          </div>

          <div className="space-y-4">
            {[
              { label: "Nombre del Evento", name: "nombreEvento", type: "text" },
              { label: "Ubicación", name: "ubicacion", type: "text" },
              { label: "Fecha", name: "fecha", type: "date" },
              { label: "Contacto", name: "contacto", type: "text" },
              { label: "Capacidad", name: "capacidad", type: "number" },
              { label: "Artistas", name: "artistas", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold mb-1 text-gray-300">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={onChange}
                  className={`w-full p-3 bg-gray-800 border ${
                    errors[field.name] ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C]`}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-300">Género Musical</label>
              <select
                name="generoMusical"
                value={formData.generoMusical}
                onChange={onChange}
                className={`w-full p-3 bg-gray-800 border ${
                  errors.generoMusical ? "border-red-500" : "border-gray-700"
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C]`}
              >
                <option value="">Selecciona un género</option>
                {generosMusicales.map((genero, idx) => (
                  <option key={idx} value={genero}>
                    {genero}
                  </option>
                ))}
              </select>
              {errors.generoMusical && (
                <p className="text-red-500 text-sm mt-1">{errors.generoMusical}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-300">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={onChange}
                rows="3"
                className={`w-full p-3 bg-gray-800 border ${
                  errors.descripcion ? "border-red-500" : "border-gray-700"
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C]`}
              ></textarea>
              {errors.descripcion && (
                <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-gray-600 hover:to-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={onSave}
            className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg hover:from-[#39FF14] hover:to-[#00FF8C] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Guardar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- ModalVer Component ---
const ModalVer = ({ data, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md mx-auto my-8 border border-white border-opacity-20 relative"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles del Evento</h2>

        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            <div className="text-center mb-6">
              {data.foto ? (
                <img
                  src={typeof data.foto === 'string' ? data.foto : URL.createObjectURL(data.foto)}
                  alt="Evento"
                  className="w-40 h-40 rounded-lg object-cover mx-auto border border-gray-600 shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/333333/FFFFFF?text=Sin+Imagen"; }}
                />
              ) : (
                <div className="w-40 h-40 bg-gray-700 rounded-lg flex items-center justify-center mx-auto border border-gray-600 shadow-md">
                  <span className="text-gray-400 text-lg">Sin foto</span>
                </div>
              )}
            </div>

            {[
              { label: "Nombre del Evento", value: data.nombreEvento },
              { label: "Género Musical", value: data.generoMusical },
              { label: "Ubicación", value: data.ubicacion },
              { label: "Fecha", value: data.fecha },
              { label: "Contacto", value: data.contacto },
              { label: "Capacidad", value: data.capacidad },
              { label: "Artistas", value: data.artistas },
              { label: "Descripción", value: data.descripcion },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
                <p className="text-lg text-white bg-gray-800 p-3 rounded-lg border border-gray-700">{item.value}</p>
              </div>
            ))}

            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-1 text-gray-300">Estado</label>
              <span className={`px-4 py-2 rounded-full text-base font-bold w-fit ${
                data.estado ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}>
                {data.estado ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg hover:from-[#39FF14] hover:to-[#00FF8C] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// PropTypes for type checking
EventoCard.propTypes = {
  evento: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  cardVariants: PropTypes.object.isRequired,
  openModalVer: PropTypes.func.isRequired,
  openModalEditar: PropTypes.func.isRequired,
  handleDeleteEvento: PropTypes.func.isRequired,
  handleRestoreEvento: PropTypes.func.isRequired,
};

ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  generosMusicales: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Eventos;