import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiDownload,
  FiFilter,
  FiPlusCircle,
  FiSearch
} from "react-icons/fi";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

const GrupoMusical = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      mirror: false,
    });
    AOS.refresh();
  }, []);

  const [grupos, setGrupos] = useState([
    {
      foto: "https://media.gettyimages.com/id/74075509/es/foto/portrait-of-a-rock-band.jpg?s=612x612&w=gi&k=20&c=ALmtElqKeTBmCgJiIMh9gVe0Ybc6aIaeDdNmQrnU1Io=", // URL de imagen de ejemplo
      nombreGrupo: "Grupo 1",
      generoMusical: "Rock",
      descripcion: "Descripción del Grupo 1",
      plataforma: "Spotify",
      url: "https://spotify.com/grupo1",
      activo: true,
    },
    {
      foto: "https://st.depositphotos.com/1000647/3910/i/450/depositphotos_39105587-stock-photo-band-performs-on-stage.jpg", // URL de imagen de ejemplo
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
  const [filterActive, setFilterActive] = useState("all");
  const [errors, setErrors] = useState({});

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

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredGrupos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grupos Musicales");
    XLSX.writeFile(workbook, "grupos_musicales.xlsx");
  };

  const handleFilterChange = () => {
    setFilterActive(prev => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  const filteredGrupos = grupos
    .filter(grupo => grupo.nombreGrupo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(grupo => {
      if (filterActive === "all") return true;
      return filterActive === "active" ? grupo.activo : !grupo.activo;
    });

  const openModalCrear = () => {
    setFormData({
      foto: null,
      nombreGrupo: "",
      generoMusical: "",
      descripcion: "",
      plataforma: "",
      url: "",
    });
    setModalCrear(true);
  };

  const openModalEditar = (index) => {
    setCurrentGrupo(index);
    setFormData(grupos[index]);
    setModalEditar(true);
  };

  const openModalVer = (index) => {
    setCurrentGrupo(index);
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
      [name]: name === "foto" ? files[0] : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreGrupo) newErrors.nombreGrupo = "Nombre obligatorio";
    if (!formData.generoMusical) newErrors.generoMusical = "Género obligatorio";
    if (!formData.descripcion) newErrors.descripcion = "Descripción obligatoria";
    if (!formData.plataforma) newErrors.plataforma = "Plataforma obligatoria";
    if (!formData.url) newErrors.url = "URL obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGrupo = () => {
    if (!validateForm()) return;
    setGrupos([...grupos, { ...formData, activo: true }]);
    Swal.fire("Éxito", "Grupo agregado", "success");
    closeModal();
  };

  const handleUpdateGrupo = () => {
    if (!validateForm()) return;
    const updated = [...grupos];
    updated[currentGrupo] = formData;
    setGrupos(updated);
    Swal.fire("Éxito", "Grupo actualizado", "success");
    closeModal();
  };

  const handleDeleteGrupo = (index) => {
    const updated = [...grupos];
    updated[index].activo = false;
    setGrupos(updated);
    Swal.fire("Info", "Grupo desactivado", "info");
  };

  const handleRestoreGrupo = (index) => {
    const updated = [...grupos];
    updated[index].activo = true;
    setGrupos(updated);
    Swal.fire("Éxito", "Grupo activado", "success");
  };

  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
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

      <div className="relative z-10">
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <h1 className="text-4xl font-bold">Grupos Musicales</h1>
          <p className="text-lg opacity-90">Administra tus grupos musicales</p>
        </motion.div>

        <motion.div
          className="glass-card p-4 mb-8 flex justify-center"
          variants={itemVariants}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <nav className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-[#00FF8C] hover:underline">
              Inicio
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">Grupos Musicales</span>
          </nav>
        </motion.div>

        <motion.div
          className="glass-card p-6 mb-8 flex flex-wrap gap-4"
          variants={itemVariants}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              placeholder="Buscar grupo..."
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
              <FiPlusCircle /> Agregar Grupo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-6 overflow-x-auto"
          variants={itemVariants}
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <table className="w-full">
            <thead>
              <tr className="glass-table-header">
                <th className="py-3 px-6 text-left">Foto</th>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Género</th>
                <th className="py-3 px-6 text-left">Descripción</th>
                <th className="py-3 px-6 text-left">Plataforma</th>
                <th className="py-3 px-6 text-left">URL</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredGrupos.map((grupo, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-[rgba(0,255,140,0.05)]"
                    variants={itemVariants}
                  >
                    <td className="py-4 px-6">
                      {grupo.foto ? (
                        <img
                          src={typeof grupo.foto === 'string' ? grupo.foto : URL.createObjectURL(grupo.foto)}
                          className="w-12 h-12 rounded-lg object-cover"
                          alt="Grupo"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">{grupo.nombreGrupo}</td>
                    <td className="py-4 px-6">{grupo.generoMusical}</td>
                    <td className="py-4 px-6">{grupo.descripcion}</td>
                    <td className="py-4 px-6">{grupo.plataforma}</td>
                    <td className="py-4 px-6">
                      <a
                        href={grupo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00FF8C] hover:underline"
                      >
                        Enlace
                      </a>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        grupo.activo ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {grupo.activo ? "Activo" : "Inactivo"}
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
                      {grupo.activo ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 rounded-full"
                          onClick={() => handleDeleteGrupo(index)}
                        >
                          <FiTrash2 className="text-white"/>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500 rounded-full"
                          onClick={() => handleRestoreGrupo(index)}
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

        <AnimatePresence>
          {modalCrear && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleAddGrupo}
              errors={errors}
              title="Agregar Grupo"
            />
          )}

          {modalEditar && (
            <ModalFormulario
              formData={formData}
              onClose={closeModal}
              onChange={handleInputChange}
              onSave={handleUpdateGrupo}
              errors={errors}
              title="Editar Grupo"
            />
          )}

          {modalVer && (
            <ModalVer
              data={grupos[currentGrupo]}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave, errors, title }) => {
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
          {previewFotoUrl && (
            <img
              src={previewFotoUrl}
              alt="Vista previa"
              className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
            />
          )}
          <label
            htmlFor="foto"
            className="inline-block bg-[#00FF8C] text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#39FF14] transition"
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

        <div className="space-y-4">
          {[
            { label: "Nombre del Grupo", name: "nombreGrupo", type: "text" },
            { label: "Género Musical", name: "generoMusical", type: "text" },
            { label: "Descripción", name: "descripcion", type: "text" },
            { label: "Plataforma", name: "plataforma", type: "text" },
            { label: "URL", name: "url", type: "text" },
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
};

const ModalVer = ({ data, onClose }) => {
  return (
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
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Detalles del Grupo</h2>

        <div className="space-y-4">
          <div className="text-center">
            {data.foto ? (
              <img
                src={typeof data.foto === 'string' ? data.foto : URL.createObjectURL(data.foto)}
                alt="Grupo"
                className="w-32 h-32 rounded-lg object-cover mx-auto"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-gray-400">Sin foto</span>
              </div>
            )}
          </div>

          {[
            { label: "Nombre", value: data.nombreGrupo },
            { label: "Género", value: data.generoMusical },
            { label: "Descripción", value: data.descripcion },
            { label: "Plataforma", value: data.plataforma },
            { label: "URL", value: data.url },
          ].map((item) => (
            <div key={item.label}>
              <label className="block text-sm font-semibold mb-1 text-gray-300">{item.label}</label>
              <p className="text-lg text-white">{item.value}</p>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Estado</label>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              data.activo ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}>
              {data.activo ? "Activo" : "Inactivo"}
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
};

export default GrupoMusical;