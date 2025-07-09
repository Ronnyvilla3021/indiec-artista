import { useState, useEffect } from "react"; // Hooks de React para estado y efectos
import { motion, AnimatePresence } from "framer-motion"; // Para animaciones
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiDownload,
  FiFilter, // Renamed from FiSort (assuming it's used for toggling status filter)
  FiPlusCircle,
  FiSearch,
  FiExternalLink, // Added for external link icon, though not directly used in 'Musica' context, it was in 'GrupoMusical'
} from "react-icons/fi"; // Iconos de Feather Icons
import { Link } from "react-router-dom"; // Para navegación
import * as XLSX from "xlsx"; // Para exportar a Excel
import Swal from "sweetalert2"; // Librería para alertas/mensajes bonitos
import AOS from "aos"; // Para animaciones al hacer scroll
import "aos/dist/aos.css"; // Estilos de AOS

const Musica = () => {
  // Inicializa animaciones al cargar el componente
  useEffect(() => {
    AOS.init({
      once: true, // Las animaciones solo se ejecutan una vez
      mirror: false, // No se repiten al hacer scroll inverso
    });
    AOS.refresh(); // Forza la actualización de animaciones
  }, []);

  // Estado para almacenar la lista de canciones
  const [canciones, setCanciones] = useState([
    // Datos de ejemplo
    {
      foto: "https://marketplace.canva.com/EAF2uOSjdVU/1/0/1600w/canva-negro-p%C3%BArpura-brillante-%C3%A1cido-brutalista-general-hip-hop-portada-de-%C3%A1lbum-TuLZGoZHXtA.jpg",
      titulo: "Canción 1",
      album: "Álbum 1",
      duracion: "3:45",
      año: 2020,
      genero: "Rock",
      estado: "Activo", // Renamed 'activo' to 'estado' for consistency
    },
    {
      foto: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/techno-music-album-cover-template-design-54ad7cf78c858c37ba141bb421ac79ee_screen.jpg?ts=1742997697",
      titulo: "Canción 2",
      album: "Álbum 2",
      duracion: "4:20",
      año: 2021,
      genero: "Pop",
      estado: "Activo",
    },
    {
      foto: "https://www.oldskull.net/wp-content/uploads/2015/01/Rock_Covers-ilustracion-oldskull-15.jpg",
      titulo: "Another Track",
      album: "The Best Of",
      duracion: "3:10",
      año: 2018,
      genero: "Jazz",
      estado: "Inactivo",
    },
  ]);

  const generos = [
    "Rock",
    "Pop",
    "Jazz",
    "Clásica",
    "Electrónica",
    "Hip-Hop",
    "Reggae",
    "Metal",
  ];

  // Estados para controlar los modales
  const [modalCrear, setModalCrear] = useState(false); // Modal crear canción
  const [modalEditar, setModalEditar] = useState(false); // Modal editar canción
  const [modalVer, setModalVer] = useState(false); // Modal ver detalles

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    foto: null, // Imagen de la canción/álbum
    titulo: "", // Título
    album: "", // Álbum
    duracion: "", // Duración
    año: "", // Año
    genero: "", // Género
    estado: "Activo", // Estado activo/inactivo
  });

  // Estados adicionales
  const [previewFoto, setPreviewFoto] = useState(null); // Preview de imagen para el modal
  const [currentCancion, setCurrentCancion] = useState(null); // Canción seleccionada
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [filterStatus, setFilterStatus] = useState("all"); // Filtro (todos/activos/inactivos)
  const [errors, setErrors] = useState({}); // Errores de validación
  const [sortOrder, setSortOrder] = useState("asc"); // Orden de la tabla (asc/desc)

  // Configuración de animaciones para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 }, // Estado inicial invisible
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }, // Aparece con animación escalonada
  };

  // Animaciones para las tarjetas de canción
  const cardVariants = {
    hidden: { y: 20, opacity: 0 }, // Inicia abajo y transparente
    visible: {
      y: 0, // Termina en posición normal
      opacity: 1, // Totalmente visible
      transition: { type: "spring", stiffness: 100 }, // Con efecto de resorte
    },
    hover: {
      // Efecto al pasar el mouse
      y: -5, // Se eleva ligeramente
      boxShadow: "0 10px 25px rgba(0, 255, 140, 0.3)", // Sombra verde
    },
  };

  // Animaciones para botones
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" }, // Efecto al pasar mouse
    tap: { scale: 0.95 }, // Efecto al hacer clic
  };

  // Abre modal para crear nueva canción (resetea el formulario)
  const openModalCrear = () => {
    setFormData({
      foto: null,
      titulo: "",
      album: "",
      duracion: "",
      año: "",
      genero: "",
      estado: "Activo",
    });
    setPreviewFoto(null);
    setErrors({});
    setModalCrear(true);
  };

  // Abre modal para editar canción (carga datos existentes)
  const openModalEditar = (index) => {
    setCurrentCancion(index); // Guarda índice de la canción
    setFormData(canciones[index]); // Carga datos al formulario
    setPreviewFoto(canciones[index].foto); // Carga la foto para previsualización
    setErrors({});
    setModalEditar(true); // Abre modal
  };

  // Abre modal para ver detalles de canción
  const openModalVer = (index) => {
    setCurrentCancion(index); // Guarda índice
    setModalVer(true); // Abre modal
  };

  // Cierra todos los modales
  const closeModal = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalVer(false);
    setErrors({}); // Limpia errores al cerrar
  };

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files.length > 0) {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewFoto(objectUrl); // Actualiza la URL para la previsualización
      setFormData((prev) => ({ ...prev, foto: file })); // Guarda el objeto File
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Valida los campos del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo) newErrors.titulo = "El título es obligatorio";
    if (!formData.album) newErrors.album = "El álbum es obligatorio";
    if (!formData.duracion) newErrors.duracion = "La duración es obligatoria";
    if (!formData.año) newErrors.año = "El año es obligatorio";
    if (isNaN(formData.año) || formData.año.length !== 4)
      newErrors.año = "El año debe ser un número de 4 dígitos";
    if (!formData.genero) newErrors.genero = "El género es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  // Agrega una nueva canción a la lista
  const handleAddCancion = () => {
    if (!validateForm()) return; // Valida antes de agregar
    setCanciones([...canciones, { ...formData, estado: "Activo" }]); // Añade nueva canción
    Swal.fire({
      icon: "success",
      title: "Canción agregada",
      text: `La canción "${formData.titulo}" fue agregada exitosamente.`,
      background: "#1a1a1a",
      confirmButtonColor: "#00FF8C",
      color: "#ffffff",
    });
    closeModal(); // Cierra modal
  };

  // Actualiza una canción existente
  const handleUpdateCancion = () => {
    if (!validateForm()) return; // Valida primero
    const updated = [...canciones]; // Copia el array
    updated[currentCancion] = { ...formData }; // Actualiza la canción seleccionada
    setCanciones(updated); // Guarda cambios
    Swal.fire({
      icon: "success",
      title: "Canción actualizada",
      text: `La canción "${formData.titulo}" fue actualizada exitosamente.`,
      background: "#1a1a1a",
      confirmButtonColor: "#00FF8C",
      color: "#ffffff",
    });
    closeModal(); // Cierra modal
  };

  // "Elimina" una canción (la marca como inactiva)
  const handleDeleteCancion = (index) => {
    const updated = [...canciones]; // Copia array
    updated[index].estado = "Inactivo"; // Marca como inactiva
    setCanciones(updated); // Guarda cambios
    Swal.fire({
      icon: "info",
      title: "Canción desactivada",
      text: "La canción fue marcada como inactiva.",
      background: "#1a1a1a",
      confirmButtonColor: "#00FF8C",
      color: "#ffffff",
    });
  };

  // Reactiva una canción (la marca como activa)
  const handleRestoreCancion = (index) => {
    const updated = [...canciones]; // Copia array
    updated[index].estado = "Activo"; // Marca como activa
    setCanciones(updated); // Guarda cambios
    Swal.fire({
      icon: "success",
      title: "Canción activada",
      text: "La canción fue activada exitosamente.",
      background: "#1a1a1a",
      confirmButtonColor: "#00FF8C",
      color: "#ffffff",
    });
  };

  // Maneja cambios en el campo de búsqueda
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Alterna el filtro de estado (todos/activos/inactivos)
  const handleFilterStatusChange = () => {
    setFilterStatus((prev) => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  // Exporta las canciones a Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCanciones.map((c) => ({
        Título: c.titulo,
        Álbum: c.album,
        Duración: c.duracion,
        Año: c.año,
        Género: c.genero,
        Estado: c.estado,
      }))
    ); // Crea hoja de cálculo
    const workbook = XLSX.utils.book_new(); // Crea libro de Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Canciones"); // Añade hoja
    XLSX.writeFile(workbook, "canciones.xlsx"); // Descarga el archivo
  };

  // Función de ordenamiento por año
  const handleSortByYear = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  // Filtra y ordena canciones
  const filteredCanciones = canciones
    .filter((c) => c.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((c) => {
      if (filterStatus === "all") return true;
      return filterStatus === "active" ? c.estado === "Activo" : c.estado === "Inactivo";
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.año - b.año;
      } else {
        return b.año - a.año;
      }
    });

  // Renderizado del componente
  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
      {/* Fondo animado con gradientes */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(circle at top left, #39FF14 0%, transparent 50%),
                         radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
          backgroundSize: "200% 200%",
          animation: "bg-pan 20s ease infinite",
        }}
      ></div>

      {/* Estilos CSS-in-JS para el fondo animado y efecto "glass" */}
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

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Encabezado con animación - ahora con flex para alinear título y breadcrumbs */}
        <motion.div
          className="glass-card p-8 mb-8 flex justify-between items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <div>
            <h1 className="text-4xl font-bold">Canciones</h1>
            <p className="text-lg opacity-90">Administra tus canciones</p>
          </div>

          {/* Migas de pan (breadcrumbs) - ahora en la derecha y más compacto */}
          <motion.div
            className="glass-card p-3 rounded-lg flex items-center"
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
              <span className="text-white">Canciones</span>
            </nav>
          </motion.div>
        </motion.div>

        {/* Barra de búsqueda y acciones */}
        <motion.div
          className="glass-card p-6 mb-8 flex flex-wrap gap-4"
          variants={cardVariants}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          {/* Input de búsqueda con icono */}
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

          {/* Botones de acciones */}
          <div className="flex gap-2 flex-wrap">
            {/* Botón de filtro (alterna entre todos/activos/inactivos) */}
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleFilterStatusChange}
            >
              <FiFilter />
              {filterStatus === "all"
                ? "Todos"
                : filterStatus === "active"
                ? "Activos"
                : "Inactivos"}
            </motion.button>

            {/* Botón para ordenar por año */}
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSortByYear}
            >
              <FiFilter /> Año ({sortOrder === "asc" ? "Asc" : "Desc"})
            </motion.button>

            {/* Botón para exportar a Excel */}
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleExportToExcel}
            >
              <FiDownload /> Exportar
            </motion.button>

            {/* Botón para agregar nueva canción */}
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openModalCrear}
            >
              <FiPlusCircle /> Agregar Canción
            </motion.button>
          </div>
        </motion.div>

        {/* Lista de canciones */}
        <motion.div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", display: "grid" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          data-aos="fade-up"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          {/* Componente para animar entradas/salidas */}
          <AnimatePresence>
            {/* Mapea cada canción filtrada a una tarjeta */}
            {filteredCanciones.map((cancion, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-t-3xl rounded-br-3xl rounded-bl-xl shadow-md transition-all duration-300 hover:scale-[1.015]"
                variants={cardVariants}
                whileHover="hover"
                layout
              >
                <div className="flex flex-col h-full">
                  {/* Encabezado de la tarjeta con nombre y acciones */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{cancion.titulo}</h3>
                      {/* Badge de estado (activo/inactivo) */}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          cancion.estado === "Activo" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {cancion.estado}
                      </span>
                    </div>
                    {/* Botones de acciones para cada canción */}
                    <div className="flex gap-2">
                      {/* Botón para ver detalles */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 rounded-full"
                        onClick={() => openModalVer(index)}
                      >
                        <FiEye className="text-white" />
                      </motion.button>
                      {/* Botón para editar */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-yellow-500 rounded-full"
                        onClick={() => openModalEditar(index)}
                      >
                        <FiEdit className="text-white" />
                      </motion.button>
                      {/* Botón para eliminar o reactivar según estado */}
                      {cancion.estado === "Activo" ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteCancion(index)}
                        >
                          <FiTrash2 className="text-white" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreCancion(index)}
                        >
                          <FiRefreshCcw className="text-white" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Imagen del álbum/canción */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    {cancion.foto ? (
                      <img
                        src={typeof cancion.foto === "string" ? cancion.foto : URL.createObjectURL(cancion.foto)}
                        className="w-full h-48 object-cover rounded-lg"
                        alt={cancion.titulo}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Información de la canción */}
                  <div className="flex-grow space-y-3">
                    {/* Álbum */}
                    <div>
                      <p className="text-sm text-gray-400">Álbum</p>
                      <p className="font-medium">{cancion.album}</p>
                    </div>

                    {/* Duración */}
                    <div>
                      <p className="text-sm text-gray-400">Duración</p>
                      <p className="font-medium">{cancion.duracion}</p>
                    </div>

                    {/* Año y Género */}
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

        {/* Modales (se muestran condicionalmente) */}
        <AnimatePresence>
          {/* Modal para crear nueva canción */}
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
            />
          )}

          {/* Modal para editar canción existente */}
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
            />
          )}

          {/* Modal para ver detalles de canción */}
          {modalVer && (
            <ModalVer data={canciones[currentCancion]} onClose={closeModal} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Componente para el modal de formulario (crear/editar)
const ModalFormulario = ({ formData, onClose, onChange, onSave, errors, title, previewFotoUrl, generos }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">{title}</h2>

        {/* Sección para subir imagen */}
        <div className="mb-4 text-center">
          <label className="block text-sm font-semibold mb-2 text-gray-300">Imagen de Portada</label>
          {/* Muestra previsualización si existe */}
          {previewFotoUrl && (
            <img
              src={previewFotoUrl}
              alt="Vista previa"
              className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
            />
          )}
          {/* Input para subir imagen (oculto) con botón personalizado */}
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
        </div>

        {/* Campos del formulario */}
        <div className="space-y-4">
          {[
            { label: "Título", name: "titulo", type: "text" },
            { label: "Álbum", name: "album", type: "text" },
            { label: "Duración (ej. 3:45)", name: "duracion", type: "text" },
            { label: "Año", name: "año", type: "number" },
          ].map((field) => (
            <div key={field.name}>
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
              {/* Muestra error de validación si existe */}
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Selector de Género */}
          <div>
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
        </div>

        {/* Botones del modal */}
        <div className="flex justify-end space-x-3 mt-8">
          {/* Botón para cancelar */}
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancelar
          </motion.button>
          {/* Botón para guardar */}
          <motion.button
            onClick={onSave}
            className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg"
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

// Componente para el modal de visualización de detalles
const ModalVer = ({ data, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles de la Canción</h2>

        <div className="space-y-4">
          {/* Imagen de la canción */}
          <div className="text-center">
            {data.foto ? (
              <img
                src={typeof data.foto === "string" ? data.foto : URL.createObjectURL(data.foto)}
                alt="Canción"
                className="w-32 h-32 rounded-lg object-cover mx-auto"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-gray-400">Sin foto</span>
              </div>
            )}
          </div>

          {/* Muestra todos los datos de la canción */}
          {[
            { label: "Título", value: data.titulo },
            { label: "Álbum", value: data.album },
            { label: "Duración", value: data.duracion },
            { label: "Año", value: data.año },
            { label: "Género", value: data.genero },
          ].map((item) => (
            <div key={item.label}>
              <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
              <p className="text-lg text-white">{item.value}</p>
            </div>
          ))}

          {/* Estado de la canción */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Estado</label>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                data.estado === "Activo" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {data.estado}
            </span>
          </div>
        </div>

        {/* Botón para cerrar el modal */}
        <div className="flex justify-end mt-8">
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg"
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

export default Musica;