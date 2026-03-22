import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./MisTrabajosS.module.css";
import { IconoVolver } from "./Iconos";
import {
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const TRABAJOS = {
  hoy: [
    {
      id: 1, usuarioId: 1,
      titulo: "Tablero eléctrico",
      cliente: "Martín García",
      inicial: "M",
      direccion: "Av. Mitre 1234, Posadas",
      horario: "09:00 – 12:00",
      monto: "$35.200",
      etapa: 2,
      totalEtapas: 4,
      progreso: 50,
      estado: "hoy",
    },
    {
      id: 2, usuarioId: 2,
      titulo: "Reparación canilla",
      cliente: "Laura Pérez",
      inicial: "L",
      direccion: "San Lorenzo 456, Posadas",
      horario: "14:00 – 16:00",
      monto: "$12.000",
      etapa: 1,
      totalEtapas: 2,
      progreso: 25,
      estado: "hoy",
    },
  ],
  enCurso: [
    {
      id: 3, usuarioId: 3,
      titulo: "Pintura living",
      cliente: "Roberto Silva",
      inicial: "R",
      direccion: "Junín 789, Posadas",
      horario: "Mañana 08:00",
      monto: "$48.000",
      etapa: 1,
      totalEtapas: 3,
      progreso: 20,
      estado: "en-curso",
    },
  ],
  finalizados: [
    {
      id: 4,
      titulo: "Instalación AA",
      cliente: "Ana Gómez",
      inicial: "A",
      direccion: "Córdoba 321, Posadas",
      monto: "$65.000",
      fecha: "28 Feb",
      calificacion: 5,
      comentario: "Excelente trabajo, muy puntual.",
      estado: "finalizado",
    },
    {
      id: 5,
      titulo: "Cambio de cerradura",
      cliente: "Carlos Ruiz",
      inicial: "C",
      direccion: "Belgrano 654, Posadas",
      monto: "$8.500",
      fecha: "15 Feb",
      calificacion: 4,
      comentario: "Buen trabajo, llegó un poco tarde.",
      estado: "finalizado",
    },
    {
      id: 6,
      titulo: "Reparación persiana",
      cliente: "Sofía Torres",
      inicial: "S",
      direccion: "Entre Ríos 111, Posadas",
      monto: "$9.000",
      fecha: "2 Feb",
      calificacion: null,
      comentario: null,
      estado: "finalizado",
    },
  ],
  cancelados: [
    {
      id: 7,
      titulo: "Pintura exterior",
      cliente: "Diego Molina",
      inicial: "D",
      direccion: "Av. Uruguay 222, Posadas",
      monto: "$22.000",
      fecha: "20 Ene",
      tarifaVisita: "$5.000",
      motivoCancelacion: "El cliente tuvo un imprevisto",
      estado: "cancelado",
    },
  ],
  disputas: [
    {
      id: 8,
      titulo: "Instalación gas",
      cliente: "Héctor Giménez",
      inicial: "H",
      direccion: "Salta 333, Posadas",
      monto: "$38.000",
      fecha: "5 Feb",
      motivoDisputa: "El cliente dice que quedó mal",
      estadoDisputa: "En revisión",
      nroCaso: "#CASO-2024-0289",
      estado: "disputa",
    },
  ],
};

const TABS = [
  { id: "hoy", label: "Hoy", icono: <Calendar size={14} /> },
  { id: "enCurso", label: "En curso", icono: <RefreshCw size={14} /> },
  { id: "finalizados", label: "Finalizados", icono: <CheckCircle size={14} /> },
  { id: "cancelados", label: "Cancelados", icono: <XCircle size={14} /> },
  { id: "disputas", label: "Disputas", icono: <AlertTriangle size={14} /> },
];

export default function MisTrabajosS() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("hoy");
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
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardAvatar}>{trabajo.inicial}</div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardTitulo}>{trabajo.titulo}</span>
                    <span className={styles.cardCliente}>
                      👤 {trabajo.cliente}
                    </span>
                    <span className={styles.cardDireccion}>
                      📍 {trabajo.direccion}
                    </span>
                    {trabajo.horario && (
                      <span className={styles.cardHorario}>
                        🕐 {trabajo.horario}
                      </span>
                    )}
                    {trabajo.fecha && (
                      <span className={styles.cardFecha}>
                        📅 {trabajo.fecha}
                      </span>
                    )}
                  </div>
                  <span className={styles.cardMonto}>{trabajo.monto}</span>
                </div>

                {/* HOY / EN CURSO — progreso */}
                {(trabajo.estado === "hoy" ||
                  trabajo.estado === "en-curso") && (
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

                {/* FINALIZADO — calificación recibida */}
                {trabajo.estado === "finalizado" && (
                  <div className={styles.calificacionBloque}>
                    {trabajo.calificacion ? (
                      <>
                        <div className={styles.calificacionFila}>
                          <span className={styles.calificacionLabel}>
                            Calificación recibida:
                          </span>
                          <span className={styles.calificacionEstrellas}>
                            {"⭐".repeat(trabajo.calificacion)}
                            {"☆".repeat(5 - trabajo.calificacion)}
                          </span>
                        </div>
                        {trabajo.comentario && (
                          <p className={styles.calificacionComentario}>
                            "{trabajo.comentario}"
                          </p>
                        )}
                      </>
                    ) : (
                      <span className={styles.calificacionPendiente}>
                        ⏳ El cliente aún no calificó
                      </span>
                    )}
                  </div>
                )}

                {/* CANCELADO */}
                {trabajo.estado === "cancelado" && (
                  <div className={styles.canceladoBloque}>
                    <div className={styles.canceladoFila}>
                      <span>Motivo</span>
                      <span>{trabajo.motivoCancelacion}</span>
                    </div>
                    <div className={styles.canceladoFila}>
                      <span>Tarifa visita cobrada</span>
                      <span className={styles.canceladoMonto}>
                        {trabajo.tarifaVisita}
                      </span>
                    </div>
                  </div>
                )}

                {/* DISPUTA */}
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

                {/* Botones */}
                <div className={styles.cardBotones}>
                  {(trabajo.estado === "hoy" ||
                    trabajo.estado === "en-curso") && (
                    <>
                      <button
                        type="button"
                        className={styles.btnSecundario}
                        onClick={() => navigate(`/chat-s?usuarioId=${trabajo.usuarioId}&nombre=${encodeURIComponent(trabajo.cliente)}&inicial=${trabajo.inicial}&desde=trabajos-s`)}
                      >
                        💬 Chat
                      </button>
                      <button
                        type="button"
                        className={styles.btnPrimario}
                        onClick={() => navigate(`/seguimiento-s?usuarioId=${trabajo.usuarioId}&trabajoId=${trabajo.id}`)}
                      >
                        Ver trabajo →
                      </button>
                    </>
                  )}
                  {trabajo.estado === "finalizado" && (
                    <button
                      type="button"
                      className={styles.btnSecundario}
                      onClick={() => mostrarToast("Descargando comprobante...")}
                    >
                      📄 Comprobante
                    </button>
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
      <NavInferiorS />
    </div>
  );
}