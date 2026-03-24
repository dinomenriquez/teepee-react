import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";
import {
  Plus,
  Send,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit3,
  ChevronRight,
  X,
} from "lucide-react";

// ── SOLICITUDES que vienen del HomeSolucionador ────────────────
const SOLICITUDES_HOME = [
  {
    id: 1,
    cliente: "Laura Pérez",
    inicial: "L",
    color: "#B84030",
    servicio: "Pérdida de agua en baño principal",
    descripcionDetallada:
      "Hay una pérdida importante debajo de la pileta del baño principal. El piso ya está húmedo y hay manchas en el cielorraso del piso de abajo. Urgente antes de que empeore.",
    direccion: "Av. Mitre 1240, Piso 3, Dpto B — Posadas",
    distancia: "2.3 km",
    presupuestoEstimado: "$15.000 - $25.000",
    urgente: false,
    fotos: 2,
    disponibilidad: [
      { dia: "Lun", turnos: ["7-12", "15-19"] },
      { dia: "Mié", turnos: ["7-12"] },
      { dia: "Sáb", turnos: ["7-12", "12-15"] },
    ],
    horaPuntual: null,
  },
  {
    id: 2,
    cliente: "Roberto Silva",
    inicial: "R",
    color: "#2A7D5A",
    servicio: "Instalación de calefón nuevo",
    descripcionDetallada:
      "Tengo un calefón nuevo marca Orbis 13 litros que compré pero no tengo quién lo instale. El viejo se rompió hace una semana. También necesito que revisen la conexión de gas.",
    direccion: "San Lorenzo 456, Posadas",
    distancia: "4.1 km",
    presupuestoEstimado: "$30.000 - $45.000",
    urgente: true,
    fotos: 1,
    disponibilidad: [
      { dia: "Mar", turnos: ["15-19", "19-21"] },
      { dia: "Jue", turnos: ["15-19"] },
    ],
    horaPuntual: "08:30",
  },
  {
    id: 3,
    cliente: "Diego Fernández",
    inicial: "D",
    color: "#8C6820",
    servicio: "Cambio de canilla y sifón cocina",
    descripcionDetallada:
      "La canilla de la cocina gotea constantemente y el sifón está roto. Quisiera reemplazarla por una monocomando.",
    direccion: "Junín 789, Posadas",
    distancia: "1.8 km",
    presupuestoEstimado: "$8.000 - $15.000",
    urgente: false,
    fotos: 0,
    disponibilidad: [
      { dia: "Vie", turnos: ["7-12"] },
      { dia: "Sáb", turnos: ["7-12", "12-15", "15-19"] },
    ],
    horaPuntual: null,
  },
];

