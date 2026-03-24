import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import { getSolucionador, TRABAJOS } from "./MockData";
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
  HardHat,
  Star,
} from "lucide-react";

const TRABAJO = {
  id: "TP-2024-0847",
  titulo: "Tablero eléctrico",
  descripcion:
    "Revisión completa del tablero, reemplazo del disyuntor principal 32A y verificación de todos los circuitos.",
  monto: "$32.000",
  montoRetenido: "$35.200",
  fecha: "Hoy, 7 de marzo",
  direccion: "Av. Mitre 1240, Posadas",
  garantia: "30 días",
};

const SOLUCIONADOR = {
  nombre: "Carlos Méndez",
  inicial: "C",
  oficio: "Plomero",
  nivel: "🥇",
  reputacion: 4.9,
  telefono: "+54 376 4123456",
};

function getEtapas(nombreSol) {
  return [
    {
      id: 1,
      icono: <CheckCircle size={18} />,
      titulo: "Trabajo confirmado",
      desc: "Presupuesto aceptado y pago retenido",
      hora: "16:52",
      estado: "completada",
    },
    {
      id: 2,
      icono: <Car size={18} />,
      titulo: "En camino",
      desc: `${nombreSol} está yendo a tu domicilio`,
      hora: "17:10",
      estado: "completada",
    },
    {
      id: 3,
      icono: <Wrench size={18} />,
      titulo: "Trabajando",
      desc: `${nombreSol} está realizando el trabajo`,
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
}

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
  const [searchParams] = useSearchParams();
  const solIdParam = searchParams.get("solId");
  const trabajoIdParam = searchParams.get("trabajoId");

  // Solucionador dinámico — usa el param si viene, sino el mock por defecto
  const solDinamico = solIdParam ? getSolucionador(Number(solIdParam)) : null;
  const trabajoDinamico = trabajoIdParam
    ? TRABAJOS.find(t => t.id === Number(trabajoIdParam))
    : null;
  const solActivo = solDinamico || SOLUCIONADOR;
  const ETAPAS = getEtapas(solActivo.nombre);
  const [etapaActiva, setEtapaActiva] = useState(3);
  const [toast, setToast] = useState(null);
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [avancePct, setAvancePct] = useState(65);
  const [fotos, setFotos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [nuevoMaterial, setNuevoMaterial] = useState({ nombre: "", costo: "" });
  const [mostrarMateriales, setMostrarMateriales] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [trabajoFinalizado, setTrabajoFinalizado] = useState(false);
  const [avanceSolicitado, setAvanceSolicitado]   = useState(null); // % pendiente de aprobar
  const [avanceAprobadoU,  setAvanceAprobadoU]    = useState(65);   // último % aprobado

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const progresoPct = Math.round(
    ((etapaActiva - 1) / (ETAPAS.length - 1)) * 100,
  );

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
            {/* Simulación: el solucionador envió avance 80% */}
            {!avanceSolicitado && avanceAprobadoU < 80 && (
              <div style={{ marginTop: 8, padding: "10px 12px", background: "rgba(140,104,32,0.08)", borderRadius: 8, border: "1px solid rgba(140,104,32,0.2)" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--amarillo)", margin: "0 0 8px", fontFamily: "var(--fuente)" }}>
                  ⏳ El solucionador reportó 80% de avance
                </p>
                <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: "0 0 10px", fontFamily: "var(--fuente)" }}>
                  Aprobá el avance para habilitar el pago parcial correspondiente.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button"
                    onClick={() => { setAvanceAprobadoU(80); mostrarToast("✅ Avance aprobado · Pago parcial habilitado"); }}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: "var(--verde)", color: "white", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 12, fontWeight: 700 }}>
                    ✅ Aprobar
                  </button>
                  <button type="button"
                    onClick={() => mostrarToast("Avance rechazado — el solucionador fue notificado")}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: "none", color: "var(--tp-rojo)", border: "1px solid rgba(184,64,48,0.3)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 12, fontWeight: 600 }}>
                    Rechazar
                  </button>
                </div>
              </div>
            )}
            <p style={{ fontSize: 10, color: "var(--tp-marron-suave)", margin: "6px 0 0", fontFamily: "var(--fuente)" }}>
              📡 Avance aprobado: {avanceAprobadoU}% · Actualizado en tiempo real
            </p>
          </section>
        ) : (
          <section className={styles.finalizadoCard}>
            <span className={styles.finalizadoIcono}>🎉</span>
            <div>
              <p className={styles.finalizadoTitulo}>¡Trabajo completado!</p>
              <p className={styles.finalizadoDesc}>
                El pago fue liberado a {solActivo.nombre}. ¿Podés calificarlo?
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
              {solActivo.inicial}
              <span className={styles.solucionadorNivel}>
                {solActivo.nivel || "🥇"}
              </span>
            </div>
            <div className={styles.solucionadorTexto}>
              <span className={styles.solucionadorNombre}>
                {solActivo.nombre}
              </span>
              <span className={styles.solucionadorOficio}>
                {solActivo.oficio} · <Star size={12} />{" "}
                {solActivo.calificacion || solActivo.reputacion || 4.9}
              </span>
            </div>
          </div>
          <div className={styles.solucionadorAcciones}>
            <button
              type="button"
              className={styles.btnAccion}
              onClick={() => navigate(`/chat?solId=${solIdParam || 1}&desde=seguimiento`)}
              title="Chat"
            >
              <MessageCircle size={18} />
            </button>
            <button
              type="button"
              className={styles.btnAccion}
              onClick={() => navigate(`/perfil?nombre=${encodeURIComponent(solActivo.nombre)}&oficio=${encodeURIComponent(solActivo.oficio)}&desde=seguimiento&solId=${solIdParam || 1}`)}
              title="Ver perfil"
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontFamily: "var(--fuente)", padding: "6px 10px" }}
            >
              <HardHat size={18} />
            </button>
          </div>
        </section>

        {/* ── ESCROW ── */}
        <section className={styles.escrowCard}>
          <div className={styles.escrowIcono}>
            <Lock size={24} />
          </div>
          <div className={styles.escrowInfo}>
            <p className={styles.escrowTitulo}>Pago retenido en garantía</p>
            <p className={styles.escrowMonto}>{TRABAJO.montoRetenido}</p>
            {/* Etapas de pago simplificadas */}
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[
                { label: "Anticipo 30%", estado: "pagado" },
                { label: "Avance 40%",  estado: "retenido" },
                { label: "Cierre 30%",  estado: "pendiente" },
              ].map((e, i) => (
                <div key={i} style={{ flex: 1, padding: "5px 4px", borderRadius: 8, textAlign: "center",
                  background: e.estado === "pagado" ? "rgba(42,125,90,0.15)" : e.estado === "retenido" ? "rgba(240,234,214,0.25)" : "rgba(240,234,214,0.10)",
                }}>
                  <p style={{ fontSize: 9, fontWeight: 700, margin: "0 0 2px", fontFamily: "var(--fuente)",
                    color: e.estado === "pagado" ? "#2A7D5A" : "rgba(240,234,214,0.75)" }}>
                    {e.estado === "pagado" ? "✓" : e.estado === "retenido" ? "🔒" : "○"}
                  </p>
                  <p style={{ fontSize: 9, margin: 0, fontFamily: "var(--fuente)", color: "rgba(240,234,214,0.65)" }}>{e.label}</p>
                </div>
              ))}
            </div>
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
onClick={() => navigate(`/calificacion?solNombre=${encodeURIComponent(solActivo.nombre)}&solOficio=${encodeURIComponent(solActivo.oficio || "Solucionador")}&solInicial=${solActivo.inicial || solActivo.nombre?.charAt(0)}&solNivel=${encodeURIComponent(solActivo.nivel || "🥇")}`)}
          >
            <Star size={16} /> Calificar a {solActivo.nombre}
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
              <strong>{TRABAJO.montoRetenido}</strong> a {solActivo.nombre}.
              Esta acción no se puede deshacer.
            </p>

            <div className={styles.modalEscrow}>
              <span>
                <Lock size={16} />
              </span>
              <p>
                Se liberarán <strong>{TRABAJO.montoRetenido}</strong> retenido a
                la cuenta de {solActivo.nombre}
              </p>
            </div>

            <button
              type="button"
              className={styles.btnConfirmar}
              onClick={() => {
                setModalFinalizar(false);
                setTrabajoFinalizado(true);
                mostrarToast("🎉 Pago liberado a " + solActivo.nombre);
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
      <NavInferior />
    </div>
  );
}