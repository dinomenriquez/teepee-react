import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import stylesS from "./SeguimientoS.module.css";
import { IconoVolver } from "./Iconos";
import { MessageCircle, CheckCircle, Lock, ChevronDown, ChevronUp, Send, Plus } from "lucide-react";

// ── MOCK ──────────────────────────────────────────────────────
const TRABAJO_DEFAULT = {
  id: 1,
  titulo: "Pérdida de agua en baño principal",
  cliente: { nombre: "Laura Pérez", inicial: "L", color: "#2A7D5A" },
  ordenId: "ORD-2025-0042",
  monto: 22000,
  avanceEnviado: 60,   // último % enviado al cliente
  avanceAprobado: 40,  // % confirmado por el cliente
  etapasPago: [
    { id: 1, label: "Anticipo 30%",  pct: 30, monto: 6600, estado: "cobrado",   trigger: "Al firmar acuerdo" },
    { id: 2, label: "Avance 60%",    pct: 40, monto: 8800, estado: "pendiente", trigger: "Al confirmar 60% de obra" },
    { id: 3, label: "Cierre 30%",    pct: 30, monto: 6600, estado: "bloqueado", trigger: "Al confirmar obra terminada" },
  ],
};

const ESTADO_PAGO = {
  cobrado:   { label: "Cobrado ✓",    color: "#2A7D5A", bg: "rgba(42,125,90,0.12)" },
  pendiente: { label: "⏳ Esperando", color: "#8C6820", bg: "rgba(140,104,32,0.10)" },
  bloqueado: { label: "🔒 Bloqueado", color: "var(--tp-marron-suave)", bg: "rgba(61,31,31,0.05)" },
};