// ── MOCKS ─────────────────────────────────────────────────────
const PRESUPUESTOS_MOCK = [
  {
    id: 1,
    cliente: "Martín García",
    inicial: "M",
    color: "#B84030",
    servicio: "Pérdida de agua en baño principal",
    estado: "por_enviar",
    fecha: "Hoy",
    monto: null,
    solicitud: {
      descripcionDetallada:
        "Hay una pérdida importante debajo de la pileta del baño principal. El piso ya está húmedo y hay manchas en el cielorraso del piso de abajo. Urgente antes de que empeore.",
      urgente: false,
      direccion: "Av. Mitre 1240, Piso 3, Dpto B — Posadas",
      distancia: "1.2 km",
      presupuestoEstimado: "$15.000 - $25.000",
      disponibilidad: [
        { dia: "Lun", turnos: ["7-12", "15-19"] },
        { dia: "Mié", turnos: ["7-12"] },
        { dia: "Sáb", turnos: ["7-12", "12-15"] },
      ],
      horaPuntual: null,
      fotos: 2,
    },
  },
  {
    id: 2,
    cliente: "Laura Sánchez",
    inicial: "L",
    color: "#2A7D5A",
    servicio: "Instalación calefón nuevo",
    estado: "esperando",
    fecha: "Hace 2 hs",
    monto: 32000,
    etapas: "50/50",
    solicitud: {
      descripcionDetallada:
        "Tengo un calefón nuevo marca Orbis 13 litros que compré pero no tengo quién lo instale. El viejo se rompió hace una semana. También necesito que revisen la conexión de gas.",
      urgente: true,
      direccion: "San Lorenzo 456, Posadas",
      distancia: "3.4 km",
      presupuestoEstimado: "$30.000 - $45.000",
      disponibilidad: [
        { dia: "Mar", turnos: ["15-19", "19-21"] },
        { dia: "Jue", turnos: ["15-19"] },
      ],
      horaPuntual: "08:30",
      fotos: 1,
    },
  },
  {
    id: 3,
    cliente: "Diego Fernández",
    inicial: "D",
    color: "#8C6820",
    servicio: "Cambio de canilla cocina",
    estado: "aceptado",
    fecha: "Ayer",
    monto: 8500,
    etapas: "total",
    solicitud: {
      descripcionDetallada:
        "La canilla de la cocina gotea constantemente. Es una canilla de dos llaves, vieja. Me gustaría reemplazarla por una monocomando.",
      urgente: false,
      direccion: "Junín 789, Posadas",
      distancia: "2.1 km",
      presupuestoEstimado: "$8.000 - $12.000",
      disponibilidad: [
        { dia: "Vie", turnos: ["7-12"] },
        { dia: "Sáb", turnos: ["7-12", "12-15", "15-19"] },
      ],
      horaPuntual: null,
      fotos: 0,
    },
  },
  {
    id: 4,
    cliente: "Roberto Silva",
    inicial: "R",
    color: "#534AB7",
    servicio: "Reparación cañería externa",
    estado: "borrador",
    fecha: "Hace 3 días",
    monto: 45000,
    etapas: "30/40/30",
    solicitud: {
      descripcionDetallada:
        "Se rompió una cañería en el exterior de la casa, creo que es la de agua fría. Hay un charco permanente cerca de la medianera. La casa tiene 20 años.",
      urgente: false,
      direccion: "Salta 1122, Posadas",
      distancia: "4.8 km",
      presupuestoEstimado: "$40.000 - $60.000",
      disponibilidad: [
        { dia: "Lun", turnos: ["7-12"] },
        { dia: "Mié", turnos: ["7-12", "15-19"] },
      ],
      horaPuntual: "09:00",
      fotos: 3,
    },
  },
];

const ESTADO = {
  por_enviar: {
    label: "Por enviar",
    color: "#8C6820",
    bg: "#F5EAD0",
    icono: <AlertCircle size={11} />,
  },
  esperando: {
    label: "Esperando",
    color: "#2A7D5A",
    bg: "#D4EFE3",
    icono: <Clock size={11} />,
  },
  aceptado: {
    label: "Aceptado ✓",
    color: "#2A7D5A",
    bg: "#D4EFE3",
    icono: <CheckCircle size={11} />,
  },
  borrador: {
    label: "Borrador",
    color: "#8C5A5A",
    bg: "rgba(61,31,31,0.08)",
    icono: <Edit3 size={11} />,
  },
};

