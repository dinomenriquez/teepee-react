import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    desc: "Aparecés en búsquedas urgentes",
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

const TRABAJO_ACTIVO = {
  usuario: "Martín García",
  inicial: "M",
  descripcion: "Reparación de cañería bajo mesada",
  direccion: "Av. Mitre 1240, Posadas",
  horario: "Hoy 14:30 hs",
  monto: "$28.000",
  etapaActual: 2,
  totalEtapas: 3,
  progreso: 65,
};

const SOLICITUDES = [
  {
    id: 1,
    usuario: "Laura Pérez",
    inicial: "L",
    descripcion: "Pérdida de agua en baño principal",
    distancia: "2.3 km",
    presupuestoEstimado: "$15.000 - $25.000",
    urgente: false,
    tiempo: "hace 5 min",
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
    descripcion: "Instalación de calefón nuevo",
    distancia: "4.1 km",
    presupuestoEstimado: "$30.000 - $45.000",
    urgente: true,
    tiempo: "hace 12 min",
    disponibilidad: [
      { dia: "Mar", turnos: ["15-19", "19-21"] },
      { dia: "Jue", turnos: ["15-19"] },
    ],
    horaPuntual: "08:30",
  },
];

const NAV_ITEMS = [
  { id: "inicio", icono: <IconoInicio size={20} />, label: "Inicio" },
  { id: "trabajos", icono: <IconoTrabajos size={20} />, label: "Trabajos" },
  { id: "agenda", icono: <IconoAgenda size={20} />, label: "Agenda" },
  { id: "ingresos", icono: <IconoIngresos size={20} />, label: "Ingresos" },
  { id: "perfil", icono: <IconoPerfil size={20} />, label: "Perfil" },
];

export default function HomeSolucionador() {
  const navigate = useNavigate();
  const [estadoActivo, setEstadoActivo] = useState("disponible");
  const [navActiva, setNavActiva] = useState("inicio");
  const [toast, setToast] = useState(null);
  const [mostrarEstados, setMostrarEstados] = useState(false);

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
            <h1 className={styles.saludoNombre}>{SOLUCIONADOR.nombre}</h1>
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
          <div className={styles.avatar}>{SOLUCIONADOR.inicial}</div>
        </section>

        {/* ── RESUMEN DE INGRESOS ── */}
        <section className={styles.ingresosCard}>
          <div className={styles.ingresosBloque}>
            <p className={styles.ingresosTitulo}>Esta semana</p>
            <p className={styles.ingresosMonto}>
              {SOLUCIONADOR.ingresosEstaSemana}
            </p>
            <p className={styles.ingresosDesc}>3 trabajos completados</p>
          </div>

          <div className={styles.ingresosDivider}></div>

          <div className={styles.ingresosBloque}>
            <p className={styles.ingresosTitulo}>Este mes</p>
            <p className={styles.ingresosMonto}>{SOLUCIONADOR.ingresosMes}</p>
            <p className={styles.ingresosDesc}>12 trabajos completados</p>
          </div>

          {/* Próximo pago */}
          <div className={styles.proximoPago}>
            <span className={styles.proximoPagoIcono}>
              <IconoPago size={16} />
            </span>
            <span className={styles.proximoPagoTexto}>
              Próximo pago: {SOLUCIONADOR.proximoPago}
            </span>
          </div>
        </section>

        {/* ── TRABAJO ACTIVO ── */}
        <section className={styles.trabajoActivo}>
          <div className={styles.trabajoActivoHeader}>
            <div className={styles.trabajoActivoLabel}>
              <div className={styles.puntoActivo}></div>
              Trabajo en curso
            </div>
            <button
              className={styles.trabajoActivoBtn}
              onClick={() => navigate("/seguimiento")}
            >
              Ver detalle →
            </button>
          </div>

          <h2 className={styles.trabajoActivoDesc}>
            {TRABAJO_ACTIVO.descripcion}
          </h2>

          <div className={styles.trabajoActivoMeta}>
            <span className={styles.trabajoActivoMetaItem}>
              <IconoPerfil size={12} /> {TRABAJO_ACTIVO.usuario}
            </span>
            <span className={styles.trabajoActivoMetaItem}>
              <IconoUbicacion size={12} /> {TRABAJO_ACTIVO.distancia}
            </span>
            <span className={styles.trabajoActivoMetaItem}>
              <IconoReloj size={12} /> {TRABAJO_ACTIVO.horario}
            </span>
          </div>

          <div className={styles.progreso}>
            <div
              className={styles.progresoBarra}
              style={{ width: `${TRABAJO_ACTIVO.progreso}%` }}
            />
          </div>

          <div className={styles.progresoLabels}>
            <span className={styles.progresoTexto}>
              Etapa {TRABAJO_ACTIVO.etapaActual} de {TRABAJO_ACTIVO.totalEtapas}
            </span>
            <span className={styles.progresoMonto}>{TRABAJO_ACTIVO.monto}</span>
          </div>
        </section>

        {/* ── SOLICITUDES NUEVAS ── */}
        <section>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>
              Solicitudes nuevas
              <span className={styles.seccionBadge}>{SOLICITUDES.length}</span>
            </h2>
            <a href="#" className={styles.seccionVerTodo}>
              Ver todas →
            </a>
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

                <div className={styles.solicitudPresupuesto}>
                  <span className={styles.solicitudPresupuestoLabel}>
                    Estimado:
                  </span>
                  <span className={styles.solicitudPresupuestoMonto}>
                    {sol.presupuestoEstimado}
                  </span>
                </div>
                {/* Disponibilidad del usuario */}
                {sol.disponibilidad && sol.disponibilidad.length > 0 && (
                  <div className={styles.solicitudDisponibilidad}>
                    <span className={styles.solicitudDispLabel}>
                      🕐 Disponibilidad
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
                    onClick={() => mostrarToast("Solicitud rechazada")}
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    className={`${styles.btnAceptar} ${sol.urgente ? styles.btnAceptarUrgente : ""}`}
                    onClick={() => mostrarToast("¡Solicitud aceptada!")}
                  >
                    Ver y cotizar →
                  </button>
                </div>
              </div>
            ))}
          </div>
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

      {/* ── NAVEGACIÓN INFERIOR ── */}
      <nav className={styles.navInferior}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${navActiva === item.id ? styles.navItemActivo : ""}`}
            onClick={() => {
              setNavActiva(item.id);
              if (item.id === "agenda") navigate("/agenda");
              if (item.id === "ingresos") navigate("/ingresos");
              if (item.id === "perfil") navigate("/perfil-solucionador");
              if (item.id === "trabajos") navigate("/trabajos-s");
            }}
          >
            <span className={styles.navIcono}>{item.icono}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── TOAST ── */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
