import { useState, useEffect } from "react"; // Add useEffect
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import the AOS CSS

// Componente de carga que se muestra durante la espera de acciones asíncronas
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center">
        {/* Animación de carga */}
        <div className="border-t-4 border-blue-600 border-solid w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-600">
          Cargando...
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  // Hooks para navegar y manejar el estado
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para indicar datos cargados correctamente

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // Global duration for all AOS animations
      easing: 'ease-in-out', // Global easing for all AOS animations
      once: true // Animations happen only once
    });
  }, []); // Empty dependency array means this runs once on mount

  // Función para manejar el inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault(); // Evita la recarga de la página

    // Simulamos credenciales válidas
    const validEmail = "admin@yavirac.edu.ec";
    const validPassword = "12345";

    // Validación básica de credenciales
    if (email === validEmail && password === validPassword) {
      // Alerta de éxito
      Swal.fire({
        title: "Bienvenido",
        text: "Datos cargados correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        setLoading(true); // Activa la animación de carga

        setTimeout(() => {
          setLoading(false); // Detiene la animación de carga
          setDataLoaded(true); // Activa el mensaje de "datos cargados"

          setTimeout(() => {
            navigate("/dashboard"); // Redirige al dashboard
          }, 200); // Tiempo para mostrar "¡Datos cargados con éxito!"
        }, 200); // Duración de la animación de carga
      });
    } else {
      // Alerta de error si las credenciales no son válidas
      Swal.fire({
        title: "Error",
        text: "Credenciales incorrectas",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  // Muestra componente Loading si está en estado de carga
  if (loading) {
    return <Loading />;
  }

  // Muestra mensaje de éxito si los datos se cargaron correctamente
  if (dataLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
        <div className="text-center text-lg sm:text-xl md:text-2xl text-gray-600">
          ¡Datos cargados con éxito!
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center bg-[url('/login-fondo.jpg')]">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        data-aos="fade-down" // Added AOS animation here
        data-aos-easing="linear"
        data-aos-duration="1500"
      >
        {/* Imagen del lado izquierdo para pantallas grandes */}
        <div
          className="hidden lg:block w-full lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
          style={{ backgroundImage: "url('/img/dc.jpg')" }}
        ></div>

        <div className="w-full lg:w-1/2 p-8">
          {/* Título del formulario */}
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
            Iniciar Sesión
          </h2>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleLogin}>
            {/* Campo para el email */}
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
                onChange={(e) => setEmail(e.target.value.replace(/<[^>]+>/g, ''))} // Limpieza de posibles scripts
                placeholder="Ingresa tu correo electrónico"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Campo para la contraseña */}
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
                onChange={(e) => setPassword(e.target.value.replace(/<[^>]+>/g, ''))} // Limpieza de posibles scripts
                placeholder="Ingresa tu contraseña"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Botón de enviar */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Enlace para registro */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes una cuenta?{' '}
              <a
                href="/register"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;