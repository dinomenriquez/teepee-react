import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";
import { MessageCircle, Send, FileText, Plus } from "lucide-react";
import { getTrabajoActivo, getUsuario } from "./MockData";

function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: 2,
  });
}
// Para comisiones: siempre 2 decimales
function fmtCom(n) {
  const num = Number(n);
  if (isNaN(num)) return "0,00";
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function SeguimientoS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const trabajoData = getTrabajoActivo(searchParams.get("trabajoId") || 1);
  const usuData = getUsuario(trabajoData.usuarioId);

  const t = {
    ...trabajoData,
    cliente: {
      nombre: usuData.nombre,
      inicial: usuData.inicial,
      color: usuData.color,
    },
  };

  const [avanceActual, setAvanceActual] = useState(t.avanceReportado);
  const [avanceAprobado] = useState(t.avanceAprobado);
  const [enviando, setEnviando] = useState(false);
  const [modalAjuste, setModalAjuste] = useState(false);
  const [ajusteMonto, setAjusteMonto] = useState("");
  const [ajusteDesc, setAjusteDesc] = useState("");
  const [ajustes, setAjustes] = useState([]);
  const [toast, setToast] = useState(null);

  const COM = 0.06;
  const montoBase =
    t.monto +
    ajustes
      .filter((a) => a.estado === "aprobado")
      .reduce((s, a) => s + a.monto, 0);
  const montoAvancePend = Math.round(
    ((avanceActual - avanceAprobado) / 100) * montoBase,
  );

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function enviarAvance() {
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      mostrarToast(`📤 Avance ${avanceActual}% enviado`);
    }, 800);
  }

  const sCard = {
    background: "var(--tp-crema-clara)",
    borderRadius: "var(--r-lg)",
    padding: 16,
    marginBottom: 12,
    border: "1px solid rgba(61,31,31,0.08)",
  };
  const sSecLabel = {
    fontSize: 10,
    fontWeight: 800,
    color: "var(--tp-marron-suave)",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    margin: "0 0 12px",
    fontFamily: "var(--fuente)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--tp-crema)",
        fontFamily: "var(--fuente)",
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--tp-crema)",
          borderBottom: "1px solid rgba(61,31,31,0.08)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <IconoVolver size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "var(--tp-marron)",
              margin: 0,
            }}
          >
            {t.titulo}
          </p>
          <p
            style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}
          >
            Cliente: {t.cliente.nombre}
          </p>
        </div>
        <button
          onClick={() =>
            navigate(
              `/chat-s?usuarioId=${t.usuarioId}&nombre=${encodeURIComponent(t.cliente.nombre)}&inicial=${t.cliente.inicial}&desde=seguimiento-s&trabajoId=${t.id}`,
            )
          }
          style={{
            border: "none",
            background: "rgba(61,31,31,0.06)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageCircle size={18} color="var(--tp-marron)" />
        </button>
        <button
          onClick={() =>
            navigate(`/acuerdo-digital?trabajoId=${t.id}&modo=firmado`)
          }
          style={{
            border: "none",
            background: "rgba(61,31,31,0.06)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileText size={18} color="var(--tp-marron)" />
        </button>
      </header>

      <div style={{ padding: "16px 16px 0" }}>
        {/* ── AVANCE DE OBRA ─────────────────────── */}
        <p style={sSecLabel}>📊 Avance de obra</p>
        <div style={sCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--tp-marron)",
              }}
            >
              Progreso reportado
            </span>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "var(--tp-rojo)",
                }}
              >
                {avanceActual}%
              </span>
              {avanceActual > avanceAprobado && (
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--tp-marron-suave)",
                    margin: 0,
                  }}
                >
                  Certifica ${fmt(montoAvancePend)}
                </p>
              )}
            </div>
          </div>
          {/* Barra */}
          <div
            style={{
              height: 14,
              borderRadius: 7,
              background: "rgba(61,31,31,0.08)",
              overflow: "hidden",
              position: "relative",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                borderRadius: 7,
                background: "var(--verde)",
                width: `${avanceAprobado}%`,
                transition: "width 0.5s",
              }}
            />
            {avanceActual > avanceAprobado && (
              <div
                style={{
                  position: "absolute",
                  left: `${avanceAprobado}%`,
                  top: 0,
                  bottom: 0,
                  width: `${avanceActual - avanceAprobado}%`,
                  background:
                    "repeating-linear-gradient(45deg, rgba(245,200,66,0.6), rgba(245,200,66,0.6) 4px, rgba(245,200,66,0.25) 4px, rgba(245,200,66,0.25) 8px)",
                }}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>
              ✓ Aprobado: {avanceAprobado}%
            </span>
            <span style={{ fontSize: 11, color: "#8C6820" }}>100%</span>
          </div>

          {/* Slider */}
          <div style={{ marginBottom: 12 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--tp-marron-suave)",
                margin: "0 0 6px",
              }}
            >
              Actualizar avance
            </p>
            <input
              type="range"
              min={avanceAprobado}
              max={100}
              value={avanceActual}
              onChange={(e) => setAvanceActual(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--tp-rojo)",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Resumen certificado */}
          {avanceActual > avanceAprobado && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "var(--r-md)",
                background: "rgba(184,64,48,0.06)",
                border: "1px solid rgba(184,64,48,0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--tp-marron-suave)",
                    textTransform: "uppercase",
                    margin: "0 0 1px",
                  }}
                >
                  Certificado de avance
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--tp-marron-suave)",
                    margin: 0,
                  }}
                >
                  {avanceAprobado}% → {avanceActual}% · +
                  {avanceActual - avanceAprobado}%
                </p>
              </div>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "var(--tp-rojo)",
                  margin: 0,
                }}
              >
                ${fmt(montoAvancePend)}
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={enviando || avanceActual === avanceAprobado}
            onClick={
              avanceActual === 100
                ? () => mostrarToast("¡Trabajo marcado como terminado!")
                : enviarAvance
            }
            style={{
              width: "100%",
              padding: 13,
              borderRadius: "var(--r-md)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background:
                avanceActual === avanceAprobado
                  ? "rgba(61,31,31,0.10)"
                  : avanceActual === 100
                    ? "var(--verde)"
                    : "var(--tp-rojo)",
              color:
                avanceActual === avanceAprobado
                  ? "var(--tp-marron-suave)"
                  : "white",
            }}
          >
            <Send size={14} />
            {avanceActual === 100
              ? "Marcar como terminado"
              : avanceActual === avanceAprobado
                ? "Sin cambios"
                : `Enviar avance ${avanceActual}% al cliente`}
          </button>
        </div>

        {/* ── AJUSTES DE MONTO ───────────────────── */}
        <p style={sSecLabel}>📝 Ajustes de monto</p>

        {ajustes.length > 0 &&
          ajustes.map((aj, idx) => (
            <div
              key={aj.id}
              style={{
                ...sCard,
                border: `1px solid ${aj.estado === "aprobado" ? "rgba(42,125,90,0.25)" : "rgba(245,200,66,0.35)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 6,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--tp-marron-suave)",
                      margin: "0 0 1px",
                    }}
                  >
                    Ajuste #{idx + 1}
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: "var(--tp-marron)",
                      margin: 0,
                    }}
                  >
                    +${fmt(aj.monto)}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                      margin: 0,
                    }}
                  >
                    Neto: ${fmtCom(aj.monto * 0.94)} · Comisión: $
                    {fmtCom(aj.monto * 0.06)}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background:
                      aj.estado === "aprobado"
                        ? "rgba(42,125,90,0.12)"
                        : "rgba(245,200,66,0.25)",
                    color:
                      aj.estado === "aprobado" ? "var(--verde)" : "#8C6820",
                  }}
                >
                  {aj.estado === "aprobado" ? "✓ Aprobado" : "⏳ Esperando"}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--tp-marron-suave)",
                  margin: "0 0 8px",
                  lineHeight: 1.5,
                }}
              >
                {aj.descripcion}
              </p>

              {/* Barra de avance del ajuste */}
              <div style={{ marginBottom: aj.estado === "aprobado" ? 10 : 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}
                  >
                    Avance de este ajuste
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--tp-rojo)",
                    }}
                  >
                    {aj.avance}%
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: "rgba(61,31,31,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 4,
                      background:
                        aj.estado === "aprobado"
                          ? "var(--verde)"
                          : "rgba(245,200,66,0.6)",
                      width: `${aj.avance}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

        <button
          type="button"
          onClick={() => setModalAjuste(true)}
          style={{
            width: "100%",
            padding: 13,
            borderRadius: "var(--r-md)",
            background: "none",
            color: "var(--tp-marron)",
            border: "1.5px dashed rgba(61,31,31,0.20)",
            cursor: "pointer",
            fontFamily: "var(--fuente)",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <Plus size={14} /> Proponer ajuste de monto
        </button>

        {/* ── PAGOS ──────────────────────────────── */}
        <p style={sSecLabel}>💳 Pagos</p>
        <div style={sCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--tp-marron-suave)",
                  margin: "0 0 2px",
                }}
              >
                Monto total
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "var(--tp-marron)",
                  margin: 0,
                }}
              >
                ${fmt(montoBase)}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--tp-marron-suave)",
                  margin: "0 0 2px",
                }}
              >
                Tu cobro neto (94%)
              </p>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--verde)",
                  margin: 0,
                }}
              >
                ${fmtCom(montoBase * 0.94)}
              </p>
            </div>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "rgba(61,31,31,0.08)",
              overflow: "hidden",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                background: "var(--verde)",
                width: `${Math.round((t.etapasPago.filter((e) => e.estado === "pagado").reduce((s, e) => s + e.monto, 0) / montoBase) * 100)}%`,
              }}
            />
          </div>
          {t.etapasPago.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: "var(--r-md)",
                background: "var(--tp-crema)",
                border: "1px solid rgba(61,31,31,0.08)",
                marginBottom: 8,
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--tp-marron)",
                    margin: "0 0 1px",
                  }}
                >
                  {e.label}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--tp-marron-suave)",
                    margin: 0,
                  }}
                >
                  ${fmt(e.monto)} · Neto: ${fmtCom(e.monto * 0.94)}
                </p>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background:
                    e.estado === "pagado"
                      ? "rgba(42,125,90,0.12)"
                      : "rgba(61,31,31,0.05)",
                  color:
                    e.estado === "pagado"
                      ? "var(--verde)"
                      : "var(--tp-marron-suave)",
                }}
              >
                {e.estado === "pagado"
                  ? "Cobrado ✓"
                  : e.estado === "habilitado"
                    ? "⏳ Por cobrar"
                    : "🔒 Bloqueado"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal proponer ajuste */}
      {modalAjuste && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(61,31,31,0.55)",
            zIndex: 200,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "var(--tp-crema)",
              borderRadius: "var(--r-lg)",
              padding: 24,
              margin: "60px 16px 16px",
              boxSizing: "border-box",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--tp-marron)",
                margin: "0 0 4px",
                fontFamily: "var(--fuente)",
              }}
            >
              Proponer ajuste
            </p>
            <div
              style={{
                background: "var(--tp-crema-clara)",
                borderRadius: "var(--r-md)",
                padding: 14,
                border: "1px solid rgba(61,31,31,0.08)",
                marginBottom: 10,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--tp-marron-suave)",
                  textTransform: "uppercase",
                  margin: "0 0 6px",
                }}
              >
                Incremento
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 20, color: "var(--tp-marron-suave)" }}>
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={ajusteMonto}
                  onChange={(e) =>
                    setAjusteMonto(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  style={{
                    flex: 1,
                    fontSize: 28,
                    fontWeight: 900,
                    color: "var(--tp-marron)",
                    border: "none",
                    background: "none",
                    outline: "none",
                    fontFamily: "var(--fuente)",
                    MozAppearance: "textfield",
                  }}
                />
              </div>
              {ajusteMonto > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: "1px dashed rgba(61,31,31,0.12)",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}
                    >
                      Tu cobro neto (94%)
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--tp-marron)",
                      }}
                    >
                      ${fmtCom(Number(ajusteMonto) * 0.94)}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}
                    >
                      Comisión TeePee (6%)
                    </span>
                    <span
                      style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}
                    >
                      ${fmtCom(Number(ajusteMonto) * 0.06)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                background: "var(--tp-crema-clara)",
                borderRadius: "var(--r-md)",
                padding: 14,
                border: "1px solid rgba(61,31,31,0.08)",
                marginBottom: 14,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--tp-marron-suave)",
                  textTransform: "uppercase",
                  margin: "0 0 6px",
                }}
              >
                Descripción detallada
              </p>
              <textarea
                placeholder="Describí los trabajos o materiales adicionales..."
                value={ajusteDesc}
                onChange={(e) => setAjusteDesc(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  fontSize: 13,
                  color: "var(--tp-marron)",
                  border: "none",
                  background: "none",
                  outline: "none",
                  fontFamily: "var(--fuente)",
                  resize: "none",
                  lineHeight: 1.6,
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!ajusteMonto || !ajusteDesc.trim()) {
                  mostrarToast("⚠️ Completá monto y descripción");
                  return;
                }
                setAjustes((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    monto: Number(ajusteMonto),
                    descripcion: ajusteDesc,
                    estado: "pendiente",
                    avance: avanceActual,
                  },
                ]);
                setAjusteMonto("");
                setAjusteDesc("");
                setModalAjuste(false);
                mostrarToast("✅ Propuesta enviada al cliente");
              }}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: "var(--r-md)",
                background: "var(--tp-rojo)",
                color: "var(--tp-crema)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Enviar propuesta al cliente
            </button>
            <button
              type="button"
              onClick={() => setModalAjuste(false)}
              style={{
                width: "100%",
                padding: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
                fontSize: 13,
                color: "var(--tp-marron-suave)",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--tp-marron)",
            color: "var(--tp-crema)",
            padding: "10px 20px",
            borderRadius: "var(--r-full)",
            fontSize: 13,
            fontWeight: 600,
            zIndex: 300,
            whiteSpace: "nowrap",
            fontFamily: "var(--fuente)",
          }}
        >
          {toast}
        </div>
      )}
      <NavInferiorS />
    </div>
  );
}
