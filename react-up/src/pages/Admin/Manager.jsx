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
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import xss from "xss";
import AOS from "aos";
import "aos/dist/aos.css";

const Manager = () => {
  /* -------------------------------------------------------------------------- */
  /* ESTADO                                                                     */
  /* -------------------------------------------------------------------------- */
  const [managers, setManagers] = useState([
    {
      foto: "https://randomuser.me/api/portraits/men/1.jpg",
      apellidos: "Perez",
      nombres: "Juan",
      correo: "juan.perez@example.com",
      genero: "Masculino",
      fecha: "2025-02-10",
      estado: true,
    },
    {
      foto: "https://randomuser.me/api/portraits/women/1.jpg",
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

  /* -------------------------------------------------------------------------- */
  /* EFECTO - AOS                                                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    AOS.init({ duration: 1500, easing: "linear", once: true });
  }, []);

  /* -------------------------------------------------------------------------- */
  /* VARIANTS                                                                   */
  /* -------------------------------------------------------------------------- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    hover: {
      y: -5,
      // Color verde neón para el efecto hover de la tarjeta
      boxShadow: "0 10px 25px rgba(0, 255, 140, 0.3)",
    },
  };

  const buttonVariants = {
    // Definimos variantes para los diferentes tipos de botones, con sus respectivos colores de resplandor neón
    hoverGreen: { scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" }, // Verde neón
    hoverBlue: { scale: 1.05, boxShadow: "0 0 15px rgba(0, 191, 255, 0.5)" }, // Azul neón
    hoverYellow: { scale: 1.05, boxShadow: "0 0 15px rgba(255, 255, 0, 0.5)" }, // Amarillo neón
    hoverRed: { scale: 1.05, boxShadow: "0 0 15px rgba(255, 0, 0, 0.5)" }, // Rojo neón
    hoverWhite: { scale: 1.05, boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)" }, // Blanco neón
    tap: { scale: 0.95 },
  };

  /* -------------------------------------------------------------------------- */
  /* HANDLERS                                                                   */
  /* -------------------------------------------------------------------------- */
  const handleSearchChange = (e) => setSearchTerm(xss(e.target.value));

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredManagers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Managers");
    XLSX.writeFile(workbook, "managers.xlsx");
  };

  const handleFilterChange = () => {
    setFilterActive((prev) => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  const handleSortByDate = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  /* --------------------------- LISTA FILTRADA ------------------------------- */
  const filteredManagers = managers
    .filter(
      (manager) =>
        manager.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((manager) => {
      if (filterActive === "all") return true;
      return filterActive === "active" ? manager.estado : !manager.estado;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.fecha) - new Date(b.fecha)
        : new Date(b.fecha) - new Date(a.fecha)
    );

  /* ----------------------------- CRUD HELPERS ------------------------------- */
  const openModalCrear = () => {
    setFormData({
      foto: null,
      apellidos: "",
      nombres: "",
      correo: "",
      genero: "",
      fecha: "",
    });
    setErrors({}); // Clear errors when opening create modal
    setModalCrear(true);
  };

  const openModalEditar = (index) => {
    setCurrentManager(index);
    setFormData(managers[index]);
    setErrors({}); // Clear errors when opening edit modal
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
    setErrors({}); // Clear errors on close
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "foto" ? files[0] : xss(value),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for the current field on change
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
    updated[currentManager] = { ...formData, estado: updated[currentManager].estado }; // Preserve existing status
    setManagers(updated);
    Swal.fire("Éxito", "Manager actualizado", "success");
    closeModal();
  };

  const handleDeleteManager = (index) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡desactivar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = [...managers];
        updated[index].estado = false;
        setManagers(updated);
        Swal.fire("¡Desactivado!", "El manager ha sido desactivado.", "success");
      }
    });
  };

  const handleRestoreManager = (index) => {
    Swal.fire({
      title: '¿Quieres activar a este manager?',
      text: "El manager volverá a estar activo en el sistema.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡activar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = [...managers];
        updated[index].estado = true;
        setManagers(updated);
        Swal.fire("¡Activado!", "El manager ha sido activado nuevamente.", "success");
      }
    });
  };

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden"
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="1500"
    >
      {/* FONDO ANIMADO VERDE NEÓN */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          // Colores originales verde neón del fondo
          background: `radial-gradient(circle at top left, #39FF14 0%, transparent 30%),
                          radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
          backgroundSize: "200% 200%",
          animation: "bg-pan 20s ease infinite",
        }}
      ></div>

      {/* ESTILOS EXTRA (glass) */}
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
          border: 1px solid transparent;
          background-image:
            linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0)),
            // Color verde neón para el resplandor de la tarjeta de cristal
            radial-gradient(100% 100% at top left, #39FF14 0%, transparent 70%);
          background-origin: border-box;
          background-clip: content-box, border-box;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.45);
          border-radius: 1.5rem;
        }
      `}</style>

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Encabezado */}
        <motion.div
          className="glass-card p-8 mb-8 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {/* Migaja de pan en la esquina */}
          <nav className="absolute top-4 right-6 text-sm text-gray-400">
            <Link to="/dashboard" className="text-[#00FF8C] hover:underline">
              Inicio
            </Link>
            <span className="mx-1">/</span>
            <span className="text-white">Managers</span>
          </nav>

          <h1 className="text-4xl font-bold text-white">Gestión de Managers</h1>
          <p className="text-lg text-gray-300 opacity-80">Administra los managers del sistema</p>
        </motion.div>

        {/* Controles */}
        <motion.div className="glass-card p-6 mb-8 flex flex-wrap gap-4" variants={cardVariants}>
          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar manager..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
            />
          </div>
          <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto md:ml-auto">
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hoverGreen" // Usar la variante hoverGreen
              whileTap="tap"
              onClick={handleFilterChange}
            >
              <FiFilter />
              {filterActive === "all" ? "Todos" : filterActive === "active" ? "Activos" : "Inactivos"}
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hoverGreen" // Usar la variante hoverGreen
              whileTap="tap"
              onClick={handleSortByDate}
            >
              <FiFilter />
              {sortOrder === "asc" ? "Fecha Asc" : "Fecha Desc"}
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hoverGreen" // Usar la variante hoverGreen
              whileTap="tap"
              onClick={handleExportToExcel}
            >
              <FiDownload /> Exportar
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hoverGreen" // Usar la variante hoverGreen (para este botón también)
              whileTap="tap"
              onClick={openModalCrear}
            >
              <FiPlusCircle /> Agregar Manager
            </motion.button>
          </div>
        </motion.div>

        {/* LISTADO – TARJETAS */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredManagers.map((manager, index) => (
              <ManagerCard
                key={index}
                manager={manager}
                index={index}
                openModalVer={openModalVer}
                openModalEditar={openModalEditar}
                handleDeleteManager={handleDeleteManager}
                handleRestoreManager={handleRestoreManager}
                cardVariants={cardVariants}
                buttonVariants={buttonVariants} // Pasamos las variantes de los botones
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* MODALES */}
        <AnimatePresence>
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddManager}
              errors={errors}
              title="Agregar Manager"
              buttonVariants={buttonVariants} // Pasamos las variantes de los botones
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
              buttonVariants={buttonVariants} // Pasamos las variantes de los botones
            />
          )}

          {modalVer && (
            <ModalVer data={managers[currentManager]} onClose={closeModal} buttonVariants={buttonVariants} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* SUBCOMPONENTES – MODALES Y TARJETAS                                        */
/* -------------------------------------------------------------------------- */

// Base Modal Component
const BaseModal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    onClick={onClose} // Close modal when clicking outside
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20 relative"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        aria-label="Cerrar modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </motion.div>
  </motion.div>
);

BaseModal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Reusable Form Input Component
const FormInput = ({ label, name, type, value, onChange, error, options }) => {
  const inputClasses = `w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C] ${
    error ? "border-red-500" : ""
  }`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1 text-gray-300">
        {label}
      </label>
      {type === "select" ? (
        <select id={name} name={name} value={value} onChange={onChange} className={inputClasses}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
};

const ModalFormulario = ({ formData, onClose, onChange, onSave, errors, title, buttonVariants }) => {
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
    <BaseModal onClose={onClose}>
      <h2 className="text-3xl font-bold mb-6 text-white text-center">{title}</h2>

      {/* Foto Input */}
      <div className="mb-4 text-center">
        <label className="block text-sm font-semibold mb-2 text-gray-300">Imagen</label>
        {previewFotoUrl && (
          <img
            src={previewFotoUrl}
            alt="Vista previa"
            className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
          />
        )}
        <label
          htmlFor="foto"
          className="inline-block bg-[#00FF8C] text-gray-900 px-4 py-2 rounded-lg cursor-pointer transition"
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

      {/* Form Inputs */}
      <div className="space-y-4">
        <FormInput
          label="Apellidos"
          name="apellidos"
          type="text"
          value={formData.apellidos}
          onChange={onChange}
          error={errors.apellidos}
        />
        <FormInput
          label="Nombres"
          name="nombres"
          type="text"
          value={formData.nombres}
          onChange={onChange}
          error={errors.nombres}
        />
        <FormInput
          label="Correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={onChange}
          error={errors.correo}
        />
        <FormInput
          label="Fecha de ingreso"
          name="fecha"
          type="date"
          value={formData.fecha}
          onChange={onChange}
          error={errors.fecha}
        />
        <FormInput
          label="Género"
          name="genero"
          type="select"
          value={formData.genero}
          onChange={onChange}
          error={errors.genero}
          options={[
            { value: "", label: "Selecciona un género" },
            { value: "Masculino", label: "Masculino" },
            { value: "Femenino", label: "Femenino" },
          ]}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-8">
        <motion.button
          onClick={onClose}
          className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg"
          variants={buttonVariants}
          whileHover="hoverWhite" // Resplandor blanco
          whileTap="tap"
        >
          Cancelar
        </motion.button>
        <motion.button
          onClick={onSave}
          className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg"
          variants={buttonVariants}
          whileHover="hoverGreen" // Resplandor verde neón
          whileTap="tap"
        >
          Guardar
        </motion.button>
      </div>
    </BaseModal>
  );
};

ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  buttonVariants: PropTypes.object.isRequired,
};

const ModalVer = ({ data, onClose, buttonVariants }) => {
  return (
    <BaseModal onClose={onClose}>
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles del Manager</h2>

      <div className="space-y-4">
        {/* Foto */}
        <div className="text-center">
          {data.foto ? (
            typeof data.foto === "string" ? (
              <img src={data.foto} alt="Manager" className="w-32 h-32 rounded-lg object-cover mx-auto" />
            ) : (
              <img
                src={URL.createObjectURL(data.foto)}
                alt="Manager"
                className="w-32 h-32 rounded-lg object-cover mx-auto"
              />
            )
          ) : (
            <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-gray-400">Sin foto</span>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-200">
          <div className="col-span-full">
            <p className="text-gray-400">Nombre Completo:</p>
            <p className="text-lg text-white font-semibold">{data.nombres} {data.apellidos}</p>
          </div>
          <div>
            <p className="text-gray-400">Correo:</p>
            <p className="text-white break-all">{data.correo}</p>
          </div>
          <div>
            <p className="text-gray-400">Género:</p>
            <p className="text-white">{data.genero}</p>
          </div>
          <div>
            <p className="text-gray-400">Fecha de ingreso:</p>
            <p className="text-white">{data.fecha}</p>
          </div>
          <div>
            <p className="text-gray-400">Estado:</p>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                data.estado ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {data.estado ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end mt-8">
        <motion.button
          onClick={onClose}
          className="bg-gradient-to-r from-[#00FF8C] to-[#39FF14] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg"
          variants={buttonVariants}
          whileHover="hoverGreen" // Resplandor verde neón
          whileTap="tap"
        >
          Cerrar
        </motion.button>
      </div>
    </BaseModal>
  );
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonVariants: PropTypes.object.isRequired,
};

const ManagerCard = ({
  manager,
  index,
  openModalVer,
  openModalEditar,
  handleDeleteManager,
  handleRestoreManager,
  cardVariants,
  buttonVariants, // Recibimos las variantes de los botones
}) => (
  <motion.div
    className="glass-card p-6 rounded-3xl"
    variants={cardVariants}
    whileHover="hover"
    layout
  >
    <div className="flex flex-col h-full">
      {/* Encabezado */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">
          {manager.apellidos} {manager.nombres}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            manager.estado ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {manager.estado ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Imagen */}
      <div className="mb-4 rounded-lg overflow-hidden">
        {manager.foto ? (
          typeof manager.foto === "string" ? (
            <img
              src={manager.foto}
              className="w-32 h-32 object-cover rounded-full mx-auto"
              alt="Manager"
            />
          ) : (
            <img
              src={URL.createObjectURL(manager.foto)}
              className="w-32 h-32 object-cover rounded-full mx-auto"
              alt="Manager"
            />
          )
        ) : (
          <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-gray-400"> Sin foto</span>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="flex-grow space-y-2 mb-4 text-white text-sm">
        <div>
          <p className="text-gray-400">Correo:</p>
          <p className="font-medium break-all">{manager.correo}</p>
        </div>
        <div>
          <p className="text-gray-400">Género:</p>
          <p>{manager.genero}</p>
        </div>
        <div>
          <p className="text-gray-400">Fecha de ingreso:</p>
          <p>{manager.fecha}</p>
        </div>
      </div>

      {/* Botones centrados */}
      <div className="flex justify-center gap-3 mt-auto">
        <motion.button
          variants={buttonVariants} // Aplica las variantes
          whileHover="hoverBlue" // Resplandor azul
          whileTap="tap"
          className="p-2 rounded-full backdrop-blur-md bg-blue-500/20 ring-1 ring-blue-500/30 hover:bg-blue-500"
          onClick={() => openModalVer(index)}
          aria-label="Ver detalles"
        >
          <FiEye className="text-white" />
        </motion.button>
        <motion.button
          variants={buttonVariants} // Aplica las variantes
          whileHover="hoverYellow" // Resplandor amarillo
          whileTap="tap"
          className="p-2 rounded-full backdrop-blur-md bg-yellow-400/20 ring-yellow-400/30 hover:bg-yellow-400"
          onClick={() => openModalEditar(index)}
          aria-label="Editar manager"
        >
          <FiEdit className="text-white" />
        </motion.button>
        {manager.estado ? (
          <motion.button
            variants={buttonVariants} // Aplica las variantes
            whileHover="hoverRed" // Resplandor rojo
            whileTap="tap"
            className="p-2 rounded-full backdrop-blur-md bg-red-500/20 ring-red-500/30 hover:bg-red-500"
            onClick={() => handleDeleteManager(index)}
            aria-label="Desactivar manager"
          >
            <FiTrash2 className="text-white" />
          </motion.button>
        ) : (
          <motion.button
            variants={buttonVariants} // Aplica las variantes
            whileHover="hoverGreen" // Resplandor verde
            whileTap="tap"
            className="p-2 bg-green-500 rounded-full"
            onClick={() => handleRestoreManager(index)}
            aria-label="Activar manager"
          >
            <FiRefreshCcw className="text-white" />
          </motion.button>
        )}
      </div>
    </div>
  </motion.div>
);

ManagerCard.propTypes = {
  manager: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  openModalVer: PropTypes.func.isRequired,
  openModalEditar: PropTypes.func.isRequired,
  handleDeleteManager: PropTypes.func.isRequired,
  handleRestoreManager: PropTypes.func.isRequired,
  cardVariants: PropTypes.object.isRequired,
  buttonVariants: PropTypes.object.isRequired, // Agregado propType para buttonVariants
};

export default Manager;