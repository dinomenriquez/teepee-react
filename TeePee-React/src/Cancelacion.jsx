import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Cancelacion.module.css";
import { IconoVolver } from "./Iconos";
import {
  XCircle, AlertTriangle, MessageCircle, Shield, Lock,
  Search, CreditCard, Mail, CheckCircle,
  Ghost, HeartCrack, DollarSign, Clock, Handshake, HelpCircle,
} from "lucide-react";

const TRABAJO = {
  id: "TP-2024-0847",
  titulo: "Tablero eléctrico",
  solucionador: "Juan Ledesma",
  inicial: "J",
  nivel: "🥇",
  monto: "$32.000",
  montoTotal: "$35.200",
  estado: "en-camino",
  horaConfirmado: "16:52",
};

const MOTIVOS_CANCELACION = [
  { id: 1, texto: "Tuve un imprevisto personal" },
  { id: 2, texto: "Ya no necesito el servicio" },
  { id: 3, texto: "Encontré otro profesional" },
  { id: 4, texto: "El precio no me conviene" },
  { id: 5, texto: "Otro motivo" },
];

const MOTIVOS_DISPUTA = [
  { id: 1, Icono: Ghost,       texto: "El solucionador no apareció" },
  { id: 2, Icono: HeartCrack,  texto: "El trabajo quedó mal hecho" },
  { id: 3, Icono: DollarSign,  texto: "Me cobró más de lo acordado" },
  { id: 4, Icono: Clock,       texto: "No terminó el trabajo" },
  { id: 5, Icono: Handshake,   texto: "Problema de comunicación" },
  { id: 6, Icono: HelpCircle,  texto: "Otro problema" },
];

const COMISION_PCT = 10;
const TARIFA_VISITA = 5000;

const POLITICA_DEVOLUCION = {
  confirmado: {
    caso: 1,
    Icono: CheckCircle,
    iconoColor: "var(--verde)",
    titulo: "Devolución del 100%",
    desc: "El solucionador aún no se movió. No hay penalidad.",
    color: "verde",
    calcular: (total) => ({
      devolucion: total, tarifaVisita: 0, solucionadorCobra: 0, tepeeCobra: 0,
    }),
  },
  "en-camino": {
    caso: 2,
    Icono: AlertTriangle,
    iconoColor: "#d4891a",
    titulo: "Tarifa de visita",
    desc: "En camino o llegó sin empezar. Se aplica tarifa de visita.",
    color: "naranja",
    calcular: (total) => {
      const comisionVisita = Math.round((TARIFA_VISITA * COMISION_PCT) / 100);
      return {
        devolucion: total - TARIFA_VISITA,
        tarifaVisita: TARIFA_VISITA,
        solucionadorCobra: TARIFA_VISITA - comisionVisita,
        tepeeCobra: comisionVisita,
      };
    },
  },
  trabajando: {
    caso: 3,
    Icono: XCircle,
    iconoColor: "var(--tp-rojo)",
    titulo: "Mediación TeePee",
    desc: "El trabajo ya empezó. TeePee va a mediar el acuerdo.",
    color: "rojo",
    calcular: () => ({
      devolucion: null, tarifaVisita: null, solucionadorCobra: null, tepeeCobra: null,
    }),
  },
};

