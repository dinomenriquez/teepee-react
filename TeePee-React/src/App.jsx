import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Bienvenida from "./Bienvenida";
import HomeUsuario from "./HomeUsuario";
import HomeSolucionador from "./HomeSolucionador";
import Busqueda from "./Busqueda";
import PerfilSolucionador from "./PerfilSolucionador";
import Chat from "./Chat";
import Seguimiento from "./Seguimiento";
import Pago from "./Pago";
import Calificacion from "./Calificacion";
import Cancelacion from "./Cancelacion";
import Agenda from "./Agenda";
import PerfilUsuario from "./PerfilUsuario";
import Presupuestos from "./Presupuestos";
import MisTrabajosU from "./MisTrabajosU";
import MisTrabajosS from "./MisTrabajosS";
import PerfilSolucionadorEdit from "./PerfilSolucionadorEdit";
import Notificaciones from "./Notificaciones";
import NotificacionesS from "./NotificacionesS";
import Ingresos from "./Ingresos";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/bienvenida" />} />
          <Route path="/bienvenida" element={<Bienvenida />} />
          <Route path="/home" element={<HomeUsuario />} />
          <Route path="/home-solucionador" element={<HomeSolucionador />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/perfil" element={<PerfilSolucionador />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/calificacion" element={<Calificacion />} />
          <Route path="/cancelacion" element={<Cancelacion />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/perfil-usuario" element={<PerfilUsuario />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/trabajos" element={<MisTrabajosU />} />
          <Route path="/trabajos-s" element={<MisTrabajosS />} />
          <Route
            path="/perfil-solucionador"
            element={<PerfilSolucionadorEdit />}
          />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/notificaciones-s" element={<NotificacionesS />} />
          <Route path="/ingresos" element={<Ingresos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
