import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import { IconoVolver } from "./Iconos";
import {
  Shield, Clock, CheckCircle, ChevronDown, ChevronUp,
  FileText, Download, AlertCircle
} from "lucide-react";

// ── MOCK del acuerdo ────────────────────────────────────────
const ACUERDO_MOCK = {
  id: "ORD-2025-0042",
  fecha: "29/03/2025",
  solucionador: {
    nombre: "Carlos Mendoza",
    oficio: "Plomero",
    nivel: "🥇",
    reputacion: 4.9,
    inicial: "C",
    color: "#B84030",
  },
  trabajo: {
    descripcion: "Pérdida de agua en baño principal",
    detalle: "Cambio de sifón y sellado completo bajo pileta del baño principal. Incluye materiales y mano de obra. Se realizará inspección visual previa al inicio.",
    categoria: "Plomería",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    fechaEstimada: "Lunes 31/03 · 9:00 – 12:00 hs",
  },
  monto: 22000,
  formaCobro: "etapas", // "total" | "etapas"
  etapas: [
    { id: 1, label: "Anticipo",  pct: 30, monto: 6600,  estado: "pendiente", trigger: "Al firmar el acuerdo" },
    { id: 2, label: "Avance 60%", pct: 40, monto: 8800,  estado: "bloqueado", trigger: "Al confirmar 60% de obra" },
    { id: 3, label: "Cierre",    pct: 30, monto: 6600,  estado: "bloqueado", trigger: "Al confirmar obra terminada" },
  ],
  garantia: 30,
  incluyeMateriales: true,
  validez: "Vence en 2 días",
  comisionApp: 0.06,
};

const sCard = {
  background: "var(--tp-crema-clara)",
  borderRadius: "var(--r-lg)",
  padding: 16,
  border: "1px solid rgba(61,31,31,0.08)",
  marginBottom: 12,
};

const sLabel = {
  fontSize: 10, fontWeight: 700, color: "var(--tp-marron-suave)",
  textTransform: "uppercase", letterSpacing: "0.6px",
  margin: "0 0 6px", fontFamily: "var(--fuente)",
};