export default function Cancelacion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trabajoId = searchParams.get("trabajoId") || TRABAJO.id;
  const desde     = searchParams.get("desde") || "seguimiento"; // "seguimiento" | "seguimiento-s"

  function volver() {
    navigate(`/${desde}?trabajoId=${trabajoId}`);
  }

  const [vista, setVista] = useState("menu");
  const [motivoCancelacion, setMotivoCancelacion] = useState(null);
  const [motivoDisputa, setMotivoDisputa] = useState(null);
  const [detalle, setDetalle] = useState("");
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const politica = POLITICA_DEVOLUCION[TRABAJO.estado];
  const montoTotal = 35200;
  const calculos = politica.calcular(montoTotal);
  const PoliticaIcono = politica.Icono;

  // ── MENÚ PRINCIPAL ──
  if (vista === "menu") {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={volver}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Ayuda con el trabajo</span>
        </header>

        <main className={styles.contenido}>
          <div className={styles.trabajoCard}>
            <div className={styles.trabajoAvatar}>
              {TRABAJO.inicial}
              <span className={styles.trabajoNivel}>{TRABAJO.nivel}</span>
            </div>
            <div className={styles.trabajoInfo}>
              <span className={styles.trabajoTitulo}>{TRABAJO.titulo}</span>
              <span className={styles.trabajoSolucionador}>{TRABAJO.solucionador}</span>
              <span className={styles.trabajoMonto}>{TRABAJO.montoTotal} · #{TRABAJO.id}</span>
            </div>
          </div>

          <p className={styles.menuPregunta}>¿Con qué necesitás ayuda?</p>

          <div className={styles.menuOpciones}>
            <button type="button" className={styles.menuOpcion} onClick={() => setVista("cancelacion")}>
              <div className={styles.menuOpcionIcono}><XCircle size={20} /></div>
              <div className={styles.menuOpcionTexto}>
                <span className={styles.menuOpcionTitulo}>Cancelar el trabajo</span>
                <span className={styles.menuOpcionDesc}>Quiero cancelar y recibir mi devolución</span>
              </div>
              <span className={styles.menuOpcionFlecha}>›</span>
            </button>

            <button type="button" className={`${styles.menuOpcion} ${styles.menuOpcionDisputa}`} onClick={() => setVista("disputa")}>
              <div className={styles.menuOpcionIcono}><AlertTriangle size={20} /></div>
              <div className={styles.menuOpcionTexto}>
                <span className={styles.menuOpcionTitulo}>Reportar un problema</span>
                <span className={styles.menuOpcionDesc}>Algo salió mal con el trabajo o el solucionador</span>
              </div>
              <span className={styles.menuOpcionFlecha}>›</span>
            </button>

            <button type="button" className={styles.menuOpcion} onClick={() => mostrarToast("Abriendo chat de soporte...")}>
              <div className={styles.menuOpcionIcono}><MessageCircle size={20} /></div>
              <div className={styles.menuOpcionTexto}>
                <span className={styles.menuOpcionTitulo}>Hablar con soporte</span>
                <span className={styles.menuOpcionDesc}>Un agente de TeePee te va a ayudar</span>
              </div>
              <span className={styles.menuOpcionFlecha}>›</span>
            </button>
          </div>

          <div className={styles.proteccionCard}>
            <span className={styles.proteccionIcono}><Shield size={20} /></span>
            <div>
              <p className={styles.proteccionTitulo}>Protección TeePee</p>
              <p className={styles.proteccionDesc}>Tu dinero está seguro en escrow. Siempre tenés opciones en caso de problemas.</p>
            </div>
          </div>
        </main>

        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    );
  }

  // ── CANCELACIÓN ──
  if (vista === "cancelacion") {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => setVista("menu")}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Cancelar trabajo</span>
        </header>

        <main className={styles.contenido}>
          <div className={`${styles.politicaCard} ${styles["politica-" + politica.color]}`}>
            <div className={styles.politicaTop}>
              <span className={styles.politicaIcono}>
                <PoliticaIcono size={22} color={politica.iconoColor} />
              </span>
              <div>
                <p className={styles.politicaTitulo}>{politica.titulo}</p>
                <p className={styles.politicaDesc}>{politica.desc}</p>
              </div>
            </div>

            {calculos.devolucion !== null && (
              <div className={styles.politicaMontos}>
                <div className={styles.politicaMonto}>
                  <span className={styles.politicaMontoLabel}>Pagaste</span>
                  <span className={styles.politicaMontoValor}>${montoTotal.toLocaleString("es-AR")}</span>
                </div>
                <div className={styles.politicaFlecha}>→</div>
                <div className={styles.politicaMonto}>
                  <span className={styles.politicaMontoLabel}>Recibís</span>
                  <span className={`${styles.politicaMontoValor} ${styles.politicaMontoDevolucion}`}>
                    ${calculos.devolucion.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            )}

            {calculos.tarifaVisita > 0 && (
              <div className={styles.politicaDesglose}>
                <div className={styles.politicaDesgloseItem}>
                  <span>Tarifa de visita</span>
                  <span>${calculos.tarifaVisita.toLocaleString("es-AR")}</span>
                </div>
                <div className={styles.politicaDesgloseItem}>
                  <span>Solucionador recibe (−{COMISION_PCT}% TeePee)</span>
                  <span className={styles.politicaDesgloseDestacado}>${calculos.solucionadorCobra.toLocaleString("es-AR")}</span>
                </div>
                <div className={styles.politicaDesgloseItem}>
                  <span>TeePee retiene</span>
                  <span>${calculos.tepeeCobra.toLocaleString("es-AR")}</span>
                </div>
              </div>
            )}
          </div>

          <section>
            <h2 className={styles.seccionTitulo}>¿Por qué cancelás?</h2>
            <div className={styles.motivosLista}>
              {MOTIVOS_CANCELACION.map((motivo) => (
                <button key={motivo.id} type="button"
                  className={`${styles.motivoBtn} ${motivoCancelacion === motivo.id ? styles.motivoBtnActivo : ""}`}
                  onClick={() => setMotivoCancelacion(motivo.id)}>
                  <span className={styles.motivoTexto}>{motivo.texto}</span>
                  <div className={`${styles.motivoRadio} ${motivoCancelacion === motivo.id ? styles.motivoRadioActivo : ""}`}></div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className={styles.seccionTitulo}>Detalle <span className={styles.opcional}>(opcional)</span></h2>
            <textarea className={styles.textarea}
              placeholder="Contanos más sobre el motivo..."
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              rows={3}
            />
          </section>

          <div className={styles.avisoCard}>
            <AlertTriangle size={16} className={styles.avisoIcono} />
            <p className={styles.avisoTexto}>
              Una vez confirmada la cancelación, el trabajo se cerrará y no podrá reabrirse. Si cambiás de idea, deberás hacer una nueva solicitud.
            </p>
          </div>
        </main>

        <div className={styles.footer}>
          <button type="button" className={styles.btnSecundario} onClick={() => setVista("menu")}>No cancelar</button>
          <button type="button"
            className={`${styles.btnCancelarTrabajo} ${!motivoCancelacion ? styles.btnDesactivado : ""}`}
            disabled={!motivoCancelacion}
            onClick={() => setVista("confirmacion")}>
            Confirmar cancelación
          </button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    );
  }

  // ── DISPUTA ──
  if (vista === "disputa") {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => setVista("menu")}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Reportar problema</span>
        </header>

        <main className={styles.contenido}>
          <div className={styles.disputaIntro}>
            <span className={styles.disputaIntroIcono}><AlertTriangle size={40} /></span>
            <div>
              <p className={styles.disputaIntroTitulo}>Lamentamos que hayas tenido un problema</p>
              <p className={styles.disputaIntroDesc}>TeePee va a revisar tu caso y mediar para encontrar la mejor solución.</p>
            </div>
          </div>

          <section>
            <h2 className={styles.seccionTitulo}>¿Qué pasó?</h2>
            <div className={styles.motivosLista}>
              {MOTIVOS_DISPUTA.map((motivo) => {
                const IconoMotivo = motivo.Icono;
                return (
                  <button key={motivo.id} type="button"
                    className={`${styles.motivoBtn} ${motivoDisputa === motivo.id ? styles.motivoBtnDisputa : ""}`}
                    onClick={() => setMotivoDisputa(motivo.id)}>
                    <span className={styles.motivoIcono}><IconoMotivo size={18} /></span>
                    <span className={styles.motivoTexto}>{motivo.texto}</span>
                    <div className={`${styles.motivoRadio} ${motivoDisputa === motivo.id ? styles.motivoRadioActivo : ""}`}></div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className={styles.seccionTitulo}>Describí el problema</h2>
            <textarea className={styles.textarea}
              placeholder="Contanos con detalle qué pasó para poder ayudarte mejor..."
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              rows={4}
            />
            <span className={styles.contadorTexto}>{detalle.length}/500</span>
          </section>

          <div className={styles.procesoCard}>
            <h3 className={styles.procesoTitulo}>¿Qué pasa después?</h3>
            <div className={styles.procesoSteps}>
              {[
                { n: "1", texto: "TeePee revisa tu reclamo en menos de 24 hs" },
                { n: "2", texto: "Se notifica al solucionador para que dé su versión" },
                { n: "3", texto: "TeePee media y determina la resolución" },
                { n: "4", texto: "Se ejecuta la devolución o acuerdo correspondiente" },
              ].map((step) => (
                <div key={step.n} className={styles.procesoStep}>
                  <div className={styles.procesoStepNum}>{step.n}</div>
                  <p className={styles.procesoStepTexto}>{step.texto}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.escrowDisputaCard}>
            <Lock size={16} className={styles.escrowIcono} />
            <p className={styles.escrowTexto}>
              El dinero permanece retenido en escrow durante todo el proceso de mediación. No se libera hasta resolución.
            </p>
          </div>
        </main>

        <div className={styles.footer}>
          <button type="button" className={styles.btnSecundario} onClick={() => setVista("menu")}>Cancelar</button>
          <button type="button"
            className={`${styles.btnReportar} ${!motivoDisputa || !detalle.trim() ? styles.btnDesactivado : ""}`}
            disabled={!motivoDisputa || !detalle.trim()}
            onClick={() => setVista("resuelto")}>
            Enviar reclamo
          </button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    );
  }

  // ── CONFIRMACIÓN CANCELACIÓN ──
  if (vista === "confirmacion") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.resultadoBloque}>
          <div className={`${styles.resultadoCirculo} ${styles.resultadoCirculoRojo}`}>
            <XCircle size={40} />
          </div>
          <h2 className={styles.resultadoTitulo}>Trabajo cancelado</h2>
          <p className={styles.resultadoDesc}>Tu cancelación fue procesada correctamente.</p>

          <div className={styles.resultadoCard}>
            <div className={styles.resultadoFila}><span>Trabajo</span><span>{TRABAJO.titulo}</span></div>
            <div className={styles.resultadoFila}><span>Estado</span><span className={styles.resultadoCancelado}>Cancelado</span></div>
            <div className={styles.resultadoFila}>
              <span>Devolución</span>
              <span className={styles.resultadoDevolucion}>${calculos.devolucion.toLocaleString("es-AR")}</span>
            </div>
            <div className={styles.resultadoFila}><span>Plazo</span><span>1 a 3 días hábiles</span></div>
          </div>

          <div className={styles.resultadoAviso}>
            <CreditCard size={16} className={styles.resultadoAvisoIcono} />
            <p>La devolución se acreditará en tu método de pago original en 1 a 3 días hábiles.</p>
          </div>

          <button type="button" className={styles.btnInicio} onClick={() => navigate("/home")}>
            Volver al inicio
          </button>
        </div>
        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    );
  }

  // ── RECLAMO ENVIADO ──
  if (vista === "resuelto") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.resultadoBloque}>
          <div className={`${styles.resultadoCirculo} ${styles.resultadoCirculoNaranja}`}>
            <AlertTriangle size={40} />
          </div>
          <h2 className={styles.resultadoTitulo}>Reclamo enviado</h2>
          <p className={styles.resultadoDesc}>Recibimos tu reclamo. Un agente de TeePee lo revisará en menos de 24 horas.</p>

          <div className={styles.resultadoCard}>
            <div className={styles.resultadoFila}><span>Número de caso</span><span className={styles.resultadoNroCaso}>#CASO-2024-0312</span></div>
            <div className={styles.resultadoFila}>
              <span>Estado</span>
              <span className={styles.resultadoEnRevision}>
                <Search size={12} /> En revisión
              </span>
            </div>
            <div className={styles.resultadoFila}>
              <span>Escrow</span>
              <span className={styles.resultadoEscrow}>
                <Lock size={12} /> Retenido
              </span>
            </div>
            <div className={styles.resultadoFila}><span>Resolución estimada</span><span>Menos de 24 hs</span></div>
          </div>

          <div className={styles.resultadoAviso}>
            <Mail size={16} className={styles.resultadoAvisoIcono} />
            <p>Te vamos a notificar por email y por la app cuando haya novedades sobre tu caso.</p>
          </div>

          <button type="button" className={styles.btnInicio} onClick={() => navigate(desde === "seguimiento-s" ? "/home-solucionador" : "/home")}>Volver al inicio</button>
          <button type="button" className={styles.btnSeguirCaso} onClick={volver}>Volver al seguimiento →</button>
        </div>
        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    );
  }
}