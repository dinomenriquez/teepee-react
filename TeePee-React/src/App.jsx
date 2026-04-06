import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext";

import Bienvenida from "./Bienvenida";
import HomeUsuario from "./HomeUsuario";
import HomeSolucionador from "./HomeSolucionador";
import Busqueda from "./Busqueda";
import PerfilSolucionador from "./PerfilSolucionador";
import Chat from "./Chat";
import Seguimiento from "./Seguimiento";
import Pago from "./Pago";
import CalificacionS from "./CalificacionS";
import Calificacion from "./Calificacion";
import Cancelacion from "./Cancelacion";
import Agenda from "./Agenda";
import PerfilUsuario from "./PerfilUsuario";
import Presupuestos from "./Presupuestos";
import MisBusquedas from './MisBusquedas';
import MisTrabajosU from "./MisTrabajosU";
import MisTrabajosS from "./MisTrabajosS";
import PerfilSolucionadorEdit from "./PerfilSolucionadorEdit";
import Notificaciones from "./Notificaciones";
import NotificacionesS from "./NotificacionesS";
import Ingresos from "./Ingresos";
import Ayuda from "./Ayuda";
import AyudaS from "./AyudaS";
import SeguimientoS from "./SeguimientoS";
import ChatS from "./ChatS";
import PerfilUsuarioPublico from "./PerfilUsuarioPublico";
import PresupuestosS from "./PresupuestosS";
import AcuerdoDigital from "./AcuerdoDigital";

// ── RUTA PROTEGIDA ────────────────────────────
// Si no hay sesión → /bienvenida
function RutaProtegida({ children }) {
  const { sesion, cargando } = useAuth();
  if (cargando) return null;
  if (!sesion) return <Navigate to="/bienvenida" replace />;
  return children;
}

// ── RUTA SOLO SOLUCIONADOR ────────────────────
function RutaSolucionador({ children }) {
  const { sesion, cargando } = useAuth();
  if (cargando) return null;
  if (!sesion) return <Navigate to="/bienvenida" replace />;
  if (sesion.rolActivo !== "solucionador") return <Navigate to="/home" replace />;
  return children;
}

// ── RUTA INICIAL: detecta sesión y redirige ───
function RutaInicial() {
  const { sesion, cargando } = useAuth();
  if (cargando) return null;
  if (!sesion) return <Navigate to="/bienvenida" replace />;
  if (sesion.rolActivo === "solucionador") return <Navigate to="/home-solucionador" replace />;
  return <Navigate to="/home" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Raíz — detecta sesión y redirige */}
      <Route path="/" element={<RutaInicial />} />

      {/* Bienvenida — siempre accesible */}
      <Route path="/bienvenida" element={<Bienvenida />} />

      {/* Homes */}
      <Route path="/home" element={
        <RutaProtegida><HomeUsuario /></RutaProtegida>
      } />
      <Route path="/home-solucionador" element={
        <RutaProtegida><HomeSolucionador /></RutaProtegida>
      } />

      {/* Rutas comunes */}
      <Route path="/busqueda" element={<RutaProtegida><Busqueda /></RutaProtegida>} />
      <Route path="/perfil" element={<RutaProtegida><PerfilSolucionador /></RutaProtegida>} />
      <Route path="/chat" element={<RutaProtegida><Chat /></RutaProtegida>} />
      <Route path="/seguimiento" element={<RutaProtegida><Seguimiento /></RutaProtegida>} />
      <Route path="/seguimiento-s" element={<RutaProtegida><SeguimientoS /></RutaProtegida>} />
      <Route path="/calificacion-s" element={<CalificacionS />} />
        <Route path="/pago" element={<RutaProtegida><Pago /></RutaProtegida>} />
      <Route path="/calificacion" element={<RutaProtegida><Calificacion /></RutaProtegida>} />
      <Route path="/cancelacion" element={<RutaProtegida><Cancelacion /></RutaProtegida>} />
      <Route path="/agenda" element={<RutaProtegida><Agenda /></RutaProtegida>} />
      <Route path="/perfil-usuario" element={<RutaProtegida><PerfilUsuario /></RutaProtegida>} />
      <Route path="/presupuestos" element={<RutaProtegida><Presupuestos /></RutaProtegida>} />
      <Route path="/mis-busquedas" element={<MisBusquedas />} />
        <Route path="/trabajos" element={<RutaProtegida><MisTrabajosU /></RutaProtegida>} />
      <Route path="/trabajos-s" element={<RutaProtegida><MisTrabajosS /></RutaProtegida>} />
      <Route path="/perfil-solucionador" element={<RutaProtegida><PerfilSolucionadorEdit /></RutaProtegida>} />
      <Route path="/notificaciones" element={<RutaProtegida><Notificaciones /></RutaProtegida>} />
      <Route path="/notificaciones-s" element={<RutaProtegida><NotificacionesS /></RutaProtegida>} />
      <Route path="/ingresos" element={<RutaProtegida><Ingresos /></RutaProtegida>} />
      <Route path="/ayuda" element={<RutaProtegida><Ayuda /></RutaProtegida>} />
      <Route path="/ayuda-s" element={<RutaProtegida><AyudaS /></RutaProtegida>} />
      <Route path="/chat-s" element={<RutaProtegida><ChatS /></RutaProtegida>} />
      <Route path="/perfil-usuario-publico" element={<RutaProtegida><PerfilUsuarioPublico /></RutaProtegida>} />
      <Route path="/presupuestos-s" element={<RutaProtegida><PresupuestosS /></RutaProtegida>} />
      <Route path="/acuerdo-digital" element={<RutaProtegida><AcuerdoDigital /></RutaProtegida>} />

      {/* Fallback */}
      <Route path="*" element={<RutaInicial />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;