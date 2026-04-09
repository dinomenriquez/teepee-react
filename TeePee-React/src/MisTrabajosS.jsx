import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./MisTrabajosS.module.css";
import { IconoVolver } from "./Iconos";
import {
  RefreshCw, CheckCircle, XCircle, AlertTriangle,
  FileText, Plus, Send, Clock, Shield, MessageCircle, Receipt, Star,
} from "lucide-react";

const TRABAJOS = {
  enCurso: [
    { id: 1, usuarioId: 1, titulo: "Tablero eléctrico",       cliente: "Laura Pérez",    inicial: "L", direccion: "Av. Mitre 1234, Posadas",       horario: "Hoy 09:00 – 12:00",    monto: "$35.200", etapa: 2, totalEtapas: 4, progreso: 50, estado: "enCurso" },
    { id: 2, usuarioId: 2, titulo: "Reparación canilla",      cliente: "Laura Pérez",    inicial: "L", direccion: "San Lorenzo 456, Posadas",       horario: "Hoy 14:00 – 16:00",    monto: "$12.000", etapa: 1, totalEtapas: 2, progreso: 25, estado: "enCurso" },
    { id: 3, usuarioId: 3, titulo: "Pintura living",          cliente: "Roberto Silva",  inicial: "R", direccion: "Junín 789, Posadas",             horario: "Mañana 08:00",          monto: "$48.000", etapa: 1, totalEtapas: 3, progreso: 20, estado: "en-curso" },
    { id: 4, usuarioId: 4, titulo: "Revisión instalación gas",cliente: "Mónica Ruiz",   inicial: "M", direccion: "Catamarca 890, Posadas",         horario: "Hoy 15:00 – 17:00 hs", monto: "$18.000", etapa: 0, totalEtapas: 1, progreso: 0,  estado: "enCurso" },
  ],
  finalizados: [
    { id: 4, usuarioId:1, titulo: "Instalación AA",       cliente: "Ana Gómez",    inicial: "A", direccion: "Córdoba 321, Posadas",   monto: "$65.000", fecha: "28 Feb", calificacion: 5, comentario: "Excelente trabajo, muy puntual.", estado: "finalizado", calificadoPorSolucionador: true,
      ordenId: "TP-2025-0401",
      comprobantes: [
        { id:"c1", label:"Anticipo 30%",  monto:"$19.500", fecha:"18 Feb" },
        { id:"c2", label:"Avance 40%",    monto:"$26.000", fecha:"24 Feb" },
        { id:"c3", label:"Cierre 30%",    monto:"$19.500", fecha:"28 Feb" },
      ],
    },
    { id: 5, usuarioId:2, titulo: "Cambio de cerradura", cliente: "Carlos Ruiz",  inicial: "C", direccion: "Belgrano 654, Posadas",  monto: "$8.500",  fecha: "15 Feb", calificacion: 4, comentario: "Buen trabajo, llegó un poco tarde.", estado: "finalizado", calificadoPorSolucionador: false,
      ordenId: "TP-2025-0389",
      comprobantes: [
        { id:"c1", label:"Pago total",    monto:"$8.500",  fecha:"15 Feb" },
      ],
    },
    { id: 6, usuarioId:3, titulo: "Reparación persiana", cliente: "Sofía Torres", inicial: "S", direccion: "Entre Ríos 111, Posadas", monto: "$9.000",  fecha: "2 Feb",  calificacion: null, comentario: null, estado: "finalizado", calificadoPorSolucionador: false,
      ordenId: "TP-2025-0371",
      comprobantes: [
        { id:"c1", label:"Pago total",    monto:"$9.000",  fecha:"2 Feb"  },
      ],
    },
  ],
  cancelados: [
    { id: 7, titulo: "Pintura exterior", cliente: "Diego Molina",    inicial: "D", direccion: "Av. Uruguay 222, Posadas", monto: "$22.000", fecha: "20 Ene", tarifaVisita: "$5.000",  motivoCancelacion: "El cliente tuvo un imprevisto", estado: "cancelado" },
    { id: 8, titulo: "Instalación gas",  cliente: "Héctor Giménez", inicial: "H", direccion: "Salta 333, Posadas",         monto: "$38.000", fecha: "5 Feb",  motivoDisputa: "El cliente dice que quedó mal", estadoDisputa: "En revisión", nroCaso: "#CASO-2024-0289", estado: "disputa" },
  ],
  disputas: [],
};

