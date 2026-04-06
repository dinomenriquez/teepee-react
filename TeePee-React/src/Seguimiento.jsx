import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import { IconoVolver } from "./Iconos";
import { MessageCircle, AlertCircle, FileText } from "lucide-react";
import { getTrabajoActivo, getSolucionador } from "./MockData";

function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: 2,
  });
}

export default function Seguimiento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const solNombre = searchParams.get("solNombre");
  const solInicial = searchParams.get("solInicial");
  const solOficio = searchParams.get("solOficio");
  const solColor = searchParams.get("solColor");

  const trabajoData = getTrabajoActivo(searchParams.get("trabajoId") || 1);
  const solData = getSolucionador(trabajoData.solucionadorId);
  const sol = {
    nombre: solNombre ? decodeURIComponent(solNombre) : solData.nombre,
    oficio: solOficio ? decodeURIComponent(solOficio) : solData.oficio,
    inicial: solInicial || solData.inicial,
    color: solColor ? decodeURIComponent(solColor) : solData.color,
    nivel: solData.nivel,
  };

  const [avanceAprobado, setAvanceAprobado] = useState(
    trabajoData.avanceAprobado,
  );
  const [toast, setToast] = useState(null);

  // Ajustes propuestos por el solucionador
  const [ajustes, setAjustes] = useState([
    {
      id: 1,
      monto: 4500,
      descripcion:
        "Materiales adicionales: sellador especial y cañería de repuesto.",
      estado: "pendiente", // pendiente | aceptado | rechazado
      avanceAprobado: 0,
      avancePropuesto: trabajoData.avanceReportado,
      etapasPago: [
        {
          id: "a1",
          label: "Pago del ajuste",
          monto: 4500,
          estado: "bloqueado",
        },
      ],
    },
  ]);

  const montoTotal =
    trabajoData.monto +
    ajustes
      .filter((a) => a.estado === "aceptado")
      .reduce((s, a) => s + a.monto, 0);
  const montoPagado = trabajoData.etapasPago
    .filter((e) => e.estado === "pagado")
    .reduce((s, e) => s + e.monto, 0);

  function navPago(monto, concepto) {
    navigate(
      `/pago?monto=${monto}&concepto=${encodeURIComponent(concepto)}&solNombre=${encodeURIComponent(sol.nombre)}&solOficio=${encodeURIComponent(sol.oficio)}&solInicial=${sol.inicial}&solColor=${encodeURIComponent(sol.color)}&trabajoId=${trabajoData.id}&desde=seguimiento`,
    );
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const sCard = {
    background: "var(--tp-crema-clara)",
    borderRadius: "var(--r-lg)",
    padding: "16px",
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
            {trabajoData.titulo}
          </p>
          <p
            style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}
          >
            {sol.nombre} · {sol.oficio}
          </p>
        </div>
        <button
          onClick={() =>
            navigate(
              `/chat?solId=${trabajoData.solucionadorId}&nombre=${encodeURIComponent(sol.nombre)}&desde=seguimiento&trabajoId=${trabajoData.id}`,
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
            navigate(
              `/acuerdo-digital?trabajoId=${trabajoData.id}&modo=firmado`,
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
              Progreso del trabajo
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: "var(--tp-marron)",
              }}
            >
              {trabajoData.avanceReportado}%
            </span>
          </div>
          {/* Barra */}
          <div
            style={{
              height: 14,
              borderRadius: 7,
              background: "rgba(61,31,31,0.08)",
              overflow: "hidden",
              position: "relative",
              marginBottom: 6,
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
            {trabajoData.avanceReportado > avanceAprobado && (
              <div
                style={{
                  position: "absolute",
                  left: `${avanceAprobado}%`,
                  top: 0,
                  bottom: 0,
                  width: `${trabajoData.avanceReportado - avanceAprobado}%`,
                  background:
                    "repeating-linear-gradient(45deg, rgba(245,200,66,0.6), rgba(245,200,66,0.6) 4px, rgba(245,200,66,0.25) 4px, rgba(245,200,66,0.25) 8px)",
                }}
              />
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>
              ✓ Aprobado: {avanceAprobado}%
            </span>
            {trabajoData.avanceReportado > avanceAprobado && (
              <span style={{ fontSize: 11, color: "#8C6820", fontWeight: 600 }}>
                ⏳ Reportado: {trabajoData.avanceReportado}%
              </span>
            )}
          </div>

          {/* Alerta avance pendiente */}
          {trabajoData.avanceReportado > avanceAprobado && (
            <div
              style={{
                marginTop: 12,
                padding: "12px 14px",
                borderRadius: "var(--r-md)",
                background: "rgba(245,200,66,0.15)",
                border: "1px solid rgba(245,200,66,0.40)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 4,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#8C6820",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <AlertCircle size={14} /> {sol.nombre.split(" ")[0]} reportó{" "}
                  {trabajoData.avanceReportado}%
                </p>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "var(--tp-rojo)",
                    margin: 0,
                  }}
                >
                  $
                  {fmt(
                    Math.round(
                      ((trabajoData.avanceReportado - avanceAprobado) / 100) *
                        montoTotal,
                    ),
                  )}
                </p>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: "#8C6820",
                  margin: "0 0 10px",
                  lineHeight: 1.4,
                }}
              >
                Incremento {avanceAprobado}% → {trabajoData.avanceReportado}% ·
                Al aprobar se habilitará el pago
              </p>
              <button
                type="button"
                onClick={() => {
                  setAvanceAprobado(trabajoData.avanceReportado);
                  mostrarToast("✅ Avance aprobado");
                }}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  borderRadius: "var(--r-md)",
                  background: "var(--verde)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                ✓ Aprobar avance
              </button>
            </div>
          )}
        </div>

        {/* ── AJUSTES PROPUESTOS ─────────────────── */}
        {ajustes.length > 0 && (
          <>
            <p style={sSecLabel}>📝 Ajustes de monto</p>
            {ajustes.map((aj, idx) => (
              <div
                key={aj.id}
                style={{
                  ...sCard,
                  border: `1px solid ${aj.estado === "aceptado" ? "rgba(42,125,90,0.25)" : aj.estado === "rechazado" ? "rgba(61,31,31,0.12)" : "rgba(245,200,66,0.40)"}`,
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
                        margin: "0 0 2px",
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
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background:
                        aj.estado === "aceptado"
                          ? "rgba(42,125,90,0.12)"
                          : aj.estado === "rechazado"
                            ? "rgba(61,31,31,0.08)"
                            : "rgba(245,200,66,0.25)",
                      color:
                        aj.estado === "aceptado"
                          ? "var(--verde)"
                          : aj.estado === "rechazado"
                            ? "var(--tp-marron-suave)"
                            : "#8C6820",
                    }}
                  >
                    {aj.estado === "aceptado"
                      ? "✓ Aceptado"
                      : aj.estado === "rechazado"
                        ? "Rechazado"
                        : "⏳ Pendiente"}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--tp-marron-suave)",
                    margin: "0 0 10px",
                    lineHeight: 1.5,
                  }}
                >
                  {aj.descripcion}
                </p>

                {/* Acciones si pendiente */}
                {aj.estado === "pendiente" && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setAjustes((prev) =>
                          prev.map((a) =>
                            a.id === aj.id
                              ? {
                                  ...a,
                                  estado: "aceptado",
                                  etapasPago: [
                                    {
                                      ...a.etapasPago[0],
                                      estado: "habilitado",
                                    },
                                  ],
                                }
                              : a,
                          ),
                        );
                        mostrarToast(
                          "✅ Ajuste aceptado · Carlos fue notificado",
                        );
                      }}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: "var(--r-md)",
                        background: "var(--verde)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--fuente)",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      ✓ Aceptar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAjustes((prev) =>
                          prev.map((a) =>
                            a.id === aj.id ? { ...a, estado: "rechazado" } : a,
                          ),
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: "var(--r-md)",
                        background: "none",
                        color: "var(--tp-rojo)",
                        border: "1px solid rgba(184,64,48,0.25)",
                        cursor: "pointer",
                        fontFamily: "var(--fuente)",
                        fontSize: 13,
                      }}
                    >
                      Rechazar
                    </button>
                  </div>
                )}

                {/* Barra de avance del ajuste (si aceptado) */}
                {aj.estado === "aceptado" && (
                  <div
                    style={{
                      marginBottom: 10,
                      padding: "10px 12px",
                      borderRadius: "var(--r-md)",
                      background: "rgba(42,125,90,0.06)",
                      border: "1px solid rgba(42,125,90,0.15)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--tp-marron-suave)",
                        }}
                      >
                        Avance de este ajuste
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 900,
                          color: "var(--verde)",
                        }}
                      >
                        {aj.avancePropuesto}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 5,
                        background: "rgba(61,31,31,0.08)",
                        overflow: "hidden",
                        position: "relative",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          borderRadius: 5,
                          background: "var(--verde)",
                          width: `${aj.avancePropuesto}%`,
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--tp-marron-suave)",
                        margin: 0,
                      }}
                    >
                      Avance acordado en este ajuste
                    </p>
                  </div>
                )}

                {/* Etapas de pago del ajuste (si aceptado) */}
                {aj.estado === "aceptado" &&
                  aj.etapasPago.map((ep) => (
                    <div
                      key={ep.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: "var(--r-md)",
                        background: "var(--tp-crema)",
                        border: "1px solid rgba(61,31,31,0.08)",
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
                          {ep.label}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--tp-marron-suave)",
                            margin: 0,
                          }}
                        >
                          ${fmt(ep.monto)}
                        </p>
                      </div>
                      {ep.estado === "habilitado" ? (
                        <button
                          type="button"
                          onClick={() => navPago(ep.monto, ep.label)}
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
                            background:
                              ep.estado === "pagado"
                                ? "rgba(42,125,90,0.12)"
                                : "rgba(61,31,31,0.05)",
                            color:
                              ep.estado === "pagado"
                                ? "var(--verde)"
                                : "var(--tp-marron-suave)",
                          }}
                        >
                          {ep.estado === "pagado" ? "Pagado ✓" : "🔒 Bloqueado"}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}

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
                ${fmt(montoTotal)}
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
                Pagado
              </p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--verde)",
                  margin: 0,
                }}
              >
                ${fmt(montoPagado)}
              </p>
            </div>
          </div>
          {/* Barra de pago */}
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
                width: `${Math.round((montoPagado / montoTotal) * 100)}%`,
              }}
            />
          </div>
          {/* Etapas */}
          {trabajoData.etapasPago.map((e) => (
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
                  ${fmt(e.monto)}
                </p>
              </div>
              {e.estado === "habilitado" ? (
                <button
                  type="button"
                  onClick={() => navPago(e.monto, e.label)}
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
                  {e.estado === "pagado" ? "Pagado ✓" : "🔒 Bloqueado"}
                </span>
              )}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 10,
              borderTop: "1px solid rgba(61,31,31,0.08)",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>
              Saldo pendiente
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "var(--tp-marron)",
              }}
            >
              ${fmt(montoTotal - montoPagado)}
            </span>
          </div>
        </div>

        {/* Calificar: solo cuando avance 100% aprobado Y pagado 100% */}
        {avanceAprobado === 100 && montoPagado >= montoTotal && (
          <div style={{ marginTop: 4, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/calificacion?solNombre=${encodeURIComponent(sol.nombre)}&solOficio=${encodeURIComponent(sol.oficio)}`,
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
              ⭐ Calificar a {sol.nombre}
            </button>
            <p
              style={{
                fontSize: 11,
                color: "var(--tp-marron-suave)",
                textAlign: "center",
                margin: "6px 0 0",
                fontFamily: "var(--fuente)",
              }}
            >
              Trabajo completado y pagado al 100%
            </p>
          </div>
        )}
        {/* Si terminó pero falta pagar, mostrar aviso */}
        {avanceAprobado === 100 && montoPagado < montoTotal && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--r-md)",
              background: "rgba(245,200,66,0.12)",
              border: "1px solid rgba(245,200,66,0.35)",
              marginTop: 4,
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#8C6820",
                margin: "0 0 3px",
                fontFamily: "var(--fuente)",
              }}
            >
              ⏳ Trabajo terminado — pago pendiente
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#8C6820",
                margin: 0,
                fontFamily: "var(--fuente)",
              }}
            >
              Completá el pago para habilitar la calificación del solucionador.
            </p>
          </div>
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
