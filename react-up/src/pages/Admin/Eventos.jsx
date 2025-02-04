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

const Eventos = () => {
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
  const [sortOrder, setSortOrder] = useState("asc");
  const [errors, setErrors] = useState({});

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByDate = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEventos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Eventos");
    XLSX.writeFile(workbook, "eventos.xlsx");
  };

  const filteredEventos = eventos
    .filter((evento) =>
      evento.nombreEvento.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.fecha) - new Date(b.fecha)
        : new Date(b.fecha) - new Date(a.fecha);
    });

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
    setErrors({});
    setModalCrear(true);
  };

  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentEvento(index);
    setFormData(eventos[index]);
    setErrors({});
    setModalEditar(true);
  };

  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentEvento(index);
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
    if (!formData.nombreEvento)
      newErrors.nombreEvento = "El nombre del evento es obligatorio.";
    if (!formData.generoMusical)
      newErrors.generoMusical = "El género musical es obligatorio.";
    if (!formData.descripcion)
      newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.ubicacion)
      newErrors.ubicacion = "La ubicación es obligatoria.";
    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria.";
    if (!formData.contacto) newErrors.contacto = "El contacto es obligatorio.";
    if (!formData.capacidad)
      newErrors.capacidad = "La capacidad es obligatoria.";
    if (!formData.artistas)
      newErrors.artistas = "Los artistas son obligatorios.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEvento = () => {
    if (!validateForm()) return;
    setEventos([...eventos, { ...formData, estado: true }]);
    Swal.fire({
      icon: "success",
      title: "Evento agregado",
      text: `El evento "${formData.nombreEvento}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateEvento = () => {
    if (!validateForm()) return;
    const updatedEventos = [...eventos];
    updatedEventos[currentEvento] = { ...formData };
    setEventos(updatedEventos);
    Swal.fire({
      icon: "success",
      title: "Evento actualizado",
      text: `El evento "${formData.nombreEvento}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteEvento = (index) => {
    const updatedEventos = [...eventos];
    updatedEventos[index].estado = false;
    setEventos(updatedEventos);
    Swal.fire({
      icon: "error",
      title: "Evento desactivado",
      text: "El evento fue marcado como inactivo.",
    });
  };

  const handleRestoreEvento = (index) => {
    const updatedEventos = [...eventos];
    updatedEventos[index].estado = true;
    setEventos(updatedEventos);
    Swal.fire({
      icon: "success",
      title: "Evento restaurado",
      text: "El evento fue restaurado y está activo nuevamente.",
    });
  };

  return (
    <div
      className="p-8 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo.gif')" }} // Fondo animado
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
          style={{
            fontSize: "clamp(25px, 8vw, 60px)",
            margin: 0,
          }}
        >
          Evento
        </p>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{
              fontSize: "18px",
            }}
          >
            Agregar Evento
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
                Evento
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
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Evento..."
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
            <FiDownload />
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Tabla de eventos */}
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
                <th className="px-4 py-2">Nombre del Evento</th>
                <th className="px-4 py-2">Género Musical</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Ubicación</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Contacto</th>
                <th className="px-4 py-2">Capacidad</th>
                <th className="px-4 py-2">Artistas</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEventos.map((evento, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    evento.estado ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {evento.foto ? (
                      <img
                        src={URL.createObjectURL(evento.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{evento.nombreEvento}</td>
                  <td className="px-4 py-2">{evento.generoMusical}</td>
                  <td className="px-4 py-2">{evento.descripcion}</td>
                  <td className="px-4 py-2">{evento.ubicacion}</td>
                  <td className="px-4 py-2">{evento.fecha}</td>
                  <td className="px-4 py-2">{evento.contacto}</td>
                  <td className="px-4 py-2">{evento.capacidad}</td>
                  <td className="px-4 py-2">{evento.artistas}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        evento.estado ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {evento.estado ? "Activo" : "Inactivo"}
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
                    {evento.estado ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleDeleteEvento(index)}
                      >
                        <FiTrash2 className="text-white" size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreEvento(index)}
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
            onSave={handleAddEvento}
            errors={errors}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateEvento}
            errors={errors}
          />
        )}

        {modalVer && (
          <ModalVer data={eventos[currentEvento]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave, errors }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Formulario de Evento</h2>
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
            Nombre del Evento
          </label>
          <input
            type="text"
            name="nombreEvento"
            value={formData.nombreEvento}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.nombreEvento ? "border-red-500" : ""
            }`}
          />
          {errors.nombreEvento && (
            <p className="text-red-500 text-sm mt-1">{errors.nombreEvento}</p>
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
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.descripcion ? "border-red-500" : ""
            }`}
          />
          {errors.descripcion && (
            <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.ubicacion ? "border-red-500" : ""
            }`}
          />
          {errors.ubicacion && (
            <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contacto</label>
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.contacto ? "border-red-500" : ""
            }`}
          />
          {errors.contacto && (
            <p className="text-red-500 text-sm mt-1">{errors.contacto}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Capacidad</label>
          <input
            type="number"
            name="capacidad"
            value={formData.capacidad}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.capacidad ? "border-red-500" : ""
            }`}
          />
          {errors.capacidad && (
            <p className="text-red-500 text-sm mt-1">{errors.capacidad}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Artistas</label>
          <input
            type="text"
            name="artistas"
            value={formData.artistas}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.artistas ? "border-red-500" : ""
            }`}
          />
          {errors.artistas && (
            <p className="text-red-500 text-sm mt-1">{errors.artistas}</p>
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
        <h2 className="text-xl font-bold mb-4">Ver Evento</h2>
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
            Nombre del Evento
          </label>
          <p>{data.nombreEvento}</p>
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
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <p>{data.ubicacion}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <p>{data.fecha}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contacto</label>
          <p>{data.contacto}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Capacidad</label>
          <p>{data.capacidad}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Artistas</label>
          <p>{data.artistas}</p>
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

export default Eventos;
