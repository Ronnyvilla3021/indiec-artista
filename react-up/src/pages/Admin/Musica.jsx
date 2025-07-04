import { useState, useEffect } from "react";
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
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import AOS from "aos"; // Importa AOS
import "aos/dist/aos.css"; // Importa el CSS de AOS

const Musica = () => {
  useEffect(() => {
    AOS.init({
      // Puedes configurar opciones globales aquí
      duration: 1000, // Duración por defecto de las animaciones en ms
      once: true, // Si las animaciones deben ocurrir solo una vez
    });
    AOS.refresh(); // Refresca AOS si el contenido cambia dinámicamente
  }, []);

  const [canciones, setCanciones] = useState([
    {
      foto: "https://marketplace.canva.com/EAF2uOSjdVU/1/0/1600w/canva-negro-p%C3%BArpura-brillante-%C3%A1cido-brutalista-general-hip-hop-portada-de-%C3%A1lbum-TuLZGoZHXtA.jpg", // Simulated URL
      titulo: "Canción 1",
      album: "Álbum 1",
      duracion: "3:45",
      año: 2020,
      genero: "Rock",
      estado: "Activo",
    },
    {
      foto: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/techno-music-album-cover-template-design-54ad7cf78c858c37ba141bb421ac79ee_screen.jpg?ts=1742997697",
      titulo: "Canción 2",
      album: "Álbum 2",
      duracion: "4:20",
      año: 2021,
      genero: "Pop",
      estado: "Activo",
    },
  ]);

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

  // Funciones de los modales
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

  // Funciones de manejo de datos
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddCancion = () => {
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
    .sort((a, b) => (sortOrder === "asc" ? a.año - b.año : b.año - a.año));

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 140, 0.5)" },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
      {/* Fondo animado */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(circle at top left, #39FF14 0%, transparent 30%),
                        radial-gradient(circle at bottom right, #00FF8C 0%, transparent 30%)`,
          backgroundSize: "200% 200%",
          animation: "bg-pan 20s ease infinite",
        }}
      ></div>

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
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          border-radius: 1.5rem;
        }
        .glass-table-header {
          background: rgba(0, 255, 140, 0.2);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 255, 140, 0.3);
        }
        .glass-table-row {
          background: rgba(255, 255, 255, 0.03);
        }
        .glass-table-row:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <div className="relative z-10">
        {/* Encabezado */}
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          data-aos="fade-down" // Animación AOS aplicada aquí
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <h1 className="text-4xl font-bold">Gestión de Música</h1>
          <p className="text-lg opacity-90">Administra tu colección musical</p>
        </motion.div>

        {/* Migas de pan */}

        <motion.div
          className="glass-card p-4 mb-8 flex justify-center"
          variants={itemVariants}
          data-aos="fade-down" // Animación AOS aplicada aquí
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  to="/dashboard"
                  className="text-[#00FF8C] px-4 py-2 rounded-lg transition duration-300 hover:bg-[rgba(0,255,140,0.15)] hover:text-white no-underline font-semibold"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <span className="text-gray-500 px-2">/</span>
              </li>
              <li>
                <span className="text-white px-4 py-2 rounded-lg font-semibold">
                  Música
                </span>
              </li>
            </ol>
          </nav>
        </motion.div>

        {/* Controles */}
        <motion.div
          className="glass-card p-6 mb-8 flex flex-wrap gap-4"
          variants={itemVariants}
          data-aos="fade-down" // Animación AOS aplicada aquí
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar canción..."
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
              onClick={handleSortByYear}
            >
              <FiFilter /> {sortOrder === "asc" ? "Año ↑" : "Año ↓"}
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
              <FiPlusCircle /> Agregar Canción
            </motion.button>
          </div>
        </motion.div>

        {/* Tabla */}
        <motion.div
          className="glass-card p-6 overflow-x-auto"
          variants={itemVariants}
          data-aos="fade-down" // Animación AOS aplicada aquí
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <table className="w-full">
            <thead>
              <tr className="glass-table-header">
                <th className="py-3 px-6 text-left">Foto</th>
                <th className="py-3 px-6 text-left">Título</th>
                <th className="py-3 px-6 text-left">Álbum</th>
                <th className="py-3 px-6 text-left">Duración</th>
                <th className="py-3 px-6 text-left">Año</th>
                <th className="py-3 px-6 text-left">Género</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredCanciones.map((cancion, index) => (
                  <motion.tr
                    key={index}
                    className="glass-table-row border-b border-gray-700"
                    variants={itemVariants}
                  >
                    <td className="py-4 px-6">
                      {cancion.foto ? (
                        <img
                          src={cancion.foto}
                          className="w-12 h-12 rounded-lg object-cover"
                          alt="Portada"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">{cancion.titulo}</td>
                    <td className="py-4 px-6">{cancion.album}</td>
                    <td className="py-4 px-6">{cancion.duracion}</td>
                    <td className="py-4 px-6">{cancion.año}</td>
                    <td className="py-4 px-6">{cancion.genero}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cancion.estado === "Activo"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {cancion.estado}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex justify-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 rounded-full"
                        onClick={() => openModalVer(index)}
                      >
                        <FiEye className="text-white" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-yellow-500 rounded-full"
                        onClick={() => openModalEditar(index)}
                      >
                        <FiEdit className="text-white" />
                      </motion.button>
                      {cancion.estado === "Activo" ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteCancion(index)}
                        >
                          <FiTrash2 className="text-white" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreCancion(index)}
                        >
                          <FiRefreshCcw className="text-white" />
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
              onClose={closeModalCrear}
              onChange={handleInputChange}
              onSave={handleAddCancion}
              generos={generos}
              title="Agregar Canción"
            />
          )}

          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModalEditar}
              onChange={handleInputChange}
              onSave={handleUpdateCancion}
              generos={generos}
              title="Editar Canción"
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

// Componente ModalFormulario
const ModalFormulario = ({ formData, onClose, onChange, onSave, generos, title }) => (
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
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        {title}
      </h2>

      <div className="mb-4 text-center">
        <label className="block text-sm font-semibold mb-2 text-gray-300">
          Imagen
        </label>
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
          { label: "Título", name: "titulo", type: "text" },
          { label: "Álbum", name: "album", type: "text" },
          { label: "Duración", name: "duracion", type: "text" },
          { label: "Año", name: "año", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={onChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">
            Género
          </label>
          <select
            name="genero"
            value={formData.genero}
            onChange={onChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
          >
            <option value="">Selecciona un género</option>
            {generos.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
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
const ModalVer = ({ cancion, onClose }) => (
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
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        Detalles de la Canción
      </h2>

      <div className="space-y-4">
        <div className="text-center">
          {cancion.foto ? (
            <img
              src={cancion.foto}
              alt="Portada"
              className="w-32 h-32 rounded-lg object-cover mx-auto"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-gray-400">Sin foto</span>
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
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              {item.label}
            </label>
            <p className="text-lg text-white">{item.value}</p>
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">
            Estado
          </label>
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              cancion.estado === "Activo"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {cancion.estado}
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

export default Musica;