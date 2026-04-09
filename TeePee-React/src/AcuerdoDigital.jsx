import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AcuerdoDigital.module.css";
import { IconoVolver } from "./Iconos";
import { CheckCircle, ChevronDown, ChevronUp, FileText, Download, AlertCircle, Lock } from "lucide-react";
import { getTrabajoActivo, getSolucionador, getUsuario } from "./MockData";
import NavInferior from "./NavInferior";
import NavInferiorS from "./NavInferiorS";

export default function AcuerdoDigital() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trabajoId = searchParams.get("trabajoId") || 1;
  const modoFirmado = searchParams.get("modo") === "firmado";
  const esSolucionador = searchParams.get("rol") === "solucionador";

  const trabajoData = getTrabajoActivo(trabajoId);
  const solData     = getSolucionador(trabajoData.solucionadorId);
  const usuData     = getUsuario(trabajoData.usuarioId);

  const a = {
    id:       trabajoData.ordenId,
    fecha:    new Date().toLocaleDateString("es-AR"),
    solucionador: { nombre: solData.nombre, oficio: solData.oficio, nivel: solData.nivel, reputacion: solData.reputacion, inicial: solData.inicial, color: solData.color },
    usuario:  { nombre: usuData.nombre, inicial: usuData.inicial },
    trabajo:  { descripcion: trabajoData.titulo, detalle: trabajoData.descripcion, categoria: trabajoData.categoria, direccion: trabajoData.direccion, fechaEstimada: trabajoData.fechaEstimada },
    monto:             trabajoData.monto,
    formaCobro:        trabajoData.formaCobro,
    etapas:            trabajoData.etapasPago,
    garantia:          trabajoData.garantia,
    incluyeMateriales: trabajoData.incluyeMateriales,
    comisionApp:       trabajoData.comisionApp,
  };

  const ajustesAprobados = modoFirmado ? [
    {
      id: 1,
      monto: 4500,
      descripcion: "Materiales adicionales: sellador especial y cañería de repuesto no contemplada en el presupuesto original.",
      fecha: "29/03/2025 10:34",
      avance: 60,
    },
  ] : [];
  const montoTotal = a.monto + ajustesAprobados.reduce((s, aj) => s + aj.monto, 0);

  const [firmado,     setFirmado]     = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [expandido,   setExpandido]   = useState(null);
  const [toast,       setToast]       = useState(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  function handleFirmar() { setConfirmando(true); setTimeout(() => { setFirmado(true); setConfirmando(false); }, 1200); }

  // ── POST-FIRMA ──────────────────────────────────────────
  if (firmado) {
    return (
      <div className={styles.pantallaFirmado}>
        <div className={styles.firmadoContenido}>
          <div className={styles.firmadoEmoji}>✅</div>
          <h1 className={styles.firmadoTitulo}>¡Acuerdo firmado!</h1>
          <p className={styles.firmadoOrden}>
            Orden <strong className={styles.firmadoOrdenStrong}>{a.id}</strong> generada.
          </p>
          <p className={styles.firmadoSubtitulo}>{a.solucionador.nombre} fue notificado. El trabajo está activo.</p>

          {a.formaCobro === "etapas" && a.etapas[0] && (
            <div className={styles.firmadoBox}>
              <p className={styles.firmadoBoxLabel}>Próximo paso</p>
              <p className={styles.firmadoBoxMonto}>Abonar anticipo: ${a.etapas[0].monto.toLocaleString("es-AR")}</p>
              <p className={styles.firmadoBoxTrigger}>{a.etapas[0].trigger}</p>
            </div>
          )}
          {a.formaCobro === "total" && (
            <div className={styles.firmadoBox}>
              <p className={styles.firmadoBoxLabel}>Forma de cobro</p>
              <p className={styles.firmadoBoxTexto}>Pago 100% al finalizar el trabajo</p>
            </div>
          )}

          <button type="button" className={styles.btnPrimario} onClick={() => navigate(`/seguimiento?trabajoId=${trabajoId}`)}>
            Ir al seguimiento →
          </button>
          <button type="button" className={styles.btnSecundarioFirmado} onClick={() => navigate("/home")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── PANTALLA PRINCIPAL ──────────────────────────────────
  return (
    <div className={styles.pantalla}>

      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>
          Orden de Trabajo
          {modoFirmado && <span className={styles.badgeFirmado}>✓ FIRMADO</span>}
        </span>
        <button type="button" className={styles.btnPdf} onClick={() => mostrarToast("PDF disponible en la app móvil")}>
          <Download size={13} /> PDF
        </button>
      </header>

      <div className={styles.contenido}>

        {/* Partes */}
        <div className={styles.card}>
          <div className={styles.partesRow}>
            <div className={styles.parteCol}>
              <p className={styles.label}>Solucionador</p>
              <div className={styles.solRow}>
                <div className={styles.solAvatar} style={{ background: a.solucionador.color }}>
                  {a.solucionador.inicial}
                </div>
                <div>
                  <p className={styles.solNombre}>{a.solucionador.nombre}</p>
                  <p className={styles.solInfo}>{a.solucionador.oficio} · ⭐ {a.solucionador.reputacion} · {a.solucionador.nivel}</p>
                </div>
              </div>
            </div>
            <div className={styles.parteDivider} />
            <div className={styles.parteCol}>
              <p className={styles.label}>Cliente</p>
              <p className={styles.clienteNombre}>{a.usuario.nombre}</p>
              <p className={styles.clienteGarantia}>🛡️ Garantía: {a.garantia} días</p>
            </div>
          </div>
        </div>

        {/* Tarea */}
        <div className={styles.card}>
          <p className={styles.label}>Tarea a realizar</p>
          <p className={styles.tareaDescripcion}>{a.trabajo.descripcion}</p>
          <p className={styles.tareaDetalle}>{a.trabajo.detalle}</p>
          <div className={styles.tareaInfoCol}>
            <div className={styles.tareaInfoRow}>
              <span className={styles.tareaIcon}>📍</span>
              <span className={styles.tareaInfoText}>{a.trabajo.direccion}</span>
            </div>
            <div className={styles.tareaInfoRow}>
              <span className={styles.tareaIcon}>🗓️</span>
              <span className={styles.tareaInfoText}>{a.trabajo.fechaEstimada}</span>
            </div>
            <div className={styles.tareaInfoRow}>
              <span className={styles.tareaIcon}>🔧</span>
              <span className={styles.tareaInfoText}>Materiales {a.incluyeMateriales ? "incluidos" : "no incluidos"}</span>
            </div>
          </div>
        </div>

        {/* Monto */}
        <div className={styles.cardMonto}>
          <p className={styles.labelClaro}>Monto total acordado</p>
          <p className={styles.montoTotal}>${montoTotal.toLocaleString("es-AR")}</p>
          {ajustesAprobados.length > 0 && (
            <p className={styles.montoDetalle}>
              ${a.monto.toLocaleString("es-AR")} original + {ajustesAprobados.length} ajuste{ajustesAprobados.length > 1 ? "s" : ""} aprobado{ajustesAprobados.length > 1 ? "s" : ""}
            </p>
          )}
          <p className={styles.montoFormaCobro}>
            {a.formaCobro === "total" ? "Pago único al finalizar" : `En ${a.etapas.length} etapas según avance`}
          </p>
        </div>

        {/* Forma de cobro */}
        <div className={styles.card}>
          <p className={styles.label}>Forma de cobro</p>
          {a.formaCobro === "total" ? (
            <div className={styles.cobroTotal}>
              <CheckCircle size={18} className={styles.cobroTotalIcon} />
              <div>
                <p className={styles.cobroTotalTitulo}>Pago 100% al terminar</p>
                <p className={styles.cobroTotalSub}>Se habilita cuando confirmás que el trabajo está terminado</p>
              </div>
            </div>
          ) : (
            <div className={styles.etapasList}>
              {a.etapas.map((e, i) => (
                <div key={e.id} className={i === 0 ? styles.etapaItemActiva : styles.etapaItem}>
                  <button
                    type="button"
                    className={i === 0 ? styles.etapaBtnActiva : styles.etapaBtn}
                    onClick={() => setExpandido(expandido === i ? null : i)}
                  >
                    <div className={i === 0 ? styles.etapaPctActivo : styles.etapaPct}>
                      {e.pct}%
                    </div>
                    <div className={styles.etapaInfo}>
                      <p className={styles.etapaLabel}>{e.label}</p>
                      <p className={i === 0 ? styles.etapaMontoActivo : styles.etapaMonto}>
                        ${e.monto.toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div className={styles.etapaActions}>
                      {i === 0
                        ? <span className={styles.etapaBadge}>Primer pago</span>
                        : <Lock size={13} color="var(--tp-marron-suave)" />
                      }
                      {expandido === i
                        ? <ChevronUp size={14} color="var(--tp-marron-suave)" />
                        : <ChevronDown size={14} color="var(--tp-marron-suave)" />
                      }
                    </div>
                  </button>
                  {expandido === i && (
                    <div className={styles.etapaExpandido}>
                      <p className={styles.etapaTrigger}>
                        <AlertCircle size={11} /> Se habilita: {e.trigger}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div className={styles.etapasTotales}>
                <span className={styles.etapasTotalesLabel}>Total en {a.etapas.length} pagos</span>
                <span className={styles.etapasTotalesMonto}>${a.monto.toLocaleString("es-AR")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Ajustes aprobados */}
        {ajustesAprobados.length > 0 && (
          <div className={styles.card}>
            <p className={styles.label}>Ajustes de monto aprobados</p>
            {ajustesAprobados.map((aj, i) => (
              <div
                key={aj.id}
                className={styles.ajusteItem}
                style={{ marginBottom: i < ajustesAprobados.length - 1 ? 8 : 0 }}
              >
                <div className={styles.ajusteRow}>
                  <span className={styles.ajusteMonto}>+${aj.monto.toLocaleString("es-AR")}</span>
                  <span className={styles.ajusteMeta}>{aj.fecha} · Avance {aj.avance}%</span>
                </div>
                <p className={styles.ajusteDesc}>{aj.descripcion}</p>
                <span className={styles.ajusteAceptado}>✓ Aceptado por el cliente</span>
              </div>
            ))}
          </div>
        )}

        {/* Aviso legal */}
        <div className={styles.avisoLegal}>
          <p className={styles.avisoTexto}>
            Habiendo aceptado los{" "}
            <span className={styles.avisoLink}>términos y condiciones</span>{" "}
            de TeePee, este documento tiene validez como acuerdo digital entre las partes.
          </p>
        </div>

        {/* Botones — ocultos en modo firmado */}
        {!modoFirmado && (
          <>
            <button
              type="button"
              onClick={handleFirmar}
              disabled={confirmando}
              className={confirmando ? styles.btnFirmarDisabled : styles.btnFirmar}
            >
              {confirmando ? <>⏳ Procesando...</> : <><FileText size={18} /> Confirmar y firmar acuerdo</>}
            </button>
            <button type="button" className={styles.btnNegociar} onClick={() => navigate(-1)}>
              Volver a negociar
            </button>
          </>
        )}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
      {esSolucionador ? <NavInferiorS /> : <NavInferior />}
    </div>
  );
}