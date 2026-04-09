import { getTrabajosDeUsuario, getSolucionador } from './MockData';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferior from "./NavInferior";
import styles from "./MisTrabajosU.module.css";
import { IconoVolver } from "./Iconos";
import { RefreshCw, CheckCircle, XCircle, FileText, Receipt, Star, MessageCircle } from "lucide-react";

const TRABAJOS = {
  enCurso: [
    { id: 1, solucionadorId: 1, solucionador: "Carlos Mendoza", inicial: "C", nivel: "🥇", color: "#B84030", oficio: "Plomero", titulo: "Pérdida de agua en baño principal", descripcion: "Pérdida de agua en baño principal", fecha: "Hoy 09:00 – 12:00 hs", monto: "$22.000", estado: "en-curso", etapa: 2, totalEtapas: 3, progreso: 40 },
    { id: 2, solucionadorId: 2, solucionador: "Roberto Flores",  inicial: "R", nivel: "🥈", color: "#534AB7", oficio: "Plomero", titulo: "Instalación calefón",              descripcion: "Instalación calefón",              fecha: "Mié 10:00 – 13:00 hs", monto: "$32.000", estado: "en-curso", etapa: 1, totalEtapas: 1, progreso: 0 },
  ],
  finalizados: [
    { id: 3, solucionadorId: 3, solucionador: "Miguel Saracho", inicial: "M", nivel: "🥇", color: "#8C6820", oficio: "Plomero", titulo: "Cambio de canilla cocina", descripcion: "Cambio de canilla cocina", fecha: "15/03/2025", monto: "$8.500", estado: "finalizado", etapa: 1, totalEtapas: 1, progreso: 100, calificacion: 5, calificadoPorUsuario: true, calificacionProfesional: 5,
      ordenId: "TP-2025-0312",
      comprobantes: [
        { id: "c1", label: "Anticipo 50%", monto: "$4.250", fecha: "10/03/2025" },
        { id: "c2", label: "Saldo final",  monto: "$4.250", fecha: "15/03/2025" },
      ],
    },
  ],
  cancelados: [
    { id: 4, solucionadorId: 2, solucionador: "Roberto Flores", inicial: "R", nivel: "🥈", color: "#534AB7", oficio: "Plomero", titulo: "Reparación canilla exterior",  descripcion: "Reparación canilla exterior",  fecha: "10/03/2025", monto: "$6.000",  estado: "cancelado", etapa: 1, totalEtapas: 1, progreso: 0,  motivoCancelacion: "El solucionador no pudo asistir", montoDevuelto: "$0 (sin anticipo)" },
    { id: 5, solucionadorId: 3, solucionador: "Miguel Saracho", inicial: "M", nivel: "🥇", color: "#8C6820", oficio: "Plomero", titulo: "Destapación cañería cocina", descripcion: "Destapación cañería cocina", fecha: "05/03/2025", monto: "$12.000", estado: "disputa",   etapa: 1, totalEtapas: 2, progreso: 50, motivoDisputa: "El problema volvió a aparecer al día siguiente", estadoDisputa: "En revisión" },
  ],
  disputas: [],
};

const TABS = [
  { id: "enCurso",     label: "En curso",         icono: <RefreshCw   size={14} /> },
  { id: "finalizados", label: "Finalizados",       icono: <CheckCircle size={14} /> },
  { id: "cancelados",  label: "No finalizados",    icono: <XCircle     size={14} /> },
];

