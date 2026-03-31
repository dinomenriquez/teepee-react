import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import styles from "./Seguimiento.module.css";
import { IconoVolver } from "./Iconos";
import {
  MessageCircle,
  CheckCircle,
  Lock,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

import { getTrabajoActivo, getSolucionador } from "./MockData";

const ESTADO_PAGO = {
  pagado: { label: "Pagado ✓", color: "#2A7D5A", bg: "rgba(42,125,90,0.12)" },
  habilitado: {
    label: "⚡ Pagar ahora",
    color: "var(--tp-rojo)",
    bg: "rgba(184,64,48,0.10)",
  },
  bloqueado: {
    label: "🔒 Bloqueado",
    color: "var(--tp-marron-suave)",
    bg: "rgba(61,31,31,0.05)",
  },
};

export default function Seguimiento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const solId = searchParams.get("solId");
  const solNombre = searchParams.get("solNombre");
  const solInicial = searchParams.get("solInicial");
  const solOficio = searchParams.get("solOficio");
  const solColor = searchParams.get("solColor");

  // Cargar datos ANTES de los useState
  const trabajoData = getTrabajoActivo(searchParams.get("trabajoId") || 1);
  const solData = getSolucionador(trabajoData.solucionadorId);
  // Si vienen datos del solucionador por URL (desde MisTrabajosU), usarlos
  const t = {
    ...trabajoData,
    solucionador: {
      nombre: solNombre ? decodeURIComponent(solNombre) : solData.nombre,
      oficio: solOficio ? decodeURIComponent(solOficio) : solData.oficio,
      inicial: solInicial || solData.inicial,
      color: solColor ? decodeURIComponent(solColor) : solData.color,
      nivel: solData.nivel,
    },
  };

  const [avanceAprobado, setAvanceAprobado] = useState(t.avanceAprobado);
  const [pendiente, setPendiente] = useState(t.pendienteAprobacion);
  const [mostrarPagos, setMostrarPagos] = useState(false);
  const [toast, setToast] = useState(null);
  const montoPagado = t.etapasPago
    .filter((e) => e.estado === "pagado")
    .reduce((s, e) => s + e.monto, 0);
  // Monto del certificado de avance pendiente de aprobar
  const montoAvancePendiente = Math.round(
    ((t.avanceReportado - avanceAprobado) / 100) * t.monto,
  );
  const montoPendiente = t.monto - montoPagado;
  const pctPagado = Math.round((montoPagado / t.monto) * 100);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function aprobarAvance() {
    setAvanceAprobado(t.avanceReportado);
    setPendiente(false);
    mostrarToast("✅ Avance aprobado — instancia de pago habilitada");
  }

  return (
    <div
      style={{
        background: "var(--tp-crema)",
        minHeight: "100vh",
        fontFamily: "var(--fuente)",
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
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <IconoVolver size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "var(--tp-marron)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t.titulo}
          </p>
          <p
            style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}
          >
            {t.ordenId}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate(
              `/chat?solId=${trabajoData.solucionadorId}&nombre=${encodeURIComponent(t.solucionador.nombre)}&inicial=${t.solucionador.inicial}&oficio=${encodeURIComponent(t.solucionador.oficio)}&desde=seguimiento&trabajoId=${trabajoData.id}`,
            )
          }
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(61,31,31,0.15)",
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--tp-marron-suave)",
          }}
        >
          <MessageCircle size={18} />
        </button>
      </header>

      <div style={{ padding: "14px 16px 90px" }}>
        {/* Solucionador */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: "var(--tp-crema-clara)",
            borderRadius: "var(--r-lg)",
            marginBottom: 12,
            border: "1px solid rgba(61,31,31,0.08)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: t.solucionador.color,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {t.solucionador.inicial}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--tp-marron)",
                margin: 0,
              }}
            >
              {t.solucionador.nombre}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--tp-marron-suave)",
                margin: 0,
              }}
            >
              {t.solucionador.oficio} · {t.solucionador.nivel}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate(
                `/acuerdo-digital?desde=seguimiento&trabajoId=${trabajoData.id}`,
              )
            }
            style={{
              fontSize: 11,
              color: "var(--tp-rojo)",
              background: "none",
              border: "1px solid rgba(184,64,48,0.25)",
              borderRadius: 20,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              fontWeight: 600,
            }}
          >
            Ver orden
          </button>
        </div>

        {/* ── AVANCE DE OBRA ── */}
        <div
          style={{
            background: "var(--tp-crema-clara)",
            borderRadius: "var(--r-lg)",
            padding: 16,
            marginBottom: 12,
            border: "1px solid rgba(61,31,31,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--tp-marron-suave)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Avance de obra
            </p>
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "var(--tp-marron)",
              }}
            >
              {avanceAprobado}%
            </span>
          </div>

          {/* Barra de avance */}
          <div
            style={{
              position: "relative",
              height: 12,
              borderRadius: 6,
              background: "rgba(61,31,31,0.08)",
              marginBottom: 8,
              overflow: "hidden",
            }}
          >
            {/* Avance aprobado */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                borderRadius: 6,
                background: "var(--tp-rojo)",
                width: `${avanceAprobado}%`,
                transition: "width 0.6s ease",
              }}
            />
            {/* Avance reportado (pendiente) */}
            {pendiente && (
              <div
                style={{
                  position: "absolute",
                  left: `${avanceAprobado}%`,
                  top: 0,
                  bottom: 0,
                  borderRadius: "0 6px 6px 0",
                  background: "rgba(184,64,48,0.25)",
                  width: `${t.avanceReportado - avanceAprobado}%`,
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(184,64,48,0.2) 4px, rgba(184,64,48,0.2) 8px)",
                }}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "var(--tp-marron-suave)",
                margin: 0,
              }}
            >
              Aprobado: {avanceAprobado}%
              {pendiente && (
                <span style={{ color: "var(--tp-rojo)", marginLeft: 6 }}>
                  · Reportado: {t.avanceReportado}%
                </span>
              )}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "var(--tp-marron-suave)",
                margin: 0,
              }}
            >
              100%
            </p>
          </div>

          {/* Alerta de avance pendiente */}
          {pendiente && (
            <div
              style={{
                marginTop: 12,
                padding: "12px 14px",
                borderRadius: "var(--r-md)",
                background: "rgba(184,64,48,0.08)",
                border: "1px solid rgba(184,64,48,0.20)",
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
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--tp-rojo)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <AlertCircle size={14} />{" "}
                  {t.solucionador.nombre.split(" ")[0]} reportó{" "}
                  {t.avanceReportado}% de avance
                </p>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "var(--tp-rojo)",
                    margin: 0,
                    fontFamily: "var(--fuente)",
                  }}
                >
                  ${montoAvancePendiente.toLocaleString("es-AR")}
                </p>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--tp-marron-suave)",
                  margin: "0 0 4px",
                }}
              >
                Incremento {avanceAprobado}% → {t.avanceReportado}% ·{" "}
                {t.avanceReportado - avanceAprobado}% del total
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--tp-marron-suave)",
                  margin: "0 0 10px",
                }}
              >
                Al aprobar se habilitará el pago de este certificado.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={aprobarAvance}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: "var(--r-md)",
                    background: "var(--tp-rojo)",
                    color: "var(--tp-crema)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--fuente)",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ✓ Aprobar avance
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/chat?solId=${trabajoData.solucionadorId}&nombre=${encodeURIComponent(t.solucionador.nombre)}&inicial=${t.solucionador.inicial}&oficio=${encodeURIComponent(t.solucionador.oficio)}&desde=seguimiento&trabajoId=${trabajoData.id}`,
                    )
                  }
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: "var(--r-md)",
                    background: "none",
                    color: "var(--tp-marron)",
                    border: "1px solid rgba(61,31,31,0.20)",
                    cursor: "pointer",
                    fontFamily: "var(--fuente)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  💬 Consultar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── PAGOS ── */}
        <div
          style={{
            background: "var(--tp-crema-clara)",
            borderRadius: "var(--r-lg)",
            border: "1px solid rgba(61,31,31,0.08)",
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <button
            type="button"
            onClick={() => setMostrarPagos(!mostrarPagos)}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, textAlign: "left" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--tp-marron-suave)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: "0 0 4px",
                }}
              >
                Pagos
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "var(--tp-marron)",
                  }}
                >
                  ${montoPagado.toLocaleString("es-AR")}
                </span>
                <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>
                  pagado de ${t.monto.toLocaleString("es-AR")} · {pctPagado}%
                </span>
              </div>
            </div>
            {/* Barra de pagos compacta */}
            <div
              style={{
                width: 60,
                height: 6,
                borderRadius: 3,
                background: "rgba(61,31,31,0.08)",
                marginRight: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 3,
                  background: "var(--verde)",
                  width: `${pctPagado}%`,
                }}
              />
            </div>
            {mostrarPagos ? (
              <ChevronUp size={16} color="var(--tp-marron-suave)" />
            ) : (
              <ChevronDown size={16} color="var(--tp-marron-suave)" />
            )}
          </button>

          {mostrarPagos && (
            <div
              style={{
                borderTop: "1px solid rgba(61,31,31,0.08)",
                padding: "12px 16px",
              }}
            >
              {t.etapasPago.map((e) => {
                const est = ESTADO_PAGO[e.estado];
                return (
                  <div
                    key={e.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(61,31,31,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background:
                          e.estado === "pagado"
                            ? "rgba(42,125,90,0.12)"
                            : e.estado === "habilitado"
                              ? "rgba(184,64,48,0.10)"
                              : "rgba(61,31,31,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {e.estado === "pagado" ? (
                        <CheckCircle size={16} color="var(--verde)" />
                      ) : e.estado === "habilitado" ? (
                        <span style={{ fontSize: 14 }}>💳</span>
                      ) : (
                        <Lock size={14} color="var(--tp-marron-suave)" />
                      )}
                    </div>
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
                          fontSize: 11,
                          color: "var(--tp-marron-suave)",
                          margin: 0,
                        }}
                      >
                        ${e.monto.toLocaleString("es-AR")}
                      </p>
                    </div>
                    {e.estado === "habilitado" ? (
                      <button
                        type="button"
                        onClick={() => navigate("/pago")}
                        style={{
                          padding: "7px 14px",
                          borderRadius: "var(--r-full)",
                          background: "var(--tp-rojo)",
                          color: "var(--tp-crema)",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--fuente)",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Pagar
                      </button>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 20,
                          background: est.bg,
                          color: est.color,
                        }}
                      >
                        {est.label}
                      </span>
                    )}
                  </div>
                );
              })}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--tp-marron-suave)",
                    margin: 0,
                  }}
                >
                  Saldo pendiente
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--tp-marron)",
                    margin: 0,
                  }}
                >
                  ${montoPendiente.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nota de tiempo real */}
        <p
          style={{
            fontSize: 11,
            color: "var(--tp-marron-suave)",
            textAlign: "center",
            margin: "4px 0 16px",
            fontFamily: "var(--fuente)",
          }}
        >
          📡 Avance reportado por {t.solucionador.nombre} en tiempo real
        </p>

        {/* Botón calificar si terminó */}
        {avanceAprobado === 100 && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/calificacion?solNombre=${encodeURIComponent(t.solucionador.nombre)}&solOficio=${encodeURIComponent(t.solucionador.oficio)}`,
              )
            }
            style={{
              width: "100%",
              padding: 16,
              borderRadius: "var(--r-md)",
              background: "var(--tp-marron)",
              color: "var(--tp-crema)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            ⭐ Calificar a {t.solucionador.nombre}
          </button>
        )}
      </div>

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
            zIndex: 200,
            whiteSpace: "nowrap",
            fontFamily: "var(--fuente)",
          }}
        >
          {toast}
        </div>
      )}
      <NavInferior />
    </div>
  );
}
