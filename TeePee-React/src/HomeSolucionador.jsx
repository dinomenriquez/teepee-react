import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import NavInferiorS from "./NavInferiorS";
import {
  TRABAJOS_ACTIVOS,
  SOLICITUDES as SOLICITUDES_GLOBAL,
  getUsuario,
  getSolicitudesDelSolucionador,
  getTrabajosDelSolucionador,
} from "./MockData";
import styles from "./HomeSolucionador.module.css";
import {
  IconoInicio,
  IconoTrabajos,
  IconoAgenda,
  IconoIngresos,
  IconoPerfil,
  IconoCampana,
  LogoTeePee,
  LogoTexto,
} from "./Iconos";
import { IconoUbicacion, IconoReloj, IconoPago } from "./Iconos";

const SOLUCIONADOR = {
  nombre: "Carlos Méndez",
  inicial: "C",
  oficio: "Plomero",
  nivel: "Plata",
  nivelIcono: "🥈",
  reputacion: 4.7,
  totalTrabajos: 38,
  ingresosEstaSemana: "$84.000",
  ingresosMes: "$320.000",
  proximoPago: "Viernes 14/03",
};

const ESTADO_OPCIONES = [
  {
    id: "disponible",
    label: "Disponible",
    icono: "🟢",
    desc: "Recibís solicitudes normales",
    color: "var(--verde)",
  },
  {
    id: "urgente",
    label: "Urgente",
    icono: "🔴",
    desc: "Aparecés en búsquedas urgentes y normales",
    color: "var(--tp-rojo)",
  },
  {
    id: "ocupado",
    label: "Ocupado",
    icono: "⛔",
    desc: "No recibís nuevas solicitudes",
    color: "var(--tp-marron-suave)",
  },
];

const TRABAJOS_ACTIVOS_S = [
  {
    id: 1,
    usuarioId: 1,
    usuario: "Martín García",
    inicial: "M",
    descripcion: "Reparación de cañería bajo mesada",
    distancia: "1.2 km",
    horario: "Hoy 14:30 hs",
    monto: "$28.000",
    etapaActual: 2,
    totalEtapas: 3,
    progreso: 65,
    color: "#2A7D5A",
  },
  {
    id: 2,
    usuarioId: 2,
    usuario: "Laura Sánchez",
    inicial: "L",
    descripcion: "Cambio de canilla cocina",
    distancia: "3.4 km",
    horario: "Mañana 10:00 hs",
    monto: "$12.000",
    etapaActual: 1,
    totalEtapas: 3,
    progreso: 20,
    color: "#B84030",
  },
];

const SOLICITUDES = [
  {
    id: 1,
    usuario: "Laura Pérez",
    inicial: "L",
    color: "#B84030",
    descripcion: "Pérdida de agua en baño principal",
    descripcionDetallada:
      "Hay una pérdida importante debajo de la pileta del baño principal. El piso ya está húmedo y hay manchas en el cielorraso del piso de abajo. Urgente antes de que empeore.",
    direccion: "Av. Mitre 1240, Piso 3, Dpto B — Posadas",
    distancia: "2.3 km",
    presupuestoEstimado: "$15.000 - $25.000",
    urgente: false,
    tiempo: "hace 5 min",
    fotos: 2,
    disponibilidad: [
      { dia: "Lun", turnos: ["7-12", "15-19"] },
      { dia: "Mié", turnos: ["7-12"] },
      { dia: "Sáb", turnos: ["7-12", "12-15"] },
    ],
    horaPuntual: null,
  },
  {
    id: 2,
    usuario: "Roberto Silva",
    inicial: "R",
    color: "#2A7D5A",
    descripcion: "Instalación de calefón nuevo",
    descripcionDetallada:
      "Tengo un calefón nuevo marca Orbis 13 litros que compré pero no tengo quién lo instale. El viejo se rompió hace una semana. También necesito que revisen la conexión de gas.",
    direccion: "San Lorenzo 456, Posadas",
    distancia: "4.1 km",
    presupuestoEstimado: "$30.000 - $45.000",
    urgente: true,
    tiempo: "hace 12 min",
    fotos: 1,
    disponibilidad: [
      { dia: "Mar", turnos: ["15-19", "19-21"] },
      { dia: "Jue", turnos: ["15-19"] },
    ],
    horaPuntual: "08:30",
  },
  {
    id: 3,
    usuario: "Diego Fernández",
    inicial: "D",
    color: "#8C6820",
    descripcion: "Cambio de canilla y sifón cocina",
    descripcionDetallada:
      "La canilla de la cocina gotea constantemente y el sifón está roto. Es una canilla de dos llaves, vieja. Me gustaría reemplazarla por una monocomando.",
    direccion: "Junín 789, Posadas",
    distancia: "1.8 km",
    presupuestoEstimado: "$8.000 - $15.000",
    urgente: false,
    tiempo: "hace 28 min",
    fotos: 0,
    disponibilidad: [
      { dia: "Vie", turnos: ["7-12"] },
      { dia: "Sáb", turnos: ["7-12", "12-15", "15-19"] },
    ],
    horaPuntual: null,
  },
];

