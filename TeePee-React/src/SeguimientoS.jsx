import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./SeguimientoS.module.css";
import { IconoVolver } from "./Iconos";
import { MessageCircle, Send, FileText, Plus } from "lucide-react";
import { getTrabajoActivo, getUsuario } from "./MockData";

function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: 2 });
}
function fmtCom(n) {
  const num = Number(n);
  if (isNaN(num)) return "0,00";
  return num.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SeguimientoS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const trabajoData = getTrabajoActivo(searchParams.get("trabajoId") || 1);
  const usuData     = getUsuario(trabajoData.usuarioId);
  const t = { ...trabajoData, cliente: { nombre: usuData.nombre, inicial: usuData.inicial, color: usuData.color } };

  const [avanceActual,  setAvanceActual]  = useState(t.avanceReportado);
  const [avanceAprobado]                  = useState(t.avanceAprobado);
  const [enviando, setEnviando]           = useState(false);
  const [modalAjuste, setModalAjuste]     = useState(false);
  const [ajusteMonto, setAjusteMonto]     = useState("");
  const [ajusteDesc,  setAjusteDesc]      = useState("");
  const [ajustes, setAjustes]             = useState([]);
  const [toast, setToast]                 = useState(null);

  const COM = 0.06;
  const montoCobrado     = t.etapasPago.filter(e => e.estado === "cobrado" || e.estado === "pagado").reduce((s, e) => s + e.monto, 0);
  const montoBase        = t.monto + ajustes.filter(a => a.estado === "aprobado").reduce((s, a) => s + a.monto, 0);
  const montoAvancePend  = Math.round(((avanceActual - avanceAprobado) / 100) * montoBase);
  const montoPagadoPct   = Math.round((t.etapasPago.filter(e => e.estado === "pagado").reduce((s, e) => s + e.monto, 0) / montoBase) * 100);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  function enviarAvance() {
    setEnviando(true);
    setTimeout(() => { setEnviando(false); mostrarToast(`📤 Avance ${avanceActual}% enviado`); }, 800);
  }

  const btnEnviarBg = avanceActual === avanceAprobado ? "rgba(61,31,31,0.10)"
    : avanceActual === 100 ? "var(--verde)" : "var(--tp-rojo)";

  return (
    <div className={styles.pantalla}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitulo}>{t.titulo}</span>
          <p className={styles.headerSub}>Cliente: {t.cliente.nombre}</p>
        </div>
        <button className={styles.btnChat}
          onClick={() => navigate(`/chat-s?usuarioId=${t.usuarioId}&nombre=${encodeURIComponent(t.cliente.nombre)}&inicial=${t.cliente.inicial}&desde=seguimiento-s&trabajoId=${t.id}`)}>
          <MessageCircle size={18} color="var(--tp-marron)" />
        </button>
      </header>

      <div className={styles.contenido}>
        <div className={styles.separadorHeader} />

        {/* AVANCE */}
        <div className={styles.seccionHeader}>
          <p className={styles.secLabel}>📊 Avance de obra</p>
          <button className={styles.btnOrden}
            onClick={() => navigate(`/acuerdo-digital?trabajoId=${t.id}&modo=firmado&rol=solucionador`)}>
            <FileText size={13} /> Orden de trabajo
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.avanceHeaderRow}>
            <span className={styles.avanceTitulo}>Progreso reportado</span>
            <div className={styles.avancePctBloque}>
              <span className={styles.avancePct}>{avanceActual}%</span>
              {avanceActual > avanceAprobado && (
                <p className={styles.avanceCertifica}>Certifica ${fmt(montoAvancePend)}</p>
              )}
            </div>
          </div>

          {/* Barra doble */}
          <div className={styles.barraPrincipal}>
            <div className={styles.barraAprobado} style={{ width: `${avanceAprobado}%` }} />
            {avanceActual > avanceAprobado && (
              <div className={styles.barraPendiente}
                style={{ left: `${avanceAprobado}%`, width: `${avanceActual - avanceAprobado}%` }} />
            )}
          </div>

          <div className={styles.avanceLabels}>
            <span className={styles.avanceLabelAprobado}>✓ Aprobado: {avanceAprobado}%</span>
            <span className={styles.avanceLabelMax}>100%</span>
          </div>

          {/* Slider */}
          <div className={styles.sliderBloque}>
            <p className={styles.sliderLabel}>Actualizar avance</p>
            <input type="range" min={avanceAprobado} max={100} value={avanceActual}
              onChange={e => setAvanceActual(Number(e.target.value))}
              className={styles.slider} />
          </div>

          {/* Resumen certificado */}
          {avanceActual > avanceAprobado && (
            <div className={styles.certificadoBloque}>
              <div>
                <p className={styles.certificadoLabel}>Certificado de avance</p>
                <p className={styles.certificadoRango}>{avanceAprobado}% → {avanceActual}% · +{avanceActual - avanceAprobado}%</p>
              </div>
              <p className={styles.certificadoMonto}>${fmt(montoAvancePend)}</p>
            </div>
          )}

          <button type="button"
            disabled={enviando || avanceActual === avanceAprobado}
            onClick={avanceActual === 100 ? () => mostrarToast("¡Trabajo marcado como terminado!") : enviarAvance}
            className={styles.btnEnviarAvance}
            style={{ background: btnEnviarBg, color: avanceActual === avanceAprobado ? "var(--tp-marron-suave)" : "white" }}>
            <Send size={14} />
            {avanceActual === 100 ? "Marcar como terminado"
              : avanceActual === avanceAprobado ? "Sin cambios"
              : `Enviar avance ${avanceActual}% al cliente`}
          </button>
        </div>

        {/* AJUSTES */}
        <p className={styles.secLabel}>📝 Ajustes de monto</p>

        {ajustes.map((aj, idx) => (
          <div key={aj.id} className={`${styles.card} ${styles.ajusteCard}`}
            style={{ borderColor: aj.estado === "aprobado" ? "rgba(42,125,90,0.25)" : "rgba(245,200,66,0.35)" }}>
            <div className={styles.ajusteHeader}>
              <div>
                <p className={styles.ajusteNum}>Ajuste #{idx + 1}</p>
                <p className={styles.ajusteMonto}>+${fmt(aj.monto)}</p>
                <p className={styles.ajusteNeto}>Neto: ${fmtCom(aj.monto * 0.94)} · Comisión: ${fmtCom(aj.monto * 0.06)}</p>
              </div>
              <span className={`${styles.ajusteBadge} ${aj.estado === "aprobado" ? styles.ajusteBadgeAprobado : styles.ajusteBadgePendiente}`}>
                {aj.estado === "aprobado" ? "✓ Aprobado" : "⏳ Esperando"}
              </span>
            </div>
            <p className={styles.ajusteDesc}>{aj.descripcion}</p>
            <div className={styles.ajusteAvanceBloque}>
              <div className={styles.ajusteAvanceHeader}>
                <span className={styles.ajusteAvanceLabel}>Avance de este ajuste</span>
                <span className={styles.ajusteAvancePct}>{aj.avance}%</span>
              </div>
              <div className={styles.barraAjuste}>
                <div className={styles.barraAjusteRelleno}
                  style={{ width: `${aj.avance}%`, background: aj.estado === "aprobado" ? "var(--verde)" : "rgba(245,200,66,0.6)" }} />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className={styles.btnProponerAjuste}
          onClick={() => setModalAjuste(v => !v)}>
          <Plus size={14} /> {modalAjuste ? "Cancelar" : "Proponer ajuste de monto"}
        </button>

        {/* Panel inline de ajuste — se despliega debajo del botón */}
        {modalAjuste && (
          <div className={styles.ajustePanel}>
            <div className={styles.modalCard}>
              <p className={styles.modalCardLabel}>Incremento</p>
              <div className={styles.modalMontoRow}>
                <span className={styles.modalMontoPeso}>$</span>
                <input type="text" inputMode="decimal" placeholder="0" value={ajusteMonto}
                  onChange={e => setAjusteMonto(e.target.value.replace(/[^0-9.]/g, ""))}
                  className={styles.modalMontoInput} />
              </div>
              {ajusteMonto > 0 && (
                <div className={styles.modalDesglose}>
                  <div className={styles.modalDesgloseRow}>
                    <span className={styles.modalDesgloseLabel}>Tu cobro neto (94%)</span>
                    <span className={styles.modalDesgloseVal}>${fmtCom(Number(ajusteMonto) * 0.94)}</span>
                  </div>
                  <div className={styles.modalDesgloseRow}>
                    <span className={styles.modalDesgloseLabel}>Comisión TeePee (6%)</span>
                    <span className={styles.modalDesgloseLabel}>${fmtCom(Number(ajusteMonto) * 0.06)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalCard}>
              <p className={styles.modalCardLabel}>Descripción detallada</p>
              <textarea className={styles.modalTextarea}
                placeholder="Describí los trabajos o materiales adicionales..."
                value={ajusteDesc} onChange={e => setAjusteDesc(e.target.value)} rows={3} />
            </div>

            <button type="button" className={styles.modalBtnEnviar}
              onClick={() => {
                if (!ajusteMonto || !ajusteDesc.trim()) { mostrarToast("⚠️ Completá monto y descripción"); return; }
                setAjustes(prev => [...prev, { id: Date.now(), monto: Number(ajusteMonto), descripcion: ajusteDesc, estado: "pendiente", avance: avanceActual }]);
                setAjusteMonto(""); setAjusteDesc(""); setModalAjuste(false);
                mostrarToast("✅ Propuesta enviada al cliente");
              }}>
              Enviar propuesta al cliente
            </button>
          </div>
        )}

        {/* PAGOS */}
        <p className={styles.secLabel}>💳 Pagos</p>
        <div className={styles.card}>
          <div className={styles.pagosResumen}>
            <div>
              <p className={styles.pagosResumenLabel}>Monto total</p>
              <p className={styles.pagosResumenTotal}>${fmt(montoBase)}</p>
            </div>
            <div className={styles.pagosResumenDer}>
              <p className={styles.pagosResumenLabel}>Tu cobro neto (94%)</p>
              <p className={styles.pagosResumenNeto}>${fmtCom(montoBase * 0.94)}</p>
            </div>
          </div>
          <div className={styles.barraPagos}>
            <div className={styles.barraPagosRelleno} style={{ width: `${montoPagadoPct}%` }} />
          </div>
          {t.etapasPago.map(e => (
            <div key={e.id} className={styles.etapaRow}>
              <div className={styles.etapaInfo}>
                <p className={styles.etapaLabel}>{e.label}</p>
                <p className={styles.etapaMonto}>${fmt(e.monto)} · Neto: ${fmtCom(e.monto * 0.94)}</p>
              </div>
              <span className={`${styles.etapaBadge} ${e.estado === "pagado" ? styles.etapaBadgePagado : styles.etapaBadgeBloqueado}`}>
                {e.estado === "pagado" ? "Cobrado ✓" : e.estado === "habilitado" ? "⏳ Por cobrar" : "🔒 Bloqueado"}
              </span>
            </div>
          ))}
        </div>

        {/* Cancelar / disputar — solo si el trabajo no terminó */}
        {avanceAprobado < 100 && (
          <button type="button" className={styles.btnCancelar}
            onClick={() => navigate(`/cancelacion?trabajoId=${t.id}&desde=seguimiento-s`)}>
            Cancelar o disputar este trabajo
          </button>
        )}
      </div>

      {/* Calificar */}
      {avanceAprobado === 100 && montoCobrado >= montoBase && (
        <div className={styles.calificarBloque}>
          <button type="button" className={styles.btnCalificar}
            onClick={() => navigate(`/calificacion-s?usuNombre=${encodeURIComponent(t.cliente.nombre)}&usuInicial=${t.cliente.inicial}&usuColor=${encodeURIComponent(t.cliente.color)}&trabajoId=${t.id}`)}>
            ⭐ Calificar a {t.cliente.nombre}
          </button>
          <p className={styles.calificarDesc}>Trabajo completado y cobrado al 100% · La calificación se publicará cuando ambos se califiquen.</p>
        </div>
      )}

      {avanceAprobado === 100 && montoCobrado < montoBase && (
        <div className={styles.calificarBloque}>
          <div className={styles.avisoCobro}>
            <p className={styles.avisoCobroTitulo}>⏳ Trabajo terminado — cobro pendiente</p>
            <p className={styles.avisoCobroDesc}>Una vez que el cliente complete el pago podrás calificarlo.</p>
          </div>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}