export default function AcuerdoDigital() {
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();
  const desde      = searchParams.get("desde") || "presupuestos";
  const [firmado,    setFirmado]    = useState(false);
  const [expandido,  setExpandido]  = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const a = ACUERDO_MOCK;
  const montoNeto = Math.round(a.monto * (1 - a.comisionApp));

  function handleFirmar() {
    setConfirmando(true);
    setTimeout(() => {
      setFirmado(true);
      setConfirmando(false);
    }, 1200);
  }

  if (firmado) {
    return (
      <div style={{ background: "var(--tp-marron)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--fuente)" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--tp-crema)", margin: "0 0 8px" }}>
            ¡Acuerdo firmado!
          </h1>
          <p style={{ fontSize: 14, color: "rgba(240,234,214,0.70)", margin: "0 0 8px", lineHeight: 1.6 }}>
            Orden de trabajo <strong style={{ color: "var(--tp-crema)" }}>{a.id}</strong> generada.
          </p>
          <p style={{ fontSize: 13, color: "rgba(240,234,214,0.60)", margin: "0 0 32px", lineHeight: 1.6 }}>
            {a.solucionador.nombre} fue notificado y el trabajo está activo.
          </p>

          {/* Próximo paso — anticipo */}
          {a.formaCobro === "etapas" && (
            <div style={{ background: "rgba(240,234,214,0.10)", borderRadius: "var(--r-md)", padding: 14, marginBottom: 24, border: "1px solid rgba(240,234,214,0.15)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,234,214,0.60)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Próximo paso</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-crema)", margin: 0 }}>
                Abonar anticipo: ${a.etapas[0].monto.toLocaleString("es-AR")}
              </p>
              <p style={{ fontSize: 11, color: "rgba(240,234,214,0.55)", margin: "3px 0 0" }}>
                {a.etapas[0].trigger}
              </p>
            </div>
          )}

          <button type="button"
            onClick={() => navigate("/seguimiento?trabajoId=1")}
            style={{ width: "100%", padding: 16, borderRadius: "var(--r-md)", background: "var(--tp-rojo)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Ir al seguimiento →
          </button>
          <button type="button"
            onClick={() => navigate("/home")}
            style={{ width: "100%", padding: 13, borderRadius: "var(--r-md)", background: "none", color: "rgba(240,234,214,0.55)", border: "1px solid rgba(240,234,214,0.15)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14 }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--tp-crema)", minHeight: "100vh", fontFamily: "var(--fuente)", paddingBottom: 90 }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}>
          <IconoVolver size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 15, fontWeight: 900, color: "var(--tp-marron)", margin: 0 }}>Orden de Trabajo</h1>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>{a.id} · {a.fecha}</p>
        </div>
        <button type="button"
          onClick={() => alert("PDF descargable — disponible en la app móvil")}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: "var(--r-full)", border: "1px solid rgba(61,31,31,0.15)", background: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 11, fontWeight: 600, color: "var(--tp-marron-suave)" }}>
          <Download size={13} /> PDF
        </button>
      </header>

      <div style={{ padding: "16px 16px 0" }}>

        {/* Solucionador */}
        <div style={{ ...sCard, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: a.solucionador.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, flexShrink: 0 }}>
            {a.solucionador.inicial}
            <span style={{ position: "absolute", fontSize: 14, marginTop: 28, marginLeft: 28 }}>{a.solucionador.nivel}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: "var(--tp-marron)", margin: "0 0 2px" }}>{a.solucionador.nombre}</p>
            <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>{a.solucionador.oficio} · ⭐ {a.solucionador.reputacion}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 10, color: "var(--tp-marron-suave)", margin: "0 0 2px" }}>Garantía</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>🛡️ {a.garantia} días</p>
          </div>
        </div>

        {/* Descripción del trabajo */}
        <div style={sCard}>
          <p style={sLabel}>Tarea a realizar</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 6px" }}>{a.trabajo.descripcion}</p>
          <p style={{ fontSize: 13, color: "var(--tp-marron-suave)", margin: "0 0 10px", lineHeight: 1.6 }}>{a.trabajo.detalle}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <span style={{ fontSize: 13, flexShrink: 0 }}>📍</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>{a.trabajo.direccion}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 13 }}>🗓️</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>{a.trabajo.fechaEstimada}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 13 }}>🔧</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>Materiales {a.incluyeMateriales ? "incluidos" : "no incluidos"}</span>
            </div>
          </div>
        </div>

        {/* Monto acordado */}
        <div style={{ ...sCard, background: "var(--tp-marron)" }}>
          <p style={{ ...sLabel, color: "rgba(240,234,214,0.55)" }}>Monto total acordado</p>
          <p style={{ fontSize: 36, fontWeight: 900, color: "var(--tp-crema)", margin: "0 0 4px", letterSpacing: "-1px" }}>
            ${a.monto.toLocaleString("es-AR")}
          </p>
          <p style={{ fontSize: 11, color: "rgba(240,234,214,0.50)", margin: 0 }}>
            Precio fijo · {a.validez}
          </p>
        </div>

        {/* Forma de cobro y etapas */}
        <div style={sCard}>
          <p style={sLabel}>Forma de cobro</p>

          {a.formaCobro === "total" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: "var(--r-md)", background: "rgba(42,125,90,0.08)" }}>
              <CheckCircle size={16} style={{ color: "var(--verde)", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>Pago 100% al terminar</p>
                <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>Se habilita cuando confirmás obra terminada</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {a.etapas.map((e, i) => (
                <div key={e.id} style={{
                  borderRadius: "var(--r-md)", overflow: "hidden",
                  border: `1px solid ${e.estado === "pendiente" ? "rgba(184,64,48,0.25)" : "rgba(61,31,31,0.08)"}`,
                }}>
                  <button type="button"
                    onClick={() => setExpandido(expandido === i ? null : i)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", border: "none", cursor: "pointer",
                      fontFamily: "var(--fuente)", textAlign: "left",
                      background: e.estado === "pendiente" ? "rgba(184,64,48,0.06)" : "rgba(61,31,31,0.03)",
                    }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800,
                      background: e.estado === "pendiente" ? "var(--tp-rojo)" : "rgba(61,31,31,0.08)",
                      color: e.estado === "pendiente" ? "white" : "var(--tp-marron-suave)" }}>
                      {e.pct}%
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>{e.label}</p>
                      <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>${e.monto.toLocaleString("es-AR")}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {e.estado === "pendiente"
                        ? <span style={{ fontSize: 10, fontWeight: 700, color: "var(--tp-rojo)", background: "rgba(184,64,48,0.10)", padding: "2px 7px", borderRadius: 20 }}>A pagar</span>
                        : <span style={{ fontSize: 10, color: "var(--tp-marron-suave)" }}>🔒 Bloqueado</span>
                      }
                      {expandido === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>
                  {expandido === i && (
                    <div style={{ padding: "8px 12px 10px", background: "rgba(61,31,31,0.03)", borderTop: "1px solid rgba(61,31,31,0.06)" }}>
                      <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                        <AlertCircle size={11} /> Se habilita: {e.trigger}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aviso legal */}
        <div style={{ padding: "10px 14px", borderRadius: "var(--r-md)", background: "rgba(61,31,31,0.04)", border: "1px solid rgba(61,31,31,0.08)", marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0, lineHeight: 1.6, fontFamily: "var(--fuente)" }}>
            Al confirmar aceptás los{" "}
            <span style={{ color: "var(--tp-rojo)", fontWeight: 600, cursor: "pointer" }}>términos y condiciones</span>{" "}
            de TeePee. Este documento tiene validez como acuerdo digital entre las partes.
          </p>
        </div>

        {/* Botón firmar */}
        <button type="button"
          onClick={handleFirmar}
          disabled={confirmando}
          style={{
            width: "100%", padding: 18, borderRadius: "var(--r-md)", border: "none",
            cursor: confirmando ? "not-allowed" : "pointer",
            fontFamily: "var(--fuente)", fontSize: 16, fontWeight: 900,
            background: confirmando ? "rgba(61,31,31,0.15)" : "var(--tp-rojo)",
            color: confirmando ? "var(--tp-marron-suave)" : "var(--tp-crema)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginBottom: 10,
          }}>
          {confirmando ? (
            <>⏳ Procesando...</>
          ) : (
            <><FileText size={18} /> Confirmar y firmar acuerdo</>
          )}
        </button>

        <button type="button"
          onClick={() => navigate(-1)}
          style={{ width: "100%", padding: 13, borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron-suave)", border: "1px solid rgba(61,31,31,0.12)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14 }}>
          Volver a negociar
        </button>
      </div>
    </div>
  );
}