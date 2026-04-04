import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import { getSolucionador, SOLUCIONADORES } from "./MockData";
import styles from "./Chat.module.css";
import { IconoVolver, IconoCamara, IconoReloj, IconoPerfil } from "./Iconos";
import {
  Paperclip,
  Send,
  FileText,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

const CONTACTO = {
  nombre: "Carlos Mendoza",
  inicial: "J",
  oficio: "Electricista",
  nivel: "🥇",
  online: true,
};

// Lista de conversaciones
const MENSAJES = [
  {
    solucionadorId: 1,
    nombre: "Carlos Mendoza",
    inicial: "C",
    oficio: "Plomero",
    ultimoMensaje: "Voy el lunes a las 9.",
    hora: "09:25",
    noLeidos: 0,
  },
  {
    solucionadorId: 2,
    nombre: "Roberto Flores",
    inicial: "R",
    oficio: "Plomero",
    ultimoMensaje: "¿Podés confirmar el horario?",
    hora: "Ayer",
    noLeidos: 1,
  },
];

// Tipos de mensaje:
// 'texto'       → mensaje normal
// 'presupuesto' → tarjeta especial con monto y acciones
const MENSAJES_INICIALES = [
  {
    id: 1,
    tipo: "texto",
    autor: "solucionador",
    texto:
      "¡Hola! Vi tu solicitud. ¿Podés contarme más sobre el problema eléctrico?",
    hora: "14:20",
    leido: true,
  },
  {
    id: 2,
    tipo: "texto",
    autor: "usuario",
    texto:
      "Hola Juan! Tengo el tablero principal que salta cada vez que enciendo el aire acondicionado.",
    hora: "14:22",
    leido: true,
  },
  {
    id: 3,
    tipo: "texto",
    autor: "solucionador",
    texto:
      "Entiendo. Probablemente sea el disyuntor o falta de capacidad en el circuito. Necesito ir a verlo para darte un presupuesto exacto. ¿Puedo pasar hoy a las 16hs?",
    hora: "14:23",
    leido: true,
  },
  {
    id: 4,
    tipo: "texto",
    autor: "usuario",
    texto: "Sí, perfecto. Te espero.",
    hora: "14:25",
    leido: true,
  },
  {
    id: 5,
    tipo: "presupuesto",
    autor: "solucionador",
    hora: "16:45",
    leido: true,
    estado: "pendiente", // pendiente | aceptado | rechazado
    presupuesto: {
      titulo: "Presupuesto — Tablero eléctrico",
      descripcion:
        "Revisión completa del tablero, reemplazo del disyuntor principal 32A y verificación de todos los circuitos. Incluye materiales.",
      monto: "$32.000",
      tiempoEstimado: "3 a 4 horas",
      garantia: "30 días",
      validoHasta: "Hoy 20:00 hs",
    },
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const solIdParam = searchParams.get("solId");
  const nombreParam = searchParams.get("nombre");
  const inicialParam = searchParams.get("inicial");
  const oficioParam = searchParams.get("oficio");
  const desdeParam = searchParams.get("desde");
  const trabajoIdBack = searchParams.get("trabajoId");
  const mensajeParam = searchParams.get("mensaje");
  const categoriaParam = searchParams.get("categoria");
  const descripcionParam = searchParams.get("descripcion");
  const direccionParam = searchParams.get("direccion");
  const urgenciaParam = searchParams.get("urgencia");
  const [mensajes, setMensajes] = useState(MENSAJES_INICIALES);
  // Si viene con ?solId=X arranca directo en ese hilo, sino muestra la lista
  const [convActiva, setConvActiva] = useState(
    solIdParam ? Number(solIdParam) : null,
  );

  // Mensaje inicial de solicitud si viene desde búsqueda
  const msgSolicitudInicial =
    mensajeParam === "solicitud" && categoriaParam
      ? [
          {
            id: 900,
            tipo: "solicitud",
            autor: "usuario",
            hora: new Date().toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            leido: false,
            solicitud: {
              categoria: categoriaParam
                ? decodeURIComponent(categoriaParam)
                : "",
              descripcion: descripcionParam
                ? decodeURIComponent(descripcionParam)
                : "",
              direccion: direccionParam
                ? decodeURIComponent(direccionParam)
                : "",
              urgencia: urgenciaParam
                ? decodeURIComponent(urgenciaParam)
                : "Normal",
            },
          },
        ]
      : [];

  // Solucionador activo según la conversación seleccionada
  const convData = MENSAJES.find((m) => m.solucionadorId === convActiva);
  // Si viene nombre por param (desde Busqueda), usarlo directo
  const contactoDesdeParam = nombreParam
    ? {
        nombre: decodeURIComponent(nombreParam),
        inicial: inicialParam || decodeURIComponent(nombreParam).charAt(0),
        oficio: oficioParam ? decodeURIComponent(oficioParam) : "",
        calificacion: 4.8,
      }
    : null;
  const contactoActivo =
    contactoDesdeParam || (convActiva ? getSolucionador(convActiva) : null);
  const [inputTexto, setInputTexto] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [modalPresupuesto, setModalPresupuesto] = useState(null);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);
  const [dispAbierta, setDispAbierta] = useState(false);
  const [esSolucionador, setEsSolucionador] = useState(false); // cambiar a true para probar
  const [modalPresupuesto2, setModalPresupuesto2] = useState(false);
  const [datosPpto, setDatosPpto] = useState({
    descripcion: "",
    monto: "",
    tiempo: "",
    garantia: "",
    validez: "24 horas",
  });

  // Si viene desde mis-trabajos o seguimiento con solId, ir directo al hilo
  useEffect(() => {
    if (
      (desdeParam === "mis-trabajos" || desdeParam === "seguimiento") &&
      solIdParam
    ) {
      setConvActiva(Number(solIdParam));
    }
  }, [desdeParam, solIdParam]);

  // Cada vez que cambian los mensajes → scroll al final
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2500);
  }

  function enviarMensaje() {
    const texto = inputTexto.trim();
    if (!texto) return;

    // Agregamos el mensaje del usuario
    const nuevoMensaje = {
      id: Date.now(),
      tipo: "texto",
      autor: "usuario",
      texto,
      hora: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      leido: false,
    };

    setMensajes((prev) => [...prev, nuevoMensaje]);
    setInputTexto("");

    // Simulamos respuesta del solucionador
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          tipo: "texto",
          autor: "solucionador",
          texto: "Perfecto, cualquier consulta me avisás 👍",
          hora: new Date().toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          leido: false,
        },
      ]);
    }, 2000);
  }

  function aceptarPresupuesto(idMensaje) {
    setMensajes((prev) =>
      prev.map((m) => (m.id === idMensaje ? { ...m, estado: "aceptado" } : m)),
    );
    setModalPresupuesto(null);
    navigate("/pago");
  }

  function rechazarPresupuesto(idMensaje) {
    setMensajes((prev) =>
      prev.map((m) => (m.id === idMensaje ? { ...m, estado: "rechazado" } : m)),
    );
    setModalPresupuesto(null);
    mostrarToast("❌ Presupuesto rechazado");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  }

  // ── VISTA: LISTA DE CONVERSACIONES ──
  if (!convActiva) {
    return (
      <div
        style={{
          background: "var(--tp-crema)",
          minHeight: "100vh",
          fontFamily: "var(--fuente)",
        }}
      >
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
              padding: 4,
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
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
          <h1
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "var(--tp-marron)",
              margin: 0,
            }}
          >
            Mensajes
          </h1>
        </header>

        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {MENSAJES.map((conv) => {
            const sol = getSolucionador(conv.solucionadorId);
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setConvActiva(conv.solucionadorId)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 12px",
                  borderRadius: "var(--r-md)",
                  background:
                    conv.sinLeer > 0 ? "var(--tp-crema-clara)" : "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                  borderBottom: "1px solid rgba(61,31,31,0.06)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: sol.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {sol.inicial}
                </div>
                <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--tp-marron)",
                      }}
                    >
                      {sol.nombre}
                    </span>
                    <span
                      style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}
                    >
                      {conv.hora}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color:
                          conv.sinLeer > 0
                            ? "var(--tp-marron)"
                            : "var(--tp-marron-suave)",
                        fontWeight: conv.sinLeer > 0 ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "70%",
                      }}
                    >
                      {conv.ultimoMensaje}
                    </span>
                    {conv.sinLeer > 0 && (
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "var(--tp-rojo)",
                          color: "white",
                          fontSize: 11,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {conv.sinLeer}
                      </div>
                    )}
                  </div>
                  <span
                    style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}
                  >
                    {sol.oficio}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <NavInferior />
      </div>
    );
  }

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <button
          className={styles.btnVolver}
          onClick={() =>
            desdeParam === "busqueda"
              ? navigate("/busqueda?paso=3")
              : desdeParam === "seguimiento"
                ? navigate(-1)
                : desdeParam === "mis-trabajos"
                  ? navigate("/trabajos")
                  : desdeParam === "presupuestos" && trabajoIdBack
                    ? navigate(`/presupuestos?trabajoId=${trabajoIdBack}`)
                    : desdeParam === "presupuestos"
                      ? navigate(-1)
                      : setConvActiva(null)
          }
        >
          <IconoVolver size={20} />
        </button>

        <div className={styles.headerContacto}>
          <div className={styles.headerAvatar}>
            {contactoActivo?.inicial || CONTACTO.inicial}
            <div className={styles.headerOnline}></div>
          </div>
          <div className={styles.headerInfo}>
            <span className={styles.headerNombre}>
              {contactoActivo?.nombre || CONTACTO.nombre}
            </span>
            <span className={styles.headerOficio}>
              {contactoActivo?.oficio || CONTACTO.oficio}
            </span>
            {!esSolucionador && (
              <button
                type="button"
                className={styles.btnVerPerfil}
                onClick={() => navigate("/perfil")}
              >
                <IconoPerfil size={18} />
              </button>
            )}
          </div>
        </div>

        <button
          className={styles.btnOpciones}
          onClick={() => mostrarToast("Opciones del chat")}
        >
          ···
        </button>
      </header>
      {/* ── DISPONIBILIDAD DEL USUARIO ── */}
      <div className={styles.dispBanner}>
        <div className={styles.dispBannerHeader}>
          <span className={styles.dispBannerTitulo}>
            <IconoReloj size={14} />{" "}
            {esSolucionador
              ? "Disponibilidad del usuario"
              : "Disponibilidad del solucionador"}
          </span>
          <button
            type="button"
            className={styles.dispBannerToggle}
            onClick={() => setDispAbierta((prev) => !prev)}
          >
            {dispAbierta ? "▲ Ocultar" : "▼ Ver"}
          </button>
        </div>

        {dispAbierta && (
          <div className={styles.dispBannerContenido}>
            {[
              { dia: "Lun", turnos: ["7-12", "15-19"] },
              { dia: "Mié", turnos: ["7-12"] },
              { dia: "Sáb", turnos: ["7-12", "12-15"] },
            ].map((fila) => (
              <div key={fila.dia} className={styles.dispFila}>
                <span className={styles.dispDia}>{fila.dia}</span>
                <div className={styles.dispTurnos}>
                  {fila.turnos.map((t) => (
                    <span key={t} className={styles.dispTurno}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.dispHoraPuntual}>
              <Clock size={14} /> Hora puntual preferida: <strong>08:30</strong>
            </div>
          </div>
        )}
      </div>
      {/* ── MENSAJES ── */}
      <main className={styles.mensajesArea}>
        {/* Separador de fecha */}
        <div className={styles.fechaSeparador}>
          <div className={styles.fechaLinea}></div>
          <span className={styles.fechaTexto}>Hoy</span>
          <div className={styles.fechaLinea}></div>
        </div>

        {mensajes.map((msg) => {
          const esMio = msg.autor === "usuario";

          // ── Mensaje de texto normal ──
          if (msg.tipo === "texto") {
            return (
              <div
                key={msg.id}
                className={`${styles.mensajeBloque} ${
                  esMio ? styles.mensajeBloquePropio : ""
                }`}
              >
                {!esMio && (
                  <div className={styles.mensajeAvatar}>{CONTACTO.inicial}</div>
                )}
                <div
                  className={`${styles.burbuja} ${
                    esMio ? styles.burbujaPropia : styles.burbujaAjena
                  }`}
                >
                  {msg.tipo === "solicitud" && msg.solicitud ? (
                    <div style={{ minWidth: 200 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 8,
                          paddingBottom: 8,
                          borderBottom: "1px solid rgba(61,31,31,0.10)",
                        }}
                      >
                        <span style={{ fontSize: 14 }}>📋</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: "var(--tp-marron)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Solicitud de presupuesto
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--tp-marron)",
                          margin: "0 0 6px",
                        }}
                      >
                        {msg.solicitud.categoria}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--tp-marron-suave)",
                          margin: "0 0 8px",
                          lineHeight: 1.5,
                          fontStyle: "italic",
                        }}
                      >
                        "{msg.solicitud.descripcion}"
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div style={{ display: "flex", gap: 6 }}>
                          <span style={{ fontSize: 12 }}>📍</span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--tp-marron-suave)",
                            }}
                          >
                            {msg.solicitud.direccion}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <span style={{ fontSize: 12 }}>⚡</span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--tp-marron-suave)",
                            }}
                          >
                            {msg.solicitud.urgencia}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.burbujaTexto}>{msg.texto}</p>
                  )}
                  <div className={styles.burubjaMeta}>
                    <span className={styles.burbujaHora}>{msg.hora}</span>
                    {esMio && (
                      <span className={styles.burbujaLeido}>
                        {msg.leido ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // ── Mensaje de presupuesto ──
          if (msg.tipo === "presupuesto") {
            return (
              <div key={msg.id} className={styles.presupuestoBloque}>
                <div
                  className={`${styles.presupuestoCard} ${
                    msg.estado === "aceptado" ? styles.presupuestoAceptado : ""
                  } ${
                    msg.estado === "rechazado"
                      ? styles.presupuestoRechazado
                      : ""
                  }`}
                >
                  {/* Header del presupuesto */}
                  <div className={styles.presupuestoHeader}>
                    <span className={styles.presupuestoIcono}>
                      <FileText size={16} />
                    </span>
                    <div className={styles.presupuestoHeaderTexto}>
                      <span className={styles.presupuestoTitulo}>
                        {msg.presupuesto.titulo}
                      </span>
                      <span className={styles.presupuestoDeJuan}>
                        Enviado por {CONTACTO.nombre}
                      </span>
                    </div>
                    {msg.estado === "aceptado" && (
                      <span className={styles.estadoBadge}>
                        <CheckCircle size={16} />
                      </span>
                    )}
                    {msg.estado === "rechazado" && (
                      <span className={styles.estadoBadge}>
                        <XCircle size={16} />
                      </span>
                    )}
                  </div>

                  {/* Monto grande */}
                  <div className={styles.presupuestoMonto}>
                    {msg.presupuesto.monto}
                  </div>

                  {/* Detalles */}
                  <div className={styles.presupuestoDetalles}>
                    <div className={styles.presupuestoDetalle}>
                      <span className={styles.presupuestoDetalleIcono}>
                        <FileText size={14} />
                      </span>
                      <span className={styles.presupuestoDetalleTexto}>
                        {msg.presupuesto.descripcion}
                      </span>
                    </div>
                    <div className={styles.presupuestoDetalle}>
                      <span className={styles.presupuestoDetalleIcono}>
                        <Clock size={14} />
                      </span>
                      <span className={styles.presupuestoDetalleTexto}>
                        {msg.presupuesto.tiempoEstimado}
                      </span>
                    </div>
                    <div className={styles.presupuestoDetalle}>
                      <span className={styles.presupuestoDetalleIcono}>
                        <Shield size={14} />
                      </span>
                      <span className={styles.presupuestoDetalleTexto}>
                        Garantía: {msg.presupuesto.garantia}
                      </span>
                    </div>
                    <div className={styles.presupuestoDetalle}>
                      <span className={styles.presupuestoDetalleIcono}>
                        <Clock size={14} />
                      </span>
                      <span className={styles.presupuestoDetalleTexto}>
                        Válido hasta: {msg.presupuesto.validoHasta}
                      </span>
                    </div>
                  </div>

                  {/* Acciones — solo si está pendiente */}
                  {msg.estado === "pendiente" && (
                    <div className={styles.presupuestoAcciones}>
                      <button
                        type="button"
                        className={styles.btnRechazar}
                        onClick={() => rechazarPresupuesto(msg.id)}
                      >
                        Rechazar
                      </button>
                      <button
                        type="button"
                        className={styles.btnNegociar}
                        onClick={() => mostrarToast("Abriendo negociación...")}
                      >
                        Negociar
                      </button>
                      <button
                        type="button"
                        className={styles.btnAceptar}
                        onClick={() => setModalPresupuesto(msg)}
                      >
                        Aceptar ✓
                      </button>
                    </div>
                  )}

                  {/* Estado final */}
                  {msg.estado === "aceptado" && (
                    <div className={styles.presupuestoEstadoFinal}>
                      <CheckCircle size={14} /> Presupuesto aceptado · Trabajo
                      confirmado
                    </div>
                  )}
                  {msg.estado === "rechazado" && (
                    <div
                      className={`${styles.presupuestoEstadoFinal} ${styles.presupuestoEstadoRechazado}`}
                    >
                      <XCircle size={14} /> Presupuesto rechazado
                    </div>
                  )}

                  <span className={styles.presupuestoHora}>{msg.hora}</span>
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* Indicador "está escribiendo..." */}
        {escribiendo && (
          <div className={styles.mensajeBloque}>
            <div className={styles.mensajeAvatar}>{CONTACTO.inicial}</div>
            <div
              className={`${styles.burbuja} ${styles.burbujaAjena} ${styles.burbujaEscribiendo}`}
            >
              <div className={styles.puntosEscribiendo}>
                <div className={styles.punto}></div>
                <div className={styles.punto}></div>
                <div className={styles.punto}></div>
              </div>
            </div>
          </div>
        )}

        {/* Referencia para scroll automático */}
        <div ref={bottomRef}></div>
      </main>

      {/* ── INPUT DE MENSAJE ── */}
      <div className={styles.inputArea}>
        <button
          className={styles.btnAdjunto}
          onClick={() => mostrarToast("Adjuntar archivo")}
        >
          <Paperclip size={18} />
        </button>

        {esSolucionador && (
          <button
            className={styles.btnPresupuesto}
            onClick={() => setModalPresupuesto2(true)}
            title="Enviar presupuesto"
          >
            <FileText size={18} />
          </button>
        )}

        <div className={styles.inputBloque}>
          <textarea
            className={styles.inputTexto}
            placeholder="Escribí un mensaje..."
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </div>
        <button
          className={`${styles.btnEnviar} ${
            inputTexto.trim() ? styles.btnEnviarActivo : ""
          }`}
          onClick={enviarMensaje}
          disabled={!inputTexto.trim()}
        >
          <Send size={18} />
        </button>
      </div>

      {/* ── MODAL CONFIRMACIÓN PRESUPUESTO ── */}
      {modalPresupuesto && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalPresupuesto(null);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHandle}></div>
            <div className={styles.modalIcono}>
              <CheckCircle size={32} />
            </div>
            <h2 className={styles.modalTitulo}>Confirmar presupuesto</h2>
            <p className={styles.modalDesc}>
              Vas a aceptar el presupuesto de{" "}
              <strong>{modalPresupuesto.presupuesto.monto}</strong>. Se
              reservará el monto en escrow hasta que el trabajo esté completado.
            </p>

            <div className={styles.modalResumen}>
              <div className={styles.modalResumenFila}>
                <span>Monto del trabajo</span>
                <span className={styles.modalResumenValor}>
                  {modalPresupuesto.presupuesto.monto}
                </span>
              </div>
              <div className={styles.modalResumenFila}>
                <span>Comisión TeePee (10%)</span>
                <span>$3.200</span>
              </div>
              <div
                className={`${styles.modalResumenFila} ${styles.modalResumenTotal}`}
              >
                <span>Total a pagar</span>
                <span className={styles.modalResumenValor}>$35.200</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.btnConfirmar}
              onClick={() => aceptarPresupuesto(modalPresupuesto.id)}
            >
              Confirmar y pagar →
            </button>
            <button
              type="button"
              className={styles.btnCancelarModal}
              onClick={() => setModalPresupuesto(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {/* ── MODAL CARGAR PRESUPUESTO ── */}
      {modalPresupuesto2 && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalPresupuesto2(false);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHandle}></div>
            <h2 className={styles.modalTitulo}>Enviar presupuesto</h2>

            <div className={styles.campoPpto}>
              <label className={styles.campoPptoLabel}>
                Descripción del trabajo
              </label>
              <textarea
                className={styles.campoPptoInput}
                placeholder="Describí el trabajo a realizar..."
                rows={3}
                value={datosPpto.descripcion}
                onChange={(e) =>
                  setDatosPpto({ ...datosPpto, descripcion: e.target.value })
                }
              />
            </div>

            <div className={styles.campoPpto}>
              <label className={styles.campoPptoLabel}>Monto ($)</label>
              <input
                type="number"
                className={styles.campoPptoInput}
                placeholder="Ej: 25000"
                value={datosPpto.monto}
                onChange={(e) =>
                  setDatosPpto({ ...datosPpto, monto: e.target.value })
                }
              />
            </div>

            <div className={styles.campoFila}>
              <div className={styles.campoPpto}>
                <label className={styles.campoPptoLabel}>Tiempo estimado</label>
                <input
                  type="text"
                  className={styles.campoPptoInput}
                  placeholder="Ej: 2-3 horas"
                  value={datosPpto.tiempo}
                  onChange={(e) =>
                    setDatosPpto({ ...datosPpto, tiempo: e.target.value })
                  }
                />
              </div>
              <div className={styles.campoPpto}>
                <label className={styles.campoPptoLabel}>Garantía (días)</label>
                <input
                  type="number"
                  className={styles.campoPptoInput}
                  placeholder="Ej: 30"
                  value={datosPpto.garantia}
                  onChange={(e) =>
                    setDatosPpto({ ...datosPpto, garantia: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.campoPpto}>
              <label className={styles.campoPptoLabel}>Válido por</label>
              <select
                className={styles.campoPptoInput}
                value={datosPpto.validez}
                onChange={(e) =>
                  setDatosPpto({ ...datosPpto, validez: e.target.value })
                }
              >
                <option>12 horas</option>
                <option>24 horas</option>
                <option>48 horas</option>
                <option>3 días</option>
                <option>7 días</option>
              </select>
            </div>

            <button
              type="button"
              className={styles.btnConfirmar}
              disabled={!datosPpto.descripcion || !datosPpto.monto}
              onClick={() => {
                const nuevo = {
                  id: Date.now(),
                  tipo: "presupuesto",
                  autor: "solucionador",
                  hora: new Date().toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  leido: false,
                  estado: "pendiente",
                  presupuesto: {
                    titulo: "Presupuesto",
                    descripcion: datosPpto.descripcion,
                    monto: `$${parseInt(datosPpto.monto).toLocaleString("es-AR")}`,
                    tiempoEstimado: datosPpto.tiempo,
                    garantia: datosPpto.garantia
                      ? `${datosPpto.garantia} días`
                      : "Sin garantía",
                    validoHasta: `Válido por ${datosPpto.validez}`,
                  },
                };
                setMensajes((prev) => [...prev, nuevo]);
                setModalPresupuesto2(false);
                setDatosPpto({
                  descripcion: "",
                  monto: "",
                  tiempo: "",
                  garantia: "",
                  validez: "24 horas",
                });
                mostrarToast("Presupuesto enviado");
              }}
            >
              Enviar presupuesto
            </button>

            <button
              type="button"
              className={styles.btnCancelarModal}
              onClick={() => setModalPresupuesto2(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      <NavInferior />
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
