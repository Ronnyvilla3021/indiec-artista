import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUserPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import api from "../axiosConfig";

const Register = () => {
  const navigate = useNavigate();
  const [emailUser, setEmail] = useState("");
  const [passwordUser, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [nameUsers, setNameUsers] = useState("");
  const [phoneUser, setPhone] = useState("");

  const sanitizeInput = (input) => input.replace(/[<>"'`]/g, (match) => `&#${match.charCodeAt(0)};`);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    const email = sanitizeInput(emailUser.trim());
    const password = sanitizeInput(passwordUser.trim());
    const username = sanitizeInput(userName.trim());
    const fullName = sanitizeInput(nameUsers.trim());
    const phone = sanitizeInput(phoneUser.trim());

    if (!email || !password || !username || !fullName || !phone) {
      return Swal.fire({
        title: "Error",
        text: "Todos los campos son requeridos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }

    if (!emailRegex.test(email)) {
      return Swal.fire({
        title: "Error",
        text: "Correo electrónico inválido",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }

    if (password.length < 5) {
      return Swal.fire({
        title: "Error",
        text: "La contraseña debe tener al menos 5 caracteres",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }

    try {
      const res = await api.post("/auth/register", {
        nameUsers: fullName,
        phoneUser: phone,
        emailUser: email,
        passwordUser: password,
        userName: username,
        stateUser: "activo",
        createUser: "sistema",
        updateUser: "sistema"
      });

      Swal.fire({
        title: "Registro Exitoso",
        text: res.data.message || "Te has registrado correctamente",
        icon: "success",
        confirmButtonText: "Ir al Login",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Error en el registro";
      Swal.fire({
        title: "Error",
        text: msg,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center bg-[url('/registro-fondo.jpg')]">
      <motion.div 
        className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="hidden lg:block w-full lg:w-1/2 h-auto bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/piezas.jpeg')" }}></div>

        <div className="w-full lg:w-1/2 p-6 sm:p-8 overflow-y-auto" style={{ maxHeight: "90vh" }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-green-700 mb-6">Regístrate</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input 
                type="text" 
                value={nameUsers} 
                onChange={(e) => setNameUsers(e.target.value)} 
                placeholder="Nombre completo" 
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Usuario" 
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input 
                type="email" 
                value={emailUser} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input 
                type="tel" 
                value={phoneUser} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Teléfono" 
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={passwordUser} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Contraseña" 
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2 sm:py-3 bg-green-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition duration-200 mt-6"
            >
              <FiUserPlus /> Registrar
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <a href="/" className="text-green-600 hover:text-green-700 font-semibold">Inicia sesión aquí</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;