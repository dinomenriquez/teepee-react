import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { IconoVolver } from "./Iconos";

function fmt(n) {
  return Number(n).toLocaleString("es-AR");
}

const MEDIOS = [
  { id: "tarjeta",      icono: "💳", label: "Tarjeta de crédito / débito" },
  { id: "transferencia",icono: "🏦", label: "Transferencia bancaria"       },
  { id: "mp",           icono: "💙", label: "MercadoPago"                  },
  { id: "efectivo",     icono: "💵", label: "Efectivo"                     },
];

export default function Pago() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Helper seguro para decodificar params
  function dec(key, fallback = "") {
    try { const v = searchParams.get(key); return v ? decodeURIComponent(v) : fallback; }
    catch { return fallback; }
  }

  // Params que vienen desde Seguimiento
  const monto      = Number(searchParams.get("monto") || 0);
  const concepto   = dec("concepto",  "Pago de servicio");
  const solNombre  = dec("solNombre", "Carlos Mendoza");
  const solOficio  = dec("solOficio", "Plomero");
  const solInicial = searchParams.get("solInicial") || "C";
  const solColor   = dec("solColor",  "#B84030");
  const trabajoId  = searchParams.get("trabajoId")  || "1";
  const desde      = searchParams.get("desde")      || "seguimiento";

  const [medioSel, setMedioSel] = useState(null);
  const [pagado, setPagado]     = useState(false);
  const [pendiente, setPendiente] = useState(false);

  function confirmarPago() {
    if (!medioSel) return;
    setPagado(true);
  }

  function omitirPago() {
    setPendiente(true);
  }

  function volver() {
    navigate(`/${desde}?trabajoId=${trabajoId}`);
  }

  if (pagado) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--verde)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "var(--fuente)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <p style={{ fontSize: 22, fontWeight: 900, color: "white", margin: "0 0 8px", textAlign: "center" }}>¡Pago confirmado!</p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.80)", margin: "0 0 6px", textAlign: "center" }}>{concepto}</p>
        <p style={{ fontSize: 28, fontWeight: 900, color: "white", margin: "0 0 32px" }}>${fmt(monto)}</p>
        <button type="button" onClick={volver}
          style={{ padding: "14px 32px", borderRadius: "var(--r-full)", background: "white", color: "var(--verde)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 800 }}>
          Volver al seguimiento →
        </button>
      </div>
    );
  }

  if (pendiente) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--tp-crema)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "var(--fuente)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ fontSize: 20, fontWeight: 900, color: "var(--tp-marron)", margin: "0 0 8px", textAlign: "center" }}>Pago pendiente</p>
        <p style={{ fontSize: 13, color: "var(--tp-marron-suave)", margin: "0 0 6px", textAlign: "center" }}>{concepto}</p>
        <p style={{ fontSize: 26, fontWeight: 900, color: "var(--tp-marron)", margin: "0 0 12px" }}>${fmt(monto)}</p>
        <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: "0 0 32px", textAlign: "center", lineHeight: 1.5 }}>
          Podés realizar el pago en cualquier momento desde la pantalla de seguimiento.
        </p>
        <button type="button" onClick={volver}
          style={{ padding: "14px 32px", borderRadius: "var(--r-full)", background: "var(--tp-marron)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 800 }}>
          Volver al seguimiento
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--tp-crema)", fontFamily: "var(--fuente)", paddingBottom: 32 }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={volver} style={{ border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex" }}>
          <IconoVolver size={20} />
        </button>
        <p style={{ fontSize: 16, fontWeight: 900, color: "var(--tp-marron)", margin: 0 }}>Confirmar pago</p>
      </header>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Datos del solucionador */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: "var(--r-lg)", background: "var(--tp-crema-clara)", border: "1px solid rgba(61,31,31,0.08)" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: solColor, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, flexShrink: 0 }}>
            {solInicial}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>{solNombre}</p>
            <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>{solOficio}</p>
          </div>
        </div>

        {/* Concepto y monto — SIN desglose de comisión */}
        <div style={{ padding: "20px 16px", borderRadius: "var(--r-lg)", background: "var(--tp-marron)", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(240,234,214,0.60)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>{concepto}</p>
          <p style={{ fontSize: 40, fontWeight: 900, color: "var(--tp-crema)", margin: "0 0 4px", letterSpacing: "-1px" }}>${fmt(monto)}</p>
          <p style={{ fontSize: 11, color: "rgba(240,234,214,0.45)", margin: 0 }}>Monto total a pagar</p>
        </div>

        {/* Medios de pago */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px" }}>Elegí cómo pagar</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MEDIOS.map(m => (
              <button key={m.id} type="button" onClick={() => setMedioSel(m.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  borderRadius: "var(--r-md)", border: medioSel === m.id ? "2px solid var(--tp-rojo)" : "1px solid rgba(61,31,31,0.10)",
                  background: medioSel === m.id ? "rgba(184,64,48,0.05)" : "var(--tp-crema-clara)",
                  cursor: "pointer", fontFamily: "var(--fuente)", textAlign: "left",
                }}>
                <span style={{ fontSize: 22 }}>{m.icono}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tp-marron)", flex: 1 }}>{m.label}</span>
                {medioSel === m.id && <span style={{ fontSize: 18, color: "var(--tp-rojo)" }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Botón confirmar */}
        <button type="button" onClick={confirmarPago} disabled={!medioSel}
          style={{
            width: "100%", padding: "15px 0", borderRadius: "var(--r-md)", border: "none",
            cursor: medioSel ? "pointer" : "not-allowed", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 800,
            background: medioSel ? "var(--tp-rojo)" : "rgba(61,31,31,0.12)",
            color: medioSel ? "var(--tp-crema)" : "var(--tp-marron-suave)",
          }}>
          Confirmar pago ${fmt(monto)}
        </button>

        {/* Omitir pago */}
        <button type="button" onClick={omitirPago}
          style={{ width: "100%", padding: "12px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 13, color: "var(--tp-marron-suave)" }}>
          Pagar más tarde — quedará pendiente
        </button>

      </div>
    </div>
  );
}