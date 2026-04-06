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

// Para comisiones: siempre 2 decimales
function fmtCom(n) {
  const num = Number(n);
  if (isNaN(num)) return "0,00";
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
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
// Formato monetario argentino: punto en miles, coma en decimales
function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: 2,
  });
}

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
  const [mostrarVisita, setMostrarVisita] = useState(false);
  const [anticipo, setAnticipo] = useState("30");
  const [items, setItems] = useState([]); // items del presupuesto
  const [mostrarItems, setMostrarItems] = useState(false);
  const sol = solicitud.solicitud;
  const COM = 0.06;
  const montoNum =
    tipo === "cerrado"
      ? Number(monto)
      : montoMin && montoMax
        ? (Number(montoMin) + Number(montoMax)) / 2
        : 0;
  const montoItemizado = items.reduce(
    (s, i) => s + Number(i.precio) * Number(i.cantidad || 1),
    0,
  );
  const montoBase =
    mostrarItems && montoItemizado > 0 ? montoItemizado : montoNum;
  const netoSol = montoBase * (1 - COM);
  const comisionApp = montoBase * COM;

  const etapasOpciones = [
    {
      id: "total",
      label: "100% al cierre",
      sub: "Pago total al finalizar el trabajo",
    },
    {
      id: "anticipo",
      label: "Anticipo + saldo al cierre",
      sub: "Proponé un % de anticipo",
    },
    {
      id: "etapas",
      label: "Anticipo + avance + cierre",
      sub: "Pago en 3 etapas según avance",
    },
    {
      id: "convenir",
      label: "A convenir",
      sub: "Lo definís directamente con el cliente",
    },
  ];

  const montoFinal =
    tipo === "cerrado"
      ? monto
        ? `$${fmt(monto)}`
        : ""
      : montoMin && montoMax
        ? `$${fmt(montoMin)} – $${fmt(montoMax)}`
        : "";

  const paso1Completo =
    tipo === "cerrado" ? (mostrarItems ? montoItemizado > 0 : !!monto) : true;

  function enviarAlChat() {
    setEnviandoChat(true);
    const montoBase2 =
      mostrarItems && montoItemizado > 0 ? montoItemizado : montoNum;
    const montoDisplay =
      tipo === "cerrado"
        ? mostrarItems && montoItemizado > 0
          ? `$${fmt(montoItemizado)}`
          : monto
            ? `$${fmt(monto)}`
            : "A confirmar"
        : montoMin || montoMax
          ? `$${fmt(montoMin)} – $${fmt(montoMax)}`
          : "A confirmar tras la visita";
    const montoEncode = encodeURIComponent(montoDisplay);
    const etapasEncode = encodeURIComponent(
      etapas === "total"
        ? "100% al cierre del trabajo"
        : etapas === "anticipo"
          ? `Anticipo ${anticipo}% + saldo al cierre`
          : etapas === "etapas"
            ? `Anticipo ${anticipo}% + avance + cierre`
            : "A convenir con el cliente",
    );
    const garantiaEncode = encodeURIComponent(
      garantia === "0" ? "Sin garantía" : `Garantía ${garantia} días`,
    );
    const matEncode = encodeURIComponent(
      materiales ? "Materiales incluidos" : "Materiales no incluidos",
    );
    const tipoEncode = encodeURIComponent(
      tipo === "cerrado"
        ? mostrarItems
          ? "Precio itemizado"
          : "Precio fijo"
        : "Con visita previa",
    );
    const descEncode = encodeURIComponent(descripcionTrabajo);
    const itemsEncode = mostrarItems
      ? encodeURIComponent(JSON.stringify(items))
      : "";
    const visitaEncode = encodeURIComponent(
      costoVisita ? `$${fmt(costoVisita)}` : "",
    );
    const netoEncode = encodeURIComponent(`$${fmtCom(montoBase2 * 0.94)}`);
    setTimeout(() => {
      navigate(
        `/chat-s?usuarioId=1&nombre=${encodeURIComponent(solicitud.cliente)}&inicial=${solicitud.inicial}&mensaje=presupuesto&monto=${montoEncode}&etapas=${etapasEncode}&garantia=${garantiaEncode}&materiales=${matEncode}&tipo=${tipoEncode}&desc=${descEncode}&neto=${fmtCom(netoEncode)}&visita=${visitaEncode}`,
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
              `/chat-s?usuarioId=1&nombre=${encodeURIComponent(solicitud.cliente)}&inicial=${solicitud.inicial}&desde=presupuestos-s&solicitudId=${solicitud.id || 1}&volverPaso=1`,
            )
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 10px",
            borderRadius: "var(--r-full)",
            border: "1px solid rgba(61,31,31,0.15)",
            background: "none",
            cursor: "pointer",
            fontFamily: "var(--fuente)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--tp-marron-suave)",
            whiteSpace: "nowrap",
          }}
        >
          <MessageCircle size={14} /> Consultar sobre el problema
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

      {/* Aclaración al solucionador */}
      <div
        style={{
          padding: "12px 14px",
          borderRadius: "var(--r-md)",
          background: "rgba(42,125,90,0.08)",
          border: "1px solid rgba(42,125,90,0.22)",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "#2A7D5A",
            margin: "0 0 6px",
            fontFamily: "var(--fuente)",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          Para enviar el presupuesto definí:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            "💰 Precio del trabajo",
            "💳 Forma de pago",
            "🛡️ Garantía",
            "🔧 Materiales incluidos o no",
            "📅 Validez del presupuesto",
          ].map((item) => (
            <p
              key={item}
              style={{
                fontSize: 12,
                color: "var(--tp-marron-suave)",
                margin: 0,
                fontFamily: "var(--fuente)",
              }}
            >
              {item}
            </p>
          ))}
        </div>
      </div>

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
                  sub: "Monto exacto propuesto",
                },
                {
                  id: "estimado",
                  emoji: "🔍",
                  titulo: "Precio con visita previa",
                  sub: "Se confirma luego de ver el trabajo",
                },
              ].map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => {
                    setTipo(op.id);
                    if (op.id === "estimado") setMostrarVisita(true);
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

            {/* Costo de visita — segundo nivel, compacto */}
            {tipo === "estimado" && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(61,31,31,0.04)",
                  border: "1px dashed rgba(61,31,31,0.15)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--tp-marron-suave)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    Costo de visita (opcional)
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 4,
                      flex: 1,
                    }}
                  >
                    <span
                      style={{ fontSize: 14, color: "var(--tp-marron-suave)" }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0 = gratis"
                      value={costoVisita}
                      onChange={(e) => setCostoVisita(e.target.value)}
                      style={{
                        flex: 1,
                        fontSize: 16,
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
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--tp-marron-suave)",
                    margin: 0,
                    fontFamily: "var(--fuente)",
                    lineHeight: 1.5,
                  }}
                >
                  El costo de visita está incluido en el monto total acordado.
                  Si el cliente no acepta el presupuesto luego de la visita, se
                  cobra aparte.
                </p>
              </div>
            )}
          </div>

          {/* Monto */}
          <div style={sCard}>
            <p style={sLabel}>
              {tipo === "cerrado" ? "Monto total" : "Rango estimado (opcional)"}
            </p>

            {tipo === "cerrado" ? (
              <>
                {/* Opción itemizado o monto único */}
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {[false, true].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setMostrarItems(v)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--fuente)",
                        fontSize: 11,
                        fontWeight: 600,
                        background:
                          mostrarItems === v
                            ? "var(--tp-marron)"
                            : "rgba(61,31,31,0.06)",
                        color:
                          mostrarItems === v
                            ? "var(--tp-crema)"
                            : "var(--tp-marron-suave)",
                      }}
                    >
                      {v ? "Valor itemizado" : "Valor total"}
                    </button>
                  ))}
                </div>

                {!mostrarItems ? (
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                  >
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
                  <div>
                    {/* Encabezados */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      <span
                        style={{
                          flex: 2,
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--tp-marron-suave)",
                          fontFamily: "var(--fuente)",
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}
                      >
                        Detalle ítem
                      </span>
                      <span
                        style={{
                          width: 50,
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--tp-marron-suave)",
                          fontFamily: "var(--fuente)",
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        Cant.
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--tp-marron-suave)",
                          fontFamily: "var(--fuente)",
                          textTransform: "uppercase",
                        }}
                      >
                        Precio unit.
                      </span>
                      <span style={{ width: 20 }} />
                    </div>
                    {items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 6,
                          marginBottom: 6,
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Descripción"
                          value={item.desc}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((x, j) =>
                                j === i ? { ...x, desc: e.target.value } : x,
                              ),
                            )
                          }
                          style={{
                            flex: 2,
                            padding: "6px 8px",
                            borderRadius: 8,
                            border: "1px solid rgba(61,31,31,0.15)",
                            fontFamily: "var(--fuente)",
                            fontSize: 12,
                            background: "var(--tp-crema)",
                            color: "var(--tp-marron)",
                            outline: "none",
                          }}
                        />
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((x, j) =>
                                j === i
                                  ? {
                                      ...x,
                                      cantidad: e.target.value.replace(
                                        /[^0-9.]/g,
                                        "",
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                          style={{
                            width: 50,
                            padding: "6px 6px",
                            borderRadius: 8,
                            border: "1px solid rgba(61,31,31,0.15)",
                            fontFamily: "var(--fuente)",
                            fontSize: 12,
                            background: "var(--tp-crema)",
                            color: "var(--tp-marron)",
                            outline: "none",
                            textAlign: "center",
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            padding: "4px 8px",
                            borderRadius: 8,
                            border: "1px solid rgba(61,31,31,0.15)",
                            background: "var(--tp-crema)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--tp-marron-suave)",
                              fontFamily: "var(--fuente)",
                            }}
                          >
                            $
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0"
                            value={item.precio}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((x, j) =>
                                  j === i
                                    ? {
                                        ...x,
                                        precio: e.target.value.replace(
                                          /[^0-9.]/g,
                                          "",
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                            style={{
                              width: "100%",
                              border: "none",
                              background: "none",
                              fontFamily: "var(--fuente)",
                              fontSize: 12,
                              color: "var(--tp-marron)",
                              outline: "none",
                              MozAppearance: "textfield",
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setItems((prev) => prev.filter((_, j) => j !== i))
                          }
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: "var(--tp-rojo)",
                            fontSize: 16,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setItems((prev) => [
                          ...prev,
                          { desc: "", cantidad: "1", precio: "" },
                        ])
                      }
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
                      + Agregar ítem
                    </button>
                    {montoItemizado > 0 && (
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          justifyContent: "space-between",
                          borderTop: "1px dashed rgba(61,31,31,0.12)",
                          paddingTop: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--tp-marron-suave)",
                            fontFamily: "var(--fuente)",
                          }}
                        >
                          Total itemizado
                        </span>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 900,
                            color: "var(--tp-marron)",
                            fontFamily: "var(--fuente)",
                          }}
                        >
                          ${fmt(montoItemizado)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Visita previa — rango opcional
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
                    placeholder="optativo"
                    value={montoMin}
                    onChange={(e) => setMontoMin(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 16,
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
                    placeholder="optativo"
                    value={montoMax}
                    onChange={(e) => setMontoMax(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 16,
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

            {/* Nota para el solucionador */}
            {tipo === "cerrado" && montoBase > 0 && (
              <p
                style={{
                  fontSize: 10,
                  color: "var(--tp-marron-suave)",
                  margin: "6px 0 0",
                  fontFamily: "var(--fuente)",
                  lineHeight: 1.4,
                  fontStyle: "italic",
                }}
              >
                ℹ️ El cliente solo verá el monto total. El desglose
                neto/comisión es solo para vos.
              </p>
            )}
            {/* Desglose neto/comisión — solo para precio fijo */}
            {tipo === "cerrado" && montoBase > 0 && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: "1px dashed rgba(61,31,31,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    Tu cobro neto (94%)
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--tp-marron)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    ${fmtCom(netoSol)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    Comisión TeePee (6%)
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    ${fmtCom(comisionApp)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(61,31,31,0.08)",
                    paddingTop: 4,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--tp-marron)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    Monto total al cliente
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: "var(--tp-marron)",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    ${fmt(montoBase)}
                  </span>
                </div>
              </div>
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

          {/* Confirmación del monto antes de continuar */}
          {paso1Completo && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "var(--r-md)",
                background: "var(--tp-marron)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(240,234,214,0.55)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 0 3px",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  {tipo === "cerrado" && !mostrarItems
                    ? "Monto total"
                    : tipo === "cerrado" && mostrarItems
                      ? "Total itemizado"
                      : "Precio con visita previa"}
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "var(--tp-crema)",
                    margin: 0,
                    fontFamily: "var(--fuente)",
                  }}
                >
                  {tipo === "cerrado" && !mostrarItems && monto
                    ? `$${fmt(monto)}`
                    : tipo === "cerrado" && mostrarItems && montoItemizado > 0
                      ? `$${fmt(montoItemizado)}`
                      : tipo === "estimado" && (montoMin || montoMax)
                        ? `$${fmt(montoMin)} – $${fmt(montoMax)}`
                        : tipo === "estimado"
                          ? "A confirmar tras la visita"
                          : "—"}
                </p>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(240,234,214,0.55)",
                  fontFamily: "var(--fuente)",
                }}
              >
                {tipo === "cerrado"
                  ? `Neto: $${fmtCom(netoSol)}`
                  : costoVisita
                    ? `Visita: $${fmt(costoVisita)}`
                    : ""}
              </span>
            </div>
          )}

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
                ? "var(--tp-rojo)"
                : "rgba(61,31,31,0.15)",
              color: paso1Completo
                ? "var(--tp-crema)"
                : "var(--tp-marron-suave)",
            }}
          >
            Continuar con este monto →
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
              <p style={sLabel}>Monto propuesto</p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "var(--tp-marron)",
                  margin: 0,
                }}
              >
                {montoFinal || (
                  <span
                    style={{ color: "var(--tp-marron-suave)", fontSize: 14 }}
                  >
                    Sin monto definido
                  </span>
                )}
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
            <p style={sLabel}>Forma de pago</p>
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

            {/* Anticipo — input de % cuando aplica */}
            {(etapas === "anticipo" || etapas === "etapas") && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(61,31,31,0.04)",
                  border: "1px solid rgba(61,31,31,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--tp-marron-suave)",
                    margin: "0 0 6px",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  % de anticipo propuesto
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={anticipo}
                    onChange={(e) => setAnticipo(e.target.value)}
                    style={{ flex: 1, accentColor: "var(--tp-rojo)" }}
                  />
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "var(--tp-rojo)",
                      fontFamily: "var(--fuente)",
                      minWidth: 40,
                      textAlign: "right",
                    }}
                  >
                    {anticipo}%
                  </span>
                </div>
                {/* Monto del anticipo en $ — segundo nivel */}
                {montoBase > 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "rgba(184,64,48,0.06)",
                      border: "1px solid rgba(184,64,48,0.12)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--tp-marron-suave)",
                        fontFamily: "var(--fuente)",
                      }}
                    >
                      Anticipo ({anticipo}%)
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 900,
                        color: "var(--tp-rojo)",
                        fontFamily: "var(--fuente)",
                      }}
                    >
                      ${fmtCom(montoBase * (anticipo / 100))}
                    </span>
                  </div>
                )}
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--tp-marron-suave)",
                    margin: "4px 0 0",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  El cliente deberá aceptar o proponer un % diferente
                </p>
              </div>
            )}
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
            <p style={{ ...sLabel, margin: 0 }}>Validez del presupuesto</p>
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
  const volverPasoParam = searchParams.get("volverPaso");
  const desdeParam = searchParams.get("desde") || "";
  const categoriaParam = searchParams.get("categoria");
  const descripcionParam = searchParams.get("descripcion");
  const direccionParam = searchParams.get("direccion");
  const urgenciaParam = searchParams.get("urgencia");
  const usuarioNomParam = searchParams.get("nombre");
  const usuarioIniParam = searchParams.get("inicial");

  // Solicitud que viene directamente desde Búsqueda (paso 3)
  const solicitudDesdeBusqueda =
    desdeParam === "busqueda" && categoriaParam
      ? {
          cliente: usuarioNomParam
            ? decodeURIComponent(usuarioNomParam)
            : "Laura Pérez",
          inicial: usuarioIniParam || "L",
          color: "#2A7D5A",
          servicio: categoriaParam
            ? decodeURIComponent(categoriaParam)
            : "Servicio",
          monto: null,
          solicitud: {
            descripcionDetallada: descripcionParam
              ? decodeURIComponent(descripcionParam)
              : "",
            direccion: direccionParam ? decodeURIComponent(direccionParam) : "",
            urgente: urgenciaParam === "Urgente",
            distancia: "Cercano",
            presupuestoEstimado: "A definir",
            disponibilidad: [],
            fotos: [],
          },
        }
      : null;

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

  const [formulario, setFormulario] = useState(
    solicitudDesdeBusqueda || solicitudDesdeHome,
  );
  // Si vuelve desde chat con volverPaso, ya viene con formulario cargado via solicitudDesdeHome
  const [verPresupuesto, setVerPresupuesto] = useState(null); // presupuesto a visualizar
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
          onVolver={() => {
            if (desdeParam === "home-solucionador") navigate(-1);
            else setFormulario(null);
          }}
          onEnviar={() => {
            setFormulario(null);
            mostrarToast("✅ Presupuesto enviado");
          }}
        />
        {/* Modal: Ver presupuesto completo */}
        {verPresupuesto && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(61,31,31,0.60)",
              zIndex: 200,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                background: "var(--tp-crema)",
                margin: "40px 16px 16px",
                borderRadius: "var(--r-lg)",
                padding: 24,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: "var(--tp-marron)",
                    margin: 0,
                    fontFamily: "var(--fuente)",
                  }}
                >
                  Resumen del presupuesto
                </p>
                <button
                  onClick={() => setVerPresupuesto(null)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 22,
                    color: "var(--tp-marron-suave)",
                  }}
                >
                  ✕
                </button>
              </div>
              {/* Cliente + servicio */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                  padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  background: "var(--tp-crema-clara)",
                  border: "1px solid rgba(61,31,31,0.08)",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: verPresupuesto.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  {verPresupuesto.inicial}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "var(--tp-marron)",
                      margin: 0,
                    }}
                  >
                    {verPresupuesto.cliente}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--tp-marron-suave)",
                      margin: 0,
                    }}
                  >
                    {verPresupuesto.servicio}
                  </p>
                </div>
              </div>
              {/* Descripción del cliente */}
              {verPresupuesto.solicitud?.descripcionDetallada && (
                <div
                  style={{
                    marginBottom: 12,
                    padding: "10px 12px",
                    borderRadius: "var(--r-md)",
                    background: "rgba(61,31,31,0.04)",
                    border: "1px solid rgba(61,31,31,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--tp-marron-suave)",
                      textTransform: "uppercase",
                      margin: "0 0 4px",
                    }}
                  >
                    Descripción del problema
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--tp-marron)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {verPresupuesto.solicitud.descripcionDetallada}
                  </p>
                </div>
              )}
              {/* Monto y condiciones */}
              {verPresupuesto.monto && (
                <div
                  style={{
                    marginBottom: 12,
                    padding: "12px 14px",
                    borderRadius: "var(--r-md)",
                    background: "var(--tp-marron)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(240,234,214,0.60)",
                      margin: "0 0 4px",
                    }}
                  >
                    Monto propuesto
                  </p>
                  <p
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: "var(--tp-crema)",
                      margin: "0 0 8px",
                    }}
                  >
                    ${fmt(verPresupuesto.monto)}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(240,234,214,0.70)",
                      margin: 0,
                    }}
                  >
                    {verPresupuesto.etapas === "total"
                      ? "100% al cierre"
                      : verPresupuesto.etapas === "50/50"
                        ? "Anticipo 50% + cierre 50%"
                        : verPresupuesto.etapas === "30/40/30"
                          ? "Anticipo 30% + avance 40% + cierre 30%"
                          : verPresupuesto.etapas}
                  </p>
                </div>
              )}
              {/* Dirección */}
              {verPresupuesto.solicitud?.direccion && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--tp-marron-suave)",
                    margin: "0 0 10px",
                  }}
                >
                  📍 {verPresupuesto.solicitud.direccion}
                </p>
              )}
              {/* Urgencia */}
              {verPresupuesto.solicitud?.urgente && (
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--tp-rojo)",
                    margin: "0 0 14px",
                  }}
                >
                  ⚡ Urgente
                </p>
              )}
              <button
                type="button"
                onClick={() => setVerPresupuesto(null)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: "var(--r-md)",
                  background: "var(--tp-marron)",
                  color: "var(--tp-crema)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

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
                padding: "14px 16px",
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

              {/* Monto + forma de pago */}
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
                    ${fmt(p.monto)}
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
                    {p.etapas === "total"
                      ? "100% al cierre"
                      : p.etapas === "50/50"
                        ? "Anticipo 50% + cierre 50%"
                        : p.etapas === "30/40/30"
                          ? "Anticipo 30% + avance 40% + cierre 30%"
                          : p.etapas === "anticipo"
                            ? "Anticipo + saldo al cierre"
                            : p.etapas === "etapas"
                              ? "Anticipo + avance + cierre"
                              : "A convenir"}
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
                    onClick={() => setVerPresupuesto(p)}
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

      {/* Modal: Ver presupuesto completo */}
      {verPresupuesto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(61,31,31,0.60)",
            zIndex: 200,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "var(--tp-crema)",
              margin: "40px 16px 16px",
              borderRadius: "var(--r-lg)",
              padding: 24,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: "var(--tp-marron)",
                  margin: 0,
                  fontFamily: "var(--fuente)",
                }}
              >
                Resumen del presupuesto
              </p>
              <button
                onClick={() => setVerPresupuesto(null)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 22,
                  color: "var(--tp-marron-suave)",
                }}
              >
                ✕
              </button>
            </div>
            {/* Cliente + servicio */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: "var(--r-md)",
                background: "var(--tp-crema-clara)",
                border: "1px solid rgba(61,31,31,0.08)",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: verPresupuesto.color,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {verPresupuesto.inicial}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "var(--tp-marron)",
                    margin: 0,
                  }}
                >
                  {verPresupuesto.cliente}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--tp-marron-suave)",
                    margin: 0,
                  }}
                >
                  {verPresupuesto.servicio}
                </p>
              </div>
            </div>
            {/* Descripción del cliente */}
            {verPresupuesto.solicitud?.descripcionDetallada && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(61,31,31,0.04)",
                  border: "1px solid rgba(61,31,31,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--tp-marron-suave)",
                    textTransform: "uppercase",
                    margin: "0 0 4px",
                  }}
                >
                  Descripción del problema
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--tp-marron)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {verPresupuesto.solicitud.descripcionDetallada}
                </p>
              </div>
            )}
            {/* Monto y condiciones */}
            {verPresupuesto.monto && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "12px 14px",
                  borderRadius: "var(--r-md)",
                  background: "var(--tp-marron)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(240,234,214,0.60)",
                    margin: "0 0 4px",
                  }}
                >
                  Monto propuesto
                </p>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "var(--tp-crema)",
                    margin: "0 0 8px",
                  }}
                >
                  ${fmt(verPresupuesto.monto)}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(240,234,214,0.70)",
                    margin: 0,
                  }}
                >
                  {verPresupuesto.etapas === "total"
                    ? "100% al cierre"
                    : verPresupuesto.etapas === "50/50"
                      ? "Anticipo 50% + cierre 50%"
                      : verPresupuesto.etapas === "30/40/30"
                        ? "Anticipo 30% + avance 40% + cierre 30%"
                        : verPresupuesto.etapas}
                </p>
              </div>
            )}
            {/* Dirección */}
            {verPresupuesto.solicitud?.direccion && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--tp-marron-suave)",
                  margin: "0 0 10px",
                }}
              >
                📍 {verPresupuesto.solicitud.direccion}
              </p>
            )}
            {/* Urgencia */}
            {verPresupuesto.solicitud?.urgente && (
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--tp-rojo)",
                  margin: "0 0 14px",
                }}
              >
                ⚡ Urgente
              </p>
            )}
            <button
              type="button"
              onClick={() => setVerPresupuesto(null)}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: "var(--r-md)",
                background: "var(--tp-marron)",
                color: "var(--tp-crema)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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
