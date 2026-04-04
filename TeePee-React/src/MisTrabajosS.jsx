import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./MisTrabajosS.module.css";
import { IconoVolver } from "./Iconos";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Plus,
  Send,
  Clock,
  Shield,
  MessageCircle,
} from "lucide-react";

const TRABAJOS = {
  enCurso: [
    {
      id: 1, usuarioId: 1,
      titulo: "Tablero eléctrico",
      cliente: "Laura Pérez",
      inicial: "L",
      direccion: "Av. Mitre 1234, Posadas",
      horario: "Hoy 09:00 – 12:00",
      monto: "$35.200",
      etapa: 2,
      totalEtapas: 4,
      progreso: 50,
      estado: "enCurso",
    },
    {
      id: 2, usuarioId: 2,
      titulo: "Reparación canilla",
      cliente: "Laura Pérez",
      inicial: "L",
      direccion: "San Lorenzo 456, Posadas",
      horario: "Hoy 14:00 – 16:00",
      monto: "$12.000",
      etapa: 1,
      totalEtapas: 2,
      progreso: 25,
      estado: "enCurso",
    },
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
    {
      id: 4, usuarioId: 4,
      titulo: "Revisión instalación gas",
      cliente: "Mónica Ruiz",
      inicial: "M",
      direccion: "Catamarca 890, Posadas",
      horario: "Hoy 15:00 – 17:00 hs",
      monto: "$18.000",
      etapa: 0,
      totalEtapas: 1,
      progreso: 0,
      estado: "enCurso",
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
  { id: "enCurso",      label: "En curso",     icono: <RefreshCw     size={14} /> },
  { id: "presupuestos", label: "Presupuestos", icono: <FileText      size={14} />, destacada: true, ruta: "/presupuestos-s" },
  { id: "finalizados",  label: "Finalizados",  icono: <CheckCircle   size={14} /> },
  { id: "cancelados",   label: "Cancelados",   icono: <XCircle       size={14} /> },
  { id: "disputas",     label: "Disputas",     icono: <AlertTriangle size={14} /> },
];

const PRESUPUESTOS_MOCK = [
  {
    id: 1, clienteId: 1, cliente: "Laura Pérez", inicial: "M", color: "#B84030",
    servicio: "Pérdida de agua en baño", estado: "pendiente",
    monto: 15000, tiempoEstimado: "2–3 hs", garantia: 30,
    incluyeMateriales: true, vence: 2, fecha: "Hoy",
  },
  {
    id: 2, clienteId: 2, cliente: "Laura Sánchez", inicial: "L", color: "#2A7D5A",
    servicio: "Instalación calefón", estado: "pendiente",
    monto: 32000, tiempoEstimado: "3–4 hs", garantia: 15,
    incluyeMateriales: false, vence: 5, fecha: "Ayer",
  },
  {
    id: 3, clienteId: 3, cliente: "Diego Fernández", inicial: "D", color: "#8C6820",
    servicio: "Cambio de canilla", estado: "aceptado",
    monto: 8500, tiempoEstimado: "1–2 hs", garantia: 30,
    incluyeMateriales: true, vence: 0, fecha: "Hace 3 días",
  },
];

export default function MisTrabajosS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam      = searchParams.get("tab");
  const clienteParam  = searchParams.get("cliente");
  const servicioParam = searchParams.get("servicio");

  const [tab, setTab] = useState(tabParam || "enCurso");
  const [formPpto, setFormPpto] = useState(null);

  // Cuando vienen params de URL (desde HomeSolucionador), abrir tab y formulario
  useEffect(() => {
    if (tabParam === "presupuestos") {
      setTab("presupuestos");
      if (clienteParam) {
        setFormPpto({
          cliente: decodeURIComponent(clienteParam),
          servicio: decodeURIComponent(servicioParam || ""),
          clienteId: null,
        });
      }
    }
  }, [tabParam, clienteParam, servicioParam]);
  const [datosPpto, setDatosPpto] = useState({
    monto: "", tiempoEstimado: "", garantia: "30",
    incluyeMateriales: true, noIncluye: "", validezDias: "7",
    descripcion: "",
  });
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const trabajosActuales = TRABAJOS[tab] || [];

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header} style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mis Trabajos</span>
      </header>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {TABS.map((t) => {
          const pptosPendientes = PRESUPUESTOS_MOCK.filter(p => p.estado === "pendiente").length;
          const count = t.id === "presupuestos"
            ? pptosPendientes
            : (TRABAJOS[t.id]?.length || 0);
          return (
            <button
              key={t.id}
              type="button"
              className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""}`}
              onClick={() => t.ruta ? navigate(t.ruta) : setTab(t.id)}
              style={t.destacada && tab !== t.id ? {
                color: "var(--tp-rojo)", fontWeight: 700,
                borderBottom: "2px solid rgba(184,64,48,0.25)",
              } : {}}
            >
              <span>{t.icono}</span>
              <span>{t.label}</span>
              {count > 0 && (
                <span className={`${styles.tabBadge} ${tab === t.id ? styles.tabBadgeActivo : ""}`}
                  style={t.destacada && tab !== t.id ? { background: "var(--tp-rojo)", color: "white" } : {}}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab !== "presupuestos" && (
      <main className={styles.contenido}>
        {trabajosActuales.length === 0 ? (
          <div className={styles.vacio}>
            <span className={styles.vacioIcono}>
              {tab === "enCurso" ? "🔧" : tab === "finalizados" ? "✅" : tab === "cancelados" ? "🚫" : "⚖️"}
            </span>
            <p className={styles.vacioTexto}>
              {tab === "enCurso"     ? "Sin trabajos en curso"     :
               tab === "finalizados" ? "Sin trabajos finalizados"  :
               tab === "cancelados"  ? "Sin trabajos cancelados"   :
               "Sin disputas activas"}
            </p>
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

                {/* EN CURSO — progreso solo si ya tiene avance */}
                {(trabajo.estado === "hoy" || trabajo.estado === "en-curso" || trabajo.estado === "enCurso") && trabajo.progreso > 0 && (
                  <div className={styles.progresoBloque}>
                    <div className={styles.progresoLabels}>
                      <span className={styles.progresoTexto}>
                        Avance de obra
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
      )}

      {/* ── TAB PRESUPUESTOS ── */}
      {tab === "presupuestos" && (
        <main className={styles.lista} style={{ paddingBottom: 80 }}>

          {/* Si hay un formulario abierto */}
          {formPpto ? (
            <div>
              {/* Header formulario */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <button onClick={() => setFormPpto(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--tp-marron-suave)", fontSize: 20 }}>←</button>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "var(--tp-marron)", margin: 0, fontFamily: "var(--fuente)" }}>Nuevo presupuesto</p>
                  <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0, fontFamily: "var(--fuente)" }}>{formPpto.cliente} · {formPpto.servicio}</p>
                </div>
              </div>

              {/* Formulario */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Monto */}
                <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--fuente)", display: "block", marginBottom: 6 }}>Monto total</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>$</span>
                    <input
                      type="number" placeholder="0"
                      value={datosPpto.monto}
                      onChange={e => setDatosPpto(p => ({ ...p, monto: e.target.value }))}
                      style={{ flex: 1, fontSize: 22, fontWeight: 800, color: "var(--tp-marron)", border: "none", background: "none", outline: "none", fontFamily: "var(--fuente)" }}
                    />
                  </div>
                </div>

                {/* Tiempo y garantía */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 12, border: "1px solid rgba(61,31,31,0.08)" }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--fuente)", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <Clock size={11} /> Tiempo est.
                    </label>
                    <input
                      type="text" placeholder="ej: 2-3 hs"
                      value={datosPpto.tiempoEstimado}
                      onChange={e => setDatosPpto(p => ({ ...p, tiempoEstimado: e.target.value }))}
                      style={{ width: "100%", fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", border: "none", background: "none", outline: "none", fontFamily: "var(--fuente)" }}
                    />
                  </div>
                  <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 12, border: "1px solid rgba(61,31,31,0.08)" }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--fuente)", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <Shield size={11} /> Garantía
                    </label>
                    <select
                      value={datosPpto.garantia}
                      onChange={e => setDatosPpto(p => ({ ...p, garantia: e.target.value }))}
                      style={{ width: "100%", fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", border: "none", background: "none", outline: "none", fontFamily: "var(--fuente)" }}
                    >
                      {["Sin garantía", "7", "15", "30", "60", "90"].map(d => (
                        <option key={d} value={d}>{d === "Sin garantía" ? d : `${d} días`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Materiales */}
                <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--fuente)", display: "block", marginBottom: 10 }}>Materiales</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[true, false].map(val => (
                      <button key={String(val)} type="button"
                        onClick={() => setDatosPpto(p => ({ ...p, incluyeMateriales: val }))}
                        style={{ flex: 1, padding: "8px 0", borderRadius: "var(--r-sm)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 13, fontWeight: 600,
                          background: datosPpto.incluyeMateriales === val ? "var(--tp-marron)" : "rgba(61,31,31,0.06)",
                          color: datosPpto.incluyeMateriales === val ? "var(--tp-crema)" : "var(--tp-marron-suave)",
                        }}>
                        {val ? "Incluidos" : "No incluidos"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qué incluye / no incluye */}
                <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--fuente)", display: "block", marginBottom: 6 }}>Descripción del trabajo</label>
                  <textarea
                    placeholder="Describí qué incluye el presupuesto, qué no incluye, condiciones..."
                    value={datosPpto.descripcion}
                    onChange={e => setDatosPpto(p => ({ ...p, descripcion: e.target.value }))}
                    rows={3}
                    style={{ width: "100%", fontSize: 13, color: "var(--tp-marron)", border: "none", background: "none", outline: "none", fontFamily: "var(--fuente)", resize: "none", lineHeight: 1.5 }}
                  />
                </div>

                {/* Validez */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", border: "1px solid rgba(61,31,31,0.08)" }}>
                  <span style={{ fontSize: 13, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>Válido por</span>
                  <select
                    value={datosPpto.validezDias}
                    onChange={e => setDatosPpto(p => ({ ...p, validezDias: e.target.value }))}
                    style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", border: "none", background: "none", fontFamily: "var(--fuente)" }}
                  >
                    {["3", "5", "7", "10", "15", "30"].map(d => (
                      <option key={d} value={d}>{d} días</option>
                    ))}
                  </select>
                </div>

                {/* Botón enviar */}
                <button type="button"
                  onClick={() => { setFormPpto(null); mostrarToast("✅ Presupuesto enviado a " + formPpto.cliente); }}
                  style={{ width: "100%", padding: 16, borderRadius: "var(--r-md)", background: "var(--tp-marron)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <Send size={16} /> Enviar presupuesto
                </button>

                <button type="button"
                  onClick={() => mostrarToast("Borrador guardado")}
                  style={{ width: "100%", padding: 12, borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron)", border: "1px solid rgba(61,31,31,0.15)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14, fontWeight: 600 }}
                >
                  Guardar como borrador
                </button>
              </div>
            </div>

          ) : (
            /* Lista de presupuestos */
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Botón nuevo presupuesto */}
              <button type="button"
                onClick={() => setFormPpto({ cliente: "Cliente nuevo", servicio: "Nuevo servicio", clienteId: null })}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--r-md)", background: "none", border: "2px dashed rgba(61,31,31,0.18)", cursor: "pointer", fontFamily: "var(--fuente)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--tp-marron-suave)", fontSize: 14, fontWeight: 600 }}
              >
                <Plus size={16} /> Nuevo presupuesto
              </button>

              {PRESUPUESTOS_MOCK.map(p => (
                <div key={p.id} style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-lg)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: p.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                      {p.inicial}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", margin: 0, fontFamily: "var(--fuente)" }}>{p.cliente}</p>
                      <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0, fontFamily: "var(--fuente)" }}>{p.servicio}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: "var(--r-full)", fontFamily: "var(--fuente)",
                      background: p.estado === "aceptado" ? "var(--verde-suave)" : "var(--amarillo-suave)",
                      color: p.estado === "aceptado" ? "var(--verde)" : "var(--amarillo)",
                    }}>
                      {p.estado === "aceptado" ? "✓ Aceptado" : "⏳ Pendiente"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                    <div style={{ textAlign: "center", padding: "6px 0", background: "rgba(61,31,31,0.04)", borderRadius: 8 }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "var(--tp-marron)", margin: 0, fontFamily: "var(--fuente)" }}>${p.monto.toLocaleString()}</p>
                      <p style={{ fontSize: 10, color: "var(--tp-marron-suave)", margin: 0, fontFamily: "var(--fuente)" }}>Monto</p>
                    </div>
                    <div style={{ textAlign: "center", padding: "6px 0", background: "rgba(61,31,31,0.04)", borderRadius: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0, fontFamily: "var(--fuente)" }}>{p.tiempoEstimado}</p>
                      <p style={{ fontSize: 10, color: "var(--tp-marron-suave)", margin: 0, fontFamily: "var(--fuente)" }}>Tiempo</p>
                    </div>
                    <div style={{ textAlign: "center", padding: "6px 0", background: "rgba(61,31,31,0.04)", borderRadius: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0, fontFamily: "var(--fuente)" }}>{p.garantia}d</p>
                      <p style={{ fontSize: 10, color: "var(--tp-marron-suave)", margin: 0, fontFamily: "var(--fuente)" }}>Garantía</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>
                      {p.fecha} · {p.incluyeMateriales ? "Con materiales" : "Sin materiales"}
                      {p.estado === "pendiente" && p.vence > 0 ? ` · Vence en ${p.vence}d` : ""}
                    </span>
                    {p.estado === "pendiente" && (
                      <button type="button"
                        onClick={() => setFormPpto(p)}
                        style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-rojo)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fuente)" }}
                      >
                        Editar →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}