/**
 * Importaciones necesarias para el componente de registro
 * - useState: para manejar el estado de los inputs del formulario.
 * - useNavigate: para redireccionar a otras rutas.
 * - motion: para animaciones.
 * - FiUserPlus: para el ícono del botón de registro.
 * - Swal: para mostrar alertas agradables al usuario.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUserPlus } from "react-icons/fi";
import Swal from "sweetalert2";

/**
 * Componente principal del formulario de registro
 */
const Register = () => {
  // Declaración de hooks para manejar el estado de los inputs
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  /**
   * Sanitiza las entradas del usuario para prevenir ataques XSS
   * Reemplaza caracteres especiales por su representación segura
   * @param {string} input - Texto a sanitizar
   * @returns {string} - Texto seguro
   */
  const sanitizeInput = (input) => {
    return input.replace(/[<>"'`]/g, (match) => `&#${match.charCodeAt(0)};`);
  };

  // Expresión regular para validar emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Maneja el registro del usuario y valida los datos
   * @param {Event} e - Evento del formulario
   */
  const handleRegister = (e) => {
    e.preventDefault(); // Evita la recarga de la página

    // Sanitización de las entradas del usuario
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPhone = sanitizeInput(phoneNumber);

    // Validaciones del formulario
    if (!sanitizedEmail || !sanitizedPassword || !sanitizedUsername || !sanitizedPhone) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son requeridos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (!emailRegex.test(sanitizedEmail)) {
      Swal.fire({
        title: "Error",
        text: "Formato de correo electrónico no válido",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
      return;
    }

    if (sanitizedPassword.length < 5) {
      Swal.fire({
        title: "Error",
        text: "La contraseña debe tener al menos 5 caracteres",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
      return;
    }

    // Mensaje de registro exitoso
    Swal.fire({
      title: "Registro Exitoso",
      text: "Te has registrado correctamente",
      icon: "success",
      confirmButtonText: "Ir al Dashboard",
    }).then(() => {
      navigate("/dashboard"); // Navega al dashboard tras el registro
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center bg-[url('/registro-fondo.jpg')] ">
      {/* Contenedor principal con animación */}
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        {/* Imagen del lado izquierdo del formulario */}
        <div
          className="hidden lg:block w-full lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
          style={{ backgroundImage: "url('/img/piezas.jpeg')" }}
        ></div>

        {/* Contenido del formulario */}
        <div className="w-full sm:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
            Regístrate
          </h2>

          {/* Formulario de registro */}
          <form onSubmit={handleRegister}>
            {/* Campo de nombre de usuario */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Campo de email */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Campo de número de teléfono */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Número de Teléfono
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ingresa tu número de teléfono"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Campo de contraseña */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition duration-200"
            >
              <FiUserPlus /> Registrar
            </button>
          </form>

          {/* Enlace para iniciar sesión si ya se tiene una cuenta */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <a href="/" className="text-green-600 hover:text-green-700 font-semibold">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;