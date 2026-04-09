import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavInferiorS.module.css";
import { IconoInicio, IconoTrabajos, IconoAgenda, IconoChat } from "./Iconos";
import { User, DollarSign, HelpCircle, LogOut } from "lucide-react";

function IconoMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

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
];

const MENU_ITEMS = [
  {
    icono: <User size={15} />,
    label: "Mi perfil",
    ruta: "/perfil-solucionador",
    rojo: false,
  },
  {
    icono: <DollarSign size={15} />,
    label: "Mis ingresos",
    ruta: "/ingresos",
    rojo: false,
  },
  {
    icono: <HelpCircle size={15} />,
    label: "Centro de ayuda",
    ruta: "/ayuda-s",
    rojo: false,
  },
  {
    icono: <LogOut size={15} />,
    label: "Cerrar sesión",
    ruta: "/bienvenida",
    rojo: true,
  },
];

export default function NavInferiorS() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      {/* Overlay para cerrar el menú */}
      {menuAbierto && (
        <div
          className={styles.menuOverlay}
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Menú desplegable */}
      {menuAbierto && (
        <div className={styles.menuPopup}>
          {MENU_ITEMS.map((item, i) => (
            <button
              key={item.label}
              type="button"
              className={`${styles.menuItem} ${i < MENU_ITEMS.length - 1 ? styles.menuItemBorder : ""}`}
              onClick={() => {
                setMenuAbierto(false);
                navigate(item.ruta);
              }}
            >
              <span
                className={
                  item.rojo ? styles.menuItemIconoRojo : styles.menuItemIcono
                }
              >
                {item.icono}
              </span>
              <span
                className={
                  item.rojo ? styles.menuItemLabelRojo : styles.menuItemLabel
                }
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Nav */}
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
        <button
          type="button"
          className={`${styles.item} ${menuAbierto ? styles.itemActivo : ""}`}
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <span
            className={`${styles.icono} ${menuAbierto ? styles.iconoActivo : ""}`}
          >
            <IconoMenu />
          </span>
          <span
            className={`${styles.label} ${menuAbierto ? styles.labelActivo : ""}`}
          >
            Menú
          </span>
        </button>
      </nav>
    </>
  );
}
