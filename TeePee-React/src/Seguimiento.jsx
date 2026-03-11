import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Seguimiento.module.css";
import { IconoVolver } from "./Iconos";
import {
  CheckCircle,
  Car,
  Wrench,
  Flag,
  Zap,
  Cable,
  Lock,
  MessageCircle,
  Star,
} from "lucide-react";

const TRABAJO = {
  id: "TP-2024-0847",
  titulo: "Tablero eléctrico",
  descripcion:
    "Revisión completa del tablero, reemplazo del disyuntor principal 32A y verificación de todos los circuitos.",
  monto: "$32.000",
  montoEscrow: "$35.200",
  fecha: "Hoy, 7 de marzo",
  direccion: "Av. Mitre 1240, Posadas",
  garantia: "30 días",
};

const SOLUCIONADOR = {
  nombre: "Juan Ledesma",
  inicial: "J",
  oficio: "Electricista",
  nivel: "🥇",
  reputacion: 4.9,
  telefono: "+54 376 4123456",
};

const ETAPAS = [
  {
    id: 1,
    icono: <CheckCircle size={18} />,
    titulo: "Trabajo confirmado",
    desc: "Presupuesto aceptado y pago en escrow",
    hora: "16:52",
    estado: "completada",
  },
  {
    id: 2,
    icono: <Car size={18} />,
    titulo: "En camino",
    desc: "Juan está yendo a tu domicilio",
    hora: "17:10",
    estado: "completada",
  },
  {
    id: 3,
    icono: <Wrench size={18} />,
    titulo: "Trabajando",
    desc: "Juan está realizando el trabajo",
    hora: "17:35",
    estado: "activa",
  },
  {
    id: 4,
    icono: <Flag size={18} />,
    titulo: "Terminado",
    desc: "Trabajo finalizado, pendiente de confirmación",
    hora: null,
    estado: "pendiente",
  },
];

const FOTOS_AVANCE = [
  { id: 1, icono: <Zap size={20} />, titulo: "Tablero antes", hora: "17:38" },
  {
    id: 2,
    icono: <Wrench size={20} />,
    titulo: "Circuito abierto",
    hora: "17:45",
  },
  { id: 3, icono: <Wrench size={20} />, titulo: "Reemplazando", hora: "18:02" },
];

