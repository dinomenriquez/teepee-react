import { useState, useEffect } from "react";
import stylesCss from "./ChatS.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";
import { MessageCircle, Send, Paperclip, DollarSign } from "lucide-react";

// Chats del solucionador con sus clientes
const CHATS_CLIENTES = [
  {
    solucionadorId: 1,
    clienteId: 1,
    nombre: "Laura Pérez",
    inicial: "L",
    color: "#B84030",
    ultimoMensaje: "Confirmo para las 14:30 hs",
    hora: "14:23",
    sinLeer: 2,
    trabajo: "Reparación cañería",
  },
  {
    solucionadorId: 1,
    clienteId: 2,
    nombre: "Laura Sánchez",
    inicial: "L",
    color: "#2A7D5A",
    ultimoMensaje: "¿Podés venir el sábado a la mañana?",
    hora: "11:05",
    sinLeer: 1,
    trabajo: "Cambio de canilla",
  },
  {
    solucionadorId: 1,
    clienteId: 3,
    nombre: "Diego Fernández",
    inicial: "D",
    color: "#8C6820",
    ultimoMensaje: "Gracias, quedó perfecto 👍",
    hora: "Ayer",
    sinLeer: 0,
    trabajo: "Instalación calefón",
  },
];

const MENSAJES_INICIALES = [
  {
    id: 1,
    tipo: "texto",
    autor: "cliente",
    texto: "Hola! ¿A qué hora podés venir?",
    hora: "14:20",
    leido: true,
  },
  {
    id: 2,
    tipo: "texto",
    autor: "solucionador",
    texto: "Hola! Puedo estar a las 14:30 hs. ¿Te viene bien?",
    hora: "14:21",
    leido: true,
  },
  {
    id: 3,
    tipo: "texto",
    autor: "cliente",
    texto: "Confirmo para las 14:30 hs",
    hora: "14:23",
    leido: false,
  },
];

