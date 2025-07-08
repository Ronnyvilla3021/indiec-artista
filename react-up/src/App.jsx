import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import './App.css'; // Asegúrate de tener tu archivo CSS global para estilos adicionales si los necesitas

function App() {
  return (
    // Aplica el fondo oscuro a todo el div principal de la aplicación
    <div className="cursor-custom min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;