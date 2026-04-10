import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import MisBusquedas from "./MisBusquedas";
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

// Admin
import RutaAdmin from "./admin/RutaAdmin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminAprobaciones from "./admin/AdminAprobaciones";
import AdminReclamos from "./admin/AdminReclamos";
import AdminUsuarios from "./admin/AdminUsuarios";
import AdminSolucionadores from "./admin/AdminSolucionadores";
import AdminPagos from "./admin/AdminPagos";
import AdminComisiones from "./admin/AdminComisiones";
import AdminReportes from "./admin/AdminReportes";
import AdminAntifraude from "./admin/AdminAntifraude";

// ── RUTA PROTEGIDA ────────────────────────────
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
  if (sesion.rolActivo === "admin")       return <Navigate to="/admin" replace />;
  if (sesion.rolActivo === "solucionador") return <Navigate to="/home-solucionador" replace />;
  return <Navigate to="/home" replace />;
}

// ── WRAPPER ADMIN: layout + ruta protegida ────
function AdminPage({ children }) {
  return (
    <RutaAdmin>
      <AdminLayout>{children}</AdminLayout>
    </RutaAdmin>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Raíz */}
      <Route path="/" element={<RutaInicial />} />

      {/* Bienvenida */}
      <Route path="/bienvenida" element={<Bienvenida />} />

      {/* ── PANEL ADMIN ── */}
      <Route path="/admin"                element={<AdminPage><AdminDashboard /></AdminPage>} />
      <Route path="/admin/aprobaciones"   element={<AdminPage><AdminAprobaciones /></AdminPage>} />
      <Route path="/admin/reclamos"       element={<AdminPage><AdminReclamos /></AdminPage>} />
      <Route path="/admin/usuarios"       element={<AdminPage><AdminUsuarios /></AdminPage>} />
      <Route path="/admin/solucionadores" element={<AdminPage><AdminSolucionadores /></AdminPage>} />
      <Route path="/admin/pagos"          element={<AdminPage><AdminPagos /></AdminPage>} />
      <Route path="/admin/comisiones"     element={<AdminPage><AdminComisiones /></AdminPage>} />
      <Route path="/admin/reportes"       element={<AdminPage><AdminReportes /></AdminPage>} />
      <Route path="/admin/antifraude"     element={<AdminPage><AdminAntifraude /></AdminPage>} />

      {/* ── APP USUARIO / SOLUCIONADOR ── */}
      <Route path="/home" element={<RutaProtegida><HomeUsuario /></RutaProtegida>} />
      <Route path="/home-solucionador" element={<RutaProtegida><HomeSolucionador /></RutaProtegida>} />
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

function AppWrapper() {
  const location = useLocation();
  const esAdmin  = location.pathname.startsWith("/admin");
  return (
    <div className={esAdmin ? "appAdmin" : "app"}>
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;