export default function HomeSolucionador() {
  const navigate = useNavigate();
  const { sesion, tieneDobleRol, cambiarRol, logout } = useAuth();
  const [estadoActivo, setEstadoActivo] = useState("disponible");
  const [toast, setToast] = useState(null);
  const [mostrarEstados, setMostrarEstados] = useState(false);
  const [dropdownRol, setDropdownRol] = useState(false);
  const dropdownRef = useRef(null);

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

  function cambiarEstado(estado) {
    setEstadoActivo(estado.id);
    setMostrarEstados(false);
    mostrarToast("Estado: " + estado.label);
  }

  const estadoActual = ESTADO_OPCIONES.find((e) => e.id === estadoActivo);

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <LogoTeePee size={32} />
          <LogoTexto size={16} />
        </div>

        {/*
          Toggle de disponibilidad — el control más
          importante para el solucionador.
          Define si recibe o no nuevas solicitudes.
        */}
        <button
          className={styles.estadoToggle}
          style={{ borderColor: estadoActual.color }}
          onClick={() => setMostrarEstados(!mostrarEstados)}
        >
          <span>{estadoActual.icono}</span>
          <span
            className={styles.estadoToggleLabel}
            style={{ color: estadoActual.color }}
          >
            {estadoActual.label}
          </span>
          <span className={styles.estadoToggleFlecha}>
            {mostrarEstados ? "▲" : "▼"}
          </span>
        </button>
        <button
          className={styles.btnIcono}
          onClick={() => navigate("/notificaciones-s")}
          title="Notificaciones"
        >
          <IconoCampana size={20} />
          <div className={styles.notifBadge}></div>
        </button>

        {/* Avatar con dot de rol + dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            type="button"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              padding: 0,
              border: "none",
              cursor: "pointer",
              position: "relative",
              background: "none",
            }}
            onClick={() => setDropdownRol((v) => !v)}
            title="Mi cuenta"
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--tp-marron)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 800,
                color: "var(--tp-crema)",
                fontFamily: "var(--fuente)",
              }}
            >
              {sesion?.nombre?.charAt(0) || SOLUCIONADOR.inicial}
            </div>
            {/* Dot verde = modo solucionador */}
            <div
              style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--verde)",
                border: "2px solid var(--tp-crema)",
              }}
            />
          </button>

          {dropdownRol && (
            <div
              style={{
                position: "absolute",
                top: 44,
                right: 0,
                background: "var(--tp-crema-clara)",
                border: "1px solid rgba(61,31,31,0.12)",
                borderRadius: 12,
                minWidth: 210,
                boxShadow: "0 4px 16px rgba(61,31,31,0.10)",
                zIndex: 200,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid rgba(61,31,31,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--tp-marron)",
                    margin: 0,
                  }}
                >
                  {sesion?.nombre || SOLUCIONADOR.nombre}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 3,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--verde)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    Modo solucionador activo
                  </span>
                </div>
              </div>

              {tieneDobleRol && (
                <button
                  type="button"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid rgba(61,31,31,0.06)",
                    cursor: "pointer",
                    fontFamily: "var(--fuente)",
                    textAlign: "left",
                  }}
                  onClick={() => {
                    cambiarRol("usuario");
                    setDropdownRol(false);
                    navigate("/home");
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#378ADD",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--tp-marron)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    Cambiar a usuario
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "var(--tp-rojo)",
                    }}
                  >
                    →
                  </span>
                </button>
              )}

              {!tieneDobleRol && (
                <button
                  type="button"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid rgba(61,31,31,0.06)",
                    cursor: "pointer",
                    fontFamily: "var(--fuente)",
                    textAlign: "left",
                  }}
                  onClick={() => {
                    setDropdownRol(false);
                    navigate("/home");
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--tp-marron-suave)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    Activar modo usuario
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                    }}
                  >
                    +
                  </span>
                </button>
              )}

              <button
                type="button"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(61,31,31,0.06)",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                  textAlign: "left",
                }}
                onClick={() => {
                  setDropdownRol(false);
                  navigate("/perfil-solucionador");
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--tp-marron)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  Mi perfil
                </span>
              </button>
              <button
                type="button"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(61,31,31,0.06)",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                  textAlign: "left",
                }}
                onClick={() => {
                  setDropdownRol(false);
                  navigate("/ayuda-s");
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--tp-marron)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  Centro de ayuda
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "var(--tp-marron-suave)",
                  }}
                >
                  ?
                </span>
              </button>

              <button
                type="button"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                  textAlign: "left",
                }}
                onClick={() => {
                  logout();
                  setDropdownRol(false);
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--tp-rojo)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  Cerrar sesión
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/*
        Dropdown de estados — aparece solo cuando
        mostrarEstados es true.
        Renderizado condicional: {condicion && <elemento>}
      */}
      {mostrarEstados && (
        <div className={styles.estadosDropdown}>
          {ESTADO_OPCIONES.map((estado) => (
            <button
              key={estado.id}
              className={`${styles.estadoOpcion} ${estadoActivo === estado.id ? styles.estadoOpcionActiva : ""}`}
              onClick={() => cambiarEstado(estado)}
            >
              <span className={styles.estadoOpcionIcono}>{estado.icono}</span>
              <div className={styles.estadoOpcionTexto}>
                <span className={styles.estadoOpcionLabel}>{estado.label}</span>
                <span className={styles.estadoOpcionDesc}>{estado.desc}</span>
              </div>
              {estadoActivo === estado.id && (
                <span className={styles.estadoOpcionCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── CONTENIDO ── */}
      <main className={styles.contenido}>
        {/* ── SALUDO ── */}
        <section className={styles.saludo}>
          <div>
            <p className={styles.saludoSub}>Panel del Solucionador 🔧</p>
            <h1 className={styles.saludoNombre}>
              {sesion?.nombre || SOLUCIONADOR.nombre}
            </h1>
            <div className={styles.saludoNivel}>
              <span>{SOLUCIONADOR.nivelIcono}</span>
              <span className={styles.saludoNivelTexto}>
                Nivel {SOLUCIONADOR.nivel}
              </span>
              <span className={styles.saludoOficio}>
                · {SOLUCIONADOR.oficio}
              </span>
            </div>
          </div>
        </section>

        {/* ── RESUMEN DE INGRESOS ── */}
        <section
          onClick={() => navigate("/ingresos")}
          style={{
            cursor: "pointer",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #3D1F1F 0%, #5C2E2E 60%, #7A2020 100%)",
            boxShadow: "0 8px 24px rgba(61,31,31,0.35)",
          }}
        >
          {/* Nivel 1 — Título */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F0EAD6"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#F0EAD6",
                  fontFamily: "var(--fuente)",
                  letterSpacing: "-0.4px",
                }}
              >
                Mis ingresos
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(240,234,214,0.55)",
                fontFamily: "var(--fuente)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              Este mes
            </span>
          </div>

          {/* Nivel 2 — Montos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              padding: "4px 20px 16px",
              borderBottom: "1px solid rgba(240,234,214,0.08)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(240,234,214,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  margin: "0 0 4px",
                  fontFamily: "var(--fuente)",
                }}
              >
                Esta semana
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#F0EAD6",
                  margin: "0 0 3px",
                  letterSpacing: "-0.5px",
                  fontFamily: "var(--fuente)",
                }}
              >
                {SOLUCIONADOR.ingresosEstaSemana}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(240,234,214,0.40)",
                  margin: 0,
                  fontFamily: "var(--fuente)",
                }}
              >
                3 trabajos
              </p>
            </div>
            <div
              style={{
                width: 1,
                background: "rgba(240,234,214,0.08)",
                margin: "0 20px",
              }}
            />
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(240,234,214,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  margin: "0 0 4px",
                  fontFamily: "var(--fuente)",
                }}
              >
                Este mes
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#F5C842",
                  margin: "0 0 3px",
                  letterSpacing: "-0.5px",
                  fontFamily: "var(--fuente)",
                }}
              >
                {SOLUCIONADOR.ingresosMes}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(240,234,214,0.40)",
                  margin: 0,
                  fontFamily: "var(--fuente)",
                }}
              >
                12 trabajos
              </p>
            </div>
          </div>

          {/* Nivel 3 — Próximo pago */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderBottom: "1px solid rgba(240,234,214,0.06)",
            }}
          >
            <IconoPago size={14} style={{ color: "rgba(240,234,214,0.5)" }} />
            <span
              style={{
                fontSize: 12,
                color: "rgba(240,234,214,0.55)",
                fontFamily: "var(--fuente)",
                fontWeight: 500,
              }}
            >
              Próximo pago:
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#F0EAD6",
                fontFamily: "var(--fuente)",
                fontWeight: 700,
              }}
            >
              {SOLUCIONADOR.proximoPago}
            </span>
          </div>

          {/* Nivel 4 — Ver detalle */}
          <div
            style={{
              padding: "11px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "rgba(245,200,66,0.12)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#F5C842",
                fontFamily: "var(--fuente)",
                letterSpacing: "0.2px",
              }}
            >
              Ver detalle de ingresos
            </span>
            <span style={{ fontSize: 14, color: "#F5C842" }}>→</span>
          </div>
        </section>

        {/* ── TRABAJOS ACTIVOS ── */}
        {TRABAJOS_ACTIVOS_S.map((t) => (
          <section key={t.id} className={styles.trabajoActivo}>
            <div className={styles.trabajoActivoHeader}>
              <div className={styles.trabajoActivoLabel}>
                <div
                  className={styles.puntoActivo}
                  style={{ background: t.color }}
                ></div>
                Trabajo en curso
              </div>
              <button
                className={styles.trabajoActivoBtn}
                onClick={() =>
                  navigate(
                    `/seguimiento-s?solId=${t.usuarioId}&trabajoId=${t.id}`,
                  )
                }
              >
                Ver detalle →
              </button>
            </div>

            <h2 className={styles.trabajoActivoDesc}>{t.descripcion}</h2>

            <div className={styles.trabajoActivoMeta}>
              <span className={styles.trabajoActivoMetaItem}>
                <IconoPerfil size={12} /> {t.usuario}
              </span>
              <span className={styles.trabajoActivoMetaItem}>
                <IconoUbicacion size={12} /> {t.distancia}
              </span>
              <span className={styles.trabajoActivoMetaItem}>
                <IconoReloj size={12} /> {t.horario}
              </span>
            </div>

            <div className={styles.progreso}>
              <div
                className={styles.progresoBarra}
                style={{ width: `${t.progreso}%`, background: t.color }}
              />
            </div>

            <div className={styles.progresoLabels}>
              <span className={styles.progresoTexto}>
                Avance de obra: {t.progreso}%
              </span>
              <span className={styles.progresoMonto}>{t.monto}</span>
            </div>
          </section>
        ))}

        {/* ── SOLICITUDES NUEVAS ── */}
        <section>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>
              Solicitudes nuevas
              <span className={styles.seccionBadge}>{SOLICITUDES.length}</span>
            </h2>
            <button
              type="button"
              className={styles.seccionVerTodo}
              onClick={() => navigate("/trabajos-s")}
            >
              Ver todas →
            </button>
          </div>

          <div className={styles.solicitudesLista}>
            {SOLICITUDES.map((sol) => (
              <div key={sol.id} className={styles.solicitudCard}>
                {sol.urgente && (
                  <div className={styles.urgenteBadge}>🚨 URGENTE</div>
                )}

                <div className={styles.solicitudTop}>
                  <div
                    className={styles.solicitudAvatar}
                    style={{
                      background: sol.urgente
                        ? "var(--tp-rojo)"
                        : "var(--tp-marron)",
                    }}
                  >
                    {sol.inicial}
                  </div>
                  <div className={styles.solicitudInfo}>
                    <span className={styles.solicitudUsuario}>
                      {sol.usuario}
                    </span>
                    <span className={styles.solicitudDesc}>
                      {sol.descripcion}
                    </span>
                    <div className={styles.solicitudMeta}>
                      <span>📍 {sol.distancia}</span>
                      <span>🕐 {sol.tiempo}</span>
                    </div>
                  </div>
                </div>

                {sol.descripcionDetallada && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--tp-crema-oscura)",
                      margin: "6px 0 4px",
                      lineHeight: 1.5,
                      fontFamily: "var(--fuente)",
                      opacity: 0.85,
                      fontStyle: "italic",
                    }}
                  >
                    "
                    {sol.descripcionDetallada.length > 90
                      ? sol.descripcionDetallada.slice(0, 90) + "…"
                      : sol.descripcionDetallada}
                    "
                  </p>
                )}
                {/* Disponibilidad del usuario */}
                {sol.disponibilidad && sol.disponibilidad.length > 0 && (
                  <div className={styles.solicitudDisponibilidad}>
                    <span className={styles.solicitudDispLabel}>
                      🕐 Disponibilidad para visita al domicilio
                    </span>
                    <div className={styles.solicitudDispGrid}>
                      {sol.disponibilidad.map((fila) => (
                        <div
                          key={fila.dia}
                          className={styles.solicitudDispFila}
                        >
                          <span className={styles.solicitudDispDia}>
                            {fila.dia}
                          </span>
                          <div className={styles.solicitudDispTurnos}>
                            {fila.turnos.map((t) => (
                              <span
                                key={t}
                                className={styles.solicitudDispTurno}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {sol.horaPuntual && (
                      <div className={styles.solicitudHoraPuntual}>
                        ⏰ Hora puntual preferida:{" "}
                        <strong>{sol.horaPuntual}</strong>
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.solicitudAcciones}>
                  <button
                    type="button"
                    className={styles.btnRechazar}
                    onClick={() => {
                      mostrarToast("Solicitud rechazada");
                    }}
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    className={`${styles.btnAceptar} ${sol.urgente ? styles.btnAceptarUrgente : ""}`}
                    onClick={() =>
                      navigate(
                        `/presupuestos-s?solicitudId=${sol.id}&desde=home-solucionador`,
                      )
                    }
                  >
                    Ver y cotizar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CENTRO DE AYUDA ── */}
        <section>
          <button
            type="button"
            onClick={() => navigate("/ayuda-s")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              borderRadius: "var(--r-md)",
              background: "var(--tp-crema-clara)",
              border: "1px solid rgba(61,31,31,0.10)",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--tp-rojo-suave)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              💬
            </div>
            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--tp-marron)",
                  margin: 0,
                }}
              >
                Centro de ayuda
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--tp-marron-suave)",
                  margin: 0,
                }}
              >
                Preguntas frecuentes y soporte
              </p>
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
        </section>

        {/* ── REPUTACIÓN ── */}
        <section className={styles.reputacionCard}>
          <div className={styles.reputacionIcono}>⭐</div>
          <div className={styles.reputacionInfo}>
            <p className={styles.reputacionTitulo}>Tu reputación</p>
            <p className={styles.reputacionScore}>
              {SOLUCIONADOR.reputacion} <span>/ 5.0</span>
            </p>
            <p className={styles.reputacionDesc}>
              {SOLUCIONADOR.totalTrabajos} trabajos · Nivel {SOLUCIONADOR.nivel}
            </p>
            <div className={styles.repBarraContainer}>
              <div
                className={styles.repBarra}
                style={{ width: `${(SOLUCIONADOR.reputacion / 5) * 100}%` }}
              />
            </div>
          </div>
        </section>
      </main>
      <NavInferiorS />

      {/* ── TOAST ── */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
