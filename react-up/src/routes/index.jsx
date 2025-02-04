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
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <>
            <Navbar />
            <Dashboard />
          </>
        }
      />
      <Route
        path="/musica"
        element={
          <>
            <Navbar />
            <Musica />
          </>
        }
      />
      <Route
        path="/eventos"
        element={
          <>
            <Navbar />
            <Eventos />
          </>
        }
      />

      <Route
        path="/grupomusical"
        element={
          <>
            <Navbar />
            <GrupoMusical />
          </>
        }
      />

      <Route
        path="/manager"
        element={
          <>
            <Navbar />
            <Manager />
          </>
        }
      />
      <Route
        path="/album"
        element={
          <>
            <Navbar />
            <Album />
          </>
        }
      />
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
