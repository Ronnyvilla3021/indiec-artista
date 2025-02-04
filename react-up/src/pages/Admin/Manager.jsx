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

const Manager = () => {
  const [managers, setManagers] = useState([
    {
      foto: null,
      apellidos: "Perez",
      nombres: "Juan",
      correo: "juan.perez@example.com",
      genero: "Masculino",
      fecha: "2025-02-10", // Agregué una propiedad de fecha para el ejemplo
      estado: true,
    },
    {
      foto: null,
      apellidos: "Gomez",
      nombres: "Maria",
      correo: "maria.gomez@example.com",
      genero: "Femenino",
      fecha: "2025-03-20", // Agregué una propiedad de fecha para el ejemplo
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
    fecha: "", // Agregué una propiedad de fecha para el formulario
  });
  const [currentManager, setCurrentManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Estado para el orden de la fecha
  const [errors, setErrors] = useState({});

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByDate = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredManagers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Managers");
    XLSX.writeFile(workbook, "managers.xlsx");
  };

  const filteredManagers = managers
    .filter(
      (manager) =>
        manager.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.fecha) - new Date(b.fecha);
      } else {
        return new Date(b.fecha) - new Date(a.fecha);
      }
    });

  const openModalCrear = () => {
    setFormData({
      foto: null,
      apellidos: "",
      nombres: "",
      correo: "",
      genero: "",
      fecha: "",
    });
    setErrors({});
    setModalCrear(true);
  };

  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentManager(index);
    setFormData(managers[index]);
    setErrors({});
    setModalEditar(true);
  };

  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentManager(index);
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
    if (!formData.apellidos)
      newErrors.apellidos = "Los apellidos son obligatorios.";
    if (!formData.nombres) newErrors.nombres = "Los nombres son obligatorios.";
    if (!formData.correo) newErrors.correo = "El correo es obligatorio.";
    if (!formData.genero) newErrors.genero = "El género es obligatorio.";
    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria."; // Validación de fecha
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddManager = () => {
    if (!validateForm()) return;
    setManagers([...managers, { ...formData, estado: true }]);
    Swal.fire({
      icon: "success",
      title: "Usuario agregado",
      text: `El usuario "${formData.nombres}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateManager = () => {
    if (!validateForm()) return;
    const updatedManagers = [...managers];
    updatedManagers[currentManager] = { ...formData };
    setManagers(updatedManagers);
    Swal.fire({
      icon: "success",
      title: "Usuario actualizado",
      text: `El usuario "${formData.nombres}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteManager = (index) => {
    const updatedManagers = [...managers];
    updatedManagers[index].estado = false;
    setManagers(updatedManagers);
    Swal.fire({
      icon: "error",
      title: "Usuario desactivado",
      text: "El usuario fue marcado como inactivo.",
    });
  };

  const handleRestoreManager = (index) => {
    const updatedManagers = [...managers];
    updatedManagers[index].estado = true;
    setManagers(updatedManagers);
    Swal.fire({
      icon: "success",
      title: "Usuario restaurado",
      text: "El usuario fue restaurado y está activo nuevamente.",
    });
  };

  return (
    <div
      className="p-8 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo.gif')" }}
    >
      {/* Encabezado y botón de agregar */}
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
          style={{ fontSize: "clamp(25px, 8vw, 60px)", margin: 0 }}
        >
          Manager
        </p>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{ fontSize: "18px" }}
          >
            Agregar Manager
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
                Manager
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
              placeholder="Buscar Manager..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
            />
          </div>
          <button
            onClick={handleSortByDate}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiFilter />
            {sortOrder === "asc" ? "Fecha Ascendente" : "Fecha Descendente"}
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiDownload /> Exportar a Excel
          </button>
        </div>
      </div>

      {/* Tabla de managers */}
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
                <th className="px-4 py-2">Apellidos</th>
                <th className="px-4 py-2">Nombres</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Género</th>
                <th className="px-4 py-2">Fecha</th>{" "}
                {/* Nueva columna de fecha */}
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.map((manager, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    manager.estado ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {manager.foto ? (
                      <img
                        src={URL.createObjectURL(manager.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{manager.apellidos}</td>
                  <td className="px-4 py-2">{manager.nombres}</td>
                  <td className="px-4 py-2">{manager.correo}</td>
                  <td className="px-4 py-2">{manager.genero}</td>
                  <td className="px-4 py-2">{manager.fecha}</td>{" "}
                  {/* Nueva columna de fecha */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        manager.estado ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {manager.estado ? "Activo" : "Inactivo"}
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
                    {manager.estado ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleDeleteManager(index)}
                      >
                        <FiTrash2 className="text-white" size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreManager(index)}
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
            onSave={handleAddManager}
            errors={errors}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateManager}
            errors={errors}
          />
        )}

        {modalVer && (
          <ModalVer data={managers[currentManager]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave, errors }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Formulario de Usuario</h2>
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
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.apellidos ? "border-red-500" : ""
            }`}
          />
          {errors.apellidos && (
            <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.nombres ? "border-red-500" : ""
            }`}
          />
          {errors.nombres && (
            <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.correo ? "border-red-500" : ""
            }`}
          />
          {errors.correo && (
            <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.genero ? "border-red-500" : ""
            }`}
          >
            <option value="">Seleccionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          {errors.genero && (
            <p className="text-red-500 text-sm mt-1">{errors.genero}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.fecha ? "border-red-500" : ""
            }`}
          />
          {errors.fecha && (
            <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>
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

const ModalVer = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ver Usuario</h2>
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
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <p>{data.apellidos}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <p>{data.nombres}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <p>{data.correo}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <p>{data.genero}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <p>{data.fecha}</p>
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

export default Manager;