// ── FORMULARIO ─────────────────────────────────────────────────
function Formulario({ solicitud, onVolver, onEnviar, navigate }) {
  const [paso, setPaso] = useState(1);
  const [tipo, setTipo] = useState("cerrado");
  const [monto, setMonto] = useState("");
  const [montoMin, setMontoMin] = useState("");
  const [montoMax, setMontoMax] = useState("");
  const [descripcionTrabajo, setDescripcionTrabajo] = useState("");
  const [etapas, setEtapas] = useState("total");
  const [garantia, setGarantia] = useState("30");
  const [materiales, setMateriales] = useState(true);
  const [validez, setValidez] = useState("7");
  const [modalVisita, setModalVisita] = useState(false);
  const [costoVisita, setCostoVisita] = useState("");
  const [enviandoChat, setEnviandoChat] = useState(false);
  const sol = solicitud.solicitud;

  const etapasOpciones = [
    { id: "total", label: "100%", sub: "Pago total al finalizar" },
    { id: "5050", label: "50 / 50", sub: "Anticipo + cierre" },
    { id: "304030", label: "30 / 40 / 30", sub: "Anticipo + avance + cierre" },
    { id: "custom", label: "A convenir", sub: "Lo definís con el cliente" },
  ];

  const montoFinal =
    tipo === "cerrado"
      ? monto
        ? `$${Number(monto).toLocaleString()}`
        : ""
      : montoMin && montoMax
        ? `$${Number(montoMin).toLocaleString()} – $${Number(montoMax).toLocaleString()}`
        : "";

  const paso1Completo = tipo === "cerrado" ? !!monto : !!(montoMin && montoMax);

  function enviarAlChat() {
    setEnviandoChat(true);
    const montoEncode = encodeURIComponent(montoFinal || "A convenir");
    const etapasEncode = encodeURIComponent(
      etapas === "total"
        ? "Pago total"
        : etapas === "5050"
          ? "50% anticipo · 50% cierre"
          : etapas === "304030"
            ? "30% anticipo · 40% avance · 30% cierre"
            : "A convenir con el cliente",
    );
    const garantiaEncode = encodeURIComponent(
      garantia === "0" ? "Sin garantía" : `${garantia} días`,
    );
    const matEncode = encodeURIComponent(
      materiales ? "Incluidos" : "No incluidos",
    );
    setTimeout(() => {
      navigate(
        `/chat-s?usuarioId=1&nombre=${encodeURIComponent(solicitud.cliente)}&inicial=${solicitud.inicial}&mensaje=presupuesto&monto=${montoEncode}&etapas=${etapasEncode}&garantia=${garantiaEncode}&materiales=${matEncode}`,
      );
    }, 400);
  }

  return (
    <div style={{ fontFamily: "var(--fuente)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <button
          onClick={paso === 2 ? () => setPaso(1) : onVolver}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "var(--tp-marron-suave)",
            display: "flex",
          }}
        >
          <IconoVolver size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "var(--tp-marron)",
              margin: 0,
            }}
          >
            {paso === 1 ? "Armar presupuesto" : "Condiciones"}
          </p>
          <p
            style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}
          >
            Paso {paso} de 2 · {solicitud.cliente}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate(
              `/chat-s?usuarioId=1&nombre=${encodeURIComponent(solicitud.cliente)}&inicial=${solicitud.inicial}`,
            )
          }
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid rgba(61,31,31,0.15)",
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--tp-marron-suave)",
          }}
          title="Chatear con el cliente"
        >
          <MessageCircle size={16} />
        </button>
      </div>

      {/* Barra de progreso */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[1, 2].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: paso >= n ? "var(--tp-rojo)" : "rgba(61,31,31,0.10)",
            }}
          />
        ))}
      </div>

      {/* ── DETALLE DE LA SOLICITUD (siempre visible) ── */}
      {sol && (
        <div
          style={{
            ...sCard,
            marginBottom: 14,
            background: "var(--tp-crema-oscura)",
            border: "1px solid rgba(61,31,31,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: solicitud.color,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {solicitud.inicial}
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--tp-marron)",
                  margin: 0,
                }}
              >
                {solicitud.cliente}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--tp-marron-suave)",
                  margin: 0,
                }}
              >
                {solicitud.servicio}
              </p>
            </div>
            {sol.urgente && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  fontWeight: 700,
                  background: "var(--tp-rojo)",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                🚨 URGENTE
              </span>
            )}
          </div>

          {/* Descripción detallada */}
          <p
            style={{
              fontSize: 13,
              color: "var(--tp-marron)",
              margin: 0,
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            "{sol.descripcionDetallada}"
          </p>

          {/* Datos clave */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              marginTop: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ fontSize: 13, flexShrink: 0 }}>📍</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>
                {sol.direccion} · {sol.distancia}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ fontSize: 13, flexShrink: 0 }}>💰</span>
              <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>
                Rango esperado: {sol.presupuestoEstimado}
              </span>
            </div>
            {sol.fotos > 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13 }}>📷</span>
                  <span
                    style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}
                  >
                    {sol.fotos} foto{sol.fotos > 1 ? "s" : ""} adjunta
                    {sol.fotos > 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {Array.from({ length: sol.fotos }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 10,
                        background: "rgba(61,31,31,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        border: "1px solid rgba(61,31,31,0.10)",
                      }}
                    >
                      📷
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Disponibilidad */}
          <div style={{ marginTop: 6 }}>
            <p style={{ ...sLabel, marginBottom: 6 }}>
              Disponibilidad del cliente
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sol.disponibilidad.map((fila, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--tp-marron)",
                      width: 28,
                      flexShrink: 0,
                    }}
                  >
                    {fila.dia}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {fila.turnos.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 20,
                          background: "rgba(61,31,31,0.10)",
                          color: "var(--tp-marron)",
                          fontWeight: 600,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {sol.horaPuntual && (
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--tp-rojo)",
                    margin: "2px 0 0",
                    fontWeight: 600,
                  }}
                >
                  ⏰ Hora puntual preferida: {sol.horaPuntual}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 1: Tipo, monto y descripción ── */}
      {paso === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Tipo de precio */}
          <div style={sCard}>
            <p style={sLabel}>¿Cómo es el precio?</p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                {
                  id: "cerrado",
                  emoji: "🔒",
                  titulo: "Precio fijo",
                  sub: "Monto exacto",
                },
                {
                  id: "estimado",
                  emoji: "🔍",
                  titulo: "Con visita",
                  sub: "Requiere ver el trabajo",
                },
              ].map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => {
                    setTipo(op.id);
                    if (op.id === "estimado") setModalVisita(true);
                  }}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: "var(--r-md)",
                    cursor: "pointer",
                    fontFamily: "var(--fuente)",
                    textAlign: "center",
                    border: "none",
                    background:
                      tipo === op.id
                        ? "var(--tp-marron)"
                        : "rgba(61,31,31,0.06)",
                    color:
                      tipo === op.id ? "var(--tp-crema)" : "var(--tp-marron)",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>
                    {op.emoji}
                  </div>
                  <p
                    style={{ fontSize: 12, fontWeight: 700, margin: "0 0 2px" }}
                  >
                    {op.titulo}
                  </p>
                  <p style={{ fontSize: 10, opacity: 0.7, margin: 0 }}>
                    {op.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Monto */}
          <div style={sCard}>
            <p style={sLabel}>
              {tipo === "cerrado" ? "Monto total" : "Rango estimado"}
            </p>
            {tipo === "cerrado" ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontSize: 24,
                    color: "var(--tp-marron-suave)",
                    fontWeight: 300,
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: 32,
                    fontWeight: 900,
                    color: "var(--tp-marron)",
                    border: "none",
                    background: "none",
                    outline: "none",
                    fontFamily: "var(--fuente)",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 4 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--tp-marron-suave)",
                      flexShrink: 0,
                    }}
                  >
                    $ mín
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={montoMin}
                    onChange={(e) => setMontoMin(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "var(--tp-marron)",
                      border: "none",
                      background: "none",
                      outline: "none",
                      fontFamily: "var(--fuente)",
                    }}
                  />
                </div>
                <span
                  style={{ color: "var(--tp-marron-suave)", flexShrink: 0 }}
                >
                  —
                </span>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 4 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--tp-marron-suave)",
                      flexShrink: 0,
                    }}
                  >
                    $ máx
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={montoMax}
                    onChange={(e) => setMontoMax(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "var(--tp-marron)",
                      border: "none",
                      background: "none",
                      outline: "none",
                      fontFamily: "var(--fuente)",
                    }}
                  />
                </div>
              </div>
            )}
            {costoVisita && tipo === "estimado" && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--tp-marron-suave)",
                  margin: 0,
                }}
              >
                + ${Number(costoVisita).toLocaleString()} costo de visita (se
                descuenta del total)
              </p>
            )}
          </div>

          {/* Descripción del trabajo */}
          <div style={sCard}>
            <p style={sLabel}>¿Qué incluye el trabajo?</p>
            <textarea
              placeholder="Describí qué vas a hacer, qué incluye, y qué no incluye..."
              value={descripcionTrabajo}
              onChange={(e) => setDescripcionTrabajo(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                fontSize: 13,
                color: "var(--tp-marron)",
                border: "none",
                background: "none",
                outline: "none",
                fontFamily: "var(--fuente)",
                resize: "none",
                lineHeight: 1.7,
              }}
            />
          </div>

          <button
            type="button"
            disabled={!paso1Completo}
            onClick={() => setPaso(2)}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: "var(--r-md)",
              cursor: paso1Completo ? "pointer" : "not-allowed",
              fontFamily: "var(--fuente)",
              fontSize: 15,
              fontWeight: 700,
              border: "none",
              background: paso1Completo
                ? "var(--tp-marron)"
                : "rgba(61,31,31,0.15)",
              color: paso1Completo
                ? "var(--tp-crema)"
                : "var(--tp-marron-suave)",
            }}
          >
            Continuar →
          </button>
        </div>
      )}

      {/* ── PASO 2: Condiciones de pago ── */}
      {paso === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Resumen del paso 1 */}
          <div
            style={{
              ...sCard,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={sLabel}>Monto acordado</p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "var(--tp-marron)",
                  margin: 0,
                }}
              >
                {montoFinal}
              </p>
            </div>
            <button
              onClick={() => setPaso(1)}
              style={{
                fontSize: 12,
                color: "var(--tp-rojo)",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
                fontWeight: 600,
              }}
            >
              Cambiar
            </button>
          </div>

          {/* Forma de cobro */}
          <div style={sCard}>
            <p style={sLabel}>¿Cómo cobrás?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {etapasOpciones.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setEtapas(op.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: "var(--r-md)",
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "var(--fuente)",
                    textAlign: "left",
                    background:
                      etapas === op.id
                        ? "var(--tp-marron)"
                        : "rgba(61,31,31,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${etapas === op.id ? "var(--tp-crema)" : "rgba(61,31,31,0.25)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {etapas === op.id && (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "var(--tp-crema)",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        margin: 0,
                        color:
                          etapas === op.id
                            ? "var(--tp-crema)"
                            : "var(--tp-marron)",
                      }}
                    >
                      {op.label}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        margin: 0,
                        color:
                          etapas === op.id
                            ? "rgba(240,234,214,0.7)"
                            : "var(--tp-marron-suave)",
                      }}
                    >
                      {op.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Garantía + Materiales */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div style={sCard}>
              <p style={sLabel}>Garantía</p>
              <select
                value={garantia}
                onChange={(e) => setGarantia(e.target.value)}
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--tp-marron)",
                  border: "none",
                  background: "none",
                  fontFamily: "var(--fuente)",
                  width: "100%",
                }}
              >
                <option value="0">Sin garantía</option>
                <option value="7">7 días</option>
                <option value="15">15 días</option>
                <option value="30">30 días</option>
                <option value="60">60 días</option>
              </select>
            </div>
            <div style={sCard}>
              <p style={sLabel}>Materiales</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    onClick={() => setMateriales(v)}
                    style={{
                      flex: 1,
                      padding: "6px 4px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      border: "none",
                      fontFamily: "var(--fuente)",
                      background:
                        materiales === v
                          ? "var(--tp-marron)"
                          : "rgba(61,31,31,0.06)",
                      color:
                        materiales === v
                          ? "var(--tp-crema)"
                          : "var(--tp-marron-suave)",
                    }}
                  >
                    {v ? "Incluidos" : "Sin mat."}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Validez */}
          <div
            style={{
              ...sCard,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ ...sLabel, margin: 0 }}>Válido por</p>
            <select
              value={validez}
              onChange={(e) => setValidez(e.target.value)}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--tp-marron)",
                border: "none",
                background: "none",
                fontFamily: "var(--fuente)",
              }}
            >
              <option value="3">3 días</option>
              <option value="5">5 días</option>
              <option value="7">7 días</option>
              <option value="15">15 días</option>
            </select>
          </div>

          {/* Botones de envío */}
          <button
            type="button"
            onClick={enviarAlChat}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: "var(--r-md)",
              background: "var(--tp-rojo)",
              color: "var(--tp-crema)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              fontSize: 15,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: enviandoChat ? 0.7 : 1,
            }}
          >
            <MessageCircle size={16} /> Enviar al chat del cliente
          </button>

          <button
            type="button"
            onClick={onEnviar}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: "var(--r-md)",
              background: "none",
              color: "var(--tp-marron)",
              border: "1.5px solid rgba(61,31,31,0.20)",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Send size={14} /> Enviar sin chat
          </button>

          <button
            type="button"
            onClick={onVolver}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: "var(--r-md)",
              background: "none",
              color: "var(--tp-marron-suave)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              fontSize: 13,
            }}
          >
            Guardar borrador
          </button>
        </div>
      )}

      {/* Modal visita previa */}
      {modalVisita && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(61,31,31,0.6)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              background: "var(--tp-crema)",
              borderRadius: "20px 20px 0 0",
              padding: 24,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--tp-marron)",
                  margin: 0,
                  fontFamily: "var(--fuente)",
                }}
              >
                🔍 Visita previa
              </p>
              <button
                onClick={() => setModalVisita(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--tp-marron-suave)",
                marginBottom: 16,
                fontFamily: "var(--fuente)",
                lineHeight: 1.6,
              }}
            >
              Podés cobrar un costo de visita para evaluar el trabajo. Si el
              cliente acepta el presupuesto final, ese monto se descuenta del
              total.
            </p>
            <div style={sCard}>
              <p style={sLabel}>Costo de visita</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 20, color: "var(--tp-marron-suave)" }}>
                  $
                </span>
                <input
                  type="number"
                  placeholder="0  (dejar en 0 si es gratis)"
                  value={costoVisita}
                  onChange={(e) => setCostoVisita(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: 24,
                    fontWeight: 800,
                    color: "var(--tp-marron)",
                    border: "none",
                    background: "none",
                    outline: "none",
                    fontFamily: "var(--fuente)",
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalVisita(false)}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: "var(--r-md)",
                background: "var(--tp-marron)",
                color: "var(--tp-crema)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
                fontSize: 14,
                fontWeight: 700,
                marginTop: 14,
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ESTILOS ────────────────────────────────────────────────────
const sCard = {
  background: "var(--tp-crema-clara)",
  borderRadius: "var(--r-md)",
  padding: 14,
  border: "1px solid rgba(61,31,31,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
const sLabel = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--tp-marron-suave)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: 0,
  fontFamily: "var(--fuente)",
  display: "flex",
  alignItems: "center",
};

