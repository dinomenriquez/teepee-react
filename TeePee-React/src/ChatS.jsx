import { useState, useEffect, useRef } from "react";
import stylesCss from "./ChatS.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";
import {
  User, MessageCircle, Send, Paperclip, Camera, Mic, Plus,
  Bell, MapPin, Zap, ClipboardList,
  FileText, CreditCard, Shield, Wrench, Car, CheckCircle,
} from "lucide-react";

function dec(val, fallback = "") {
  if (!val) return fallback;
  try { return decodeURIComponent(val); } catch { return val; }
}

const CHATS_CLIENTES = [
  { solucionadorId: 1, clienteId: 1, nombre: "Laura Pérez",     inicial: "L", color: "#B84030", ultimoMensaje: "Confirmo para las 14:30 hs",        hora: "14:23", sinLeer: 2, trabajo: "Reparación cañería" },
  { solucionadorId: 1, clienteId: 2, nombre: "Laura Sánchez",   inicial: "L", color: "#2A7D5A", ultimoMensaje: "¿Podés venir el sábado a la mañana?", hora: "11:05", sinLeer: 1, trabajo: "Cambio de canilla" },
  { solucionadorId: 1, clienteId: 3, nombre: "Diego Fernández", inicial: "D", color: "#8C6820", ultimoMensaje: "Gracias, quedó perfecto 👍",           hora: "Ayer",  sinLeer: 0, trabajo: "Instalación calefón" },
];

const MENSAJES_INICIALES = [
  { id: 1, tipo: "texto", autor: "cliente",      texto: "Hola! ¿A qué hora podés venir?",                        hora: "14:20", leido: true },
  { id: 2, tipo: "texto", autor: "solucionador", texto: "Hola! Puedo estar a las 14:30 hs. ¿Te viene bien?",     hora: "14:21", leido: true },
  { id: 3, tipo: "texto", autor: "cliente",      texto: "Confirmo para las 14:30 hs",                             hora: "14:23", leido: false },
];

