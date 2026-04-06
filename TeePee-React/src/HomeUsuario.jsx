import { HelpCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import NavInferior from "./NavInferior";
import styles from "./HomeUsuario.module.css";
import {
  IconoInicio,
  IconoBuscar,
  IconoTrabajos,
  IconoChat,
  IconoPerfil,
  LogoTeePee,
  LogoTexto,
  IconoEstrella,
  IconoPago,
} from "./Iconos";
import { IconoCampana, IconoConfig } from "./Iconos";

const USUARIO = {
  nombre: "Laura Pérez",
  inicial: "L",
  reputacion: 4.8,
  totalTrabajos: 12,
};

const TRABAJOS_ACTIVOS = [
  {
    id: 1,
    solucionador: "Carlos Méndez",
    oficio: "Plomero",
    descripcion: "Reparación de cañería bajo mesada",
    horario: "Hoy 14:30 hs",
    etapaActual: 2,
    totalEtapas: 3,
    progreso: 65,
    color: "#2A7D5A",
  },
  {
    id: 2,
    solucionador: "Ana Rodríguez",
    oficio: "Plomero",
    descripcion: "Instalación de toma corrientes cocina",
    horario: "Mañana 10:00 hs",
    etapaActual: 1,
    totalEtapas: 3,
    progreso: 20,
    color: "#B84030",
  },
  {
    id: 3,
    solucionador: "Carlos Mendoza",
    oficio: "Pintor",
    descripcion: "Pintura living y comedor",
    horario: "Vie 09:00 hs",
    etapaActual: 3,
    totalEtapas: 4,
    progreso: 75,
    color: "#8C6820",
  },
];

const BUSQUEDAS_HOME = [
  {
    id: 1,
    categoria: "Plomería",
    descripcion: "Pérdida de agua en baño principal",
    fecha: "Hoy 14:32",
    solucionadores: 2,
    estado: "con_presupuesto",
  },
  {
    id: 2,
    categoria: "Electricidad",
    descripcion: "Tablero salta con el aire acondicionado",
    fecha: "Ayer 10:15",
    solucionadores: 1,
    estado: "sin_respuesta",
  },
];

export default function HomeUsuario() {
  const navigate = useNavigate();
  const { sesion, tieneDobleRol, cambiarRol, logout } = useAuth();
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [dropdownRol, setDropdownRol] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownRol(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className={styles.pantalla}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <LogoTeePee size={32} />
          <LogoTexto size={16} />
        </div>
        <div className={styles.headerAcciones}>
          <button
            className={styles.btnIcono}
            title="Notificaciones"
            onClick={() => navigate("/notificaciones")}
          >
            <IconoCampana size={20} />
            <div className={styles.notifBadge}></div>
          </button>
        </div>
      </header>

      <main className={styles.contenido}>
        <section className={styles.saludo}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "var(--tp-rojo)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 900,
                color: "var(--tp-crema)",
                fontFamily: "var(--fuente)",
                flexShrink: 0,
                border: "3px solid var(--tp-crema)",
                boxShadow: "0 2px 8px rgba(61,31,31,0.15)",
              }}
            >
              {(sesion?.nombre || USUARIO.nombre)
                .split(" ")
                .map((n) => n.charAt(0))
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className={styles.saludoSub}>¡Bienvenido de nuevo! 👋</p>
              <h1 className={styles.saludoNombre}>
                {sesion?.nombre || USUARIO.nombre}
              </h1>
            </div>
          </div>
        </section>

        {/* ── SOLICITAR SERVICIO ── */}
        <section>
          <button
            type="button"
            className={styles.btnSolicitar}
            onClick={() => navigate("/busqueda")}
          >
            <div className={styles.btnSolicitarIcono}>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5L21 21" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </div>
            <div className={styles.btnSolicitarTexto}>
              <span className={styles.btnSolicitarTitulo}>
                Solicitar Servicio
              </span>
              <span className={styles.btnSolicitarSub}>
                Encontrá al profesional ideal
              </span>
            </div>
            <span className={styles.btnFlecha}>›</span>
          </button>
        </section>

        {/* ── TRABAJOS EN CURSO ── */}
        <div>
          <div className={styles.seccionHeader} style={{ marginBottom: 8 }}>
            <h2 className={styles.seccionTitulo}>Trabajos en curso</h2>
            {TRABAJOS_ACTIVOS.length > 0 && (
              <button
                type="button"
                className={styles.seccionVerTodo}
                onClick={() => navigate("/trabajos")}
              >
                Ver todos →
              </button>
            )}
          </div>

          {TRABAJOS_ACTIVOS.length === 0 ? (
            <section className={styles.trabajoActivo} style={{ opacity: 0.6 }}>
              <div className={styles.trabajoActivoHeader}>
                <div className={styles.trabajoActivoLabel}>
                  <div
                    className={styles.puntoActivo}
                    style={{ background: "rgba(61,31,31,0.25)" }}
                  ></div>
                  Sin trabajos activos en curso
                </div>
              </div>
              <h2
                className={styles.trabajoActivoNombre}
                style={{ color: "rgba(240,234,214,0.45)", fontStyle: "italic" }}
              >
                —
              </h2>
              <p className={styles.trabajoActivoDesc}>
                Cuando tengas un trabajo en curso aparecerá acá
              </p>
              <div className={styles.progreso}>
                <div className={styles.progresoBarra} style={{ width: "0%" }} />
              </div>
              <div className={styles.progresoLabels}>
                <span className={styles.progresoTexto}>Sin etapas</span>
                <span className={styles.progresoPct}>0%</span>
              </div>
            </section>
          ) : (
            TRABAJOS_ACTIVOS.slice(0, 2).map((t) => (
              <section
                key={t.id}
                className={styles.trabajoActivo}
                style={{ marginBottom: 10 }}
              >
                <div className={styles.trabajoActivoHeader}>
                  <div className={styles.trabajoActivoLabel}>
                    <div
                      className={styles.puntoActivo}
                      style={{ background: t.color }}
                    ></div>
                    Trabajo en curso
                  </div>
                  <button
                    type="button"
                    className={styles.trabajoActivoBtn}
                    onClick={() =>
                      navigate(`/seguimiento?solId=${t.id}&trabajoId=${t.id}`)
                    }
                  >
                    Ver detalle →
                  </button>
                </div>
                <h2 className={styles.trabajoActivoNombre}>
                  {t.solucionador} — {t.oficio}
                </h2>
                <p className={styles.trabajoActivoDesc}>
                  {t.descripcion} · {t.horario}
                </p>
                <div className={styles.progreso}>
                  <div
                    className={styles.progresoBarra}
                    style={{ width: `${t.progreso}%`, background: t.color }}
                  />
                </div>
                <div className={styles.progresoLabels}>
                  <span className={styles.progresoTexto}>
                    Etapa {t.etapaActual} de {t.totalEtapas}
                  </span>
                  <span className={styles.progresoPct}>{t.progreso}%</span>
                </div>
              </section>
            ))
          )}
        </div>
        {/* ── PRESUPUESTOS ── */}
        <section className={styles.presupuestosSection}>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>Presupuestos</h2>
            <button
              type="button"
              className={styles.seccionVerTodo}
              onClick={() => navigate("/presupuestos")}
            >
              Ver todos →
            </button>
          </div>
          {/* Si hay presupuestos muestra el banner, sino muestra vacío */}
          {true /* reemplazar con presupuestos.length > 0 */ ? (
            <button
              type="button"
              className={styles.presupuestosBanner}
              onClick={() => navigate("/presupuestos")}
            >
              <div className={styles.presupuestosBannerLeft}>
                <span className={styles.presupuestosBadge}>3</span>
                <div>
                  <p className={styles.presupuestosBannerTitulo}>
                    Presupuestos pendientes
                  </p>
                  <p className={styles.presupuestosBannerDesc}>
                    Pérdida de agua · Instalación luces · Pintura
                  </p>
                </div>
              </div>
              <span className={styles.presupuestosFlecha}>›</span>
            </button>
          ) : (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "var(--r-md)",
                background: "rgba(61,31,31,0.04)",
                border: "1px dashed rgba(61,31,31,0.12)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "var(--tp-marron-suave)",
                  margin: 0,
                  fontFamily: "var(--fuente)",
                }}
              >
                Sin presupuestos pendientes de ver
              </p>
            </div>
          )}
        </section>

        {/* ── ACCIONES RÁPIDAS 2x2 ── */}
        <section>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                icono: <IconoTrabajos size={22} />,
                titulo: "Mis trabajos",
                sub: "3 activos",
                ruta: "/trabajos",
              },
              {
                icono: <IconoBuscar size={22} />,
                titulo: "Mis búsquedas",
                sub: "3 realizadas",
                ruta: "/mis-busquedas",
              },
              {
                icono: <IconoChat size={22} />,
                titulo: "Mensajes",
                sub: "2 sin leer",
                ruta: "/chat",
              },
              {
                icono: <IconoEstrella size={22} />,
                titulo: "Calificar",
                sub: "1 pendiente",
                ruta: "/calificacion",
              },
            ].map((item) => (
              <button
                key={item.titulo}
                type="button"
                className={styles.btnSecundario}
                onClick={() => navigate(item.ruta)}
              >
                <div className={styles.btnSecIcono}>
                  {typeof item.icono === "string" ? (
                    <span style={{ fontSize: 22 }}>{item.icono}</span>
                  ) : (
                    item.icono
                  )}
                </div>
                <span className={styles.btnSecTitulo}>{item.titulo}</span>
                <span className={styles.btnSecSub}>{item.sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── CENTRO DE AYUDA ── */}
        <button
          type="button"
          className={styles.btnSecundario}
          onClick={() => navigate("/ayuda")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 12,
            textAlign: "left",
          }}
        >
          <div className={styles.btnSecIcono}>
            <HelpCircle size={22} color="var(--tp-marron)" />
          </div>
          <div>
            <span className={styles.btnSecTitulo}>Centro de ayuda</span>
            <span className={styles.btnSecSub}>
              Preguntas frecuentes y soporte
            </span>
          </div>
          <span
            style={{
              marginLeft: "auto",
              color: "var(--tp-marron-suave)",
              fontSize: 18,
            }}
          >
            ›
          </span>
        </button>

        {/* ── REPUTACIÓN ── */}
        <section className={styles.reputacionCard}>
          <div className={styles.reputacionIcono}>🏅</div>
          <div className={styles.reputacionInfo}>
            <p className={styles.reputacionTitulo}>Tu reputación en TeePee</p>
            <p className={styles.reputacionScore}>
              {USUARIO.reputacion} <span>/ 5.0</span>
            </p>
            <p className={styles.reputacionDesc}>
              Basado en {USUARIO.totalTrabajos} trabajos completados
            </p>
            <div className={styles.repBarraContainer}>
              <div
                className={styles.repBarra}
                style={{ width: `${(USUARIO.reputacion / 5) * 100}%` }}
              />
            </div>
          </div>
        </section>
      </main>

      <NavInferior />

      {toast && <div className={styles.toast}>{toast}</div>}

      {modal && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHandle}></div>
            <div className={styles.modalIcono}>{modal.icono}</div>
            <h2
              className={`${styles.modalTitulo} ${modal.urgente ? styles.modalTituloUrgente : ""}`}
            >
              {modal.titulo}
            </h2>
            <p className={styles.modalMensaje}>{modal.mensaje}</p>
            <button
              type="button"
              className={`${styles.modalBtn} ${modal.urgente ? styles.modalBtnUrgente : ""}`}
              onClick={() => setModal(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
