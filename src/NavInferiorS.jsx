import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavInferiorS.module.css";
import {
  IconoInicio,
  IconoTrabajos,
  IconoAgenda,
  IconoChat,
  IconoPerfil,
} from "./Iconos";

const NAV_ITEMS = [
  {
    id: "inicio",
    icono: <IconoInicio size={20} />,
    label: "Inicio",
    ruta: "/home-solucionador",
  },
  {
    id: "trabajos",
    icono: <IconoTrabajos size={20} />,
    label: "Trabajos",
    ruta: "/trabajos-s",
  },
  {
    id: "agenda",
    icono: <IconoAgenda size={20} />,
    label: "Agenda",
    ruta: "/agenda",
  },
  {
    id: "chat",
    icono: <IconoChat size={20} />,
    label: "Chat",
    ruta: "/chat-s",
  },
  {
    id: "perfil",
    icono: <IconoPerfil size={20} />,
    label: "Perfil",
    ruta: "/perfil-solucionador",
  },
];

export default function NavInferiorS() {
  const navigate = useNavigate();
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
            <span
              className={`${styles.icono} ${activo ? styles.iconoActivo : ""}`}
            >
              {item.icono}
            </span>
            <span
              className={`${styles.label} ${activo ? styles.labelActivo : ""}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
