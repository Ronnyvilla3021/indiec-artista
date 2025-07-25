import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiDownload,
  FiFilter,
  FiPlusCircle,
  FiSearch,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:9000',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "Ocurrió un error inesperado.";
    if (error.response) {
      errorMessage = error.response.data.message || error.response.statusText;
      console.error("Error en la respuesta del API:", error.response.data);
    } else if (error.request) {
      errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      console.error("Error de conexión:", error.request);
    } else {
      errorMessage = error.message;
      console.error("Error de Axios:", error.message);
    }
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      background: "#1a1a1a",
      confirmButtonColor: "#00FF8C",
      color: "#ffffff",
    });
    return Promise.reject(error);
  }
);

const Musica = () => {
  useEffect(() => {
    AOS.init({ once: true, mirror: false });
    AOS.refresh();
    fetchCanciones();
  }, []);

  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    idCancion: null,
    foto: null,
    titulo: "",
    album: "",
    duracion: "",
    año: "",
    genero: "",
    estado: "activo",
    artistaIdArtista: "",
    albumeIdAlbum: "",
  });
  const [previewFoto, setPreviewFoto] = useState(null);
  const [currentCancion, setCurrentCancion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [errors, setErrors] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

  const generos = [
    "Rock", "Pop", "Jazz", "Clásica", "Electrónica",
    "Hip-Hop", "Reggae", "Metal", "Salsa", "Merengue",
    "Cumbia", "Bachata", "Reggaeton", "Indie", "Blues", "Country"
  ];

  const fetchCanciones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/canciones/lista');
      const cancionesFetched = response.data.data.map(song => ({
        idCancion: song.idCancion,
        titulo: song.titulo,
        album: song.album,
        año: song.año,
        estado: song.estado,
        duracion: song.detallesMongo?.duracion || 'N/A',
        genero: song.detallesMongo?.genero || 'N/A',
        foto: song.detallesMongo?.imagen ? `${api.defaults.baseURL}/uploads/${song.detallesMongo.imagen}` : null,
      }));
      setCanciones(cancionesFetched);
    } catch (error) {
      console.error("Error al cargar canciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCancion = async () => {
    if (!validateForm()) return;

    const dataToSend = new FormData();
    dataToSend.append('titulo', formData.titulo);
    dataToSend.append('album', formData.album);
    dataToSend.append('año', formData.año);
    dataToSend.append('duracion', formData.duracion);
    dataToSend.append('genero', formData.genero);
    dataToSend.append('artistaIdArtista', formData.artistaIdArtista);
    dataToSend.append('albumeIdAlbum', formData.albumeIdAlbum);
    if (formData.foto) {
      dataToSend.append('imagen', formData.foto);
    }

    try {
      const response = await api.post('/canciones/crear', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire({
        icon: "success",
        title: "Canción agregada",
        text: response.data.message || `La canción "${formData.titulo}" fue agregada exitosamente.`,
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
      closeModal();
      fetchCanciones();
    } catch (error) {
      console.error("Error al agregar canción:", error);
    }
  };

  const handleUpdateCancion = async () => {
    if (!validateForm()) return;
    if (!formData.idCancion) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de canción no encontrado para actualizar.",
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
      return;
    }

    const updated = [...canciones];
    updated[currentCancion] = { ...formData };
    setCanciones(updated);
    Swal.fire({
      icon: "success",
      title: "Canción actualizada (solo frontend)",
      text: `La canción "${formData.titulo}" fue actualizada exitosamente en el frontend.`,
      background: "#1a1a1a",
      confirmButtonColor: "#00FF8C",
      color: "#ffffff",
    });
    closeModal();
  };

  const handleDeleteCancion = async (idCancion, titulo) => {
    const updated = [...canciones];
    const index = updated.findIndex(c => c.idCancion === idCancion);
    if (index !== -1) {
      updated[index].estado = "inactivo";
      setCanciones(updated);
      Swal.fire({
        icon: "info",
        title: "Canción desactivada (solo frontend)",
        text: `La canción "${titulo}" fue marcada como inactiva en el frontend.`,
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
    }
  };

  const handleRestoreCancion = async (idCancion, titulo) => {
    const updated = [...canciones];
    const index = updated.findIndex(c => c.idCancion === idCancion);
    if (index !== -1) {
      updated[index].estado = "activo";
      setCanciones(updated);
      Swal.fire({
        icon: "success",
        title: "Canción activada (solo frontend)",
        text: `La canción "${titulo}" fue activada exitosamente en el frontend.`,
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
    }
  };

  const openModalCrear = () => {
    setFormData({
      foto: null,
      titulo: "",
      album: "",
      duracion: "",
      año: "",
      genero: "",
      estado: "activo",
      artistaIdArtista: "",
      albumeIdAlbum: "",
    });
    setPreviewFoto(null);
    setErrors({});
    setModalCrear(true);
  };

  const openModalEditar = (cancion) => {
    setCurrentCancion(cancion.idCancion);
    setFormData({
      idCancion: cancion.idCancion,
      foto: cancion.foto,
      titulo: cancion.titulo,
      album: cancion.album,
      duracion: cancion.duracion,
      año: cancion.año,
      genero: cancion.genero,
      estado: cancion.estado,
      artistaIdArtista: cancion.artistaIdArtista || "",
      albumeIdAlbum: cancion.albumeIdAlbum || "",
    });
    setPreviewFoto(cancion.foto);
    setErrors({});
    setModalEditar(true);
  };

  const openModalVer = (cancion) => {
    setCurrentCancion(cancion);
    setModalVer(true);
  };

  const closeModal = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalVer(false);
    setErrors({});
    setCurrentCancion(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files.length > 0) {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewFoto(objectUrl);
      setFormData((prev) => ({ ...prev, foto: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo) newErrors.titulo = "El título es obligatorio";
    if (!formData.album) newErrors.album = "El álbum es obligatorio";
    if (!formData.duracion) newErrors.duracion = "La duración es obligatoria";
    if (!formData.año) newErrors.año = "El año es obligatorio";
    if (isNaN(parseInt(formData.año)) || formData.año.toString().length !== 4)
      newErrors.año = "El año debe ser un número de 4 dígitos";
    if (!formData.genero) newErrors.genero = "El género es obligatorio";
    if (!formData.artistaIdArtista) newErrors.artistaIdArtista = "El ID de Artista es obligatorio";
    if (isNaN(parseInt(formData.artistaIdArtista))) newErrors.artistaIdArtista = "El ID de Artista debe ser un número";
    if (!formData.albumeIdAlbum) newErrors.albumeIdAlbum = "El ID de Álbum es obligatorio";
    if (isNaN(parseInt(formData.albumeIdAlbum))) newErrors.albumeIdAlbum = "El ID de Álbum debe ser un número";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterStatusChange = () => {
    setFilterStatus((prev) => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCanciones.map((c) => ({
        ID_SQL: c.idCancion,
        Título: c.titulo,
        Álbum: c.album,
        Duración: c.duracion,
        Año: c.año,
        Género: c.genero,
        Estado: c.estado === 'activo' ? 'Activo' : 'Inactivo',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Canciones");
    XLSX.writeFile(workbook, "canciones.xlsx");
  };

  const handleSortByYear = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const filteredCanciones = canciones
    .filter((c) => c.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((c) => {
      if (filterStatus === "all") return true;
      return filterStatus === "active" ? c.estado === "activo" : c.estado === "inactivo";
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.año - b.año;
      } else {
        return b.año - a.año;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(circle at top left, #39FF14 0%, transparent 50%),
                         radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
          backgroundSize: "200% 200%",
          animation: "bg-pan 20s ease infinite",
        }}
      ></div>

      <style jsx>{`
        @keyframes bg-pan {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          border-radius: 1.5rem;
        }
      `}</style>

      <div className="relative z-10">
        <motion.div
          className="glass-card p-8 mb-8 flex justify-between items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          data-aos="fade-down"
        >
          <div>
            <h1 className="text-4xl font-bold">Canciones</h1>
            <p className="text-lg opacity-90">Administra tus canciones</p>
          </div>
          <motion.div className="glass-card p-3 rounded-lg flex items-center">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/dashboard" className="text-[#00FF8C] hover:underline">Inicio</Link>
              <span className="text-gray-500">/</span>
              <span className="text-white">Canciones</span>
            </nav>
          </motion.div>
        </motion.div>

        <motion.div
          className="glass-card p-6 mb-8 flex flex-wrap gap-4"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
          }}
          initial="hidden"
          animate="visible"
          data-aos="fade-down"
        >
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar canción..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFilterStatusChange}
            >
              <FiFilter />
              {filterStatus === "all" ? "Todos" : filterStatus === "active" ? "Activos" : "Inactivos"}
            </motion.button>

            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSortByYear}
            >
              <FiFilter /> Año ({sortOrder === "asc" ? "Asc" : "Desc"})
            </motion.button>

            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportToExcel}
            >
              <FiDownload /> Exportar
            </motion.button>

            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={openModalCrear}
            >
              <FiPlusCircle /> Agregar Canción
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
          data-aos="fade-up"
        >
          <AnimatePresence>
            {filteredCanciones.map((cancion) => (
              <motion.div
                key={cancion.idCancion}
                className="glass-card p-6 rounded-t-3xl rounded-br-3xl rounded-bl-xl shadow-md transition-all duration-300 hover:scale-[1.015]"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
                  hover: { y: -5, boxShadow: "0 10px 25px rgba(0, 255, 140, 0.3)" }
                }}
                whileHover="hover"
                layout
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{cancion.titulo}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        cancion.estado === "activo" ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {cancion.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 rounded-full"
                        onClick={() => openModalVer(cancion)}
                      >
                        <FiEye className="text-white" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-yellow-500 rounded-full"
                        onClick={() => openModalEditar(cancion)}
                      >
                        <FiEdit className="text-white" />
                      </motion.button>
                      {cancion.estado === "activo" ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteCancion(cancion.idCancion, cancion.titulo)}
                        >
                          <FiTrash2 className="text-white" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreCancion(cancion.idCancion, cancion.titulo)}
                        >
                          <FiRefreshCcw className="text-white" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg overflow-hidden">
                    {cancion.foto ? (
                      <img
                        src={cancion.foto}
                        className="w-full h-48 object-cover rounded-lg"
                        alt={cancion.titulo}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Álbum</p>
                      <p className="font-medium">{cancion.album}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Duración</p>
                      <p className="font-medium">{cancion.duracion}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">Año</p>
                        <p className="font-medium">{cancion.año}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Género</p>
                        <p className="font-medium">{cancion.genero}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddCancion}
              errors={errors}
              title="Agregar Canción"
              previewFotoUrl={previewFoto}
              generos={generos}
              isEditing={false}
            />
          )}

          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleUpdateCancion}
              errors={errors}
              title="Editar Canción"
              previewFotoUrl={previewFoto}
              generos={generos}
              isEditing={true}
            />
          )}

          {modalVer && currentCancion && (
            <ModalVer data={currentCancion} onClose={closeModal} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Componente ModalFormulario mejorado
const ModalFormulario = ({ formData, onClose, onChange, onSave, errors, title, previewFotoUrl, generos, isEditing }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative glass-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white border-opacity-20"
      >
        <div className="sticky top-0 z-10 bg-gray-800 bg-opacity-90 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 64px)' }}>
          <div className="mb-4 text-center">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Imagen de Portada</label>
            {previewFotoUrl && (
              <img
                src={previewFotoUrl}
                alt="Vista previa"
                className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
              />
            )}
            <label
              htmlFor="foto"
              className="inline-block bg-[#00FF8C] text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#39FF14] transition"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Título", name: "titulo", type: "text", fullWidth: true },
              { label: "Álbum", name: "album", type: "text", fullWidth: true },
              { label: "Duración (ej. 3:45)", name: "duracion", type: "text" },
              { label: "Año", name: "año", type: "number" },
            ].map((field) => (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-semibold mb-1 text-gray-300">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={onChange}
                  className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${
                    errors[field.name] ? "border-red-500" : ""
                  }`}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-300">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={onChange}
                className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${
                  errors.genero ? "border-red-500" : ""
                }`}
              >
                <option value="">Selecciona un género</option>
                {generos.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero}</p>}
            </div>

            {!isEditing && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-300">ID Artista</label>
                  <input
                    type="number"
                    name="artistaIdArtista"
                    value={formData.artistaIdArtista}
                    onChange={onChange}
                    className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${
                      errors.artistaIdArtista ? "border-red-500" : ""
                    }`}
                  />
                  {errors.artistaIdArtista && (
                    <p className="text-red-500 text-sm mt-1">{errors.artistaIdArtista}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-300">ID Álbum</label>
                  <input
                    type="number"
                    name="albumeIdAlbum"
                    value={formData.albumeIdAlbum}
                    onChange={onChange}
                    className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${
                      errors.albumeIdAlbum ? "border-red-500" : ""
                    }`}
                  />
                  {errors.albumeIdAlbum && (
                    <p className="text-red-500 text-sm mt-1">{errors.albumeIdAlbum}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-800 bg-opacity-90 p-4 border-t border-gray-700 flex justify-end space-x-3">
          <motion.button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={onSave}
            className="px-6 py-2 bg-[#00FF8C] text-gray-900 rounded-lg hover:bg-[#39FF14] transition font-semibold"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Guardar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente ModalVer mejorado
const ModalVer = ({ data, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative glass-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white border-opacity-20"
      >
        <div className="sticky top-0 z-10 bg-gray-800 bg-opacity-90 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Detalles de la Canción</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 64px)' }}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                {data.foto ? (
                  <img
                    src={data.foto}
                    alt="Canción"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </div>
            </div>

            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "ID Canción", value: data.idCancion },
                  { label: "Título", value: data.titulo },
                  { label: "Álbum", value: data.album },
                  { label: "Duración", value: data.duracion },
                  { label: "Año", value: data.año },
                  { label: "Género", value: data.genero },
                ].map((item) => (
                  <div key={item.label}>
                    <label className="block text-sm font-semibold text-gray-400">{item.label}</label>
                    <p className="text-lg text-white mt-1">{item.value || 'N/A'}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-400">Estado</label>
                <span
                  className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold ${
                    data.estado === "activo" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {data.estado === "activo" ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-800 bg-opacity-90 p-4 border-t border-gray-700 flex justify-end">
          <motion.button
            onClick={onClose}
            className="px-6 py-2 bg-[#00FF8C] text-gray-900 rounded-lg hover:bg-[#39FF14] transition font-semibold"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Musica;