export default function ChatS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const usuarioIdParam    = searchParams.get("usuarioId");
  const nombreParam       = searchParams.get("nombre");
  const inicialParam      = searchParams.get("inicial");
  const desdeParam        = searchParams.get("desde");
  const solicitudIdBack   = searchParams.get("solicitudId");
  const mensajeParam      = searchParams.get("mensaje");
  const montoPptoParam    = searchParams.get("monto");
  const etapasPptoParam   = searchParams.get("etapas");
  const garantiaPptoParam = searchParams.get("garantia");
  const matPptoParam      = searchParams.get("materiales");
  const tipoPptoParam     = searchParams.get("tipo");
  const descPptoParam     = searchParams.get("desc");
  const netoPptoParam     = searchParams.get("neto");
  const visitaPptoParam   = searchParams.get("visita");
  const categoriaParam    = searchParams.get("categoria");
  const descripcionParam  = searchParams.get("descripcion");
  const direccionParam    = searchParams.get("direccion");
  const urgenciaParam     = searchParams.get("urgencia");

  const clienteDirecto = usuarioIdParam || nombreParam ? {
    nombre:    nombreParam ? dec(nombreParam) : CHATS_CLIENTES.find(c => c.clienteId === Number(usuarioIdParam))?.nombre || "Cliente",
    inicial:   inicialParam || (nombreParam ? dec(nombreParam).charAt(0) : "C"),
    color:     "#B84030",
    clienteId: Number(usuarioIdParam) || 1,
  } : null;

  const [convActiva, setConvActiva] = useState(clienteDirecto);

  useEffect(() => {
    if (clienteDirecto) setConvActiva(clienteDirecto);
  }, [usuarioIdParam, nombreParam]);

  const mensajesIniciales = mensajeParam === "presupuesto"
    ? [...MENSAJES_INICIALES, {
        id: MENSAJES_INICIALES.length + 1,
        tipo: "presupuesto", autor: "solucionador", texto: "Presupuesto enviado",
        hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        leido: false,
        presupuesto: {
          monto:      montoPptoParam     ? dec(montoPptoParam)     : "A confirmar",
          tipo:       tipoPptoParam      ? dec(tipoPptoParam)      : "Precio fijo",
          etapas:     etapasPptoParam    ? dec(etapasPptoParam)    : "A convenir",
          garantia:   garantiaPptoParam  ? dec(garantiaPptoParam)  : "Sin garantía",
          materiales: matPptoParam       ? dec(matPptoParam)       : "",
          desc:       descPptoParam      ? dec(descPptoParam)      : "",
          neto:       netoPptoParam      ? dec(netoPptoParam)      : "",
          visita:     visitaPptoParam    ? dec(visitaPptoParam)    : "",
        },
      }]
    : mensajeParam === "solicitud" && categoriaParam
    ? [...MENSAJES_INICIALES, {
        id: MENSAJES_INICIALES.length + 1,
        tipo: "solicitud", autor: "cliente",
        hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        leido: false,
        solicitud: {
          categoria:   categoriaParam   ? dec(categoriaParam)   : "",
          descripcion: descripcionParam ? dec(descripcionParam) : "",
          direccion:   direccionParam   ? dec(direccionParam)   : "",
          urgencia:    urgenciaParam    ? dec(urgenciaParam)    : "Normal",
        },
      }]
    : desdeParam === "ayuda-s" ? [{
        id: 1, tipo: "texto", autor: "cliente",
        texto: "¡Hola! Soy el equipo de soporte de TeePee. ¿En qué te puedo ayudar?",
        hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        leido: true,
      }]
    : MENSAJES_INICIALES;

  const [mensajes, setMensajes]     = useState(mensajesIniciales);
  const [inputTexto, setInputTexto] = useState("");
  const [toast, setToast]           = useState(null);
  const [grabando, setGrabando]     = useState(false);
  const bottomRef                   = useRef(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function enviarMensaje() {
    if (!inputTexto.trim()) return;
    setMensajes(prev => [...prev, {
      id: prev.length + 1, tipo: "texto", autor: "solucionador",
      texto: inputTexto.trim(),
      hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      leido: false,
    }]);
    setInputTexto("");
    const ta = document.querySelector(`.${stylesCss.inputTexto}`);
    if (ta) ta.style.height = "20px";
  }

  function iniciarGrabacion() { setGrabando(true); }
  function finalizarGrabacion() {
    if (!grabando) return;
    setGrabando(false);
    setMensajes(prev => [...prev, {
      id: prev.length + 1, tipo: "audio", autor: "solucionador",
      texto: "🎤 Audio (0:03)",
      hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      leido: false,
    }]);
  }

  function volverDesdeHilo() {
    if (desdeParam === "seguimiento-s") navigate(-1);
    else if (desdeParam === "trabajos-s") navigate("/trabajos-s");
    else if (desdeParam === "agenda") navigate("/agenda");
    else if (desdeParam === "perfil-usuario-publico") navigate(-1);
    else if (desdeParam === "presupuestos-s") navigate(`/presupuestos-s?solicitudId=${solicitudIdBack || 1}&volverPaso=1`);
    else setConvActiva(null);
  }

  // ── LISTA DE CHATS ──
  if (!convActiva) {
    return (
      <div className={stylesCss.pantalla}>
        <header className={stylesCss.header}>
          <button onClick={() => navigate(-1)} className={stylesCss.btnVolver}>
            <IconoVolver size={20} />
          </button>
          <h1 className={stylesCss.headerTitulo}>Mensajes</h1>
        </header>

        <div className={stylesCss.lista}>
          {CHATS_CLIENTES.map((conv) => (
            <button key={conv.clienteId} type="button"
              onClick={() => setConvActiva(conv)}
              className={`${stylesCss.convBtn} ${conv.sinLeer > 0 ? stylesCss.convBtnNoLeido : ""}`}
            >
              <div className={stylesCss.convAvatar} style={{ background: conv.color }}>
                {conv.inicial}
              </div>
              <div className={stylesCss.convInfo}>
                <div className={stylesCss.convFila}>
                  <span className={stylesCss.convNombre}>{conv.nombre}</span>
                  <span className={stylesCss.convHora}>{conv.hora}</span>
                </div>
                <div className={stylesCss.convMensajeFila}>
                  <span className={`${stylesCss.convUltimo} ${conv.sinLeer > 0 ? stylesCss.convUltimoNoLeido : ""}`}>
                    {conv.ultimoMensaje}
                  </span>
                  {conv.sinLeer > 0 && <div className={stylesCss.convBadge}>{conv.sinLeer}</div>}
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
        <div className={stylesCss.hiloContacto}>
          {/* Avatar con icono de perfil al lado */}
          <div className={stylesCss.hiloAvatarWrapper}>
            <div className={stylesCss.hiloAvatar}>
              {convActiva.inicial}
              <div className={stylesCss.hiloOnline}></div>
            </div>
            <button
              className={stylesCss.btnVerPerfilAvatar}
              onClick={() => navigate(`/perfil-usuario-publico?usuarioId=${convActiva.clienteId}&nombre=${encodeURIComponent(convActiva.nombre)}`)}
              title="Ver perfil"
              style={{ display: desdeParam === "ayuda-s" ? "none" : undefined }}
            >
              <User size={12} />
            </button>
          </div>
          <div className={stylesCss.hiloInfo}>
            <span className={stylesCss.hiloNombre}>{convActiva.nombre}</span>
            <span className={stylesCss.hiloEstado}>● En línea</span>
          </div>
        </div>
        {/* Botón + para enviar presupuesto */}
        {desdeParam !== "ayuda-s" && (
          <button
            className={stylesCss.btnNuevoPresupuesto}
            onClick={() => navigate(`/presupuestos-s?solicitudId=${convActiva.clienteId}&nombre=${encodeURIComponent(convActiva.nombre)}&inicial=${convActiva.inicial}&desde=chat-s`)}
            title="Enviar presupuesto"
          >
            <Plus size={18} />
          </button>
        )}
      </header>

      <div className={stylesCss.mensajes}>
        {mensajes.map((msg) => (
          <div key={msg.id} className={`${stylesCss.mensajeFila} ${msg.autor === "solucionador" ? stylesCss.mensajeFilaPropio : ""}`}>
            <div className={`${stylesCss.burbuja} ${msg.autor === "solucionador" ? stylesCss.burbujaPropia : ""}`}>

              {/* Solicitud de presupuesto */}
              {msg.tipo === "solicitud" && msg.solicitud ? (
                <div className={stylesCss.solicitudCard}>
                  <div className={stylesCss.solicitudHeader}>
                    <Bell size={14} className={stylesCss.solicitudHeaderIcono} />
                    <span className={stylesCss.solicitudHeaderLabel}>Solicitud de presupuesto</span>
                  </div>
                  <p className={stylesCss.solicitudCategoria}>{msg.solicitud.categoria}</p>
                  {msg.solicitud.descripcion && (
                    <p className={stylesCss.solicitudDesc}>"{msg.solicitud.descripcion}"</p>
                  )}
                  <div className={stylesCss.solicitudMeta}>
                    {msg.solicitud.direccion && (
                      <div className={stylesCss.solicitudMetaFila}>
                        <MapPin size={12} className={stylesCss.solicitudMetaIcono} />
                        <span className={stylesCss.solicitudMetaTexto}>{msg.solicitud.direccion}</span>
                      </div>
                    )}
                    <div className={stylesCss.solicitudMetaFila}>
                      <Zap size={12} className={stylesCss.solicitudMetaIcono} />
                      <span className={stylesCss.solicitudMetaTexto}>{msg.solicitud.urgencia}</span>
                    </div>
                  </div>
                  <button type="button" className={stylesCss.btnArmarPpto}
                    onClick={() => navigate(`/presupuestos-s?solicitudId=${solicitudIdBack || 1}`)}>
                    <ClipboardList size={13} /> Armar presupuesto
                  </button>
                </div>

              ) : msg.tipo === "presupuesto" && msg.presupuesto ? (
                /* Presupuesto enviado */
                <div className={stylesCss.pptoCard}>
                  <div className={stylesCss.pptoHeader}>
                    <FileText size={14} className={stylesCss.pptoHeaderIcono} />
                    <div>
                      <span className={stylesCss.pptoHeaderLabel}>Presupuesto</span>
                      {msg.presupuesto.tipo && <span className={stylesCss.pptoTipo}>{msg.presupuesto.tipo}</span>}
                    </div>
                  </div>

                  <p className={stylesCss.pptoMonto}>{msg.presupuesto.monto}</p>

                  {msg.presupuesto.desc && (
                    <p className={stylesCss.pptoDesc}>{msg.presupuesto.desc}</p>
                  )}

                  <div className={stylesCss.pptoDetalles}>
                    <div className={stylesCss.pptoDetalleFila}>
                      <CreditCard size={12} className={stylesCss.pptoDetalleIcono} />
                      <span className={stylesCss.pptoDetalleTexto}>{msg.presupuesto.etapas}</span>
                    </div>
                    <div className={stylesCss.pptoDetalleFila}>
                      <Shield size={12} className={stylesCss.pptoDetalleIcono} />
                      <span className={stylesCss.pptoDetalleTexto}>{msg.presupuesto.garantia}</span>
                    </div>
                    {msg.presupuesto.materiales && (
                      <div className={stylesCss.pptoDetalleFila}>
                        <Wrench size={12} className={stylesCss.pptoDetalleIcono} />
                        <span className={stylesCss.pptoDetalleTexto}>{msg.presupuesto.materiales}</span>
                      </div>
                    )}
                    {msg.presupuesto.visita && (
                      <div className={stylesCss.pptoDetalleFila}>
                        <Car size={12} className={stylesCss.pptoDetalleIcono} />
                        <span className={stylesCss.pptoDetalleTexto}>Visita: {msg.presupuesto.visita}</span>
                      </div>
                    )}
                  </div>

                  <div className={stylesCss.pptoBotones}>
                    <button type="button" className={stylesCss.btnAceptarPpto}>
                      <CheckCircle size={12} /> Aceptar
                    </button>
                    <button type="button" className={stylesCss.btnNegociarPpto}>
                      Negociar
                    </button>
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
        {!grabando ? (
          <>
            <button className={stylesCss.btnAdjunto} onClick={() => mostrarToast("Adjuntar archivo")}>
              <Paperclip size={17} />
            </button>
            <button className={stylesCss.btnAdjunto} onClick={() => mostrarToast("Abrir cámara")}>
              <Camera size={17} />
            </button>
            <div className={stylesCss.inputBloque}>
              <textarea
                className={stylesCss.inputTexto}
                placeholder="Escribí un mensaje..."
                value={inputTexto}
                onChange={(e) => {
                  setInputTexto(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje(); } }}
                rows={1}
              />
            </div>
            {inputTexto.trim() ? (
              <button className={`${stylesCss.btnEnviar} ${stylesCss.btnEnviarActivo}`} onClick={enviarMensaje}>
                <Send size={17} />
              </button>
            ) : (
              <button
                className={`${stylesCss.btnAudio} ${grabando ? stylesCss.btnAudioGrabando : ""}`}
                onMouseDown={iniciarGrabacion}
                onMouseUp={finalizarGrabacion}
                onTouchStart={iniciarGrabacion}
                onTouchEnd={finalizarGrabacion}>
                <Mic size={17} />
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className={`${stylesCss.btnAudio} ${stylesCss.btnAudioGrabando}`}
              onMouseUp={finalizarGrabacion}
              onTouchEnd={finalizarGrabacion}>
              <Mic size={17} />
            </button>
            <span className={stylesCss.grabandoLabel}>● Grabando... soltá para enviar</span>
          </>
        )}
      </div>

      {toast && <div className={stylesCss.toast}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}