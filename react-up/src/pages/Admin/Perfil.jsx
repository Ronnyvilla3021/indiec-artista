import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiSave, FiX, FiCheck, FiUpload } from "react-icons/fi";

import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import the AOS CSS

const Perfil = () => {
  // Estado para los datos del usuario
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    profilePicture: "",
  });

  // Estados para UI
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // Global duration for all AOS animations
      easing: 'ease-in-out', // Global easing for all AOS animations
      once: true // Animations happen only once
    });
  }, []);

  // Datos de imágenes para publicaciones
  const images = [
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
  ];

  // Manejadores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const saveChanges = () => {
    setShowModal(true);
    setIsEditing(false);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="flex-1 md:ml-72 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 min-h-screen p-8 relative overflow-hidden">
      {/* Fondo animado */}
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
      `}</style>

      {/* Added AOS animation here */}
      <div
        className="relative z-10"
        data-aos="fade-down"
        data-aos-easing="linear"
        data-aos-duration="1500"
      >
        {/* Encabezado */}
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h1 className="text-4xl font-bold">Mi Perfil</h1>
          <p className="text-lg opacity-90">Administra tu información personal</p>
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center">
              <motion.div
                className="relative w-40 h-40 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={userData.profilePicture}
                  className="w-full h-full rounded-full object-cover border-2 border-[#00FF8C]"
                  alt="Foto de perfil"
                />
                {isEditing && (
                  <motion.label
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ opacity: 0.8 }}
                  >
                    <FiUpload className="text-2xl mb-1" />
                    <span className="text-xs">Cambiar foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </motion.label>
                )}
              </motion.div>
            </div>

            {/* Formulario */}
            <div className="flex-1">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Columna 1 */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <motion.input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Correo</label>
                      <motion.input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                  </div>

                  {/* Columna 2 */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <motion.input
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Ubicación</label>
                      <motion.input
                        type="text"
                        name="location"
                        value={userData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF8C]"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <motion.button
                    type="button"
                    onClick={isEditing ? saveChanges : toggleEdit}
                    className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                      isEditing
                        ? "bg-gradient-to-r from-green-500 to-lime-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isEditing ? (
                      <>
                        <FiSave /> Guardar cambios
                      </>
                    ) : (
                      <>
                        <FiEdit /> Editar perfil
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Sección de publicaciones */}
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Mis Publicaciones</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <motion.img
                  src={hoveredIndex === index ? image.hover : image.default}
                  alt={`Publicación ${index + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal de éxito */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <motion.div
              className="glass-card p-8 max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.div
                className="flex justify-center mb-6"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring" }}
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="text-2xl" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-center mb-2">¡Éxito!</h3>
              <p className="text-center mb-6">Tus cambios se han guardado correctamente.</p>

              <div className="flex justify-center">
                <motion.button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Aceptar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Perfil;