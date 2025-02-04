import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiFilter,
  FiDownload,
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

// Componente principal
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
    validateField(name, value); // Validar el campo en tiempo real
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
      delete newErrors[name]; // Eliminar el error si el campo es válido
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
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByYear = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCanciones);
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
    <div className="p-8 min-h-screen bg-cover bg-center bg-[url('/fondo.gif')]">
      {/* Encabezado y botón de agregar */}
      <div
        className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg bg-cover bg-center"
        style={{ backgroundImage: "url('/img/dc.jpg')", borderRadius: "20px" }}
      >
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ fontSize: "clamp(25px, 8vw, 60px)", margin: 0 }}
        >
          Canción
        </p>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{ fontSize: "18px" }}
          >
            Agregar Canción
          </button>
        </div>
      </div>

      {/* Migajas de pan */}
      <div
        className="md:ml-72 p-4 mx-auto bg-blue-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9",
          borderRadius: "20px",
          marginTop: "20px",
          marginBottom: "20px",
          height: "auto",
          padding: "10px",
        }}
      >
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap gap-2 list-none p-0 m-0 justify-center items-center">
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <Link
                to="/dashboard"
                className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline"
              >
                Inicio
              </Link>
            </li>
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-2">/</span>
            </li>
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
                Canción
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de búsqueda, filtro y exportar */}
      <div
        className="md:ml-72 p-4 mx-auto bg-gray-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9",
          borderRadius: "20px",
          marginTop: "20px",
          marginBottom: "20px",
          height: "auto",
          padding: "10px",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
          <div className=" w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Canción..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
            />
          </div>
          <button
            onClick={handleSortByYear}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiFilter />
            {sortOrder === "asc" ? "Año Ascendente" : "Año Descendente"}
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiDownload />
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Tabla de canciones */}
      <div
        className="flex-1 ml-0 md:ml-72 p-4 rounded-lg overflow-auto"
        style={{ backgroundColor: "rgba(241, 248, 249, 0.8)" }}
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full table-auto rounded-lg shadow-md"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          >
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Foto</th>
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Álbum</th>
                <th className="px-4 py-2">Duración</th>
                <th className="px-4 py-2">Año</th>
                <th className="px-4 py-2">Género</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCanciones.map((cancion, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    cancion.estado === "Activo"
                      ? "hover:bg-gray-100"
                      : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {cancion.foto ? (
                      <img
                        src={URL.createObjectURL(cancion.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{cancion.titulo}</td>
                  <td className="px-4 py-2">{cancion.album}</td>
                  <td className="px-4 py-2">{cancion.duracion}</td>
                  <td className="px-4 py-2">{cancion.año}</td>
                  <td className="px-4 py-2">{cancion.genero}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        cancion.estado === "Activo"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {cancion.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalVer(index)}
                    >
                      <FiEye className="text-white" size={20} />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalEditar(index)}
                    >
                      <FiEdit className="text-white" size={20} />
                    </motion.div>
                    {cancion.estado === "Activo" ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleDeleteCancion(index)}
                      >
                        <FiTrash2 className="text-white" size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreCancion(index)}
                      >
                        <FiRefreshCcw className="text-white" size={20} />
                      </motion.div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modales */}
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
      </div>
    </div>
  );
};

// ModalFormulario
const ModalFormulario = ({
  formData,
  onClose,
  onChange,
  onSave,
  generos,
  errors,
  isFormValid,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Formulario de Canción</h2>
      <form>
        <div className="mb-4 text-center">
          <label className="block text-sm font-semibold text-gray-700 mb-2"></label>
          <div>
            <label
              htmlFor="foto"
              className="inline-block bg-[#067b80] text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-[#056b6e] focus:ring-2 focus:ring-[#056b6e] focus:outline-none"
            >
              Subir Imagen
            </label>
            <input
              id="foto"
              type="file"
              name="foto"
              onChange={onChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.titulo ? "border-red-500" : ""
            }`}
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Álbum</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.album ? "border-red-500" : ""
            }`}
          />
          {errors.album && (
            <p className="text-red-500 text-sm mt-1">{errors.album}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Duración</label>
          <input
            type="text"
            name="duracion"
            value={formData.duracion}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.duracion ? "border-red-500" : ""
            }`}
          />
          {errors.duracion && (
            <p className="text-red-500 text-sm mt-1">{errors.duracion}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Año</label>
          <input
            type="number"
            name="año"
            value={formData.año}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.año ? "border-red-500" : ""
            }`}
          />
          {errors.año && (
            <p className="text-red-500 text-sm mt-1">{errors.año}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
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
        <div className="flex justify-end">
          <button
            onClick={onSave}
            className={`bg-blue-500 text-white p-2 rounded-lg mr-2 ${
              !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isFormValid()}
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-red-400 text-white p-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </form>
    </div>
  </div>
);

// ModalVer
const ModalVer = ({ cancion, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Ver Canción</h2>
      <div className="mb-4">
        <strong>Foto:</strong>
        {cancion.foto ? (
          <img
            src={URL.createObjectURL(cancion.foto)}
            alt="Foto"
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          "Sin foto"
        )}
      </div>
      <div className="mb-4">
        <strong>Título:</strong>
        <p>{cancion.titulo}</p>
      </div>
      <div className="mb-4">
        <strong>Álbum:</strong>
        <p>{cancion.album}</p>
      </div>
      <div className="mb-4">
        <strong>Duración:</strong>
        <p>{cancion.duracion}</p>
      </div>
      <div className="mb-4">
        <strong>Año:</strong>
        <p>{cancion.año}</p>
      </div>
      <div className="mb-4">
        <strong>Género:</strong>
        <p>{cancion.genero}</p>
      </div>
      <div className="mb-4">
        <strong>Estado:</strong>
        <p>{cancion.estado}</p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-purple-500 text-white p-2 rounded-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

// PropTypes
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