const TABS = [
  { id: "enCurso",      label: "En curso",      icono: <RefreshCw   size={14} /> },
  { id: "presupuestos", label: "Presupuestos",  icono: <FileText    size={14} />, destacada: true, ruta: "/presupuestos-s" },
  { id: "finalizados",  label: "Finalizados",   icono: <CheckCircle size={14} /> },
  { id: "cancelados",   label: "No finalizados",icono: <XCircle     size={14} /> },
];

const PRESUPUESTOS_MOCK = [
  { id: 1, clienteId: 1, cliente: "Laura Pérez",     inicial: "M", color: "#B84030", servicio: "Pérdida de agua en baño", estado: "pendiente", monto: 15000, tiempoEstimado: "2–3 hs", garantia: 30, incluyeMateriales: true,  vence: 2, fecha: "Hoy" },
  { id: 2, clienteId: 2, cliente: "Laura Sánchez",   inicial: "L", color: "#2A7D5A", servicio: "Instalación calefón",     estado: "pendiente", monto: 32000, tiempoEstimado: "3–4 hs", garantia: 15, incluyeMateriales: false, vence: 5, fecha: "Ayer" },
  { id: 3, clienteId: 3, cliente: "Diego Fernández", inicial: "D", color: "#8C6820", servicio: "Cambio de canilla",       estado: "aceptado",  monto: 8500,  tiempoEstimado: "1–2 hs", garantia: 30, incluyeMateriales: true,  vence: 0, fecha: "Hace 3 días" },
];

