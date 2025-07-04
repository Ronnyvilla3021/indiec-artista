import { useState, useEffect } from "react"; // Import useEffect
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiDownload,
  FiFilter,
  FiPlusCircle,
  FiSearch
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import xss from "xss";
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS

const Album = () => {
  const [albums, setAlbums] = useState([
    {
      foto: null,
      titulo: "Álbum 1",
      artista: "Artista 1",
      año: 2020,
      genero: "Rock",
      activo: true,
    },
    {
      foto: null,
      titulo: "Álbum 2",
      artista: "Artista 2",
      año: 2021,
      genero: "Pop",
      activo: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    titulo: "",
    artista: "",
    año: "",
    genero: "",
  });
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [errors, setErrors] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

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

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1500, // Set default duration for AOS animations
      easing: 'linear', // Set default easing for AOS animations
      once: false // Animations can repeat on scroll up/down
    });
    AOS.refresh(); // Refresh AOS on component updates
  }, []);

  // Animaciones Framer Motion (existing)
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
    const worksheet = XLSX.utils.json_to_sheet(filteredAlbums);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Álbumes");
    XLSX.writeFile(workbook, "albumes.xlsx");
  };

  const handleFilterChange = () => {
    setFilterActive(prev => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  const handleSortByYear = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const filteredAlbums = albums
    .filter(album => album.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(album => {
      if (filterActive === "all") return true;
      return filterActive === "active" ? album.activo : !album.activo;
    })
    .sort((a, b) => sortOrder === "asc" ? a.año - b.año : b.año - a.año);

  // Funciones de modales
  const openModalCrear = () => {
    setFormData({
      foto: null,
      titulo: "",
      artista: "",
      año: "",
      genero: "",
    });
    setModalCrear(true);
  };

  const openModalEditar = (index) => {
    setCurrentAlbum(index);
    setFormData(albums[index]);
    setModalEditar(true);
  };

  const openModalVer = (index) => {
    setCurrentAlbum(index);
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
    if (!formData.titulo) newErrors.titulo = "Título obligatorio";
    if (!formData.artista) newErrors.artista = "Artista obligatorio";
    if (!formData.año) newErrors.año = "Año obligatorio";
    if (!formData.genero) newErrors.genero = "Género obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAlbum = () => {
    if (!validateForm()) return;
    setAlbums([...albums, { ...formData, activo: true }]);
    Swal.fire("Éxito", "Álbum agregado", "success");
    closeModal();
  };

  const handleUpdateAlbum = () => {
    if (!validateForm()) return;
    const updated = [...albums];
    updated[currentAlbum] = formData;
    setAlbums(updated);
    Swal.fire("Éxito", "Álbum actualizado", "success");
    closeModal();
  };

  const handleDeleteAlbum = (index) => {
    const updated = [...albums];
    updated[index].activo = false;
    setAlbums(updated);
    Swal.fire("Info", "Álbum desactivado", "info");
  };

  const handleRestoreAlbum = (index) => {
    const updated = [...albums];
    updated[index].activo = true;
    setAlbums(updated);
    Swal.fire("Éxito", "Álbum activado", "success");
  };

  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
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
        {/* Encabezado - Apply AOS here */}
        <motion.div 
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          data-aos="fade-down" // AOS animation
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <h1 className="text-4xl font-bold">Álbumes Musicales</h1>
          <p className="text-lg opacity-90">Administra tu colección de álbumes</p>
        </motion.div>

        {/* Migas de pan - Apply AOS here */}
        <motion.div 
          className="glass-card p-4 mb-8 flex justify-center"
          variants={itemVariants}
          data-aos="fade-down" // AOS animation
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <nav className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-[#00FF8C] hover:underline">
              Inicio
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">Álbumes</span>
          </nav>
        </motion.div>

        {/* Controles - Apply AOS here */}
        <motion.div 
          className="glass-card p-6 mb-8 flex flex-wrap gap-4"
          variants={itemVariants}
          data-aos="fade-down" // AOS animation
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input 
              type="text" 
              placeholder="Buscar álbum..." 
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
              onClick={handleSortByYear}
            >
              <FiFilter />
              {sortOrder === "asc" ? "Año Asc" : "Año Desc"}
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
              <FiPlusCircle /> Agregar Álbum
            </motion.button>
          </div>
        </motion.div>

        {/* Tabla - Apply AOS here */}
        <motion.div 
          className="glass-card p-6 overflow-x-auto"
          variants={itemVariants}
          data-aos="fade-down" // AOS animation
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <table className="w-full">
            <thead>
              <tr className="glass-table-header">
                <th className="py-3 px-6 text-left">Foto</th>
                <th className="py-3 px-6 text-left">Título</th>
                <th className="py-3 px-6 text-left">Artista</th>
                <th className="py-3 px-6 text-left">Año</th>
                <th className="py-3 px-6 text-left">Género</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAlbums.map((album, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-[rgba(0,255,140,0.05)]"
                    variants={itemVariants}
                  >
                    <td className="py-4 px-6">
                      {album.foto ? (
                        <img 
                          src={URL.createObjectURL(album.foto)} 
                          className="w-12 h-12 rounded-lg object-cover"
                          alt="Álbum"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">{album.titulo}</td>
                    <td className="py-4 px-6">{album.artista}</td>
                    <td className="py-4 px-6">{album.año}</td>
                    <td className="py-4 px-6">{album.genero}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        album.activo ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {album.activo ? "Activo" : "Inactivo"}
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
                      {album.activo ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteAlbum(index)}
                        >
                          <FiTrash2 className="text-white"/>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreAlbum(index)}
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

        {/* Modales (unchanged) */}
        <AnimatePresence>
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddAlbum}
              generos={generos}
              errors={errors}
              title="Agregar Álbum"
            />
          )}
          
          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleUpdateAlbum}
              generos={generos}
              errors={errors}
              title="Editar Álbum"
            />
          )}
          
          {modalVer && (
            <ModalVer
              data={albums[currentAlbum]}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Componente ModalFormulario (unchanged)
const ModalFormulario = ({ formData, onClose, onChange, onSave, generos, errors, title }) => (
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
      
      <div className="mb-4 text-center">
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

      <div className="space-y-4">
        {[
          { label: "Título del Álbum", name: "titulo", type: "text" },
          { label: "Artista", name: "artista", type: "text" },
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
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

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
            {generos.map((genero, index) => (
              <option key={index} value={genero}>
                {genero}
              </option>
            ))}
          </select>
          {errors.genero && (
            <p className="text-red-500 text-sm mt-1">{errors.genero}</p>
          )}
        </div>
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

// Componente ModalVer (unchanged)
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
      className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles del Álbum</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          {data.foto ? (
            <img
              src={URL.createObjectURL(data.foto)}
              alt="Álbum"
              className="w-32 h-32 rounded-lg object-cover mx-auto"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-gray-400">Sin foto</span>
            </div>
          )}
        </div>

        {[
          { label: "Título", value: data.titulo },
          { label: "Artista", value: data.artista },
          { label: "Año", value: data.año },
          { label: "Género", value: data.genero },
        ].map((item) => (
          <div key={item.label}>
            <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
            <p className="text-lg text-white">{item.value}</p>
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">Estado</label>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            data.activo ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {data.activo ? "Activo" : "Inactivo"}
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
  generos: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Album;