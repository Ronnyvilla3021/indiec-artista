import { useState, useEffect } from "react"; // Hooks de React para estado y efectos
import Swal from "sweetalert2"; // Librería para alertas/mensajes bonitos
import { motion, AnimatePresence } from "framer-motion"; // Para animaciones
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiDownload,
  FiFilter,
  FiPlusCircle,
  FiSearch,
  FiExternalLink
} from "react-icons/fi"; // Iconos de Feather Icons
import { Link } from "react-router-dom"; // Para navegación
import * as XLSX from "xlsx"; // Para exportar a Excel
import AOS from 'aos'; // Para animaciones al hacer scroll
import 'aos/dist/aos.css'; // Estilos de AOS

const GrupoMusical = () => {
  // Inicializa animaciones al cargar el componente
  useEffect(() => {
    AOS.init({
      once: true, // Las animaciones solo se ejecutan una vez
      mirror: false, // No se repiten al hacer scroll inverso
    });
    AOS.refresh(); // Forza la actualización de animaciones
  }, []);

  // Estado para almacenar la lista de grupos musicales
  const [grupos, setGrupos] = useState([
    // Datos de ejemplo
    {
      foto: "https://www.wallpaperflare.com/static/358/451/736/music-black-sabbath-heavy-metal-black-wallpaper.jpg", // URL de imagen
      nombreGrupo: "Black Sabbath", // Nombre del grupo
      generoMusical: "Rock", // Género musical
      descripcion: "Banda de rock ", // Descripción
      plataforma: "Spotify", // Plataforma de música
      url: "https://spotify.com/grupo1", // Enlace
      activo: true, // Estado activo/inactivo
    },
    {
      foto: "https://cdn.worldvectorlogo.com/logos/ac-dc-1.svg", // URL de imagen
      nombreGrupo: "AC/DC", // Nombre del grupo
      generoMusical: "Rock", // Género musical
      descripcion: "Banda de rock clásico", // Descripción
      plataforma: "Spotify", // Plataforma de música
      url: "https://spotify.com/grupo1", // Enlace
      activo: true, // Estado activo/inactivo
    },
    {
      foto: "https://1000marcas.net/wp-content/uploads/2020/03/Red-hot-chili-peppers-Fuente.jpg", // URL de imagen
      nombreGrupo: "red hot chili peppers", // Nombre del grupo
      generoMusical: "Rock", // Género musical
      descripcion: "Banda de rock", // Descripción
      plataforma: "Spotify", // Plataforma de música
      url: "https://spotify.com/grupo1", // Enlace
      activo: true, // Estado activo/inactivo
    },

  ]);

  // Estados para controlar los modales
  const [modalCrear, setModalCrear] = useState(false); // Modal crear grupo
  const [modalEditar, setModalEditar] = useState(false); // Modal editar grupo
  const [modalVer, setModalVer] = useState(false); // Modal ver detalles

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    foto: null, // Imagen del grupo
    nombreGrupo: "", // Nombre
    generoMusical: "", // Género
    descripcion: "", // Descripción
    plataforma: "", // Plataforma
    url: "", // Enlace
  });

  // Estados adicionales
  const [currentGrupo, setCurrentGrupo] = useState(null); // Grupo seleccionado
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [filterActive, setFilterActive] = useState("all"); // Filtro (todos/activos/inactivos)
  const [errors, setErrors] = useState({}); // Errores de validación

  // Configuración de animaciones para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 }, // Estado inicial invisible
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } } // Aparece con animación escalonada
  };

  // Animaciones para las tarjetas de grupo
  const cardVariants = {
    hidden: { y: 20, opacity: 0 }, // Inicia abajo y transparente
    visible: {
      y: 0, // Termina en posición normal
      opacity: 1, // Totalmente visible
      transition: { type: "spring", stiffness: 100 } // Con efecto de resorte
    },
    hover: { // Efecto al pasar el mouse
      y: -5, // Se eleva ligeramente
      boxShadow: "0 10px 25px rgba(0, 255, 140, 0.3)" // Sombra verde
    }
  };

  // Animaciones para botones
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" }, // Efecto al pasar mouse
    tap: { scale: 0.95 } // Efecto al hacer clic
  };

  // Maneja cambios en el campo de búsqueda
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Exporta los grupos a Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredGrupos); // Crea hoja de cálculo
    const workbook = XLSX.utils.book_new(); // Crea libro de Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grupos Musicales"); // Añade hoja
    XLSX.writeFile(workbook, "grupos_musicales.xlsx"); // Descarga el archivo
  };

  // Cambia entre filtros (todos/activos/inactivos)
  const handleFilterChange = () => {
    setFilterActive(prev => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  // Filtra grupos según término de búsqueda y estado
  const filteredGrupos = grupos
    .filter(grupo => grupo.nombreGrupo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(grupo => {
      if (filterActive === "all") return true;
      return filterActive === "active" ? grupo.activo : !grupo.activo;
    });

  // Abre modal para crear nuevo grupo (resetea el formulario)
  const openModalCrear = () => {
    setFormData({
      foto: null,
      nombreGrupo: "",
      generoMusical: "",
      descripcion: "",
      plataforma: "",
      url: "",
    });
    setModalCrear(true);
  };

  // Abre modal para editar grupo (carga datos existentes)
  const openModalEditar = (index) => {
    setCurrentGrupo(index); // Guarda índice del grupo
    setFormData(grupos[index]); // Carga datos al formulario
    setModalEditar(true); // Abre modal
  };

  // Abre modal para ver detalles de grupo
  const openModalVer = (index) => {
    setCurrentGrupo(index); // Guarda índice
    setModalVer(true); // Abre modal
  };

  // Cierra todos los modales
  const closeModal = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalVer(false);
  };

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "foto" ? files[0] : value // Maneja archivos diferente a otros campos
    }));
  };

  // Valida los campos del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreGrupo) newErrors.nombreGrupo = "Nombre obligatorio";
    if (!formData.generoMusical) newErrors.generoMusical = "Género obligatorio";
    if (!formData.descripcion) newErrors.descripcion = "Descripción obligatoria";
    if (!formData.plataforma) newErrors.plataforma = "Plataforma obligatoria";
    if (!formData.url) newErrors.url = "URL obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  // Agrega un nuevo grupo a la lista
  const handleAddGrupo = () => {
    if (!validateForm()) return; // Valida antes de agregar
    setGrupos([...grupos, { ...formData, activo: true }]); // Añade nuevo grupo
    Swal.fire("Éxito", "Grupo agregado", "success"); // Muestra alerta
    closeModal(); // Cierra modal
  };

  // Actualiza un grupo existente
  const handleUpdateGrupo = () => {
    if (!validateForm()) return; // Valida primero
    const updated = [...grupos]; // Copia el array
    updated[currentGrupo] = formData; // Actualiza el grupo seleccionado
    setGrupos(updated); // Guarda cambios
    Swal.fire("Éxito", "Grupo actualizado", "success"); // Alerta
    closeModal(); // Cierra modal
  };

  // "Elimina" un grupo (lo marca como inactivo)
  const handleDeleteGrupo = (index) => {
    const updated = [...grupos]; // Copia array
    updated[index].activo = false; // Marca como inactivo
    setGrupos(updated); // Guarda cambios
    Swal.fire("Info", "Grupo desactivado", "info"); // Alerta
  };

  // Reactiva un grupo (lo marca como activo)
  const handleRestoreGrupo = (index) => {
    const updated = [...grupos]; // Copia array
    updated[index].activo = true; // Marca como activo
    setGrupos(updated); // Guarda cambios
    Swal.fire("Éxito", "Grupo activado", "success"); // Alerta
  };

  // Renderizado del componente
  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        background: `radial-gradient(circle at top left, #39FF14 0%, transparent 50%),
                    radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
        backgroundSize: "200% 200%",
        animation: "bg-pan 20s ease infinite",
      }}></div>

      {/* Estilos CSS-in-JS para el fondo animado y efecto "glass" */}
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
            <h1 className="text-4xl font-bold">Grupos Musicales</h1>
            <p className="text-lg opacity-90">Administra tus grupos musicales</p>
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
              <span className="text-white">Grupos Musicales</span>
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
              placeholder="Buscar grupo..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
            />
          </div>

          {/* Botones de acciones */}
          <div className="flex gap-2">
            {/* Botón de filtro (alterna entre todos/activos/inactivos) */}
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleFilterChange}
            >
              <FiFilter />
              {filterActive === "all" ? "Todos" : filterActive === "active" ? "Activos" : "Inactivos"}
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

            {/* Botón para agregar nuevo grupo */}
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openModalCrear}
            >
              <FiPlusCircle /> Agregar Grupo
            </motion.button>
          </div>
        </motion.div>

        {/* Lista de grupos musicales */}
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
            {/* Mapea cada grupo filtrado a una tarjeta */}
            {filteredGrupos.map((grupo, index) => (
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
                      <h3 className="text-xl font-bold text-white">{grupo.nombreGrupo}</h3>
                      {/* Badge de estado (activo/inactivo) */}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${grupo.activo ? "bg-green-500" : "bg-red-500"
                        }`}>
                        {grupo.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    {/* Botones de acciones para cada grupo */}
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
                      {grupo.activo ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteGrupo(index)}
                        >
                          <FiTrash2 className="text-white" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreGrupo(index)}
                        >
                          <FiRefreshCcw className="text-white" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Imagen del grupo */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    {grupo.foto ? (
                      <img
                        src={typeof grupo.foto === 'string' ? grupo.foto : URL.createObjectURL(grupo.foto)}
                        className="w-full h-48 object-cover rounded-lg"
                        alt={grupo.nombreGrupo}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Información del grupo */}
                  <div className="flex-grow space-y-3">
                    {/* Género musical */}
                    <div>
                      <p className="text-sm text-gray-400">Género musical</p>
                      <p className="font-medium">{grupo.generoMusical}</p>
                    </div>

                    {/* Descripción (con límite de 2 líneas) */}
                    <div>
                      <p className="text-sm text-gray-400">Descripción</p>
                      <p className="line-clamp-2">{grupo.descripcion}</p>
                    </div>

                    {/* Plataforma y enlace */}
                    <div>
                      <p className="text-sm text-gray-400">Plataforma</p>
                      <div className="flex items-center gap-2">
                        <p>{grupo.plataforma}</p>
                        <a
                          href={grupo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00FF8C] hover:underline flex items-center"
                        >
                          <FiExternalLink className="mr-1" />
                          Visitar
                        </a>
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
          {/* Modal para crear nuevo grupo */}
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddGrupo}
              errors={errors}
              title="Agregar Grupo"
            />
          )}

          {/* Modal para editar grupo existente */}
          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleUpdateGrupo}
              errors={errors}
              title="Editar Grupo"
            />
          )}

          {/* Modal para ver detalles de grupo */}
          {modalVer && (
            <ModalVer
              data={grupos[currentGrupo]}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Componente para el modal de formulario (crear/editar)
const ModalFormulario = ({ formData, onClose, onChange, onSave, errors, title }) => {
  // Estado para la previsualización de la imagen
  const [previewFotoUrl, setPreviewFotoUrl] = useState(null);

  // Efecto para manejar la previsualización de la imagen
  useEffect(() => {
    if (formData.foto instanceof File) {
      const objectUrl = URL.createObjectURL(formData.foto);
      setPreviewFotoUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Limpieza
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
          <label className="block text-sm font-semibold mb-2 text-gray-300">Imagen</label>
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
            { label: "Nombre del Grupo", name: "nombreGrupo", type: "text" },
            { label: "Género Musical", name: "generoMusical", type: "text" },
            { label: "Descripción", name: "descripcion", type: "text" },
            { label: "Plataforma", name: "plataforma", type: "text" },
            { label: "URL", name: "url", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold mb-1 text-gray-300">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={onChange}
                className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${errors[field.name] ? "border-red-500" : ""
                  }`}
              />
              {/* Muestra error de validación si existe */}
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
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
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles del Grupo</h2>

        <div className="space-y-4">
          {/* Imagen del grupo */}
          <div className="text-center">
            {data.foto ? (
              <img
                src={typeof data.foto === 'string' ? data.foto : URL.createObjectURL(data.foto)}
                alt="Grupo"
                className="w-32 h-32 rounded-lg object-cover mx-auto"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-gray-400">Sin foto</span>
              </div>
            )}
          </div>

          {/* Muestra todos los datos del grupo */}
          {[
            { label: "Nombre", value: data.nombreGrupo },
            { label: "Género", value: data.generoMusical },
            { label: "Descripción", value: data.descripcion },
            { label: "Plataforma", value: data.plataforma },
            { label: "URL", value: data.url },
          ].map((item) => (
            <div key={item.label}>
              <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
              <p className="text-lg text-white">{item.value}</p>
            </div>
          ))}

          {/* Estado del grupo */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Estado</label>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${data.activo ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}>
              {data.activo ? "Activo" : "Inactivo"}
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

export default GrupoMusical;