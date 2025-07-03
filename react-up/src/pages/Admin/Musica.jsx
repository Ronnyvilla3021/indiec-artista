import { useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiFilter,
  FiDownload,
  FiPlusCircle,
  FiSearch // Added missing FiSearch
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const Musica = () => {
  const [canciones, setCanciones] = useState([
    {
      foto: null,
      titulo: "Canción 1",
      album: "Álbum 1",
      duracion: "3:45",
      año: 2020,
      genero: "Rock",
      estado: "Activo",
    },
    {
      foto: null,
      titulo: "Canción 2",
      album: "Álbum 2",
      duracion: "4:20",
      año: 2021,
      genero: "Pop",
      estado: "Activo",
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    titulo: "",
    album: "",
    duracion: "",
    año: "",
    genero: "",
    estado: "Activo",
  });
  const [currentCancion, setCurrentCancion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    setErrors({});
    setModalCrear(true);
  };

  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentCancion(index);
    setFormData(canciones[index]);
    setErrors({});
    setModalEditar(true);
  };

  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentCancion(index);
    setModalVer(true);
  };

  const closeModalVer = () => setModalVer(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === "titulo" && !value) {
      newErrors.titulo = "El título es obligatorio.";
    } else if (name === "album" && !value) {
      newErrors.album = "El álbum es obligatorio.";
    } else if (name === "duracion" && !value) {
      newErrors.duracion = "La duración es obligatoria.";
    } else if (name === "año" && !value) {
      newErrors.año = "El año es obligatorio.";
    } else if (name === "genero" && !value) {
      newErrors.genero = "El género es obligatorio.";
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const isFormValid = () => {
    return (
      formData.titulo &&
      formData.album &&
      formData.duracion &&
      formData.año &&
      formData.genero &&
      Object.keys(errors).length === 0
    );
  };

  const handleAddCancion = () => {
    if (!isFormValid()) return;
    setCanciones([...canciones, { ...formData }]);
    Swal.fire({
      icon: "success",
      title: "Canción agregada",
      text: `La canción "${formData.titulo}" fue agregada exitosamente.`,
      background: "#f1f8f9",
      confirmButtonColor: "#0aa5a9",
    });
    closeModalCrear();
  };

  const handleUpdateCancion = () => {
    if (!isFormValid()) return;
    const updatedCanciones = [...canciones];
    updatedCanciones[currentCancion] = { ...formData };
    setCanciones(updatedCanciones);
    Swal.fire({
      icon: "success",
      title: "Canción actualizada",
      text: `La canción "${formData.titulo}" fue actualizada exitosamente.`,
      background: "#f1f8f9",
      confirmButtonColor: "#0aa5a9",
    });
    closeModalEditar();
  };

  const handleDeleteCancion = (index) => {
    const updatedCanciones = [...canciones];
    updatedCanciones[index].estado = "Inactivo";
    setCanciones(updatedCanciones);
    Swal.fire({
      icon: "error",
      title: "Canción desactivada",
      text: "La canción fue marcada como inactiva.",
      background: "#f1f8f9",
      confirmButtonColor: "#0aa5a9",
    });
  };

  const handleRestoreCancion = (index) => {
    const updatedCanciones = [...canciones];
    updatedCanciones[index].estado = "Activo";
    setCanciones(updatedCanciones);
    Swal.fire({
      icon: "success",
      title: "Canción restaurada",
      text: "La canción fue restaurada y está activa nuevamente.",
      background: "#f1f8f9",
      confirmButtonColor: "#0aa5a9",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByYear = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      canciones.map((cancion) => ({
        Título: cancion.titulo,
        Álbum: cancion.album,
        Duración: cancion.duracion,
        Año: cancion.año,
        Género: cancion.genero,
        Estado: cancion.estado,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Canciones");
    XLSX.writeFile(workbook, "canciones.xlsx");
  };

  const filteredCanciones = canciones
    .filter((cancion) =>
      cancion.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === "asc" ? a.año - b.año : b.año - a.año;
    });

  return (

<div style={{
  background: "linear-gradient(135deg, rgba(241,248,249,0.9) 0%, rgba(214,234,236,0.9) 100%)",
  minHeight: "100vh",
  padding: "2rem 4rem", // Aumenta padding horizontal
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
}}>
  {/* Contenedor que centra todo el contenido */}
  <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg w-full">
    {/* Hero Section */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Gestión de Música</h1>
          <p className="text-lg opacity-90">Administra tu colección musical</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModalCrear}
          className="mt-4 md:mt-0 bg-white text-teal-700 px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <FiPlusCircle size={20} />
          Agregar Canción
        </motion.button>
      </div>
    </motion.div>

    {/* Breadcrumb */}
    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <nav className="flex items-center space-x-2 text-sm">
        <Link to="/dashboard" className="text-cyan-600 hover:underline">
          Inicio
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-cyan-600 font-medium">Música</span>
      </nav>
    </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar canción..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSortByYear}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FiFilter />
              {sortOrder === "asc" ? "Año ↑" : "Año ↓"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportToExcel}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FiDownload />
              Exportar
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Foto</th>
                <th className="px-6 py-3 text-left">Título</th>
                <th className="px-6 py-3 text-left">Álbum</th>
                <th className="px-6 py-3 text-left">Duración</th>
                <th className="px-6 py-3 text-left">Año</th>
                <th className="px-6 py-3 text-left">Género</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredCanciones.map((cancion, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`border-t border-gray-200 ${cancion.estado === "Inactivo" ? "bg-gray-50" : "hover:bg-cyan-50"
                      }`}
                  >
                    <td className="px-6 py-4">
                      {cancion.foto ? (
                        <img
                          src={URL.createObjectURL(cancion.foto)}
                          alt="Cover"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{cancion.titulo}</td>
                    <td className="px-6 py-4">{cancion.album}</td>
                    <td className="px-6 py-4">{cancion.duracion}</td>
                    <td className="px-6 py-4">{cancion.año}</td>
                    <td className="px-6 py-4">{cancion.genero}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${cancion.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {cancion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 rounded-full text-white"
                        onClick={() => openModalVer(index)}
                      >
                        <FiEye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-yellow-500 rounded-full text-white"
                        onClick={() => openModalEditar(index)}
                      >
                        <FiEdit size={16} />
                      </motion.button>
                      {cancion.estado === "Activo" ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full text-white"
                          onClick={() => handleDeleteCancion(index)}
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full text-white"
                          onClick={() => handleRestoreCancion(index)}
                        >
                          <FiRefreshCcw size={16} />
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalCrear && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalCrear}
            onChange={handleInputChange}
            onSave={handleAddCancion}
            generos={generos}
            errors={errors}
            isFormValid={isFormValid}
          />
        )}
        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateCancion}
            generos={generos}
            errors={errors}
            isFormValid={isFormValid}
          />
        )}
        {modalVer && (
          <ModalVer
            cancion={canciones[currentCancion]}
            onClose={closeModalVer}
          />
        )}
      </AnimatePresence>
    </div>
    </div>

  );
};

// ModalFormulario Component
const ModalFormulario = ({
  formData,
  onClose,
  onChange,
  onSave,
  generos,
  errors,
  isFormValid,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white rounded-xl p-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-cyan-700 mb-4">Formulario de Canción</h2>

      <div className="mb-4 text-center">
        <label className="block mb-2 font-medium">Imagen de la canción</label>
        <label
          htmlFor="foto"
          className="inline-block bg-cyan-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-cyan-700 transition"
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
          { label: "Título", name: "titulo", type: "text" },
          { label: "Álbum", name: "album", type: "text" },
          { label: "Duración", name: "duracion", type: "text" },
          { label: "Año", name: "año", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={onChange}
              className={`w-full p-2 border rounded-lg ${errors[field.name] ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={onChange}
            className={`w-full p-2 border rounded-lg ${errors.genero ? "border-red-500" : "border-gray-300"
              }`}
          >
            <option value="">Selecciona un género</option>
            {generos.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
          {errors.genero && (
            <p className="text-red-500 text-sm mt-1">{errors.genero}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={!isFormValid()}
          className={`px-4 py-2 rounded-lg transition ${isFormValid()
            ? "bg-cyan-600 text-white hover:bg-cyan-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Guardar
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ModalVer Component
const ModalVer = ({ cancion, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white rounded-xl p-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-cyan-700 mb-4">Detalles de la Canción</h2>

      <div className="space-y-4">
        <div>
          <label className="font-medium">Foto:</label>
          {cancion.foto ? (
            <img
              src={URL.createObjectURL(cancion.foto)}
              alt="Cover"
              className="w-24 h-24 rounded-lg object-cover mt-2"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mt-2">
              Sin foto
            </div>
          )}
        </div>

        {[
          { label: "Título", value: cancion.titulo },
          { label: "Álbum", value: cancion.album },
          { label: "Duración", value: cancion.duracion },
          { label: "Año", value: cancion.año },
          { label: "Género", value: cancion.genero },
        ].map((item) => (
          <div key={item.label}>
            <label className="font-medium">{item.label}:</label>
            <p className="mt-1">{item.value}</p>
          </div>
        ))}

        <div>
          <label className="font-medium">Estado:</label>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${cancion.estado === "Activo"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {cancion.estado}
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
        >
          Cerrar
        </button>
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
  isFormValid: PropTypes.func.isRequired,
};

ModalVer.propTypes = {
  cancion: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Musica;