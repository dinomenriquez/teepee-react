import { getTrabajosDeUsuario, getSolucionador } from './MockData';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferior from "./NavInferior";
import styles from "./MisTrabajosU.module.css";
import { IconoVolver } from "./Iconos";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const TRABAJOS = {
  enCurso: [
    {
      id: 1,
      solucionadorId: 1,
      solucionador: "Carlos Mendoza",
      inicial: "C",
      nivel: "🥇",
      color: "#B84030",
      oficio: "Plomero",
      titulo: "Pérdida de agua en baño principal",
      descripcion: "Pérdida de agua en baño principal",
      fecha: "Hoy 09:00 – 12:00 hs",
      monto: "$22.000",
      estado: "en-curso",
      etapa: 2,
      totalEtapas: 3,
      progreso: 40,
    },
    {
      id: 2,
      solucionadorId: 2,
      solucionador: "Roberto Flores",
      inicial: "R",
      nivel: "🥈",
      color: "#534AB7",
      oficio: "Plomero",
      titulo: "Instalación calefón",
      descripcion: "Instalación calefón",
      fecha: "Mié 10:00 – 13:00 hs",
      monto: "$32.000",
      estado: "en-curso",
      etapa: 1,
      totalEtapas: 1,
      progreso: 0,
    },
  ],
  finalizados: [
    {
      id: 3,
      solucionadorId: 3,
      solucionador: "Miguel Saracho",
      inicial: "M",
      nivel: "🥇",
      color: "#8C6820",
      oficio: "Plomero",
      titulo: "Cambio de canilla cocina",
      descripcion: "Cambio de canilla cocina",
      fecha: "15/03/2025",
      monto: "$8.500",
      estado: "finalizado",
      etapa: 1,
      totalEtapas: 1,
      progreso: 100,
      calificacion: 5,
    },
  ],
  cancelados: [
    {
      id: 4,
      solucionadorId: 2,
      solucionador: "Roberto Flores",
      inicial: "R",
      nivel: "🥈",
      color: "#534AB7",
      oficio: "Plomero",
      titulo: "Reparación canilla exterior",
      descripcion: "Reparación canilla exterior",
      fecha: "10/03/2025",
      monto: "$6.000",
      estado: "cancelado",
      etapa: 1,
      totalEtapas: 1,
      progreso: 0,
      motivoCancelacion: "El solucionador no pudo asistir",
      montoDevuelto: "$0 (sin anticipo)",
    },
  ],
  disputas: [
    {
      id: 5,
      solucionadorId: 3,
      solucionador: "Miguel Saracho",
      inicial: "M",
      nivel: "🥇",
      color: "#8C6820",
      oficio: "Plomero",
      titulo: "Destapación cañería cocina",
      descripcion: "Destapación cañería cocina",
      fecha: "05/03/2025",
      monto: "$12.000",
      estado: "disputa",
      etapa: 1,
      totalEtapas: 2,
      progreso: 50,
      motivoDisputa: "El problema volvió a aparecer al día siguiente",
      estadoDisputa: "En revisión",
    },
  ],
};

const TABS = [
  { id: "enCurso",     label: "En curso",     icono: <RefreshCw    size={14} /> },
  { id: "finalizados", label: "Finalizados",   icono: <CheckCircle  size={14} /> },
  { id: "cancelados",  label: "Cancelados",    icono: <XCircle      size={14} /> },
  { id: "disputas",    label: "Disputas",      icono: <AlertTriangle size={14} /> },
];