export default function Seguimiento() {
  const navigate = useNavigate();
  const [etapaActiva] = useState(3);
  const [toast, setToast] = useState(null);
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [trabajoFinalizado, setTrabajoFinalizado] = useState(false);
  const [esSolucionador, setEsSolucionador] = useState(false) // cambiar a true para probar

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const progresoPct = Math.round(
    ((etapaActiva - 1) / (ETAPAS.length - 1)) * 100,
  );
  if (esSolucionador) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Seguimiento</span>
          <button className={styles.btnAccionHeader} onClick={() => navigate('/chat')}>
            <MessageCircle size={20} />
          </button>
        </header>

        <main className={styles.contenido}>
          {/* ── ESTADO ── */}
          <section className={styles.estadoCard}>
            <div className={styles.estadoCardTop}>
              <div className={styles.estadoPunto}></div>
              <div className={styles.estadoInfo}>
                <p className={styles.estadoLabel}>Estado actual</p>
                <p className={styles.estadoTexto}>{ETAPAS[etapaActiva - 1].titulo}</p>
                <p className={styles.estadoDesc}>{ETAPAS[etapaActiva - 1].desc}</p>
              </div>
              <div className={styles.estadoPct}>{progresoPct}%</div>
            </div>
            <div className={styles.estadoBarra}>
              <div className={styles.estadoBarraRelleno} style={{ width: `${progresoPct}%` }} />
            </div>
          </section>

          {/* ── DATOS DEL USUARIO ── */}
          <section className={styles.solucionadorCard}>
            <div className={styles.solucionadorInfo}>
              <div className={styles.solucionadorAvatar}>
                M
              </div>
              <div className={styles.solucionadorTexto}>
                <span className={styles.solucionadorNombre}>Martín García</span>
                <span className={styles.solucionadorOficio}>
                  {TRABAJO.titulo} · {TRABAJO.direccion}
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.btnAccion}
              onClick={() => navigate('/chat')}
            >
              <MessageCircle size={18} />
            </button>
          </section>

          {/* ── ETAPAS ── */}
          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Progreso del trabajo</h2>
            <div className={styles.etapasLista}>
              {ETAPAS.map((etapa, index) => (
                <div key={etapa.id} className={styles.etapaFila}>
                  <div className={styles.etapaIzquierda}>
                    <div className={`${styles.etapaCirculo} ${
                      etapa.estado === 'completada' ? styles.etapaCirculoCompleta
                      : etapa.estado === 'activa' ? styles.etapaCirculoActiva
                      : styles.etapaCirculoPendiente
                    }`}>
                      {etapa.estado === 'completada' ? '✓' : etapa.estado === 'activa' ? etapa.icono : index + 1}
                    </div>
                    {index < ETAPAS.length - 1 && (
                      <div className={`${styles.etapaLinea} ${
                        etapa.estado === 'completada' ? styles.etapaLineaCompleta : styles.etapaLineaPendiente
                      }`}></div>
                    )}
                  </div>
                  <div className={`${styles.etapaContenido} ${
                    etapa.estado === 'pendiente' ? styles.etapaContenidoPendiente : ''
                  }`}>
                    <div className={styles.etapaHeader}>
                      <span className={styles.etapaTitulo}>{etapa.titulo}</span>
                      {etapa.hora && <span className={styles.etapaHora}>{etapa.hora}</span>}
                    </div>
                    <span className={styles.etapaDesc}>{etapa.desc}</span>
                    {etapa.estado === 'activa' && (
                      <div className={styles.etapaActivaBadge}>En curso ahora</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── MONTO ── */}
          <section className={styles.escrowCard}>
            <div className={styles.escrowIcono}><Lock size={24} /></div>
            <div className={styles.escrowInfo}>
              <p className={styles.escrowTitulo}>Pago en garantía (Escrow)</p>
              <p className={styles.escrowMonto}>{TRABAJO.montoEscrow}</p>
              <p className={styles.escrowDesc}>
                Se libera cuando el usuario confirma el trabajo completo.
              </p>
            </div>
          </section>

          {/* ── BOTÓN MARCAR TERMINADO ── */}
          {!trabajoFinalizado && etapaActiva < ETAPAS.length && (
            <button
              type="button"
              className={styles.btnFinalizar}
              onClick={() => {
                setEtapaActiva(prev => Math.min(prev + 1, ETAPAS.length))
                mostrarToast('Etapa actualizada')
              }}
            >
              <CheckCircle size={16} /> Avanzar etapa
            </button>
          )}

          {etapaActiva === ETAPAS.length && !trabajoFinalizado && (
            <button
              type="button"
              className={styles.btnFinalizar}
              onClick={() => setModalFinalizar(true)}
            >
              <CheckCircle size={16} /> Marcar como terminado
            </button>
          )}
        </main>

        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    )
  }
  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <div className={styles.headerTexto}>
          <span className={styles.headerTitulo}>Seguimiento</span>
          <span className={styles.headerId}>#{TRABAJO.id}</span>
        </div>
        <button
          className={styles.btnAyuda}
          onClick={() => navigate("/cancelacion")}
        >
          ?
        </button>
      </header>

      <main className={styles.contenido}>
        {/* ── ESTADO GENERAL ── */}
        {!trabajoFinalizado ? (
          <section className={styles.estadoCard}>
            <div className={styles.estadoCardTop}>
              <div className={styles.estadoPunto}></div>
              <div className={styles.estadoInfo}>
                <p className={styles.estadoLabel}>Estado actual</p>
                <p className={styles.estadoTexto}>
                  {ETAPAS[etapaActiva - 1].titulo}
                </p>
                <p className={styles.estadoDesc}>
                  {ETAPAS[etapaActiva - 1].desc}
                </p>
              </div>
              <div className={styles.estadoPct}>{progresoPct}%</div>
            </div>
            <div className={styles.estadoBarra}>
              <div
                className={styles.estadoBarraRelleno}
                style={{ width: `${progresoPct}%` }}
              />
            </div>
          </section>
        ) : (
          <section className={styles.finalizadoCard}>
            <span className={styles.finalizadoIcono}>🎉</span>
            <div>
              <p className={styles.finalizadoTitulo}>¡Trabajo completado!</p>
              <p className={styles.finalizadoDesc}>
                El pago fue liberado a Juan. ¿Podés calificarlo?
              </p>
            </div>
          </section>
        )}

        {/* ── ETAPAS ── */}
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Progreso del trabajo</h2>
          <div className={styles.etapasLista}>
            {ETAPAS.map((etapa, index) => (
              <div key={etapa.id} className={styles.etapaFila}>
                {/* Línea conectora */}
                <div className={styles.etapaIzquierda}>
                  <div
                    className={`${styles.etapaCirculo} ${
                      etapa.estado === "completada"
                        ? styles.etapaCirculoCompleta
                        : etapa.estado === "activa"
                          ? styles.etapaCirculoActiva
                          : styles.etapaCirculoPendiente
                    }`}
                  >
                    {etapa.estado === "completada"
                      ? "✓"
                      : etapa.estado === "activa"
                        ? etapa.icono
                        : index + 1}
                  </div>
                  {index < ETAPAS.length - 1 && (
                    <div
                      className={`${styles.etapaLinea} ${
                        etapa.estado === "completada"
                          ? styles.etapaLineaCompleta
                          : styles.etapaLineaPendiente
                      }`}
                    ></div>
                  )}
                </div>

                <div
                  className={`${styles.etapaContenido} ${
                    etapa.estado === "pendiente"
                      ? styles.etapaContenidoPendiente
                      : ""
                  }`}
                >
                  <div className={styles.etapaHeader}>
                    <span className={styles.etapaTitulo}>{etapa.titulo}</span>
                    {etapa.hora && (
                      <span className={styles.etapaHora}>{etapa.hora}</span>
                    )}
                  </div>
                  <span className={styles.etapaDesc}>{etapa.desc}</span>
                  {etapa.estado === "activa" && (
                    <div className={styles.etapaActivaBadge}>
                      En curso ahora
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SOLUCIONADOR ── */}
        <section className={styles.solucionadorCard}>
          <div className={styles.solucionadorInfo}>
            <div className={styles.solucionadorAvatar}>
              {SOLUCIONADOR.inicial}
              <span className={styles.solucionadorNivel}>
                {SOLUCIONADOR.nivel}
              </span>
            </div>
            <div className={styles.solucionadorTexto}>
              <span className={styles.solucionadorNombre}>
                {SOLUCIONADOR.nombre}
              </span>
              <span className={styles.solucionadorOficio}>
                {SOLUCIONADOR.oficio} · <Star size={12} />{" "}
                {SOLUCIONADOR.reputacion}
              </span>
            </div>
          </div>
          <div className={styles.solucionadorAcciones}>
              <button
              type="button"
              className={styles.btnAccion}
              onClick={() => navigate("/chat")}
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </section>

        {/* ── ESCROW ── */}
        <section className={styles.escrowCard}>
          <div className={styles.escrowIcono}>
            <Lock size={24} />
          </div>
          <div className={styles.escrowInfo}>
            <p className={styles.escrowTitulo}>Pago en garantía (Escrow)</p>
            <p className={styles.escrowMonto}>{TRABAJO.montoEscrow}</p>
            <p className={styles.escrowDesc}>
              El dinero está retenido de forma segura. Se libera automáticamente
              cuando confirmás que el trabajo está completo.
            </p>
          </div>
        </section>

        {/* ── FOTOS DE AVANCE ── */}
        <section className={styles.seccion}>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>Fotos del avance</h2>
            <span className={styles.seccionBadge}>{FOTOS_AVANCE.length}</span>
          </div>
          <div className={styles.fotosScroll}>
            {FOTOS_AVANCE.map((foto) => (
              <div
                key={foto.id}
                className={styles.fotoCard}
                onClick={() => mostrarToast("Ver: " + foto.titulo)}
              >
                <span className={styles.fotoEmoji}>{foto.icono}</span>
                <div className={styles.fotoInfo}>
                  <span className={styles.fotoTitulo}>{foto.titulo}</span>
                  <span className={styles.fotoHora}>{foto.hora}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DETALLES DEL TRABAJO ── */}
        <section className={styles.detallesCard}>
          <h2 className={styles.seccionTitulo}>Detalles</h2>
          <div className={styles.detallesLista}>
            {[
              { label: "Trabajo", valor: TRABAJO.titulo },
              { label: "Dirección", valor: TRABAJO.direccion },
              { label: "Fecha", valor: TRABAJO.fecha },
              { label: "Monto", valor: TRABAJO.monto },
              { label: "Garantía", valor: TRABAJO.garantia },
            ].map((item) => (
              <div key={item.label} className={styles.detalleFila}>
                <span className={styles.detalleLabel}>{item.label}</span>
                <span className={styles.detalleValor}>{item.valor}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTÓN FINALIZAR ── */}
        {!trabajoFinalizado && (
          <button
            type="button"
            className={styles.btnFinalizar}
            onClick={() => setModalFinalizar(true)}
          >
            <CheckCircle size={16} /> Confirmar trabajo completado
          </button>
        )}

        {trabajoFinalizado && (
          <button
            type="button"
            className={styles.btnCalificar}
            onClick={() => navigate("/calificacion")}
          >
            <Star size={16} /> Calificar a {SOLUCIONADOR.nombre}
          </button>
        )}
      </main>

      {/* ── MODAL FINALIZAR ── */}
      {modalFinalizar && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalFinalizar(false);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHandle}></div>
            <div className={styles.modalIcono}>
              <CheckCircle size={32} />
            </div>
            <h2 className={styles.modalTitulo}>¿El trabajo está completo?</h2>
            <p className={styles.modalDesc}>
              Al confirmar, se liberará el pago de{" "}
              <strong>{TRABAJO.montoEscrow}</strong> a {SOLUCIONADOR.nombre}.
              Esta acción no se puede deshacer.
            </p>

            <div className={styles.modalEscrow}>
              <span>
                <Lock size={16} />
              </span>
              <p>
                Se liberarán <strong>{TRABAJO.montoEscrow}</strong> del escrow a
                la cuenta de {SOLUCIONADOR.nombre}
              </p>
            </div>

            <button
              type="button"
              className={styles.btnConfirmar}
              onClick={() => {
                setModalFinalizar(false);
                setTrabajoFinalizado(true);
                mostrarToast("🎉 Pago liberado a " + SOLUCIONADOR.nombre);
              }}
            >
              Confirmar y liberar pago
            </button>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={() => setModalFinalizar(false)}
            >
              Todavía no
            </button>
          </div>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