// ── PANTALLA LISTA ─────────────────────────────────────────────
export default function PresupuestosS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const solicitudIdParam = searchParams.get("solicitudId");

  // Buscar solicitud por id si viene de HomeSolucionador
  const solicitudDesdeHome = solicitudIdParam
    ? (() => {
        const s = SOLICITUDES_HOME.find(
          (x) => x.id === Number(solicitudIdParam),
        );
        if (!s) return null;
        return {
          cliente: s.cliente,
          inicial: s.inicial,
          color: s.color,
          servicio: s.servicio,
          monto: null,
          solicitud: {
            descripcionDetallada: s.descripcionDetallada,
            direccion: s.direccion,
            distancia: s.distancia,
            presupuestoEstimado: s.presupuestoEstimado,
            urgente: s.urgente,
            fotos: s.fotos,
            disponibilidad: s.disponibilidad,
            horaPuntual: s.horaPuntual,
          },
        };
      })()
    : null;

  const [formulario, setFormulario] = useState(solicitudDesdeHome);
  const [toast, setToast] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const presupuestosFiltrados =
    filtro === "todos"
      ? PRESUPUESTOS_MOCK
      : filtro === "pendientes"
        ? PRESUPUESTOS_MOCK.filter(
            (p) => p.estado === "por_enviar" || p.estado === "borrador",
          )
        : PRESUPUESTOS_MOCK.filter(
            (p) => p.estado === "esperando" || p.estado === "aceptado",
          );

  if (formulario) {
    return (
      <div
        style={{
          background: "var(--tp-crema)",
          minHeight: "100vh",
          padding: "16px 16px 90px",
        }}
      >
        <Formulario
          solicitud={formulario}
          navigate={navigate}
          onVolver={() => setFormulario(null)}
          onEnviar={() => {
            setFormulario(null);
            mostrarToast("✅ Presupuesto enviado");
          }}
        />
        {toast && <div style={sToast}>{toast}</div>}
        <NavInferiorS />
      </div>
    );
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
        <h1
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--tp-marron)",
            margin: 0,
            flex: 1,
          }}
        >
          Presupuestos
        </h1>
        <button
          type="button"
          onClick={() =>
            setFormulario({
              cliente: "",
              servicio: "",
              inicial: "C",
              color: "#B84030",
              monto: null,
            })
          }
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--tp-marron)",
            color: "var(--tp-crema)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={18} />
        </button>
      </header>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(61,31,31,0.06)",
        }}
      >
        {[
          { id: "todos", label: "Todos" },
          { id: "pendientes", label: "Por enviar" },
          { id: "enviados", label: "Enviados" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--r-full)",
              cursor: "pointer",
              fontFamily: "var(--fuente)",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              background:
                filtro === f.id ? "var(--tp-marron)" : "rgba(61,31,31,0.06)",
              color:
                filtro === f.id ? "var(--tp-crema)" : "var(--tp-marron-suave)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 80,
        }}
      >
        {presupuestosFiltrados.map((p) => {
          const est = ESTADO[p.estado];
          return (
            <div
              key={p.id}
              style={{
                background: "var(--tp-crema-clara)",
                borderRadius: "var(--r-lg)",
                padding: 14,
                border: "1px solid rgba(61,31,31,0.08)",
              }}
            >
              {/* Cabecera tarjeta */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: p.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {p.inicial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--tp-marron)",
                      margin: "0 0 2px",
                    }}
                  >
                    {p.cliente}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--tp-marron-suave)",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.servicio}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: "var(--r-full)",
                    background: est.bg,
                    color: est.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    flexShrink: 0,
                  }}
                >
                  {est.icono} {est.label}
                </span>
              </div>

              {/* Monto + etapas */}
              {p.monto && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: "rgba(61,31,31,0.04)",
                    marginBottom: 10,
                  }}
                >
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "var(--tp-marron)",
                      margin: 0,
                    }}
                  >
                    ${p.monto.toLocaleString()}
                  </p>
                  <span
                    style={{
                      width: 1,
                      height: 18,
                      background: "rgba(61,31,31,0.15)",
                    }}
                  />
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--tp-marron-suave)",
                      margin: 0,
                    }}
                  >
                    {p.etapas === "total" ? "Pago total" : `Etapas ${p.etapas}`}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--tp-marron-suave)",
                    flex: 1,
                  }}
                >
                  {p.fecha}
                </span>

                {/* Chat siempre disponible */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/chat-s?usuarioId=1&nombre=${encodeURIComponent(p.cliente)}&inicial=${p.inicial}`,
                    )
                  }
                  style={{
                    width: 32,
                    height: 32,
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
                  <MessageCircle size={14} />
                </button>

                {(p.estado === "por_enviar" || p.estado === "borrador") && (
                  <button
                    type="button"
                    onClick={() => setFormulario(p)}
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
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    {p.estado === "borrador" ? "Editar" : "Presupuestar"}{" "}
                    <ChevronRight size={13} />
                  </button>
                )}

                {p.estado === "esperando" && (
                  <button
                    type="button"
                    onClick={() => setFormulario(p)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "var(--r-full)",
                      background: "rgba(61,31,31,0.08)",
                      color: "var(--tp-marron)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--fuente)",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Ver
                  </button>
                )}

                {p.estado === "aceptado" && (
                  <span
                    style={{
                      padding: "7px 12px",
                      borderRadius: "var(--r-full)",
                      background: "var(--verde-suave)",
                      color: "var(--verde)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    ✓ Acordado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast && <div style={sToast}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}

const sToast = {
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
};
