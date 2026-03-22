import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavInferior.module.css";
import { IconoInicio, IconoBuscar, IconoTrabajos, IconoChat, IconoPerfil } from "./Iconos";

const NAV_ITEMS = [
  { id: "inicio",   icono: <IconoInicio   size={20} />, label: "Inicio",   ruta: "/home" },
  { id: "buscar",   icono: <IconoBuscar   size={20} />, label: "Buscar",   ruta: "/busqueda" },
  { id: "trabajos", icono: <IconoTrabajos size={20} />, label: "Trabajos", ruta: "/trabajos" },
  { id: "chat",     icono: <IconoChat     size={20} />, label: "Chat",     ruta: "/chat" },
  { id: "perfil",   icono: <IconoPerfil   size={20} />, label: "Perfil",   ruta: "/perfil-usuario" },
];

export default function NavInferior() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {NAV_ITEMS.map((item) => {
        const activo = pathname === item.ruta;
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.item} ${activo ? styles.itemActivo : ""}`}
            onClick={() => navigate(item.ruta)}
          >
            <span className={`${styles.icono} ${activo ? styles.iconoActivo : ""}`}>
              {item.icono}
            </span>
            <span className={`${styles.label} ${activo ? styles.labelActivo : ""}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}