export default function MisTrabajosU() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("enCurso");
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const trabajosActuales = TRABAJOS[tab];

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mis Trabajos</span>
      </header>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icono}</span>
            <span>{t.label}</span>
            {TRABAJOS[t.id].length > 0 && (
              <span
                className={`${styles.tabBadge} ${
                  tab === t.id ? styles.tabBadgeActivo : ""
                }`}
              >
                {TRABAJOS[t.id].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className={styles.contenido}>
        {trabajosActuales.length === 0 ? (
          <div className={styles.vacio}>
            <span className={styles.vacioIcono}>
              {tab === "enCurso" ? "🔧" : tab === "finalizados" ? "✅" : tab === "cancelados" ? "🚫" : "⚖️"}
            </span>
            <p className={styles.vacioTexto}>
              {tab === "enCurso"    ? "Sin trabajos en curso"     :
               tab === "finalizados" ? "Sin trabajos finalizados"  :
               tab === "cancelados"  ? "Sin trabajos cancelados"   :
               "Sin disputas activas"}
            </p>
          </div>
        ) : (
          <div className={styles.lista}>
            {trabajosActuales.map((trabajo) => (
              <div key={trabajo.id} className={styles.card}>
                {/* Header del trabajo */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardAvatar} style={{ background: trabajo.color, color: "white" }}>
                    {trabajo.inicial}
                    <span className={styles.cardNivel}>{trabajo.nivel}</span>
                  </div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardTitulo}>{trabajo.titulo}</span>
                    <span className={styles.cardSolucionador}>
                      {trabajo.solucionador} · {trabajo.oficio}
                    </span>
                    <span className={styles.cardFecha}>📅 {trabajo.fecha}</span>
                  </div>
                  <span className={styles.cardMonto}>{trabajo.monto}</span>
                </div>

                {/* EN CURSO — barra de avance solo si hay progreso */}
                {trabajo.estado === "en-curso" && trabajo.progreso > 0 && (
                  <div className={styles.progresoBloque}>
                    <div className={styles.progresoLabels}>
                      <span className={styles.progresoTexto}>Avance de obra</span>
                      <span className={styles.progresoPct}>{trabajo.progreso}%</span>
                    </div>
                    <div className={styles.progresoBarra}>
                      <div className={styles.progresoRelleno} style={{ width: `${trabajo.progreso}%` }} />
                    </div>
                  </div>
                )}

                {/* FINALIZADO — calificación */}
                {trabajo.estado === "finalizado" && (
                  <div className={styles.calificacionBloque}>
                    {trabajo.calificacion ? (
                      <div className={styles.calificacionDada}>
                        <span className={styles.calificacionLabel}>
                          Tu calificación:
                        </span>
                        <span className={styles.calificacionEstrellas}>
                          {"⭐".repeat(trabajo.calificacion)}
                          {"☆".repeat(5 - trabajo.calificacion)}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.calificacionPendiente}>
                        <span>⏳ Calificación pendiente</span>
                      </div>
                    )}
                  </div>
                )}

                {/* CANCELADO — motivo y devolución */}
                {trabajo.estado === "cancelado" && (
                  <div className={styles.canceladoBloque}>
                    <div className={styles.canceladoFila}>
                      <span>Motivo</span>
                      <span>{trabajo.motivoCancelacion}</span>
                    </div>
                    <div className={styles.canceladoFila}>
                      <span>Devuelto</span>
                      <span className={styles.canceladoDevolucion}>
                        {trabajo.montoDevuelto}
                      </span>
                    </div>
                  </div>
                )}

                {/* DISPUTA — estado del caso */}
                {trabajo.estado === "disputa" && (
                  <div className={styles.disputaBloque}>
                    <div className={styles.disputaFila}>
                      <span>Motivo</span>
                      <span>{trabajo.motivoDisputa}</span>
                    </div>
                    <div className={styles.disputaFila}>
                      <span>Caso</span>
                      <span className={styles.disputaNroCaso}>
                        {trabajo.nroCaso}
                      </span>
                    </div>
                    <div className={styles.disputaFila}>
                      <span>Estado</span>
                      <span className={styles.disputaEstado}>
                        🔍 {trabajo.estadoDisputa}
                      </span>
                    </div>
                  </div>
                )}

                {/* Botones según estado */}
                <div className={styles.cardBotones}>
                  {trabajo.estado === "en-curso" && (
                    <>
                      <button
                        type="button"
                        className={styles.btnSecundario}
                        onClick={() => navigate(`/chat?solId=${trabajo.solucionadorId}&nombre=${encodeURIComponent(trabajo.solucionador)}&inicial=${trabajo.inicial}&oficio=${encodeURIComponent(trabajo.oficio)}&desde=mis-trabajos`)}
                      >
                        💬 Chat
                      </button>
                      <button
                        type="button"
                        className={styles.btnPrimario}
                        onClick={() => navigate(`/seguimiento?trabajoId=${trabajo.id}&solNombre=${encodeURIComponent(trabajo.solucionador)}&solInicial=${trabajo.inicial}&solOficio=${encodeURIComponent(trabajo.oficio)}&solColor=${encodeURIComponent(trabajo.color)}`)}
                      >
                        Ver seguimiento →
                      </button>
                    </>
                  )}
                  {trabajo.estado === "finalizado" && (
                    <>
                      <button
                        type="button"
                        className={styles.btnSecundario}
                        onClick={() =>
                          mostrarToast("Descargando comprobante...")
                        }
                      >
                        📄 Comprobante
                      </button>
                      {!trabajo.calificacion && (
                        <button
                          type="button"
                          className={styles.btnPrimario}
                          onClick={() => navigate("/calificacion")}
                        >
                          ⭐ Calificar
                        </button>
                      )}
                    </>
                  )}
                  {trabajo.estado === "cancelado" && (
                    <button
                      type="button"
                      className={styles.btnSecundario}
                      onClick={() => navigate("/seguimiento")}
                    >
                      Ver detalle
                    </button>
                  )}
                  {trabajo.estado === "disputa" && (
                    <button
                      type="button"
                      className={styles.btnDisputa}
                      onClick={() => navigate("/cancelacion")}
                    >
                      🔍 Ver reclamo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferior />
    </div>
  );
}