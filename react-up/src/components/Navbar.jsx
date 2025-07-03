import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaMusic,
  FaUsers,
  FaUserAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiSolidAlbum } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { GiConcentrationOrb } from "react-icons/gi";
import { Player } from "@lottiefiles/react-lottie-player";
import logoutAnimation from "../animation/Animation - 1737946669842.json"; // Importa la animación

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLottie, setShowLottie] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setShowLottie(true); // Muestra la animación
    setTimeout(() => {
      window.location.href = "/"; // Redirige después de la animación
    }, 2000); // Ajusta el tiempo según la duración de la animación
  };
 const menuItemClass =
    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group";
  const menuItemHoverClass = "hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:shadow-lg transform hover:scale-105"; // Enhanced hover effect
  const menuItemIconClass =
    "transition-colors duration-300 group-hover:text-gray-900 text-green-400"; // Green icon color by default
  const menuItemTextClass =
    "transition-colors duration-300 group-hover:text-gray-900 font-medium text-gray-200"; // Lighter text by default

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-black text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:w-72 shadow-2xl z-40`}
      
      >
        <div className="p-4">
          <div className="text-4xl font-extrabold text-green-400 mb-10 flex items-center justify-center border-b border-gray-700 pb-5">
            <FaMusic className="mr-3 text-green-500 animate-pulse" />{" "}
            {/* Added pulse animation */}
            <span className="tracking-wide">𝕀ℕ𝔻𝕀𝔼ℂ</span>
          </div>
          {/* Menu items */}
          <ul className="space-y-4">
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/dashboard" className="flex items-center gap-3 w-full">
                <FaHome size={22} className={menuItemIconClass} />{" "}
                <span className={menuItemTextClass}>Dashboard</span>
              </a>
            </li>
              <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/musica" className="flex items-center gap-3 w-full">
                <FaMusic size={22} className={menuItemIconClass} />{" "}
                <span className={menuItemTextClass}>Musica</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/grupomusical" className="flex items-center gap-3 w-full">
                <FaUsers size={22} className={menuItemIconClass} />{" "}
                <span className={menuItemTextClass}>Grupo Musical</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/album" className="flex items-center gap-3 w-full">
                <BiSolidAlbum size={22} className={menuItemIconClass} />{" "}
                <span className={menuItemTextClass}>Álbum</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/manager" className="flex items-center gap-3 w-full">
                <GrUserManager size={22} className={menuItemIconClass} />{" "}
                <span className={menuItemTextClass}>Manager</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/eventos" className="flex items-center gap-3 w-full">
                <FaUsers size={22} className={menuItemIconClass} />{" "}
                <span className={menuItemTextClass}>Evento</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-72 bg-gradient-to-r from-green-500">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-black to-green-500 shadow-md p-4">
          <div></div> {/* Empty for alignment */}
          <div className="flex items-center space-x-4 md:flex-row flex-col">
            {/* User Info with Dropdown */}
            <div className="relative">
              <div
                className="flex items-center space-x-2 "
                onClick={toggleDropdown}
              >
                <img
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-black hover:shadow-lg"
                  style={{
                    backgroundImage: "url('/musicaa.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-4 text-sm">
                  <ul className="space-y-2">
                    <h5 className="font-bold">gerardo moran</h5>
                    <li className="flex items-center gap-2">
                      <FaUserAlt size={16} className="text-gray-600" />
                      <a
                        href="/perfil"
                        className="text-gray-800 hover:text-green-500"
                      >
                        Perfil
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaSignOutAlt size={16} className="text-gray-600" />
                      <button
                        onClick={handleLogout}
                        className="text-gray-800 hover:text-green-500 w-full text-left"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Notification Button */}
            <div className="relative md:mb-0 mb-2">
              <button
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none"
                onClick={() => setShowNotification(!showNotification)}
              >
                🔔
              </button>
              {showNotification && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4 text-sm">
                  <p className="font-bold mb-2">Notificaciones</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    Tienes nuevos eventos listos para ti 🎉
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none md:hidden"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Lottie Animation */}
        {showLottie && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Player
              autoplay
              loop={false}
              src={logoutAnimation} // Usamos el archivo importado
              style={{ height: "300px", width: "300px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
