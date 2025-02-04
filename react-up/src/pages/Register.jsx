import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Animación
import { FiUserPlus } from "react-icons/fi"; // Ícono de usuario
import Swal from "sweetalert2"; // SweetAlert2

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Validación simple
    if (!email || !password || !username || !phoneNumber) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son requeridos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Lógica de registro aquí

    Swal.fire({
      title: "Registro Exitoso",
      text: "Te has registrado correctamente",
      icon: "success",
      confirmButtonText: "Ir al Dashboard",
    }).then(() => {
      navigate("/dashboard"); // Redirigir al dashboard
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center bg-[url('/registro-fondo.jpg')] ">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        {/* Imagen a la derecha, se oculta en pantallas pequeñas */}
        <div
          className="hidden lg:block w-full lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
          style={{ backgroundImage: "url('/img/piezas.jpeg')" }}
        >
          {/* La imagen que se desea mostrar */}
        </div>

        {/* Formulario a la izquierda */}
        <div className="w-full sm:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
            Regístrate
          </h2>
          <form onSubmit={handleRegister}>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
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
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
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
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
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
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition duration-200"
            >
              <FiUserPlus /> Registrar
            </button>
          </form>

          {/* Enlace a la página de login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
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
