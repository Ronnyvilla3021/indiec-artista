import { useState, useEffect } from "react"; // Add useEffect
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

import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import the AOS CSS

const Manager = () => {
  const [managers, setManagers] = useState([
    {
      foto: null,
      apellidos: "Perez",
      nombres: "Juan",
      correo: "juan.perez@example.com",
      genero: "Masculino",
      fecha: "2025-02-10",
      estado: true,
    },
    {
      foto: null,
      apellidos: "Gomez",
      nombres: "Maria",
      correo: "maria.gomez@example.com",
      genero: "Femenino",
      fecha: "2025-03-20",
      estado: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    apellidos: "",
    nombres: "",
    correo: "",
    genero: "",
    fecha: "",
  });
  const [currentManager, setCurrentManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [errors, setErrors] = useState({});

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // Global duration for all AOS animations
      easing: 'ease-in-out', // Global easing for all AOS animations
      once: true // Animations happen only once
    });
  }, []);

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
    const worksheet = XLSX.utils.json_to_sheet(filteredManagers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Managers");
    XLSX.writeFile(workbook, "managers.xlsx");
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

  const filteredManagers = managers
    .filter(manager => 
      manager.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(manager => {
      if (filterActive === "all") return true;
      return filterActive === "active" ? manager.estado : !manager.estado;
    })
    .sort((a, b) => sortOrder === "asc" ? 
      new Date(a.fecha) - new Date(b.fecha) : 
      new Date(b.fecha) - new Date(a.fecha)
    );

  // Funciones de modales
  const openModalCrear = () => {
    setFormData({
      foto: null,
      apellidos: "",
      nombres: "",
      correo: "",
      genero: "",
      fecha: "",
    });
    setModalCrear(true);
  };

  const openModalEditar = (index) => {
    setCurrentManager(index);
    setFormData(managers[index]);
    setModalEditar(true);
  };

  const openModalVer = (index) => {
    setCurrentManager(index);
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
    if (!formData.apellidos) newErrors.apellidos = "Apellidos obligatorios";
    if (!formData.nombres) newErrors.nombres = "Nombres obligatorios";
    if (!formData.correo) newErrors.correo = "Correo obligatorio";
    if (!formData.genero) newErrors.genero = "Género obligatorio";
    if (!formData.fecha) newErrors.fecha = "Fecha obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddManager = () => {
    if (!validateForm()) return;
    setManagers([...managers, { ...formData, estado: true }]);
    Swal.fire("Éxito", "Manager agregado", "success");
    closeModal();
  };

  const handleUpdateManager = () => {
    if (!validateForm()) return;
    const updated = [...managers];
    updated[currentManager] = formData;
    setManagers(updated);
    Swal.fire("Éxito", "Manager actualizado", "success");
    closeModal();
  };

  const handleDeleteManager = (index) => {
    const updated = [...managers];
    updated[index].estado = false;
    setManagers(updated);
    Swal.fire("Info", "Manager desactivado", "info");
  };

  const handleRestoreManager = (index) => {
    const updated = [...managers];
    updated[index].estado = true;
    setManagers(updated);
    Swal.fire("Éxito", "Manager activado", "success");
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

      {/* Added AOS animation here */}
      <div 
        className="relative z-10"
        data-aos="fade-down"
        data-aos-easing="linear"
        data-aos-duration="1500"
      >
        {/* Encabezado */}
        <motion.div 
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h1 className="text-4xl font-bold">Gestión de Managers</h1>
          <p className="text-lg opacity-90">Administra los managers del sistema</p>
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
            <span className="text-white">Managers</span>
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
              placeholder="Buscar manager..." 
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
              <FiPlusCircle /> Agregar Manager
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
                <th className="py-3 px-6 text-left">Apellidos</th>
                <th className="py-3 px-6 text-left">Nombres</th>
                <th className="py-3 px-6 text-left">Correo</th>
                <th className="py-3 px-6 text-left">Género</th>
                <th className="py-3 px-6 text-left">Fecha</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredManagers.map((manager, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-[rgba(0,255,140,0.05)]"
                    variants={itemVariants}
                  >
                    <td className="py-4 px-6">
                      {manager.foto ? (
                        <img 
                          src={URL.createObjectURL(manager.foto)} 
                          className="w-12 h-12 rounded-lg object-cover"
                          alt="Manager"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">{manager.apellidos}</td>
                    <td className="py-4 px-6">{manager.nombres}</td>
                    <td className="py-4 px-6">{manager.correo}</td>
                    <td className="py-4 px-6">{manager.genero}</td>
                    <td className="py-4 px-6">{manager.fecha}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        manager.estado ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {manager.estado ? "Activo" : "Inactivo"}
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
                      {manager.estado ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteManager(index)}
                        >
                          <FiTrash2 className="text-white"/>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreManager(index)}
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
              onSave={handleAddManager}
              errors={errors}
              title="Agregar Manager"
            />
          )}
          
          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleUpdateManager}
              errors={errors}
              title="Editar Manager"
            />
          )}
          
          {modalVer && (
            <ModalVer
              data={managers[currentManager]}
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
          { label: "Apellidos", name: "apellidos", type: "text" },
          { label: "Nombres", name: "nombres", type: "text" },
          { label: "Correo", name: "correo", type: "email" },
          { label: "Fecha", name: "fecha", type: "date" },
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
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
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
      className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles del Manager</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          {data.foto ? (
            <img
              src={URL.createObjectURL(data.foto)}
              alt="Manager"
              className="w-32 h-32 rounded-lg object-cover mx-auto"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-gray-400">Sin foto</span>
            </div>
          )}
        </div>

        {[
          { label: "Apellidos", value: data.apellidos },
          { label: "Nombres", value: data.nombres },
          { label: "Correo", value: data.correo },
          { label: "Género", value: data.genero },
          { label: "Fecha", value: data.fecha },
        ].map((item) => (
          <div key={item.label}>
            <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
            <p className="text-lg text-white">{item.value}</p>
          </div>
        ))}

        <div>
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

export default Manager;