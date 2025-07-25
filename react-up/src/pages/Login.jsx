import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../axiosConfig";

const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
    <div className="text-center">
      <div className="border-t-4 border-blue-600 border-solid w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-600">
        Cargando...
      </p>
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      Swal.fire({
        title: "Bienvenido",
        text: res.data.message || "Inicio de sesión exitoso",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        setLoading(false);
        setDataLoaded(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 200);
      });
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || "Credenciales incorrectas";
      Swal.fire({
        title: "Error",
        text: msg,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  if (loading) return <Loading />;

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
        data-aos="fade-down"
        data-aos-easing="linear"
        data-aos-duration="1500"
      >
        <div
          className="hidden lg:block w-full lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
          style={{ backgroundImage: "url('/img/dc.jpg')" }}
        ></div>

        <div className="w-full lg:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin}>
            {/* Username */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/<[^>]+>/g, ""))
                }
                placeholder="Ingresa tu nombre de usuario"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
                style={{ color: 'black' }} // Asegura que el texto sea negro
              />
            </motion.div>

            {/* Contraseña */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.replace(/<[^>]+>/g, ""))
                }
                placeholder="Ingresa tu contraseña"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
                style={{ color: 'black' }} // Asegura que el texto sea negro
              />
            </motion.div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes una cuenta?{" "}
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