export default function SeguimientoS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trabajoParam = searchParams.get("solId");

  const t = TRABAJO_DEFAULT;
  const [avanceActual, setAvanceActual]     = useState(t.avanceEnviado);
  const [avanceAprobado]                    = useState(t.avanceAprobado);
  const [mostrarPagos, setMostrarPagos]     = useState(false);
  const [enviandoAvance, setEnviandoAvance] = useState(false);
  const [modalAjuste, setModalAjuste]       = useState(false);
  const [ajusteMonto, setAjusteMonto]       = useState("");
  const [ajusteDesc, setAjusteDesc]         = useState("");
  const [toast, setToast]                   = useState(null);

  const montoCobrado = t.etapasPago.filter(e => e.estado === "cobrado").reduce((s, e) => s + e.monto, 0);
  const montoPendiente = t.monto - montoCobrado;
  const pctCobrado = Math.round((montoCobrado / t.monto) * 100);
  const avancePendienteEnvio = avanceActual !== t.avanceEnviado;

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function enviarAvance() {
    setEnviandoAvance(true);
    setTimeout(() => {
      setEnviandoAvance(false);
      mostrarToast(`📤 Avance ${avanceActual}% enviado a ${t.cliente.nombre}`);
    }, 800);
  }

  return (
    <div style={{ background: "var(--tp-crema)", minHeight: "100vh", fontFamily: "var(--fuente)" }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}>
          <IconoVolver size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "var(--tp-marron)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titulo}</p>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>{t.ordenId}</p>
        </div>
        {/* Botón chat permanente en header */}
        <button type="button"
          onClick={() => navigate(`/chat-s?usuarioId=1&nombre=${encodeURIComponent(t.cliente.nombre)}&inicial=${t.cliente.inicial}&desde=seguimiento-s`)}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: "var(--r-full)", border: "none", background: "var(--tp-marron)", cursor: "pointer", color: "var(--tp-crema)", fontFamily: "var(--fuente)", fontSize: 12, fontWeight: 700 }}>
          <MessageCircle size={14} /> Chat
        </button>
      </header>

      <div style={{ padding: "14px 16px 90px" }}>

        {/* Cliente */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--tp-crema-clara)", borderRadius: "var(--r-lg)", marginBottom: 12, border: "1px solid rgba(61,31,31,0.08)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.cliente.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
            {t.cliente.inicial}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>{t.cliente.nombre}</p>
            <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>Cliente · Aprobó {avanceAprobado}%</p>
          </div>
          <button type="button"
            onClick={() => navigate("/acuerdo-digital?desde=seguimiento-s")}
            style={{ fontSize: 11, color: "var(--tp-rojo)", background: "none", border: "1px solid rgba(184,64,48,0.25)", borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--fuente)", fontWeight: 600 }}>
            Ver orden
          </button>
        </div>

        {/* ── AVANCE DE OBRA ── */}
        <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-lg)", padding: 16, marginBottom: 12, border: "1px solid rgba(61,31,31,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>Avance de obra</p>
            <span style={{ fontSize: 22, fontWeight: 900, color: "var(--tp-marron)" }}>{avanceActual}%</span>
          </div>

          {/* Barra */}
          <div style={{ position: "relative", height: 14, borderRadius: 7, background: "rgba(61,31,31,0.08)", marginBottom: 8, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 7, background: "var(--tp-rojo)", width: `${avanceAprobado}%`, transition: "width 0.6s ease" }} />
            {avanceActual > avanceAprobado && (
              <div style={{ position: "absolute", left: `${avanceAprobado}%`, top: 0, bottom: 0, borderRadius: "0 7px 7px 0", width: `${avanceActual - avanceAprobado}%`, background: "repeating-linear-gradient(45deg, rgba(184,64,48,0.25), rgba(184,64,48,0.25) 4px, rgba(184,64,48,0.10) 4px, rgba(184,64,48,0.10) 8px)" }} />
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>
              ✓ Aprobado: {avanceAprobado}%
              {avanceActual > avanceAprobado && <span style={{ color: "var(--tp-rojo)", marginLeft: 8 }}>· Enviado: {avanceActual}%</span>}
            </p>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>100%</p>
          </div>

          {/* Slider para reportar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--tp-marron-suave)", margin: 0 }}>Reportar nuevo avance</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: "var(--tp-rojo)", margin: 0 }}>{avanceActual}%</p>
            </div>
            <input type="range" min={avanceAprobado} max={100} value={avanceActual}
              onChange={e => setAvanceActual(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--tp-rojo)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 10, color: "var(--tp-marron-suave)" }}>{avanceAprobado}%</span>
              <span style={{ fontSize: 10, color: "var(--tp-marron-suave)" }}>100%</span>
            </div>
          </div>

          <button type="button"
            onClick={avanceActual === 100 ? () => mostrarToast("¡Marcaste el trabajo como terminado! El cliente recibirá una notificación.") : enviarAvance}
            disabled={enviandoAvance}
            style={{
              width: "100%", marginTop: 12, padding: 14, borderRadius: "var(--r-md)", border: "none",
              cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: avanceActual === 100 ? "var(--verde)" : "var(--tp-rojo)",
              color: "white", opacity: enviandoAvance ? 0.7 : 1,
            }}>
            {avanceActual === 100
              ? <><CheckCircle size={16} /> Marcar como terminado</>
              : <><Send size={14} /> Enviar avance {avanceActual}% al cliente</>
            }
          </button>
        </div>

        {/* ── PAGOS / COBROS ── */}
        <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-lg)", border: "1px solid rgba(61,31,31,0.08)", marginBottom: 12, overflow: "hidden" }}>
          <button type="button" onClick={() => setMostrarPagos(!mostrarPagos)}
            style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Cobros</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "var(--tp-marron)" }}>${montoCobrado.toLocaleString("es-AR")}</span>
                <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>cobrado de ${t.monto.toLocaleString("es-AR")} · {pctCobrado}%</span>
              </div>
            </div>
            <div style={{ width: 60, height: 6, borderRadius: 3, background: "rgba(61,31,31,0.08)", marginRight: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, background: "var(--verde)", width: `${pctCobrado}%` }} />
            </div>
            {mostrarPagos ? <ChevronUp size={16} color="var(--tp-marron-suave)" /> : <ChevronDown size={16} color="var(--tp-marron-suave)" />}
          </button>

          {mostrarPagos && (
            <div style={{ borderTop: "1px solid rgba(61,31,31,0.08)", padding: "12px 16px" }}>
              {t.etapasPago.map(e => {
                const est = ESTADO_PAGO[e.estado];
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(61,31,31,0.05)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: est.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {e.estado === "cobrado" ? <CheckCircle size={16} color="var(--verde)" /> : e.estado === "pendiente" ? <span style={{ fontSize: 13 }}>⏳</span> : <Lock size={14} color="var(--tp-marron-suave)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 1px" }}>{e.label}</p>
                      <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>${e.monto.toLocaleString("es-AR")}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: est.bg, color: est.color, flexShrink: 0 }}>{est.label}</span>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10 }}>
                <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>Saldo a cobrar</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>${montoPendiente.toLocaleString("es-AR")}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── PROPONER AJUSTE ── */}
        <button type="button" onClick={() => setModalAjuste(true)}
          style={{ width: "100%", padding: 13, borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron)", border: "1.5px dashed rgba(61,31,31,0.20)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Plus size={14} /> Proponer ajuste de monto
        </button>
      </div>

      {/* Modal ajuste */}
      {modalAjuste && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(61,31,31,0.55)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "var(--tp-crema)", borderRadius: "20px 20px 0 0", padding: 24, width: "100%" }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: "var(--tp-marron)", margin: "0 0 6px", fontFamily: "var(--fuente)" }}>Proponer ajuste de monto</p>
            <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: "0 0 16px", fontFamily: "var(--fuente)", lineHeight: 1.6 }}>
              El cliente recibirá una notificación y deberá aceptar el nuevo monto antes de continuar.
            </p>
            <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)", marginBottom: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", margin: "0 0 6px", fontFamily: "var(--fuente)" }}>Nuevo monto total</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 20, color: "var(--tp-marron-suave)" }}>$</span>
                <input type="number" placeholder={t.monto} value={ajusteMonto} onChange={e => setAjusteMonto(e.target.value)}
                  style={{ flex: 1, fontSize: 28, fontWeight: 900, color: "var(--tp-marron)", border: "none", background: "none", outline: "none", fontFamily: "var(--fuente)" }} />
              </div>
            </div>
            <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)", marginBottom: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", margin: "0 0 6px", fontFamily: "var(--fuente)" }}>Motivo del ajuste</p>
              <textarea placeholder="Ej: Materiales adicionales por rotura oculta..."
                value={ajusteDesc} onChange={e => setAjusteDesc(e.target.value)} rows={3}
                style={{ width: "100%", fontSize: 13, color: "var(--tp-marron)", border: "none", background: "none", outline: "none", fontFamily: "var(--fuente)", resize: "none", lineHeight: 1.6 }} />
            </div>
            <button type="button"
              onClick={() => { setModalAjuste(false); mostrarToast("✅ Ajuste enviado al cliente para aprobación"); }}
              style={{ width: "100%", padding: 14, borderRadius: "var(--r-md)", background: "var(--tp-rojo)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              Enviar ajuste al cliente
            </button>
            <button type="button" onClick={() => setModalAjuste(false)}
              style={{ width: "100%", padding: 12, borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron-suave)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 13 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {toast && <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "var(--tp-marron)", color: "var(--tp-crema)", padding: "10px 20px", borderRadius: "var(--r-full)", fontSize: 13, fontWeight: 600, zIndex: 300, whiteSpace: "nowrap", fontFamily: "var(--fuente)" }}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}