export default function ChatS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const usuarioIdParam = searchParams.get("usuarioId");
  const nombreParam = searchParams.get("nombre");
  const inicialParam = searchParams.get("inicial");
  const desdeParam = searchParams.get("desde");
  const mensajeParam = searchParams.get("mensaje");
  const montoPptoParam = searchParams.get("monto");
  const etapasPptoParam = searchParams.get("etapas");
  const garantiaPptoParam = searchParams.get("garantia");
  const matPptoParam = searchParams.get("materiales");
  const tipoPptoParam = searchParams.get("tipo");
  const descPptoParam = searchParams.get("desc");
  const netoPptoParam = searchParams.get("neto");
  const visitaPptoParam = searchParams.get("visita");

  // Si viene con usuarioId o nombre, ir directo al hilo
  const clienteDirecto =
    usuarioIdParam || nombreParam
      ? {
          nombre: nombreParam
            ? decodeURIComponent(nombreParam)
            : CHATS_CLIENTES.find((c) => c.clienteId === Number(usuarioIdParam))
                ?.nombre || "Cliente",
          inicial:
            inicialParam ||
            (nombreParam ? decodeURIComponent(nombreParam).charAt(0) : "C"),
          color: "#B84030",
          clienteId: Number(usuarioIdParam) || 1,
        }
      : null;

  const [convActiva, setConvActiva] = useState(clienteDirecto);

  // Si vienen params en la URL, setear el cliente directo
  useEffect(() => {
    if (clienteDirecto) setConvActiva(clienteDirecto);
  }, [usuarioIdParam, nombreParam]);
  const mensajesIniciales =
    mensajeParam === "presupuesto"
      ? [
          ...MENSAJES_INICIALES,
          {
            id: MENSAJES_INICIALES.length + 1,
            tipo: "presupuesto",
            autor: "solucionador",
            texto: "📋 Presupuesto enviado",
            hora: new Date().toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            leido: false,
            presupuesto: {
              monto: montoPptoParam
                ? decodeURIComponent(montoPptoParam)
                : "A confirmar",
              tipo: tipoPptoParam
                ? decodeURIComponent(tipoPptoParam)
                : "Precio fijo",
              etapas: etapasPptoParam
                ? decodeURIComponent(etapasPptoParam)
                : "A convenir",
              garantia: garantiaPptoParam
                ? decodeURIComponent(garantiaPptoParam)
                : "Sin garantía",
              materiales: matPptoParam ? decodeURIComponent(matPptoParam) : "",
              desc: descPptoParam ? decodeURIComponent(descPptoParam) : "",
              neto: netoPptoParam ? decodeURIComponent(netoPptoParam) : "",
              visita: visitaPptoParam
                ? decodeURIComponent(visitaPptoParam)
                : "",
            },
          },
        ]
      : MENSAJES_INICIALES;

  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [inputTexto, setInputTexto] = useState("");
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function enviarMensaje() {
    if (!inputTexto.trim()) return;
    setMensajes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        tipo: "texto",
        autor: "solucionador",
        texto: inputTexto.trim(),
        hora: new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        leido: false,
      },
    ]);
    setInputTexto("");
  }

  function volverDesdeHilo() {
    if (desdeParam === "seguimiento-s") navigate(-1);
    else if (desdeParam === "trabajos-s") navigate("/trabajos-s");
    else if (desdeParam === "agenda") navigate("/agenda");
    else if (desdeParam === "perfil-usuario-publico") navigate(-1);
    else setConvActiva(null); // vuelve a la lista de chats
  }

  // ── LISTA DE CHATS ──
  if (!convActiva) {
    return (
      <div
        style={{
          background: "var(--tp-crema)",
          minHeight: "100vh",
          fontFamily: "var(--fuente)",
        }}
      >
        <header className={stylesCss.header}>
          <button onClick={() => navigate(-1)} className={stylesCss.btnVolver}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--tp-marron)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className={stylesCss.headerTitulo}>Mensajes</h1>
        </header>

        <div className={stylesCss.lista}>
          {CHATS_CLIENTES.map((conv) => (
            <button
              key={conv.clienteId}
              type="button"
              onClick={() => setConvActiva(conv)}
              className={`${stylesCss.convBtn} ${conv.sinLeer > 0 ? stylesCss.convBtnNoLeido : ""}`}
            >
              <div
                className={stylesCss.convAvatar}
                style={{ background: conv.color }}
              >
                {conv.inicial}
              </div>
              <div className={stylesCss.convInfo}>
                <div className={stylesCss.convFila}>
                  <span className={stylesCss.convNombre}>{conv.nombre}</span>
                  <span className={stylesCss.convHora}>{conv.hora}</span>
                </div>
                <div className={stylesCss.convMensajeFila}>
                  <span
                    className={`${stylesCss.convUltimo} ${conv.sinLeer > 0 ? stylesCss.convUltimoNoLeido : ""}`}
                  >
                    {conv.ultimoMensaje}
                  </span>
                  {conv.sinLeer > 0 && (
                    <div className={stylesCss.convBadge}>{conv.sinLeer}</div>
                  )}
                </div>
                <span className={stylesCss.convTrabajo}>{conv.trabajo}</span>
              </div>
            </button>
          ))}
        </div>
        <NavInferiorS />
      </div>
    );
  }

  // ── HILO DE CHAT ──
  return (
    <div className={stylesCss.hiloPantalla}>
      <header className={stylesCss.hiloHeader}>
        <button className={stylesCss.btnVolver} onClick={volverDesdeHilo}>
          <IconoVolver size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div className={stylesCss.hiloAvatar}>
            {convActiva.inicial}
            <div className={stylesCss.hiloOnline}></div>
          </div>
          <div className={stylesCss.hiloInfo}>
            <span className={stylesCss.hiloNombre}>{convActiva.nombre}</span>
            <span className={stylesCss.hiloEstado}>● En línea</span>
          </div>
        </div>
        <button
          className={stylesCss.btnPerfil}
          onClick={() =>
            navigate(
              `/perfil-usuario-publico?usuarioId=${convActiva.clienteId}&nombre=${encodeURIComponent(convActiva.nombre)}`,
            )
          }
          title="Ver perfil"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
      </header>

      <div className={stylesCss.mensajes}>
        {mensajes.map((msg) => (
          <div
            key={msg.id}
            className={`${stylesCss.mensajeFila} ${msg.autor === "solucionador" ? stylesCss.mensajeFilaPropio : ""}`}
          >
            <div
              className={`${stylesCss.burbuja} ${msg.autor === "solucionador" ? stylesCss.burbujaPropia : ""}`}
            >
              {msg.tipo === "presupuesto" && msg.presupuesto ? (
                <div style={{ minWidth: 220, maxWidth: 280 }}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 8,
                      paddingBottom: 8,
                      borderBottom: "1px solid rgba(240,234,214,0.18)",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>📋</span>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "rgba(240,234,214,0.90)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          display: "block",
                        }}
                      >
                        Presupuesto
                      </span>
                      {msg.presupuesto.tipo && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "rgba(240,234,214,0.55)",
                          }}
                        >
                          {msg.presupuesto.tipo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Monto */}
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: "var(--tp-crema)",
                      margin: "0 0 10px",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {msg.presupuesto.monto}
                  </p>

                  {/* Descripción del trabajo */}
                  {msg.presupuesto.desc && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(240,234,214,0.70)",
                        margin: "0 0 8px",
                        lineHeight: 1.5,
                        fontStyle: "italic",
                        paddingBottom: 8,
                        borderBottom: "1px solid rgba(240,234,214,0.12)",
                      }}
                    >
                      {msg.presupuesto.desc}
                    </p>
                  )}

                  {/* Detalles */}
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    <div style={{ display: "flex", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(240,234,214,0.55)",
                          width: 18,
                        }}
                      >
                        💳
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(240,234,214,0.80)",
                        }}
                      >
                        {msg.presupuesto.etapas}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(240,234,214,0.55)",
                          width: 18,
                        }}
                      >
                        🛡️
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(240,234,214,0.80)",
                        }}
                      >
                        {msg.presupuesto.garantia}
                      </span>
                    </div>
                    {msg.presupuesto.materiales && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(240,234,214,0.55)",
                            width: 18,
                          }}
                        >
                          🔧
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(240,234,214,0.80)",
                          }}
                        >
                          {msg.presupuesto.materiales}
                        </span>
                      </div>
                    )}
                    {msg.presupuesto.visita && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(240,234,214,0.55)",
                            width: 18,
                          }}
                        >
                          🚗
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(240,234,214,0.80)",
                          }}
                        >
                          Visita: {msg.presupuesto.visita}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botones Aceptar / Negociar */}
                  <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    <div
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        borderRadius: 8,
                        background: "rgba(42,125,90,0.40)",
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      ✓ Aceptar
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        borderRadius: 8,
                        background: "rgba(240,234,214,0.12)",
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(240,234,214,0.70)",
                        cursor: "pointer",
                      }}
                    >
                      Negociar
                    </div>
                  </div>
                </div>
              ) : (
                <p className={stylesCss.burbujaTexto}>{msg.texto}</p>
              )}
              <span className={stylesCss.burbujaHora}>{msg.hora}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={stylesCss.inputArea}>
        <button
          className={stylesCss.btnAdjunto}
          onClick={() => mostrarToast("Adjuntar archivo")}
        >
          <Paperclip size={20} />
        </button>
        <button
          className={stylesCss.btnAdjunto}
          onClick={() => mostrarToast("Enviar presupuesto")}
        >
          <DollarSign size={20} />
        </button>
        <input
          type="text"
          className={stylesCss.input}
          placeholder="Escribí un mensaje..."
          value={inputTexto}
          onChange={(e) => setInputTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
        />
        <button className={stylesCss.btnEnviar} onClick={enviarMensaje}>
          <Send size={18} />
        </button>
      </div>

      {toast && <div className={stylesCss.toast}>{toast}</div>}
    </div>
  );
}
