import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MisTrabajosU.module.css";
import { IconoVolver } from "./Iconos";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const TRABAJOS = {
  enCurso: [
    {
      id: 1,
      titulo: "Tablero eléctrico",
      solucionador: "Juan Ledesma",
      inicial: "J",
      nivel: "🥇",
      oficio: "Electricista",
      etapa: 2,
      totalEtapas: 4,
      progreso: 50,
      monto: "$35.200",
      fecha: "Hoy, 8 Mar",
      estado: "en-curso",
    },
    {
      id: 2,
      titulo: "Pintura living",
      solucionador: "Pedro Acuña",
      inicial: "P",
      nivel: "🥈",
      oficio: "Pintor",
      etapa: 1,
      totalEtapas: 3,
      progreso: 25,
      monto: "$48.000",
      fecha: "Ayer, 7 Mar",
      estado: "en-curso",
    },
  ],
  finalizados: [
    {
      id: 3,
      titulo: "Reparación canilla",
      solucionador: "Carlos Mendoza",
      inicial: "C",
      nivel: "🥇",
      oficio: "Plomero",
      monto: "$12.000",
      fecha: "28 Feb",
      calificacion: 5,
      estado: "finalizado",
    },
    {
      id: 4,
      titulo: "Instalación AA",
      solucionador: "Roberto Flores",
      inicial: "R",
      nivel: "🥈",
      oficio: "Técnico",
      monto: "$65.000",
      fecha: "15 Feb",
      calificacion: 4,
      estado: "finalizado",
    },
    {
      id: 5,
      titulo: "Cambio de cerradura",
      solucionador: "Miguel Saracho",
      inicial: "M",
      nivel: "🥇",
      oficio: "Cerrajero",
      monto: "$8.500",
      fecha: "2 Feb",
      calificacion: null,
      estado: "finalizado",
    },
  ],
  cancelados: [
    {
      id: 6,
      titulo: "Pintura exterior",
      solucionador: "Lucas Vera",
      inicial: "L",
      nivel: "🥉",
      oficio: "Pintor",
      monto: "$22.000",
      montoDevuelto: "$22.000",
      fecha: "20 Ene",
      motivoCancelacion: "Tuve un imprevisto personal",
      estado: "cancelado",
    },
  ],
  disputas: [
    {
      id: 7,
      titulo: "Instalación gas",
      solucionador: "Héctor Giménez",
      inicial: "H",
      nivel: "🥈",
      oficio: "Gasista",
      monto: "$38.000",
      fecha: "5 Feb",
      motivoDisputa: "El trabajo quedó mal hecho",
      estadoDisputa: "En revisión",
      nroCaso: "#CASO-2024-0289",
      estado: "disputa",
    },
  ],
};

const TABS = [
  { id: "enCurso", label: "En curso", icono: <RefreshCw size={14} /> },
  { id: "finalizados", label: "Finalizados", icono: <CheckCircle size={14} /> },
  { id: "cancelados", label: "Cancelados", icono: <XCircle size={14} /> },
  { id: "disputas", label: "Disputas", icono: <AlertTriangle size={14} /> },
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
            <span className={styles.vacioIcono}>📋</span>
            <p className={styles.vacioTexto}>Sin trabajos en esta sección</p>
          </div>
        ) : (
          <div className={styles.lista}>
            {trabajosActuales.map((trabajo) => (
              <div key={trabajo.id} className={styles.card}>
                {/* Header del trabajo */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardAvatar}>
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

                {/* EN CURSO — barra de progreso */}
                {trabajo.estado === "en-curso" && (
                  <div className={styles.progresoBloque}>
                    <div className={styles.progresoLabels}>
                      <span className={styles.progresoTexto}>
                        Etapa {trabajo.etapa} de {trabajo.totalEtapas}
                      </span>
                      <span className={styles.progresoPct}>
                        {trabajo.progreso}%
                      </span>
                    </div>
                    <div className={styles.progresoBarra}>
                      <div
                        className={styles.progresoRelleno}
                        style={{ width: `${trabajo.progreso}%` }}
                      />
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
                        onClick={() => navigate("/chat")}
                      >
                        💬 Chat
                      </button>
                      <button
                        type="button"
                        className={styles.btnPrimario}
                        onClick={() => navigate("/seguimiento")}
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
                      onClick={() => mostrarToast("Abriendo detalle...")}
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
    </div>
  );
}
