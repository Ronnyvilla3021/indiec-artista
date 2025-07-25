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
  baseURL: 'http://localhost:9000/manager',
});

// Añade esto antes de tu llamada Axios
console.log('URL completa:', api.defaults.baseURL + '/lista');

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

const Manager = () => {
  useEffect(() => {
    AOS.init({ once: true, mirror: false });
    AOS.refresh();
    fetchManagers();
  }, []);

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    idManager: null,
    foto: null,
    apellidos: "",
    nombres: "",
    correo: "",
    genero: "",
    fecha: "",
    estado: "activo",
  });
  const [previewFoto, setPreviewFoto] = useState(null);
  const [currentManager, setCurrentManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [errors, setErrors] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

  const generos = ["Masculino", "Femenino", "Otro"];

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lista');
      const managersFetched = response.data.data.map(manager => ({
        idManager: manager.idManager,
        apellidos: manager.apellidos,
        nombres: manager.nombres,
        correo: manager.correo,
        genero: manager.genero,
        fecha: manager.fecha,
        estado: manager.estado,
        foto: manager.foto ? `${api.defaults.baseURL}/uploads/${manager.foto}` : null,
      }));
      setManagers(managersFetched);
    } catch (error) {
      console.error("Error al cargar managers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManager = async () => {
    if (!validateForm()) return;

    const dataToSend = new FormData();
    dataToSend.append('apellidos', formData.apellidos);
    dataToSend.append('nombres', formData.nombres);
    dataToSend.append('correo', formData.correo);
    dataToSend.append('genero', formData.genero);
    dataToSend.append('fecha', formData.fecha);
    if (formData.foto) {
      dataToSend.append('foto', formData.foto);
    }

    try {
      const response = await api.post('/crear', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire({
        icon: "success",
        title: "Manager agregado",
        text: response.data.message || `El manager "${formData.nombres} ${formData.apellidos}" fue agregado exitosamente.`,
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
      closeModal();
      fetchManagers();
    } catch (error) {
      console.error("Error al agregar manager:", error);
    }
  };

  const handleUpdateManager = async () => {
    if (!validateForm()) return;
    if (!formData.idManager) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de manager no encontrado para actualizar.",
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('apellidos', formData.apellidos);
    dataToSend.append('nombres', formData.nombres);
    dataToSend.append('correo', formData.correo);
    dataToSend.append('genero', formData.genero);
    dataToSend.append('fecha', formData.fecha);
    dataToSend.append('estado', formData.estado);
    if (formData.foto instanceof File) {
      dataToSend.append('foto', formData.foto);
    }

    try {
      const response = await api.put(`/editar/${formData.idManager}`, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire({
        icon: "success",
        title: "Manager actualizado",
        text: response.data.message || `El manager "${formData.nombres} ${formData.apellidos}" fue actualizado exitosamente.`,
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
      closeModal();
      fetchManagers();
    } catch (error) {
      console.error("Error al actualizar manager:", error);
    }
  };

  const handleDeleteManager = async (idManager, nombreCompleto) => {
    try {
      const response = await api.put(`/desactivar/${idManager}`);
      Swal.fire({
        icon: "success",
        title: "Manager desactivado",
        text: response.data.message || `El manager "${nombreCompleto}" fue desactivado exitosamente.`,
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
      fetchManagers();
    } catch (error) {
      console.error("Error al desactivar manager:", error);
    }
  };

  const handleRestoreManager = async (idManager, nombreCompleto) => {
    try {
      const response = await api.put(`/activar/${idManager}`);
      Swal.fire({
        icon: "success",
        title: "Manager activado",
        text: response.data.message || `El manager "${nombreCompleto}" fue activado exitosamente.`,
        background: "#1a1a1a",
        confirmButtonColor: "#00FF8C",
        color: "#ffffff",
      });
      fetchManagers();
    } catch (error) {
      console.error("Error al activar manager:", error);
    }
  };

  const openModalCrear = () => {
    setFormData({
      foto: null,
      apellidos: "",
      nombres: "",
      correo: "",
      genero: "",
      fecha: "",
      estado: "activo",
    });
    setPreviewFoto(null);
    setErrors({});
    setModalCrear(true);
  };

  const openModalEditar = (manager) => {
    setCurrentManager(manager.idManager);
    setFormData({
      idManager: manager.idManager,
      foto: manager.foto,
      apellidos: manager.apellidos,
      nombres: manager.nombres,
      correo: manager.correo,
      genero: manager.genero,
      fecha: manager.fecha,
      estado: manager.estado,
    });
    setPreviewFoto(manager.foto);
    setErrors({});
    setModalEditar(true);
  };

  const openModalVer = (manager) => {
    setCurrentManager(manager);
    setModalVer(true);
  };

  const closeModal = () => {
    setModalCrear(false);
    setModalEditar(false);
    setModalVer(false);
    setErrors({});
    setCurrentManager(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files.length > 0) {
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
    if (!formData.apellidos) newErrors.apellidos = "Apellidos son obligatorios";
    if (!formData.nombres) newErrors.nombres = "Nombres son obligatorios";
    if (!formData.correo) newErrors.correo = "Correo es obligatorio";
    if (!formData.genero) newErrors.genero = "Género es obligatorio";
    if (!formData.fecha) newErrors.fecha = "Fecha es obligatoria";
    
    // Validación de formato de correo
    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Correo electrónico no válido";
    }
    
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
      filteredManagers.map((m) => ({
        ID: m.idManager,
        Apellidos: m.apellidos,
        Nombres: m.nombres,
        Correo: m.correo,
        Género: m.genero,
        Fecha: m.fecha,
        Estado: m.estado === 'activo' ? 'Activo' : 'Inactivo',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Managers");
    XLSX.writeFile(workbook, "managers.xlsx");
  };

  const handleSortByDate = () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const filteredManagers = managers
    .filter((m) => 
      m.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.correo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((m) => {
      if (filterStatus === "all") return true;
      return filterStatus === "active" ? m.estado === "activo" : m.estado === "inactivo";
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.fecha) - new Date(b.fecha);
      } else {
        return new Date(b.fecha) - new Date(a.fecha);
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

      <style>{`
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

      <div className="relative z-10">
        <motion.div
          className="glass-card p-8 mb-8 flex justify-between items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          data-aos="fade-down"
        >
          <div>
            <h1 className="text-4xl font-bold">Managers</h1>
            <p className="text-lg opacity-90">Administra tus managers</p>
          </div>
          <motion.div className="glass-card p-3 rounded-lg flex items-center">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/dashboard" className="text-[#00FF8C] hover:underline">Inicio</Link>
              <span className="text-gray-500">/</span>
              <span className="text-white">Managers</span>
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
              placeholder="Buscar manager..."
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
              onClick={handleSortByDate}
            >
              <FiFilter /> Fecha ({sortOrder === "asc" ? "Asc" : "Desc"})
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
              <FiPlusCircle /> Agregar Manager
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
            {filteredManagers.map((manager) => (
              <motion.div
                key={manager.idManager}
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
                      <h3 className="text-xl font-bold text-white">{manager.nombres} {manager.apellidos}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${manager.estado === "activo" ? "bg-green-500" : "bg-red-500"
                        }`}>
                        {manager.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 rounded-full"
                        onClick={() => openModalVer(manager)}
                      >
                        <FiEye className="text-white" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-yellow-500 rounded-full"
                        onClick={() => openModalEditar(manager)}
                      >
                        <FiEdit className="text-white" />
                      </motion.button>
                      {manager.estado === "activo" ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteManager(manager.idManager, `${manager.nombres} ${manager.apellidos}`)}
                        >
                          <FiTrash2 className="text-white" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreManager(manager.idManager, `${manager.nombres} ${manager.apellidos}`)}
                        >
                          <FiRefreshCcw className="text-white" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg overflow-hidden flex items-center justify-center">
                    {manager.foto ? (
                      <img
                        src={manager.foto}
                        className="w-32 h-32 rounded-full object-cover"
                        alt={`${manager.nombres} ${manager.apellidos}`}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Correo</p>
                      <p className="font-medium break-all">{manager.correo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Género</p>
                      <p className="font-medium">{manager.genero}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Fecha de ingreso</p>
                      <p className="font-medium">{manager.fecha}</p>
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
              onSave={handleAddManager}
              errors={errors}
              title="Agregar Manager"
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
              onSave={handleUpdateManager}
              errors={errors}
              title="Editar Manager"
              previewFotoUrl={previewFoto}
              generos={generos}
              isEditing={true}
            />
          )}

          {modalVer && currentManager && (
            <ModalVer data={currentManager} onClose={closeModal} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

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
            <label className="block text-sm font-semibold mb-2 text-gray-300">Foto de Perfil</label>
            {previewFotoUrl && (
              <img
                src={previewFotoUrl}
                alt="Vista previa"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
            )}
            <label
              htmlFor="foto"
              className="inline-block bg-[#00FF8C] text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#39FF14] transition"
            >
              {previewFotoUrl ? "Cambiar Foto" : "Subir Foto"}
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
                  className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${errors[field.name] ? "border-red-500" : ""
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
                className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${errors.genero ? "border-red-500" : ""
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

            {isEditing && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-300">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={onChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
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
          <h2 className="text-2xl font-bold text-white">Detalles del Manager</h2>
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
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {data.foto ? (
                  <img
                    src={data.foto}
                    alt="Manager"
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
                  { label: "ID Manager", value: data.idManager },
                  { label: "Apellidos", value: data.apellidos },
                  { label: "Nombres", value: data.nombres },
                  { label: "Correo", value: data.correo },
                  { label: "Género", value: data.genero },
                  { label: "Fecha de ingreso", value: data.fecha },
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
                  className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold ${data.estado === "activo" ? "bg-green-500 text-white" : "bg-red-500 text-white"
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

export default Manager;