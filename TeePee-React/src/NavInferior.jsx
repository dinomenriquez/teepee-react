import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavInferior.module.css";
import { IconoInicio, IconoBuscar, IconoTrabajos, IconoChat } from "./Iconos";
import { User, HelpCircle, LogOut } from "lucide-react";

function IconoMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor"/>
      <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor"/>
      <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "inicio",   icono: <IconoInicio   size={20} />, label: "Inicio",   ruta: "/home" },
  { id: "buscar",   icono: <IconoBuscar   size={20} />, label: "Buscar",   ruta: "/busqueda" },
  { id: "trabajos", icono: <IconoTrabajos size={20} />, label: "Trabajos", ruta: "/trabajos" },
  { id: "chat",     icono: <IconoChat     size={20} />, label: "Chat",     ruta: "/chat" },
];

const MENU_ITEMS = [
  { icono: <User size={15} />,       label: "Mi perfil",       ruta: "/perfil-usuario",  rojo: false },
  { icono: <HelpCircle size={15} />, label: "Centro de ayuda", ruta: "/ayuda",            rojo: false },
  { icono: <LogOut size={15} />,     label: "Cerrar sesión",   ruta: "/bienvenida",       rojo: true  },
];

export default function NavInferior() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      {menuAbierto && (
        <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setMenuAbierto(false)} />
      )}

      {menuAbierto && (
        <div style={{
          position: "fixed",
          bottom: 60,
          right: "max(8px, calc(50% - 200px))",
          zIndex: 300,
          background: "var(--tp-crema)",
          border: "1px solid rgba(61,31,31,0.12)",
          borderRadius: 12,
          boxShadow: "0 -2px 16px rgba(61,31,31,0.12)",
          width: 190,
          overflow: "hidden",
        }}>
          {MENU_ITEMS.map((item, i) => (
            <button key={item.label} type="button"
              onClick={() => { setMenuAbierto(false); navigate(item.ruta); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                background: "none", border: "none",
                borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid rgba(61,31,31,0.06)" : "none",
                cursor: "pointer", fontFamily: "var(--fuente)", textAlign: "left",
              }}>
              <span style={{ color: item.rojo ? "var(--tp-rojo)" : "var(--tp-marron-suave)", flexShrink: 0 }}>
                {item.icono}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--fuente)", color: item.rojo ? "var(--tp-rojo)" : "var(--tp-marron)" }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      <nav className={styles.nav} aria-label="Navegación principal">
        {NAV_ITEMS.map(item => {
          const activo = pathname === item.ruta;
          return (
            <button key={item.id} type="button"
              className={`${styles.item} ${activo ? styles.itemActivo : ""}`}
              onClick={() => navigate(item.ruta)}>
              <span className={`${styles.icono} ${activo ? styles.iconoActivo : ""}`}>{item.icono}</span>
              <span className={`${styles.label} ${activo ? styles.labelActivo : ""}`}>{item.label}</span>
            </button>
          );
        })}
        <button type="button"
          className={`${styles.item} ${menuAbierto ? styles.itemActivo : ""}`}
          onClick={() => setMenuAbierto(v => !v)}>
          <span className={`${styles.icono} ${menuAbierto ? styles.iconoActivo : ""}`}><IconoMenu /></span>
          <span className={`${styles.label} ${menuAbierto ? styles.labelActivo : ""}`}>Menú</span>
        </button>
      </nav>
    </>
  );
}