export default function MisTrabajosS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam      = searchParams.get("tab");
  const clienteParam  = searchParams.get("cliente");
  const servicioParam = searchParams.get("servicio");

  const [tab, setTab]         = useState(tabParam || "enCurso");
  const [formPpto, setFormPpto] = useState(null);

  useEffect(() => {
    if (tabParam === "presupuestos") {
      setTab("presupuestos");
      if (clienteParam) {
        setFormPpto({
          cliente:   decodeURIComponent(clienteParam),
          servicio:  decodeURIComponent(servicioParam || ""),
          clienteId: null,
        });
      }
    }
  }, [tabParam, clienteParam, servicioParam]);

  const [datosPpto, setDatosPpto] = useState({
    monto: "", tiempoEstimado: "", garantia: "30",
    incluyeMateriales: true, noIncluye: "", validezDias: "7", descripcion: "",
  });
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const trabajosActuales = TRABAJOS[tab] || [];

  return (
    <div className={styles.pantalla}>
      {/* Header */}
      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Mis Trabajos</span>
        </header>

        {/* Tabs */}
        <div className={styles.tabsNav}>
          {TABS.map(t => {
            const pptosPendientes = PRESUPUESTOS_MOCK.filter(p => p.estado === "pendiente").length;
            const count = t.id === "presupuestos" ? pptosPendientes : (TRABAJOS[t.id]?.length || 0);
            return (
              <button key={t.id} type="button"
                className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""} ${t.destacada && tab !== t.id ? styles.tabDestacada : ""}`}
                onClick={() => t.ruta ? navigate(t.ruta) : setTab(t.id)}>
                <span>{t.icono}</span>
                <span>{t.label}</span>
                {count > 0 && (
                  <span className={`${styles.tabBadge} ${tab === t.id ? styles.tabBadgeActivo : ""} ${t.destacada && tab !== t.id ? styles.tabBadgeDestacada : ""}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>{/* fin headerWrapper */}

      {/* Tab trabajos */}
      {tab !== "presupuestos" && (
        <main className={styles.contenido}>
          {trabajosActuales.length === 0 ? (
            <div className={styles.vacio}>
              <span className={styles.vacioIcono}>
                {tab === "enCurso" ? "🔧" : tab === "finalizados" ? "✅" : "🚫"}
              </span>
              <p className={styles.vacioTexto}>
                {tab === "enCurso"     ? "Sin trabajos en curso" :
                 tab === "finalizados" ? "Sin trabajos finalizados" :
                 "Sin cancelaciones ni disputas"}
              </p>
            </div>
          ) : (
            <div className={styles.lista}>
              {trabajosActuales.map(trabajo => (
                <div key={trabajo.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardAvatar}>{trabajo.inicial}</div>
                    <div className={styles.cardInfo}>
                      <span className={styles.cardTitulo}>{trabajo.titulo}</span>
                      <span className={styles.cardCliente}>👤 {trabajo.cliente}</span>
                      <span className={styles.cardDireccion}>📍 {trabajo.direccion}</span>
                      {trabajo.horario && <span className={styles.cardHorario}>🕐 {trabajo.horario}</span>}
                      {trabajo.fecha   && <span className={styles.cardFecha}>📅 {trabajo.fecha}</span>}
                    </div>
                    <span className={styles.cardMonto}>{trabajo.monto}</span>
                  </div>

                  {(trabajo.estado === "hoy" || trabajo.estado === "en-curso" || trabajo.estado === "enCurso") && trabajo.progreso > 0 && (
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

                  {trabajo.estado === "finalizado" && (
                    <div className={styles.calificacionBloque}>
                      {trabajo.calificacion ? (
                        <>
                          <div className={styles.calificacionFila}>
                            <span className={styles.calificacionLabel}>Calificación recibida:</span>
                            <span className={styles.calificacionEstrellas}>
                              {"⭐".repeat(trabajo.calificacion)}{"☆".repeat(5 - trabajo.calificacion)}
                            </span>
                          </div>
                          {trabajo.comentario && <p className={styles.calificacionComentario}>"{trabajo.comentario}"</p>}
                        </>
                      ) : (
                        <span className={styles.calificacionPendiente}>⏳ El cliente aún no calificó</span>
                      )}
                      {!trabajo.calificadoPorSolucionador && (
                        <span className={styles.calificacionPropia}>⏳ Aún no calificaste a este cliente</span>
                      )}
                    </div>
                  )}

                  {trabajo.estado === "cancelado" && (
                    <div className={styles.canceladoBloque}>
                      <div className={styles.canceladoFila}><span>Motivo</span><span>{trabajo.motivoCancelacion}</span></div>
                      <div className={styles.canceladoFila}><span>Tarifa visita cobrada</span><span className={styles.canceladoMonto}>{trabajo.tarifaVisita}</span></div>
                    </div>
                  )}

                  {trabajo.estado === "disputa" && (
                    <div className={styles.disputaBloque}>
                      <div className={styles.disputaFila}><span>Motivo</span><span>{trabajo.motivoDisputa}</span></div>
                      <div className={styles.disputaFila}><span>Caso</span><span className={styles.disputaNroCaso}>{trabajo.nroCaso}</span></div>
                      <div className={styles.disputaFila}><span>Estado</span><span className={styles.disputaEstado}>🔍 {trabajo.estadoDisputa}</span></div>
                    </div>
                  )}

                  <div className={styles.cardBotones}>
                    {(trabajo.estado === "hoy" || trabajo.estado === "en-curso" || trabajo.estado === "enCurso") && (
                      <>
                        <button type="button" className={styles.btnSecundario}
                          onClick={() => navigate(`/chat-s?usuarioId=${trabajo.usuarioId}&nombre=${encodeURIComponent(trabajo.cliente)}&inicial=${trabajo.inicial}&desde=trabajos-s`)}>
                          💬 Chat
                        </button>
                        <button type="button" className={styles.btnPrimario}
                          onClick={() => navigate(`/seguimiento-s?usuarioId=${trabajo.usuarioId}&trabajoId=${trabajo.id}`)}>
                          Ver trabajo →
                        </button>
                      </>
                    )}
                    {trabajo.estado === "finalizado" && (
                      <div className={styles.documentosBloque}>
                        <button type="button" className={styles.btnDocumento}
                          onClick={() => navigate(`/acuerdo-digital?trabajoId=${trabajo.id}&modo=firmado&rol=solucionador`)}>
                          <FileText size={15} className={styles.btnDocumentoIcono} />
                          <div className={styles.btnDocumentoInfo}>
                            <span className={styles.btnDocumentoLabel}>Orden de trabajo</span>
                            <span className={styles.btnDocumentoSub}>#{trabajo.ordenId}</span>
                          </div>
                          <span className={styles.btnDocumentoFlecha}>›</span>
                        </button>
                        {(trabajo.comprobantes || []).map(c => (
                          <button key={c.id} type="button" className={styles.btnDocumento}
                            onClick={() => mostrarToast(`Descargando: ${c.label}`)}>
                            <Receipt size={15} className={styles.btnDocumentoIcono} />
                            <div className={styles.btnDocumentoInfo}>
                              <span className={styles.btnDocumentoLabel}>{c.label}</span>
                              <span className={styles.btnDocumentoSub}>{c.monto} · {c.fecha}</span>
                            </div>
                            <span className={styles.btnDocumentoFlecha}>›</span>
                          </button>
                        ))}
                        {!trabajo.calificadoPorSolucionador && (
                          <button type="button" className={styles.btnDocumento}
                            onClick={() => navigate(`/calificacion-s?usuNombre=${encodeURIComponent(trabajo.cliente)}&usuInicial=${trabajo.inicial}`)}>
                            <Star size={15} className={`${styles.btnDocumentoIcono} ${styles.btnDocumentoIconoEstrella}`} />
                            <div className={styles.btnDocumentoInfo}>
                              <span className={styles.btnDocumentoLabel}>Calificar al cliente</span>
                              <span className={styles.btnDocumentoSub}>Calificación pendiente</span>
                            </div>
                            <span className={styles.btnDocumentoFlecha}>›</span>
                          </button>
                        )}
                      </div>
                    )}
                    {trabajo.estado === "cancelado" && (
                      <button type="button" className={styles.btnSecundario} onClick={() => mostrarToast("Abriendo detalle...")}>
                        Ver detalle
                      </button>
                    )}
                    {trabajo.estado === "disputa" && (
                      <button type="button" className={styles.btnDisputa} onClick={() => navigate("/cancelacion")}>
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

      {/* Tab presupuestos */}
      {tab === "presupuestos" && (
        <main className={styles.pptoMain}>

          {formPpto ? (
            /* ── FORMULARIO PRESUPUESTO ── */
            <div className={styles.pptoForm}>
              <div className={styles.pptoFormHeader}>
                <button className={styles.pptoFormVolver} onClick={() => setFormPpto(null)}>←</button>
                <div>
                  <p className={styles.pptoFormTitulo}>Nuevo presupuesto</p>
                  <p className={styles.pptoFormSubtitulo}>{formPpto.cliente} · {formPpto.servicio}</p>
                </div>
              </div>

              <div className={styles.pptoFormCampos}>
                {/* Monto */}
                <div className={styles.pptoBloque}>
                  <label className={styles.pptoBloqueLabel}>Monto total</label>
                  <div className={styles.pptoMontoRow}>
                    <span className={styles.pptoMontoPeso}>$</span>
                    <input type="number" placeholder="0" className={styles.pptoMontoInput}
                      value={datosPpto.monto}
                      onChange={e => setDatosPpto(p => ({ ...p, monto: e.target.value }))} />
                  </div>
                </div>

                {/* Tiempo y garantía */}
                <div className={styles.pptoGrid2}>
                  <div className={styles.pptoBloque}>
                    <label className={styles.pptoBloqueLabel}>
                      <Clock size={11} /> Tiempo est.
                    </label>
                    <input type="text" placeholder="ej: 2-3 hs" className={styles.pptoCampoInput}
                      value={datosPpto.tiempoEstimado}
                      onChange={e => setDatosPpto(p => ({ ...p, tiempoEstimado: e.target.value }))} />
                  </div>
                  <div className={styles.pptoBloque}>
                    <label className={styles.pptoBloqueLabel}>
                      <Shield size={11} /> Garantía
                    </label>
                    <select className={styles.pptoCampoInput}
                      value={datosPpto.garantia}
                      onChange={e => setDatosPpto(p => ({ ...p, garantia: e.target.value }))}>
                      {["Sin garantía","7","15","30","60","90"].map(d => (
                        <option key={d} value={d}>{d === "Sin garantía" ? d : `${d} días`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Materiales */}
                <div className={styles.pptoBloque}>
                  <label className={styles.pptoBloqueLabel}>Materiales</label>
                  <div className={styles.pptoMaterialesBtns}>
                    {[true, false].map(val => (
                      <button key={String(val)} type="button"
                        className={`${styles.pptoMaterialesBtn} ${datosPpto.incluyeMateriales === val ? styles.pptoMaterialesBtnActivo : ""}`}
                        onClick={() => setDatosPpto(p => ({ ...p, incluyeMateriales: val }))}>
                        {val ? "Incluidos" : "No incluidos"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div className={styles.pptoBloque}>
                  <label className={styles.pptoBloqueLabel}>Descripción del trabajo</label>
                  <textarea className={styles.pptoTextarea}
                    placeholder="Describí qué incluye el presupuesto, qué no incluye, condiciones..."
                    value={datosPpto.descripcion}
                    onChange={e => setDatosPpto(p => ({ ...p, descripcion: e.target.value }))}
                    rows={3} />
                </div>

                {/* Validez */}
                <div className={styles.pptoValidezRow}>
                  <span className={styles.pptoValidezLabel}>Válido por</span>
                  <select className={styles.pptoValidezSelect}
                    value={datosPpto.validezDias}
                    onChange={e => setDatosPpto(p => ({ ...p, validezDias: e.target.value }))}>
                    {["3","5","7","10","15","30"].map(d => (
                      <option key={d} value={d}>{d} días</option>
                    ))}
                  </select>
                </div>

                {/* Botones */}
                <button type="button" className={styles.pptoFormBtnEnviar}
                  onClick={() => { setFormPpto(null); mostrarToast("Presupuesto enviado a " + formPpto.cliente); }}>
                  <Send size={16} /> Enviar presupuesto
                </button>
                <button type="button" className={styles.pptoFormBtnBorrador}
                  onClick={() => mostrarToast("Borrador guardado")}>
                  Guardar como borrador
                </button>
              </div>
            </div>

          ) : (
            /* ── LISTA PRESUPUESTOS ── */
            <div className={styles.pptoLista}>
              <button type="button" className={styles.pptoNuevoBtn}
                onClick={() => setFormPpto({ cliente: "Cliente nuevo", servicio: "Nuevo servicio", clienteId: null })}>
                <Plus size={16} /> Nuevo presupuesto
              </button>

              {PRESUPUESTOS_MOCK.map(p => (
                <div key={p.id} className={styles.pptoCard}>
                  <div className={styles.pptoCardHeader}>
                    <div className={styles.pptoCardAvatar} style={{ background: p.color }}>{p.inicial}</div>
                    <div className={styles.pptoCardInfo}>
                      <p className={styles.pptoCardCliente}>{p.cliente}</p>
                      <p className={styles.pptoCardServicio}>{p.servicio}</p>
                    </div>
                    <span className={`${styles.pptoCardBadge} ${p.estado === "aceptado" ? styles.pptoCardBadgeAceptado : styles.pptoCardBadgePendiente}`}>
                      {p.estado === "aceptado" ? "✓ Aceptado" : "⏳ Pendiente"}
                    </span>
                  </div>

                  <div className={styles.pptoCardStats}>
                    <div className={styles.pptoStat}>
                      <p className={styles.pptoStatVal}>${p.monto.toLocaleString()}</p>
                      <p className={styles.pptoStatLabel}>Monto</p>
                    </div>
                    <div className={styles.pptoStat}>
                      <p className={styles.pptoStatVal}>{p.tiempoEstimado}</p>
                      <p className={styles.pptoStatLabel}>Tiempo</p>
                    </div>
                    <div className={styles.pptoStat}>
                      <p className={styles.pptoStatVal}>{p.garantia}d</p>
                      <p className={styles.pptoStatLabel}>Garantía</p>
                    </div>
                  </div>

                  <div className={styles.pptoCardFooter}>
                    <span className={styles.pptoCardMeta}>
                      {p.fecha} · {p.incluyeMateriales ? "Con materiales" : "Sin materiales"}
                      {p.estado === "pendiente" && p.vence > 0 ? ` · Vence en ${p.vence}d` : ""}
                    </span>
                    {p.estado === "pendiente" && (
                      <button type="button" className={styles.pptoCardEditarBtn} onClick={() => setFormPpto(p)}>
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