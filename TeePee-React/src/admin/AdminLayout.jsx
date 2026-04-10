import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import styles from "./AdminLayout.module.css";
import {
  LayoutDashboard, Users, Wrench, AlertTriangle,
  BadgeCheck, CreditCard, Settings, FileBarChart,
  Shield, ChevronRight, Menu, X, Bell, LogOut,
} from "lucide-react";

const NAV = [
  {
    seccion: "Principal",
    items: [
      { id: "dashboard",    label: "Dashboard",      icono: LayoutDashboard, ruta: "/admin",                badge: null,   badgeTipo: null },
      { id: "aprobaciones", label: "Aprobaciones",   icono: BadgeCheck,      ruta: "/admin/aprobaciones",  badge: 4,      badgeTipo: "warn" },
      { id: "reclamos",     label: "Reclamos",        icono: AlertTriangle,   ruta: "/admin/reclamos",      badge: 2,      badgeTipo: "danger" },
    ],
  },
  {
    seccion: "Gestión",
    items: [
      { id: "usuarios",       label: "Usuarios",       icono: Users,         ruta: "/admin/usuarios",       badge: null, badgeTipo: null },
      { id: "solucionadores", label: "Solucionadores", icono: Wrench,        ruta: "/admin/solucionadores", badge: null, badgeTipo: null },
      { id: "pagos",          label: "Pagos",          icono: CreditCard,    ruta: "/admin/pagos",          badge: null, badgeTipo: null },
    ],
  },
  {
    seccion: "Sistema",
    items: [
      { id: "comisiones", label: "Comisiones", icono: Settings,       ruta: "/admin/comisiones", badge: null, badgeTipo: null },
      { id: "reportes",   label: "Reportes",   icono: FileBarChart,   ruta: "/admin/reportes",   badge: null, badgeTipo: null },
      { id: "antifraude", label: "Antifraude", icono: Shield,         ruta: "/admin/antifraude", badge: null, badgeTipo: null },
    ],
  },
];

const TITULOS = {
  "/admin":                "Dashboard",
  "/admin/aprobaciones":   "Aprobaciones",
  "/admin/reclamos":       "Reclamos",
  "/admin/usuarios":       "Usuarios",
  "/admin/solucionadores": "Solucionadores",
  "/admin/pagos":          "Pagos",
  "/admin/comisiones":     "Comisiones",
  "/admin/reportes":       "Reportes",
  "/admin/antifraude":     "Antifraude",
};

export default function AdminLayout({ children }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { logout } = useAuth();
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const rutaActual = location.pathname;
  const titulo     = TITULOS[rutaActual] || "Admin";
  const fecha      = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
  const totalAlertas = NAV[0].items.reduce((acc, i) => acc + (i.badge || 0), 0);

  function irA(ruta) {
    navigate(ruta);
    setSidebarAbierta(false);
  }

  const Sidebar = () => (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.sidebarLogo}>
        <div className={styles.logoMark}>T</div>
        <div>
          <div className={styles.logoText}>TeePee</div>
          <div className={styles.logoSub}>Panel admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(grupo => (
          <div key={grupo.seccion}>
            <p className={styles.navSeccion}>{grupo.seccion}</p>
            {grupo.items.map(item => {
              const Icono  = item.icono;
              const activo = rutaActual === item.ruta;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navItem} ${activo ? styles.navItemActivo : ""}`}
                  onClick={() => irA(item.ruta)}
                >
                  <Icono size={16} className={styles.navIcono} />
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge && (
                    <span className={`${styles.navBadge} ${item.badgeTipo === "danger" ? styles.navBadgeDanger : styles.navBadgeWarn}`}>
                      {item.badge}
                    </span>
                  )}
                  {activo && <ChevronRight size={14} className={styles.navChevron} />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer admin */}
      <div className={styles.sidebarFooter}>
        <div className={styles.adminInfo}>
          <div className={styles.adminAvatar}>AD</div>
          <div className={styles.adminTexto}>
            <span className={styles.adminNombre}>Admin TeePee</span>
            <span className={styles.adminRol}>Superadmin</span>
          </div>
        </div>
        <button type="button" className={styles.btnLogout} onClick={logout} title="Cerrar sesión">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );

  return (
    <div className={styles.layout}>
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Overlay móvil */}
      {sidebarAbierta && (
        <div className={styles.overlay} onClick={() => setSidebarAbierta(false)}>
          <div className={styles.sidebarMobile} onClick={e => e.stopPropagation()}>
            <button type="button" className={styles.btnCerrarSidebar} onClick={() => setSidebarAbierta(false)}>
              <X size={20} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button type="button" className={styles.btnHamburguesa} onClick={() => setSidebarAbierta(true)}>
              <Menu size={20} />
            </button>
            <h1 className={styles.topbarTitulo}>{titulo}</h1>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.topbarFecha}>{fecha}</span>
            {totalAlertas > 0 && (
              <button type="button" className={styles.alertPill} onClick={() => irA("/admin/reclamos")}>
                <Bell size={12} />
                {totalAlertas} alertas urgentes
              </button>
            )}
          </div>
        </header>

        {/* Página */}
        <main className={styles.contenido}>
          {children}
        </main>
      </div>
    </div>
  );
}