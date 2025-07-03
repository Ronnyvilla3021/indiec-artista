import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaMusic,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import { BiSolidAlbum } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { GiConcentrationOrb } from "react-icons/gi";
import { Player } from "@lottiefiles/react-lottie-player";
import logoutAnimation from "../animation/Animation - 1737946669842.json";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLottie, setShowLottie] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setShowNotification(false);
  };
  const toggleNotification = () => {
    setShowNotification(!showNotification);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setShowLottie(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const menuItemClass =
    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group";
  const menuItemHoverClass =
    "hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:shadow-lg transform hover:scale-105";
  const menuItemIconClass =
    "transition-colors duration-300 group-hover:text-gray-900 text-green-400";
  const menuItemTextClass =
    "transition-colors duration-300 group-hover:text-gray-900 font-medium text-gray-200";

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-black text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:w-72 shadow-2xl z-40`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="text-4xl font-extrabold text-green-400 mb-10 flex items-center justify-center border-b border-gray-700 pb-5">
            <FaMusic className="mr-3 text-green-500 animate-pulse" />
            <span className="tracking-wide">𝕀ℕ𝔻𝕀𝔼ℂ</span>
          </div>

          {/* Menu Items */}
          <ul className="space-y-4">
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/dashboard" className="flex items-center gap-3 w-full">
                <FaHome size={22} className={menuItemIconClass} />
                <span className={menuItemTextClass}>Dashboard</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/musica" className="flex items-center gap-3 w-full">
                <FaMusic size={22} className={menuItemIconClass} />
                <span className={menuItemTextClass}>Música</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/grupomusical" className="flex items-center gap-3 w-full">
                <FaUsers size={22} className={menuItemIconClass} />
                <span className={menuItemTextClass}>Grupo Musical</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/album" className="flex items-center gap-3 w-full">
                <BiSolidAlbum size={22} className={menuItemIconClass} />
                <span className={menuItemTextClass}>Álbum</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/manager" className="flex items-center gap-3 w-full">
                <GrUserManager size={22} className={menuItemIconClass} />
                <span className={menuItemTextClass}>Manager</span>
              </a>
            </li>
            <li className={`${menuItemClass} ${menuItemHoverClass}`}>
              <a href="/eventos" className="flex items-center gap-3 w-full">
                <GiConcentrationOrb size={22} className={menuItemIconClass} />
                <span className={menuItemTextClass}>Eventos</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-72 bg-gray-50">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-gray-800 to-black text-white shadow-lg p-4 md:p-6 sticky top-0 z-30 border-b border-gray-700">
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full text-white hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          <div className="flex-grow"></div>

          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Notification */}
            <div className="relative" ref={notificationRef}>
              <button
                className="p-3 rounded-full bg-gray-700 text-white hover:bg-green-600 focus:outline-none transition-all duration-300 transform hover:scale-110 relative"
                onClick={toggleNotification}
                aria-label="Show notifications"
              >
                <FaBell size={22} />
                <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  3
                </span>
              </button>
              {showNotification && (
                <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-lg shadow-xl p-5 text-sm animate-fade-in-down origin-top-right border border-gray-200">
                  <p className="font-bold text-lg mb-3 border-b pb-2 text-gray-900 flex justify-between items-center">
                    Notificaciones
                    <span className="text-gray-500 text-sm">Nuevas (3)</span>
                  </p>
                  <ul className="space-y-4">
                    <li className="bg-green-50 p-3 rounded-md border border-green-200 flex items-start gap-3 hover:bg-green-100">
                      <FaMusic className="text-green-600 mt-1" />
                      <div>
                        <p className="font-semibold">¡Nueva canción subida!</p>
                        <p className="text-xs text-gray-600">"Summer Vibes" ya está disponible.</p>
                      </div>
                    </li>
                    <li className="bg-blue-50 p-3 rounded-md border border-blue-200 flex items-start gap-3 hover:bg-blue-100">
                      <FaUsers className="text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold">Nuevo seguidor</p>
                        <p className="text-xs text-gray-600">JuanPerez ha empezado a seguirte.</p>
                      </div>
                    </li>
                    <li className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start gap-3 hover:bg-yellow-100">
                      <FaBell className="text-yellow-600 mt-1" />
                      <div>
                        <p className="font-semibold">Recordatorio de evento</p>
                        <p className="text-xs text-gray-600">"Live Session" es mañana a las 8 PM.</p>
                      </div>
                    </li>
                  </ul>
                  <a
                    href="/notifications"
                    className="block text-center mt-4 text-green-600 hover:underline font-medium text-sm"
                  >
                    Ver todas
                  </a>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-gray-700 transition-all"
                onClick={toggleDropdown}
              >
                <img
                  className="w-10 h-10 rounded-full border-2 border-green-400 object-cover transform hover:scale-110"
                  src="/musicaa.png"
                  alt="User Avatar"
                />
                <span className="hidden md:block text-gray-300 font-medium">
                  Gerardo Moran
                </span>
                <FaUserCircle className="hidden md:block text-green-400" />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-lg shadow-xl p-4 text-base animate-fade-in-down border border-gray-200">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                    <FaUserCircle size={30} className="text-green-500" />
                    <div>
                      <h5 className="font-bold text-lg">Gerardo Moran</h5>
                      <p className="text-sm text-gray-600">Admin</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md">
                      <FaUserCircle size={20} className="text-gray-600" />
                      <a href="/perfil" className="font-medium text-gray-800 hover:text-green-600 w-full">
                        Ver Perfil
                      </a>
                    </li>
                    <li className="flex items-center gap-3 hover:bg-red-50 p-2 rounded-md">
                      <FaSignOutAlt size={20} className="text-red-500" />
                      <button
                        onClick={handleLogout}
                        className="text-left font-medium text-gray-800 hover:text-red-600 w-full"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lottie Animation */}
        {showLottie && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <Player
              autoplay
              loop={false}
              src={logoutAnimation}
              style={{ height: "350px", width: "350px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
