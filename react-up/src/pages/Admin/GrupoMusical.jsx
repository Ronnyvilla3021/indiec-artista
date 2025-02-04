import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiDownload,
  FiFilter,
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const GrupoMusical = () => {
  const [grupos, setGrupos] = useState([
    {
      foto: null,
      nombreGrupo: "Grupo 1",
      generoMusical: "Rock",
      descripcion: "Descripción del Grupo 1",
      plataforma: "Spotify",
      url: "https://spotify.com/grupo1",
      activo: true,
    },
    {
      foto: null,
      nombreGrupo: "Grupo 2",
      generoMusical: "Pop",
      descripcion: "Descripción del Grupo 2",
      plataforma: "YouTube",
      url: "https://youtube.com/grupo2",
      activo: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    nombreGrupo: "",
    generoMusical: "",
    descripcion: "",
    plataforma: "",
    url: "",
  });
  const [currentGrupo, setCurrentGrupo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all"); // "all", "active", "inactive"
  const [errors, setErrors] = useState({});

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredGrupos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grupos Musicales");
    XLSX.writeFile(workbook, "grupos_musicales.xlsx");
  };

  // Handle filter change
  const handleFilterChange = () => {
    setFilterActive((prev) => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  // Filter grupos based on search term and filter condition
  const filteredGrupos = grupos
    .filter((grupo) =>
      grupo.nombreGrupo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((grupo) => {
      if (filterActive === "all") return true;
      if (filterActive === "active") return grupo.activo;
      return !grupo.activo;
    });

  // Open and close modals
  const openModalCrear = () => {
    setFormData({
      foto: null,
      nombreGrupo: "",
      generoMusical: "",
      descripcion: "",
      plataforma: "",
      url: "",
    });
    setErrors({});
    setModalCrear(true);
  };

  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentGrupo(index);
    setFormData(grupos[index]);
    setErrors({});
    setModalEditar(true);
  };

  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentGrupo(index);
    setModalVer(true);
  };

  const closeModalVer = () => setModalVer(false);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreGrupo)
      newErrors.nombreGrupo = "El nombre del grupo es obligatorio.";
    if (!formData.generoMusical)
      newErrors.generoMusical = "El género musical es obligatorio.";
    if (!formData.descripcion)
      newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.plataforma)
      newErrors.plataforma = "La plataforma es obligatoria.";
    if (!formData.url) newErrors.url = "La URL es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add a new grupo
  const handleAddGrupo = () => {
    if (!validateForm()) return;
    setGrupos([...grupos, { ...formData, activo: true }]);
    Swal.fire({
      icon: "success",
      title: "Grupo agregado",
      text: `El grupo musical "${formData.nombreGrupo}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  // Update an existing grupo
  const handleUpdateGrupo = () => {
    if (!validateForm()) return;
    const updatedGrupos = [...grupos];
    updatedGrupos[currentGrupo] = { ...formData };
    setGrupos(updatedGrupos);
    Swal.fire({
      icon: "success",
      title: "Grupo actualizado",
      text: `El grupo musical "${formData.nombreGrupo}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  // Delete (deactivate) a grupo
  const handleDeleteGrupo = (index) => {
    const updatedGrupos = [...grupos];
    updatedGrupos[index].activo = false;
    setGrupos(updatedGrupos);
    Swal.fire({
      icon: "error",
      title: "Grupo desactivado",
      text: "El grupo fue marcado como inactivo.",
    });
  };

  // Restore (activate) a grupo
  const handleRestoreGrupo = (index) => {
    const updatedGrupos = [...grupos];
    updatedGrupos[index].activo = true;
    setGrupos(updatedGrupos);
    Swal.fire({
      icon: "success",
      title: "Grupo restaurado",
      text: "El grupo fue restaurado y está activo nuevamente.",
    });
  };

  return (
    <div
      className="p-8 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo.gif')" }} // Fondo animado
    >
      {/* Header and Add Button */}
      <div
        className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg"
        style={{
          backgroundImage: "url('/img/dc.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px",
        }}
      >
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontSize: "clamp(25px, 8vw, 60px)",
            margin: 0,
          }}
        >
          Grupo Musical
        </p>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{
              fontSize: "18px",
            }}
          >
            Agregar Grupo
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
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
                Grupo Musical
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Search, Filter, and Export Container */}
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
              placeholder="Buscar Grupo Musical..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
            />
          </div>
          <button
            onClick={handleFilterChange}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiFilter />
            {filterActive === "all"
              ? "Todos"
              : filterActive === "active"
              ? "Activos"
              : "Inactivos"}
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

      {/* Table of Grupos */}
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
                <th className="px-4 py-2">Nombre del Grupo</th>
                <th className="px-4 py-2">Género Musical</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Plataforma</th>
                <th className="px-4 py-2">URL</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrupos.map((grupo, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    grupo.activo ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {grupo.foto ? (
                      <img
                        src={URL.createObjectURL(grupo.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{grupo.nombreGrupo}</td>
                  <td className="px-4 py-2">{grupo.generoMusical}</td>
                  <td className="px-4 py-2">{grupo.descripcion}</td>
                  <td className="px-4 py-2">{grupo.plataforma}</td>
                  <td className="px-4 py-2">
                    <a
                      href={grupo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {grupo.url}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        grupo.activo ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {grupo.activo ? "Activo" : "Inactivo"}
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
                    {grupo.activo ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleDeleteGrupo(index)}
                      >
                        <FiTrash2 className="text-white" size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreGrupo(index)}
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

        {/* Modals */}
        {modalCrear && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalCrear}
            onChange={handleInputChange}
            onSave={handleAddGrupo}
            errors={errors}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateGrupo}
            errors={errors}
          />
        )}

        {modalVer && (
          <ModalVer data={grupos[currentGrupo]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

// ModalFormulario Component
const ModalFormulario = ({ formData, onClose, onChange, onSave, errors }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Formulario de Grupo Musical</h2>
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
          <label className="block text-sm font-medium mb-1">
            Nombre del Grupo
          </label>
          <input
            type="text"
            name="nombreGrupo"
            value={formData.nombreGrupo}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.nombreGrupo ? "border-red-500" : ""
            }`}
          />
          {errors.nombreGrupo && (
            <p className="text-red-500 text-sm mt-1">{errors.nombreGrupo}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Género Musical
          </label>
          <input
            type="text"
            name="generoMusical"
            value={formData.generoMusical}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.generoMusical ? "border-red-500" : ""
            }`}
          />
          {errors.generoMusical && (
            <p className="text-red-500 text-sm mt-1">{errors.generoMusical}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.descripcion ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.descripcion && (
            <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Plataforma</label>
          <input
            type="text"
            name="plataforma"
            value={formData.plataforma}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.plataforma ? "border-red-500" : ""
            }`}
          />
          {errors.plataforma && (
            <p className="text-red-500 text-sm mt-1">{errors.plataforma}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.url ? "border-red-500" : ""
            }`}
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url}</p>
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

// ModalVer Component
const ModalVer = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Detalles del Grupo Musical</h2>
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
          <label className="block text-sm font-medium mb-1">
            Nombre del Grupo
          </label>
          <p>{data.nombreGrupo}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Género Musical
          </label>
          <p>{data.generoMusical}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <p>{data.descripcion}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Plataforma</label>
          <p>{data.plataforma}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">URL</label>
          <p>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {data.url}
            </a>
          </p>
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
  errors: PropTypes.object.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GrupoMusical;
