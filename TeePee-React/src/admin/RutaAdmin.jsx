import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function RutaAdmin({ children }) {
  const { sesion, cargando } = useAuth();
  if (cargando) return null;
  if (!sesion) return <Navigate to="/bienvenida" replace />;
  if (sesion.rolActivo !== "admin") return <Navigate to="/" replace />;
  return children;
}