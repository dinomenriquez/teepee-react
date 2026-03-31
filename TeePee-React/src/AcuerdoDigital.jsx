import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IconoVolver } from "./Iconos";
import { CheckCircle, ChevronDown, ChevronUp, FileText, Download, AlertCircle, Lock } from "lucide-react";
import { getTrabajoActivo, getSolucionador, getUsuario } from "./MockData";

const sCard = { background: "var(--tp-crema-clara)", borderRadius: "var(--r-lg)", padding: 16, border: "1px solid rgba(61,31,31,0.08)", marginBottom: 12 };
const sLabel = { fontSize: 10, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 6px", fontFamily: "var(--fuente)" };
const sToast = { position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "var(--tp-marron)", color: "var(--tp-crema)", padding: "10px 20px", borderRadius: "var(--r-full)", fontSize: 13, fontWeight: 600, zIndex: 200, whiteSpace: "nowrap", fontFamily: "var(--fuente)" };

export default function AcuerdoDigital() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trabajoId = searchParams.get("trabajoId") || 1;

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

  const [firmado,     setFirmado]     = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [expandido,   setExpandido]   = useState(null);
  const [toast,       setToast]       = useState(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  function handleFirmar() { setConfirmando(true); setTimeout(() => { setFirmado(true); setConfirmando(false); }, 1200); }

  // ── POST-FIRMA ──────────────────────────────────────────
  if (firmado) {
    return (
      <div style={{ background: "var(--tp-marron)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--fuente)" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--tp-crema)", margin: "0 0 8px" }}>¡Acuerdo firmado!</h1>
          <p style={{ fontSize: 14, color: "rgba(240,234,214,0.70)", margin: "0 0 4px", lineHeight: 1.6 }}>Orden <strong style={{ color: "var(--tp-crema)" }}>{a.id}</strong> generada.</p>
          <p style={{ fontSize: 13, color: "rgba(240,234,214,0.55)", margin: "0 0 28px", lineHeight: 1.6 }}>{a.solucionador.nombre} fue notificado. El trabajo está activo.</p>
          {a.formaCobro === "etapas" && a.etapas[0] && (
            <div style={{ background: "rgba(240,234,214,0.08)", borderRadius: "var(--r-md)", padding: 14, marginBottom: 24, border: "1px solid rgba(240,234,214,0.12)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(240,234,214,0.50)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Próximo paso</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: "var(--tp-crema)", margin: "0 0 3px" }}>Abonar anticipo: ${a.etapas[0].monto.toLocaleString("es-AR")}</p>
              <p style={{ fontSize: 11, color: "rgba(240,234,214,0.45)", margin: 0 }}>{a.etapas[0].trigger}</p>
            </div>
          )}
          {a.formaCobro === "total" && (
            <div style={{ background: "rgba(240,234,214,0.08)", borderRadius: "var(--r-md)", padding: 14, marginBottom: 24, border: "1px solid rgba(240,234,214,0.12)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(240,234,214,0.50)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Forma de cobro</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-crema)", margin: 0 }}>Pago 100% al finalizar el trabajo</p>
            </div>
          )}
          <button type="button" onClick={() => navigate(`/seguimiento?trabajoId=${trabajoId}`)}
            style={{ width: "100%", padding: 16, borderRadius: "var(--r-md)", background: "var(--tp-rojo)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 700, marginBottom: 10 }}>
            Ir al seguimiento →
          </button>
          <button type="button" onClick={() => navigate("/home")}
            style={{ width: "100%", padding: 13, borderRadius: "var(--r-md)", background: "none", color: "rgba(240,234,214,0.45)", border: "1px solid rgba(240,234,214,0.12)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14 }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── PANTALLA PRINCIPAL ──────────────────────────────────
  return (
    <div style={{ background: "var(--tp-crema)", minHeight: "100vh", fontFamily: "var(--fuente)", paddingBottom: 90 }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}><IconoVolver size={20} /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 15, fontWeight: 900, color: "var(--tp-marron)", margin: 0 }}>Orden de Trabajo</h1>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>{a.id} · {a.fecha}</p>
        </div>
        <button type="button" onClick={() => mostrarToast("PDF disponible en la app móvil")}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: "var(--r-full)", border: "1px solid rgba(61,31,31,0.15)", background: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 11, fontWeight: 600, color: "var(--tp-marron-suave)" }}>
          <Download size={13} /> PDF
        </button>
      </header>

      <div style={{ padding: "16px 16px 0" }}>

        {/* Partes */}
        <div style={{ ...sCard, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={sLabel}>Solucionador</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: a.solucionador.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0 }}>{a.solucionador.inicial}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "var(--tp-marron)", margin: "0 0 1px" }}>{a.solucionador.nombre}</p>
                <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>{a.solucionador.oficio} · ⭐ {a.solucionador.reputacion} · {a.solucionador.nivel}</p>
              </div>
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(61,31,31,0.10)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={sLabel}>Cliente</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 2px" }}>{a.usuario.nombre}</p>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>🛡️ Garantía: {a.garantia} días</p>
          </div>
        </div>

        {/* Tarea */}
        <div style={sCard}>
          <p style={sLabel}>Tarea a realizar</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 6px" }}>{a.trabajo.descripcion}</p>
          <p style={{ fontSize: 13, color: "var(--tp-marron-suave)", margin: "0 0 12px", lineHeight: 1.6 }}>{a.trabajo.detalle}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>📍</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)", lineHeight: 1.5 }}>{a.trabajo.direccion}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 14 }}>🗓️</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>{a.trabajo.fechaEstimada}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 14 }}>🔧</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>Materiales {a.incluyeMateriales ? "incluidos" : "no incluidos"}</span>
            </div>
          </div>
        </div>

        {/* Monto */}
        <div style={{ ...sCard, background: "var(--tp-marron)" }}>
          <p style={{ ...sLabel, color: "rgba(240,234,214,0.50)" }}>Monto total acordado</p>
          <p style={{ fontSize: 38, fontWeight: 900, color: "var(--tp-crema)", margin: "0 0 4px", letterSpacing: "-1px" }}>${a.monto.toLocaleString("es-AR")}</p>
          <p style={{ fontSize: 11, color: "rgba(240,234,214,0.45)", margin: 0 }}>
            {a.formaCobro === "total" ? "Pago único al finalizar" : `En ${a.etapas.length} etapas según avance`}
          </p>
        </div>

        {/* Forma de cobro */}
        <div style={sCard}>
          <p style={sLabel}>Forma de cobro</p>
          {a.formaCobro === "total" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: "var(--r-md)", background: "rgba(42,125,90,0.08)", border: "1px solid rgba(42,125,90,0.15)" }}>
              <CheckCircle size={18} style={{ color: "var(--verde)", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 2px" }}>Pago 100% al terminar</p>
                <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>Se habilita cuando confirmás que el trabajo está terminado</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {a.etapas.map((e, i) => (
                <div key={e.id} style={{ borderRadius: "var(--r-md)", overflow: "hidden", border: `1px solid ${i === 0 ? "rgba(184,64,48,0.25)" : "rgba(61,31,31,0.08)"}` }}>
                  <button type="button" onClick={() => setExpandido(expandido === i ? null : i)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", textAlign: "left", background: i === 0 ? "rgba(184,64,48,0.05)" : "rgba(61,31,31,0.02)" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, background: i === 0 ? "var(--tp-rojo)" : "rgba(61,31,31,0.08)", color: i === 0 ? "white" : "var(--tp-marron-suave)" }}>
                      {e.pct}%
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 2px" }}>{e.label}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? "var(--tp-rojo)" : "var(--tp-marron-suave)", margin: 0 }}>${e.monto.toLocaleString("es-AR")}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {i === 0
                        ? <span style={{ fontSize: 10, fontWeight: 700, color: "var(--tp-rojo)", background: "rgba(184,64,48,0.10)", padding: "3px 8px", borderRadius: 20 }}>Primer pago</span>
                        : <Lock size={13} color="var(--tp-marron-suave)" />
                      }
                      {expandido === i ? <ChevronUp size={14} color="var(--tp-marron-suave)" /> : <ChevronDown size={14} color="var(--tp-marron-suave)" />}
                    </div>
                  </button>
                  {expandido === i && (
                    <div style={{ padding: "8px 14px 10px", background: "rgba(61,31,31,0.02)", borderTop: "1px solid rgba(61,31,31,0.06)" }}>
                      <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                        <AlertCircle size={11} /> Se habilita: {e.trigger}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px 0", borderTop: "1px dashed rgba(61,31,31,0.12)" }}>
                <span style={{ fontSize: 12, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>Total en {a.etapas.length} pagos</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--tp-marron)", fontFamily: "var(--fuente)" }}>${a.monto.toLocaleString("es-AR")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Aviso legal */}
        <div style={{ padding: "10px 14px", borderRadius: "var(--r-md)", background: "rgba(61,31,31,0.03)", border: "1px solid rgba(61,31,31,0.08)", marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0, lineHeight: 1.7, fontFamily: "var(--fuente)" }}>
            Al confirmar aceptás los{" "}
            <span style={{ color: "var(--tp-rojo)", fontWeight: 600, cursor: "pointer" }}>términos y condiciones</span>{" "}
            de TeePee. Este documento tiene validez como acuerdo digital entre las partes.
          </p>
        </div>

        {/* Botones */}
        <button type="button" onClick={handleFirmar} disabled={confirmando}
          style={{ width: "100%", padding: 18, borderRadius: "var(--r-md)", border: "none", cursor: confirmando ? "not-allowed" : "pointer", fontFamily: "var(--fuente)", fontSize: 16, fontWeight: 900, background: confirmando ? "rgba(61,31,31,0.15)" : "var(--tp-rojo)", color: confirmando ? "var(--tp-marron-suave)" : "var(--tp-crema)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
          {confirmando ? <>⏳ Procesando...</> : <><FileText size={18} /> Confirmar y firmar acuerdo</>}
        </button>
        <button type="button" onClick={() => navigate(-1)}
          style={{ width: "100%", padding: 13, borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron-suave)", border: "1px solid rgba(61,31,31,0.12)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14, marginBottom: 16 }}>
          Volver a negociar
        </button>
      </div>

      {toast && <div style={sToast}>{toast}</div>}
    </div>
  );
}