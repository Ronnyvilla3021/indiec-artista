import { useState, useEffect } from "react"; // Agrega useEffect
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
import AOS from 'aos'; // Importa AOS
import 'aos/dist/aos.css'; // Importa los estilos de AOS

const Eventos = () => {
  // Inicializa AOS cuando el componente se monta
  useEffect(() => {
    AOS.init({
      duration: 1500, // Duración por defecto para todas las animaciones AOS
      easing: 'linear', // Easing por defecto para todas las animaciones AOS
      once: true // Si quieres que la animación solo se ejecute una vez al hacer scroll
    });
  }, []);

  const [eventos, setEventos] = useState([
    {
      foto: null,
      nombreEvento: "Concierto de Rock",
      generoMusical: "Rock",
      descripcion: "Evento de música rock",
      ubicacion: "Auditorio A",
      fecha: "2025-02-10",
      contacto: "123456789",
      capacidad: 500,
      artistas: "Bandas locales",
      estado: true,
    },
    {
      foto: null,
      nombreEvento: "Festival de Jazz",
      generoMusical: "Jazz",
      descripcion: "Evento de música jazz",
      ubicacion: "Teatro B",
      fecha: "2025-03-20",
      contacto: "987654321",
      capacidad: 300,
      artistas: "Artistas internacionales",
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

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" },
    tap: { scale: 0.95 }
  };

  // Funciones de manejo
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
      evento.nombreEvento.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(evento => {
      if (filterActive === "all") return true;
      return filterActive === "active" ? evento.estado : !evento.estado;
    })
    .sort((a, b) => sortOrder === "asc" ? 
      new Date(a.fecha) - new Date(b.fecha) : 
      new Date(b.fecha) - new Date(a.fecha)
    );

  // Funciones de modales
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
    setModalCrear(true);
  };

  const openModalEditar = (index) => {
    setCurrentEvento(index);
    setFormData(eventos[index]);
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
    if (!formData.nombreEvento) newErrors.nombreEvento = "Nombre del evento obligatorio";
    if (!formData.generoMusical) newErrors.generoMusical = "Género musical obligatorio";
    if (!formData.descripcion) newErrors.descripcion = "Descripción obligatoria";
    if (!formData.ubicacion) newErrors.ubicacion = "Ubicación obligatoria";
    if (!formData.fecha) newErrors.fecha = "Fecha obligatoria";
    if (!formData.contacto) newErrors.contacto = "Contacto obligatorio";
    if (!formData.capacidad) newErrors.capacidad = "Capacidad obligatoria";
    if (!formData.artistas) newErrors.artistas = "Artistas obligatorios";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEvento = () => {
    if (!validateForm()) return;
    setEventos([...eventos, { ...formData, estado: true }]);
    Swal.fire("Éxito", "Evento agregado", "success");
    closeModal();
  };

  const handleUpdateEvento = () => {
    if (!validateForm()) return;
    const updated = [...eventos];
    updated[currentEvento] = formData;
    setEventos(updated);
    Swal.fire("Éxito", "Evento actualizado", "success");
    closeModal();
  };

  const handleDeleteEvento = (index) => {
    const updated = [...eventos];
    updated[index].estado = false;
    setEventos(updated);
    Swal.fire("Info", "Evento desactivado", "info");
  };

  const handleRestoreEvento = (index) => {
    const updated = [...eventos];
    updated[index].estado = true;
    setEventos(updated);
    Swal.fire("Éxito", "Evento activado", "success");
  };

  return (
    <div 
      className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden"
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="1500"
    >
      {/* Fondo animado */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        background: `radial-gradient(circle at top left, #39FF14 0%, transparent 30%), 
                     radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
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
      `}</style>

      <div className="relative z-10">
        {/* Encabezado */}
        <motion.div 
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h1 className="text-4xl font-bold">Gestión de Eventos</h1>
          <p className="text-lg opacity-90">Administra los eventos del sistema</p>
        </motion.div>

        {/* Migas de pan */}
        <motion.div 
          className="glass-card p-4 mb-8 flex justify-center"
          variants={itemVariants}
        >
          <nav className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-[#00FF8C] hover:underline">
              Inicio
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">Eventos</span>
          </nav>
        </motion.div>

        {/* Controles */}
        <motion.div 
          className="glass-card p-6 mb-8 flex flex-wrap gap-4"
          variants={itemVariants}
        >
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input 
              type="text" 
              placeholder="Buscar evento..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
            />
          </div>
          <div className="flex gap-2">
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
            <motion.button 
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSortByDate}
            >
              <FiFilter />
              {sortOrder === "asc" ? "Fecha Asc" : "Fecha Desc"}
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleExportToExcel}
            >
              <FiDownload /> Exportar
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openModalCrear}
            >
              <FiPlusCircle /> Agregar Evento
            </motion.button>
          </div>
        </motion.div>

        {/* Tabla */}
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
                    className="border-b border-gray-700 hover:bg-[rgba(0,255,140,0.05)]"
                    variants={itemVariants}
                  >
                    <td className="py-4 px-6">
                      {evento.foto ? (
                        <img 
                          src={URL.createObjectURL(evento.foto)} 
                          className="w-12 h-12 rounded-lg object-cover"
                          alt="Evento"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">{evento.nombreEvento}</td>
                    <td className="py-4 px-6">{evento.generoMusical}</td>
                    <td className="py-4 px-6">{evento.descripcion}</td>
                    <td className="py-4 px-6">{evento.ubicacion}</td>
                    <td className="py-4 px-6">{evento.fecha}</td>
                    <td className="py-4 px-6">{evento.contacto}</td>
                    <td className="py-4 px-6">{evento.capacidad}</td>
                    <td className="py-4 px-6">{evento.artistas}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        evento.estado ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {evento.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex justify-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 rounded-full"
                        onClick={() => openModalVer(index)}
                      >
                        <FiEye className="text-white"/>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-yellow-500 rounded-full"
                        onClick={() => openModalEditar(index)}
                      >
                        <FiEdit className="text-white"/>
                      </motion.button>
                      {evento.estado ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteEvento(index)}
                        >
                          <FiTrash2 className="text-white"/>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
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
        </motion.div>

        {/* Modales */}
        <AnimatePresence>
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddEvento}
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
              errors={errors}
              title="Editar Evento"
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

// Componente ModalFormulario
const ModalFormulario = ({ formData, onClose, onChange, onSave, errors, title }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white border-opacity-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-white text-center">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4 text-center col-span-2">
          <label className="block text-sm font-semibold mb-2 text-gray-300">Imagen</label>
          <label
            htmlFor="foto"
            className="inline-block bg-[#00FF8C] text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#39FF14] transition"
          >
            Subir Imagen
            <input
              id="foto"
              type="file"
              name="foto"
              onChange={onChange}
              className="hidden"
            />
          </label>
        </div>

        {[
          { label: "Nombre del Evento", name: "nombreEvento", type: "text" },
          { label: "Género Musical", name: "generoMusical", type: "text" },
          { label: "Ubicación", name: "ubicacion", type: "text" },
          { label: "Fecha", name: "fecha", type: "date" },
          { label: "Contacto", name: "contacto", type: "text" },
          { label: "Capacidad", name: "capacidad", type: "number" },
          { label: "Artistas", name: "artistas", type: "text", colSpan: "col-span-2" },
          { label: "Descripción", name: "descripcion", type: "text", colSpan: "col-span-2" },
        ].map((field) => (
          <div key={field.name} className={field.colSpan || ""}>
            <label className="block text-sm font-semibold mb-1 text-gray-300">{field.label}</label>
            {field.type === "text" && field.name === "descripcion" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={onChange}
                className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                rows="3"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={onChange}
                className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
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
          className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancelar
        </motion.button>
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

// Componente ModalVer
const ModalVer = ({ data, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white border-opacity-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles del Evento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center col-span-2">
          {data.foto ? (
            <img
              src={URL.createObjectURL(data.foto)}
              alt="Evento"
              className="w-32 h-32 rounded-lg object-cover mx-auto"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-gray-400">Sin foto</span>
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
          { label: "Artistas", value: data.artistas, colSpan: "col-span-2" },
          { label: "Descripción", value: data.descripcion, colSpan: "col-span-2" },
        ].map((item) => (
          <div key={item.label} className={item.colSpan || ""}>
            <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
            <p className="text-lg text-white break-words">{item.value}</p>
          </div>
        ))}

        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1 text-gray-300">Estado</label>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            data.estado ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {data.estado ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

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