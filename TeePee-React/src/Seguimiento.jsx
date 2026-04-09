import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import styles from "./Seguimiento.module.css";
import { IconoVolver } from "./Iconos";
import { MessageCircle, AlertCircle, FileText } from "lucide-react";
import { getTrabajoActivo, getSolucionador } from "./MockData";

function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: 2 });
}

export default function Seguimiento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const solNombre  = searchParams.get("solNombre");
  const solInicial = searchParams.get("solInicial");
  const solOficio  = searchParams.get("solOficio");
  const solColor   = searchParams.get("solColor");

  const trabajoData = getTrabajoActivo(searchParams.get("trabajoId") || 1);
  const solData     = getSolucionador(trabajoData.solucionadorId);
  const sol = {
    nombre:  solNombre ? decodeURIComponent(solNombre)  : solData.nombre,
    oficio:  solOficio ? decodeURIComponent(solOficio)  : solData.oficio,
    inicial: solInicial || solData.inicial,
    color:   solColor  ? decodeURIComponent(solColor)   : solData.color,
    nivel:   solData.nivel,
  };

  const [avanceAprobado, setAvanceAprobado] = useState(trabajoData.avanceAprobado);
  const [toast, setToast] = useState(null);

  const [ajustes, setAjustes] = useState([
    {
      id: 1, monto: 4500,
      descripcion: "Materiales adicionales: sellador especial y cañería de repuesto.",
      estado: "pendiente",
      avanceAprobado: 0,
      avancePropuesto: trabajoData.avanceReportado,
      etapasPago: [
        { id: "a1", label: "Pago del ajuste", monto: 4500, estado: "bloqueado" },
      ],
    },
  ]);

  const montoTotal   = trabajoData.monto + ajustes.filter(a => a.estado === "aceptado").reduce((s, a) => s + a.monto, 0);
  const montoPagado  = trabajoData.etapasPago.filter(e => e.estado === "pagado").reduce((s, e) => s + e.monto, 0);
  const saldoPct     = Math.round((montoPagado / montoTotal) * 100);

  function navPago(monto, concepto) {
    navigate(`/pago?monto=${monto}&concepto=${encodeURIComponent(concepto)}&solNombre=${encodeURIComponent(sol.nombre)}&solOficio=${encodeURIComponent(sol.oficio)}&solInicial=${sol.inicial}&solColor=${encodeURIComponent(sol.color)}&trabajoId=${trabajoData.id}&desde=seguimiento`);
  }
  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  // Helper: badge de etapa
  function EtapaBadge({ estado }) {
    if (estado === "habilitado") return null;
    return (
      <span className={`${styles.etapaBadge} ${estado === "pagado" ? styles.etapaBadgePagado : styles.etapaBadgeBloqueado}`}>
        {estado === "pagado" ? "Pagado ✓" : "🔒 Bloqueado"}
      </span>
    );
  }

  return (
    <div className={styles.pantalla}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitulo}>{trabajoData.titulo}</span>
          <p className={styles.headerSub}>{sol.nombre} · {sol.oficio}</p>
        </div>
        <button className={styles.btnChat}
          onClick={() => navigate(`/chat?solId=${trabajoData.solucionadorId}&nombre=${encodeURIComponent(sol.nombre)}&desde=seguimiento&trabajoId=${trabajoData.id}`)}>
          <MessageCircle size={18} color="var(--tp-marron)" />
        </button>
      </header>

      <div className={styles.contenido}>
        <div className={styles.separadorHeader} />

        {/* AVANCE DE OBRA */}
        <div className={styles.seccionHeader}>
          <p className={styles.secLabel}>📊 Avance de obra</p>
          <button className={styles.btnOrden}
            onClick={() => navigate(`/acuerdo-digital?trabajoId=${trabajoData.id}&modo=firmado`)}>
            <FileText size={13} /> Orden de trabajo
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.avanceHeaderRow}>
            <span className={styles.avanceTitulo}>Progreso del trabajo</span>
            <span className={styles.avancePct}>{trabajoData.avanceReportado}%</span>
          </div>

          {/* Barra doble */}
          <div className={styles.barraPrincipal}>
            <div className={styles.barraAprobado} style={{ width: `${avanceAprobado}%` }} />
            {trabajoData.avanceReportado > avanceAprobado && (
              <div className={styles.barraPendiente}
                style={{ left: `${avanceAprobado}%`, width: `${trabajoData.avanceReportado - avanceAprobado}%` }} />
            )}
          </div>

          <div className={styles.avanceLabels}>
            <span className={styles.avanceLabelAprobado}>✓ Aprobado: {avanceAprobado}%</span>
            {trabajoData.avanceReportado > avanceAprobado && (
              <span className={styles.avanceLabelPendiente}>⏳ Reportado: {trabajoData.avanceReportado}%</span>
            )}
          </div>

          {/* Alerta avance pendiente */}
          {trabajoData.avanceReportado > avanceAprobado && (
            <div className={styles.alertaAvance}>
              <div className={styles.alertaAvanceHeader}>
                <p className={styles.alertaAvanceTitulo}>
                  <AlertCircle size={14} /> {sol.nombre.split(" ")[0]} reportó {trabajoData.avanceReportado}%
                </p>
                <p className={styles.alertaAvanceMonto}>
                  ${fmt(Math.round(((trabajoData.avanceReportado - avanceAprobado) / 100) * montoTotal))}
                </p>
              </div>
              <p className={styles.alertaAvanceDesc}>
                Incremento {avanceAprobado}% → {trabajoData.avanceReportado}% · Al aprobar se habilitará el pago
              </p>
              <button type="button" className={styles.btnAprobarAvance}
                onClick={() => { setAvanceAprobado(trabajoData.avanceReportado); mostrarToast("✅ Avance aprobado"); }}>
                ✓ Aprobar avance
              </button>
            </div>
          )}
        </div>

        {/* AJUSTES */}
        {ajustes.length > 0 && (
          <>
            <p className={styles.secLabel}>📝 Ajustes de monto</p>
            {ajustes.map((aj, idx) => (
              <div key={aj.id}
                className={`${styles.card} ${styles.ajusteCard}`}
                style={{
                  borderColor: aj.estado === "aceptado" ? "rgba(42,125,90,0.25)"
                    : aj.estado === "rechazado" ? "rgba(61,31,31,0.12)"
                    : "rgba(245,200,66,0.40)"
                }}>
                <div className={styles.ajusteHeader}>
                  <div>
                    <p className={styles.ajusteNum}>Ajuste #{idx + 1}</p>
                    <p className={styles.ajusteMonto}>+${fmt(aj.monto)}</p>
                  </div>
                  <span className={`${styles.ajusteBadge} ${
                    aj.estado === "aceptado" ? styles.ajusteBadgeAceptado
                    : aj.estado === "rechazado" ? styles.ajusteBadgeRechazado
                    : styles.ajusteBadgePendiente
                  }`}>
                    {aj.estado === "aceptado" ? "✓ Aceptado" : aj.estado === "rechazado" ? "Rechazado" : "⏳ Pendiente"}
                  </span>
                </div>

                <p className={styles.ajusteDesc}>{aj.descripcion}</p>

                {aj.estado === "pendiente" && (
                  <div className={styles.ajusteBotones}>
                    <button type="button" className={styles.btnAceptarAjuste}
                      onClick={() => {
                        setAjustes(prev => prev.map(a => a.id === aj.id
                          ? { ...a, estado: "aceptado", etapasPago: [{ ...a.etapasPago[0], estado: "habilitado" }] }
                          : a));
                        mostrarToast("✅ Ajuste aceptado · Carlos fue notificado");
                      }}>
                      ✓ Aceptar
                    </button>
                    <button type="button" className={styles.btnRechazarAjuste}
                      onClick={() => setAjustes(prev => prev.map(a => a.id === aj.id ? { ...a, estado: "rechazado" } : a))}>
                      Rechazar
                    </button>
                  </div>
                )}

                {aj.estado === "aceptado" && (
                  <div className={styles.ajusteAvanceBloque}>
                    <div className={styles.ajusteAvanceHeader}>
                      <span className={styles.ajusteAvanceLabel}>Avance de este ajuste</span>
                      <span className={styles.ajusteAvancePct}>{aj.avancePropuesto}%</span>
                    </div>
                    <div className={styles.barraAjuste}>
                      <div className={styles.barraAjusteRelleno} style={{ width: `${aj.avancePropuesto}%` }} />
                    </div>
                    <p className={styles.ajusteAvanceNota}>Avance acordado en este ajuste</p>
                  </div>
                )}

                {aj.estado === "aceptado" && aj.etapasPago.map(ep => (
                  <div key={ep.id} className={styles.etapaRow}>
                    <div className={styles.etapaInfo}>
                      <p className={styles.etapaLabel}>{ep.label}</p>
                      <p className={styles.etapaMonto}>${fmt(ep.monto)}</p>
                    </div>
                    {ep.estado === "habilitado" ? (
                      <button type="button" className={styles.btnPagar} onClick={() => navPago(ep.monto, ep.label)}>
                        Pagar
                      </button>
                    ) : (
                      <EtapaBadge estado={ep.estado} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* PAGOS */}
        <p className={styles.secLabel}>💳 Pagos</p>
        <div className={styles.card}>
          <div className={styles.pagosResumen}>
            <div>
              <p className={styles.pagosResumenLabel}>Monto total</p>
              <p className={styles.pagosResumenTotal}>${fmt(montoTotal)}</p>
            </div>
            <div className={styles.pagosResumenDer}>
              <p className={styles.pagosResumenLabel}>Pagado</p>
              <p className={styles.pagosResumenPagado}>${fmt(montoPagado)}</p>
            </div>
          </div>

          <div className={styles.barraPagos}>
            <div className={styles.barraPagosRelleno} style={{ width: `${saldoPct}%` }} />
          </div>

          {trabajoData.etapasPago.map(e => (
            <div key={e.id} className={styles.etapaRow}>
              <div className={styles.etapaInfo}>
                <p className={styles.etapaLabel}>{e.label}</p>
                <p className={styles.etapaMonto}>${fmt(e.monto)}</p>
              </div>
              {e.estado === "habilitado" ? (
                <button type="button" className={styles.btnPagar} onClick={() => navPago(e.monto, e.label)}>
                  Pagar
                </button>
              ) : (
                <EtapaBadge estado={e.estado} />
              )}
            </div>
          ))}

          <div className={styles.saldoRow}>
            <span className={styles.saldoLabel}>Saldo pendiente</span>
            <span className={styles.saldoVal}>${fmt(montoTotal - montoPagado)}</span>
          </div>
        </div>

        {/* Calificación disponible */}
        {avanceAprobado === 100 && montoPagado >= montoTotal && (
          <div className={styles.calificarBloque}>
            <button type="button" className={styles.btnCalificar}
              onClick={() => navigate(`/calificacion?solNombre=${encodeURIComponent(sol.nombre)}&solOficio=${encodeURIComponent(sol.oficio)}`)}>
              ⭐ Calificar a {sol.nombre}
            </button>
            <p className={styles.calificarDesc}>Trabajo completado y pagado al 100%</p>
          </div>
        )}

        {/* Aviso pago pendiente */}
        {avanceAprobado === 100 && montoPagado < montoTotal && (
          <div className={styles.avisoPagoPendiente}>
            <p className={styles.avisoPagoPendienteTitulo}>⏳ Trabajo terminado — pago pendiente</p>
            <p className={styles.avisoPagoPendienteDesc}>Completá el pago para habilitar la calificación del solucionador.</p>
          </div>
        )}

        {/* Cancelar / disputar — solo si el trabajo no terminó */}
        {avanceAprobado < 100 && (
          <button type="button" className={styles.btnCancelar}
            onClick={() => navigate(`/cancelacion?trabajoId=${trabajoData.id}&desde=seguimiento`)}>
            Cancelar o disputar este trabajo
          </button>
        )}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferior />
    </div>
  );
}