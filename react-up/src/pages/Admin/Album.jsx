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
import * as XLSX from "xlsx"; // Importar la librerí a xlsx

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
  const [errors, setErrors] = useState({});
  const [sortOrder, setSortOrder] = useState("asc"); // Estado para el orden de los años

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
      artista: "",
      año: "",
      genero: "",
    });
    setErrors({});
    setModalCrear(true);
  };
  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentAlbum(index);
    setFormData(albums[index]);
    setErrors({});
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentAlbum(index);
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
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo) newErrors.titulo = "El título es obligatorio.";
    if (!formData.artista) newErrors.artista = "El artista es obligatorio.";
    if (!formData.año) newErrors.año = "El año es obligatorio.";
    if (!formData.genero) newErrors.genero = "El género es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAlbum = () => {
    if (!validateForm()) return;
    setAlbums([...albums, { ...formData, activo: true }]);
    Swal.fire({
      icon: "success",
      title: "Álbum agregado",
      text: `El álbum "${formData.titulo}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateAlbum = () => {
    if (!validateForm()) return;
    const updatedAlbums = [...albums];
    updatedAlbums[currentAlbum] = { ...formData };
    setAlbums(updatedAlbums);
    Swal.fire({
      icon: "success",
      title: "Álbum actualizado",
      text: `El álbum "${formData.titulo}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteAlbum = (index) => {
    const updatedAlbums = [...albums];
    updatedAlbums[index].activo = false;
    setAlbums(updatedAlbums);
    Swal.fire({
      icon: "error",
      title: "Álbum desactivado",
      text: "El álbum fue marcado como inactivo.",
    });
  };

  const handleRestoreAlbum = (index) => {
    const updatedAlbums = [...albums];
    updatedAlbums[index].activo = true;
    setAlbums(updatedAlbums);
    Swal.fire({
      icon: "success",
      title: "Álbum restaurado",
      text: "El álbum fue restaurado y está activo nuevamente.",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByYear = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAlbums);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Álbumes");
    XLSX.writeFile(workbook, "albumes.xlsx");
  };

  const filteredAlbums = albums
    .filter((album) =>
      album.titulo.toLowerCase().includes(searchTerm.toLowerCase())
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
          Álbum
        </p>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{ fontSize: "18px" }}
          >
            Agregar Álbum
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
                Álbum
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de búsqueda, filtrar y exportar */}
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
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Álbum..."
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

      {/* Tabla de álbumes */}
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
                <th className="px-4 py-2">Artista</th>
                <th className="px-4 py-2">Año</th>
                <th className="px-4 py-2">Género</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlbums.map((album, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    album.activo ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {album.foto ? (
                      <img
                        src={URL.createObjectURL(album.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{album.titulo}</td>
                  <td className="px-4 py-2">{album.artista}</td>
                  <td className="px-4 py-2">{album.año}</td>
                  <td className="px-4 py-2">{album.genero}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        album.activo ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {album.activo ? "Activo" : "Inactivo"}
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
                    {album.activo ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleDeleteAlbum(index)}
                      >
                        <FiTrash2 className="text-white" size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreAlbum(index)}
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
            onSave={handleAddAlbum}
            generos={generos}
            errors={errors}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateAlbum}
            generos={generos}
            errors={errors}
          />
        )}

        {modalVer && (
          <ModalVer data={albums[currentAlbum]} onClose={closeModalVer} />
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
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Formulario de Álbum</h2>
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
          <label className="block text-sm font-medium mb-2">Artista</label>
          <input
            type="text"
            name="artista"
            value={formData.artista}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.artista ? "border-red-500" : ""
            }`}
          />
          {errors.artista && (
            <p className="text-red-500 text-sm mt-1">{errors.artista}</p>
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
            className="bg-blue-500 text-white p-2 rounded-lg mr-2"
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
      </div>
    </div>
  );
};

// ModalVer
const ModalVer = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Ver Álbum</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Foto</label>
          {data.foto ? (
            <img
              src={URL.createObjectURL(data.foto)}
              alt="Foto"
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <span>Sin foto</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Título</label>
          <p>{data.titulo}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Artista</label>
          <p>{data.artista}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Año</label>
          <p>{data.año}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <p>{data.genero}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 text-white p-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  generos: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Album;