export default function MisTrabajosU() {
  const navigate = useNavigate();
  const [tab, setTab]     = useState("enCurso");
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const trabajosActuales = TRABAJOS[tab];

  return (
    <div className={styles.pantalla}>
      {/* Wrapper fijo — header + tabs juntos */}
      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Mis Trabajos</span>
        </header>

        <div className={styles.tabsNav}>
          {TABS.map(t => (
            <button key={t.id} type="button"
              className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""}`}
              onClick={() => setTab(t.id)}>
              <span>{t.icono}</span>
              <span>{t.label}</span>
              {TRABAJOS[t.id].length > 0 && (
                <span className={`${styles.tabBadge} ${tab === t.id ? styles.tabBadgeActivo : ""}`}>
                  {TRABAJOS[t.id].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

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
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardAvatar} style={{ background: trabajo.color }}>
                    {trabajo.inicial}
                    <span className={styles.cardNivel}>{trabajo.nivel}</span>
                  </div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardTitulo}>{trabajo.titulo}</span>
                    <span className={styles.cardSolucionador}>{trabajo.solucionador} · {trabajo.oficio}</span>
                    <span className={styles.cardFecha}>📅 {trabajo.fecha}</span>
                  </div>
                  <span className={styles.cardMonto}>{trabajo.monto}</span>
                </div>

                {/* Progreso */}
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

                {/* Calificación */}
                {trabajo.estado === "finalizado" && (
                  <div className={styles.calificacionBloque}>
                    {trabajo.calificacion ? (
                      <div className={styles.calificacionDada}>
                        <span className={styles.calificacionLabel}>Tu calificación:</span>
                        <span className={styles.calificacionEstrellas}>
                          {"⭐".repeat(trabajo.calificacion)}{"☆".repeat(5 - trabajo.calificacion)}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.calificacionPendiente}>
                        <span>⏳ Calificación pendiente</span>
                      </div>
                    )}
                    {!trabajo.calificacionProfesional ? (
                      <span className={styles.calificacionPropia}>⏳ El profesional aún no te calificó</span>
                    ) : (
                      <span className={styles.calificacionPropiaOk}>✓ El profesional ya te calificó</span>
                    )}
                  </div>
                )}

                {/* Cancelado */}
                {trabajo.estado === "cancelado" && (
                  <div className={styles.canceladoBloque}>
                    <div className={styles.canceladoFila}><span>Motivo</span><span>{trabajo.motivoCancelacion}</span></div>
                    <div className={styles.canceladoFila}><span>Devuelto</span><span className={styles.canceladoDevolucion}>{trabajo.montoDevuelto}</span></div>
                  </div>
                )}

                {/* Disputa */}
                {trabajo.estado === "disputa" && (
                  <div className={styles.disputaBloque}>
                    <div className={styles.disputaFila}><span>Motivo</span><span>{trabajo.motivoDisputa}</span></div>
                    <div className={styles.disputaFila}><span>Caso</span><span className={styles.disputaNroCaso}>{trabajo.nroCaso}</span></div>
                    <div className={styles.disputaFila}><span>Estado</span><span className={styles.disputaEstado}>🔍 {trabajo.estadoDisputa}</span></div>
                  </div>
                )}

                {/* Botones */}
                <div className={styles.cardBotones}>
                  {trabajo.estado === "en-curso" && (
                    <>
                      <button type="button" className={styles.btnSecundario}
                        onClick={() => navigate(`/chat?solId=${trabajo.solucionadorId}&nombre=${encodeURIComponent(trabajo.solucionador)}&inicial=${trabajo.inicial}&oficio=${encodeURIComponent(trabajo.oficio)}&desde=mis-trabajos`)}>
                        💬 Chat
                      </button>
                      <button type="button" className={styles.btnPrimario}
                        onClick={() => navigate(`/seguimiento?trabajoId=${trabajo.id}&solNombre=${encodeURIComponent(trabajo.solucionador)}&solInicial=${trabajo.inicial}&solOficio=${encodeURIComponent(trabajo.oficio)}&solColor=${encodeURIComponent(trabajo.color)}`)}>
                        Ver seguimiento →
                      </button>
                    </>
                  )}
                  {trabajo.estado === "finalizado" && (
                    <div className={styles.documentosBloque}>
                      {/* Orden de trabajo */}
                      <button type="button" className={styles.btnDocumento}
                        onClick={() => navigate(`/acuerdo-digital?trabajoId=${trabajo.id}&modo=firmado`)}>
                        <FileText size={15} className={styles.btnDocumentoIcono} />
                        <div className={styles.btnDocumentoInfo}>
                          <span className={styles.btnDocumentoLabel}>Orden de trabajo</span>
                          <span className={styles.btnDocumentoSub}>#{trabajo.ordenId || "TP-2025-0312"}</span>
                        </div>
                        <span className={styles.btnDocumentoFlecha}>›</span>
                      </button>
                      {/* Comprobantes por etapa */}
                      {(trabajo.comprobantes || [{ id: "c1", label: "Comprobante de pago", monto: trabajo.monto, fecha: trabajo.fecha }]).map(c => (
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
                      {/* Calificar si pendiente */}
                      {!trabajo.calificacion && (
                        <button type="button" className={styles.btnDocumento}
                          onClick={() => navigate("/calificacion")}>
                          <Star size={15} className={`${styles.btnDocumentoIcono} ${styles.btnDocumentoIconoEstrella}`} />
                          <div className={styles.btnDocumentoInfo}>
                            <span className={styles.btnDocumentoLabel}>Calificar al profesional</span>
                            <span className={styles.btnDocumentoSub}>Calificación pendiente</span>
                          </div>
                          <span className={styles.btnDocumentoFlecha}>›</span>
                        </button>
                      )}
                    </div>
                  )}
                  {trabajo.estado === "cancelado" && (
                    <button type="button" className={styles.btnSecundario} onClick={() => navigate("/seguimiento")}>
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

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferior />
    </div>
  );
}