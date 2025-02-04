import { useState } from "react";
import { motion } from "framer-motion";

const Perfil = () => {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juanperez@mail.com",
    phone: "0025455445",
    location: "Ciudad,Pais",
    profilePicture: "/img/default-profile.jpg", // Imagen de perfil por defecto
  });

  // Estado para controlar el modo de edición
  const [isEditing, setIsEditing] = useState(false);

  // Estado para controlar el modal de éxito
  const [showModal, setShowModal] = useState(false);

  // Función para manejar el cambio de los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Función para manejar el cambio de imagen
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

  // Función para alternar el modo de edición
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Función para guardar los cambios y mostrar el modal
  const saveChanges = () => {
    setShowModal(true); // Mostrar el modal
    setIsEditing(false); // Desactivar el modo de edición
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
    { default: "/img/imagen1.jpg", hover: "/img/imagen2.jpg" },
  ];

  return (
    <div className="flex-1 ml-0 md:ml-72 bg-cover bg-center bg-[url('/fondo.gif')]">
      {/* Primer bloque de código */}
      <div className="p-0">
        <motion.p
          animate={{ y: [0, -10, 0] }} // Animación de salto
          transition={{ duration: 0.5 }}
        ></motion.p>
      </div>

      {/* Título de bienvenida */}
      <div className="flex justify-center items-center  py-5">
        <motion.p
          className="text-3xl font-semibold text-white"
          initial={{ opacity: 0 }} // Empieza invisible
          animate={{ opacity: 1 }} // Desvanece a visible
          transition={{
            duration: 1, // Duración del desvanecimiento
            ease: "easeOut", // Suavizado de la animación
            delay: 0.3, // Retraso para darle tiempo al resto de los elementos
          }}
        >
          Perfil
        </motion.p>
      </div>

      {/* Segundo bloque de código (Perfil y edición) */}
      <div className="flex justify-center items-center bg-gradient-to-r 0 py-10">
        <motion.div
          className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Sección de la imagen de perfil */}
          <div className=" flex flex-col items-center md:items-start md:mr-8 mb-4 md:mb-0">
            <div className="  w-40 h-40">
              <img
                src={userData.profilePicture}
                className="w-40 h-40 border border-gray-200 rounded-full object-cover mb-4 shadow-md"
              />
              {isEditing && (
                <label
                  htmlFor="profilePicture"
                  className="relative inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center rounded-full cursor-pointer text-white transition-opacity duration-200 hover:opacity-60"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm font-medium">Cargar imagen</span>
                </label>
              )}
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Sección de datos del perfil */}
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Columna izquierda: Nombre y Correo */}
              <div>
                <div className="mb-4">
                  <motion.label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  >
                    Nombre
                  </motion.label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="mb-4">
                  <motion.label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  >
                    Correo Electrónico
                  </motion.label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Columna derecha: Número y Ubicación */}
              <div>
                {/* Campo de número */}
                <div className="mb-4">
                  <motion.label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  >
                    Número
                  </motion.label>
                  <motion.input
                    type="text"
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Campo de ubicación */}
                <div className="mb-4">
                  <motion.label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  >
                    Ubicación
                  </motion.label>
                  <motion.input
                    type="text"
                    id="location"
                    name="location"
                    value={userData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    animate={{ y: [0, -10, 0] }} // Animación de salto
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <motion.button
                type="button"
                onClick={isEditing ? saveChanges : toggleEdit}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-200"
                whileTap={{ scale: 0.9 }} // Efecto de reducción al presionar
                animate={{ y: [0, -10, 0] }} // Animación de salto
                transition={{ duration: 0.3 }}
              >
                {isEditing ? "Guardar cambios" : "Editar perfil"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Modal de éxito */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-4 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Icono de "check" animado con borde verde claro */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-green-600 border-4 border-green-300 rounded-full p-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                animate={{ rotate: [0, 360] }} // Animación de giro
                transition={{ duration: 1, loop: Infinity }} // Giro continuo
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <motion.p
              className="text-lg font-semibold"
              animate={{ y: [0, -10, 0] }} // Animación de salto
              transition={{ duration: 0.5 }}
            >
              ¡Éxito!
            </motion.p>
            <motion.p
              className="mt-2"
              animate={{ y: [0, -10, 0] }} // Animación de salto
              transition={{ duration: 0.5 }}
            >
              Tus datos han sido editados con éxito.
            </motion.p>
            <motion.button
              onClick={closeModal}
              className="mt-4 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-200"
              whileTap={{ scale: 0.9 }} // Efecto de reducción al presionar
              animate={{ y: [0, -10, 0] }} // Animación de salto
              transition={{ duration: 0.3 }}
            >
              Aceptar
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Barra blanca con el texto Mis Publicaciones */}
      <div className="flex justify-center items-center  py-10">
        <motion.div
          className="bg-green-700 p-6 rounded-xl shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.8 }} // Inicia con opacidad 0 y escala más pequeña
          animate={{ opacity: 1, scale: 1 }} // Se desvanece y expande
          transition={{ duration: 1, ease: "easeInOut" }} // Animación suave
        >
          <motion.p
            className="text-3xl font-semibold text-white"
            animate={{ y: [30, 0] }} // Efecto de deslizamiento desde abajo
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }} // Movimiento tipo resorte
          >
            Mis Publicaciones
          </motion.p>
        </motion.div>
      </div>

      {/* Tres cuadros en la parte baja con fondo gradiente */}
      <div className="flex justify-center items-center  py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="w-full h-60 bg-gray-500 rounded-lg overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.img
                src={hoveredIndex === index ? image.hover : image.default}
                alt={"Imagen ${index + 1}"}
                className="w-full h-full object-cover"
                animate={{ opacity: [0.8, 1] }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
