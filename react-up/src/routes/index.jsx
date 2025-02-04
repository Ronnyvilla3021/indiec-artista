import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Admin/Dashboard";
import Navbar from "../components/Navbar";
import Musica from "../pages/Admin/Musica";
import Eventos from "../pages/Admin/Eventos";
import GrupoMusical from "../pages/Admin/GrupoMusical";

import Manager from "../pages/Admin/Manager";
import Album from "../pages/Admin/Album";
import Perfil from "../pages/Admin/Perfil";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta para la página de inicio de sesión */}
      <Route path="/" element={<Login />} />
      
      {/* Ruta para la página de registro */}
      <Route path="/register" element={<Register />} />
      
      {/* Ruta para el dashboard del administrador */}
      <Route
        path="/dashboard"
        element={
          <>
            <Navbar />
            <Dashboard />
          </>
        }
      />
      
      {/* Ruta para la página de música */}
      <Route
        path="/musica"
        element={
          <>
            <Navbar />
            <Musica />
          </>
        }
      />
      
      {/* Ruta para la página de eventos */}
      <Route
        path="/eventos"
        element={
          <>
            <Navbar />
            <Eventos />
          </>
        }
      />
      
      {/* Ruta para la página del grupo musical */}
      <Route
        path="/grupomusical"
        element={
          <>
            <Navbar />
            <GrupoMusical />
          </>
        }
      />
      
      {/* Ruta para la página del manager */}
      <Route
        path="/manager"
        element={
          <>
            <Navbar />
            <Manager />
          </>
        }
      />
      
      {/* Ruta para la página del álbum */}
      <Route
        path="/album"
        element={
          <>
            <Navbar />
            <Album />
          </>
        }
      />
      
      {/* Ruta para la página de perfil */}
      <Route
        path="/perfil"
        element={
          <>
            <Navbar />
            <Perfil />
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;