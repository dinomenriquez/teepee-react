import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { getUsuario, TRABAJOS } from "./MockData";
import styles from "./Seguimiento.module.css";
import stylesS from "./SeguimientoS.module.css";
import { IconoVolver } from "./Iconos";
import { CheckCircle, Car, Wrench, Flag, Lock, MessageCircle, HardHat } from "lucide-react";

const TRABAJO_DEFAULT = {
  titulo: "Reparación cañería",
  descripcion: "Reparación de cañería bajo mesada, cambio de sifón y sellado.",
  monto: "$28.000",
  montoRetenido: "$28.000",
  fecha: "Hoy, 14:30 hs",
  direccion: "Av. Mitre 1240, Posadas",
};

const USUARIO_DEFAULT = { nombre: "Martín García", inicial: "M" };

const ETAPAS = [
  { id: 1, icono: <CheckCircle size={18} />, titulo: "Trabajo confirmado", desc: "El presupuesto fue aceptado y el pago está retenido en garantía", hora: "16:52", estado: "completada" },
  { id: 2, icono: <Car size={18} />,         titulo: "En camino",          desc: "Estás yendo al domicilio del cliente",                hora: "17:10", estado: "completada" },
  { id: 3, icono: <Wrench size={18} />,      titulo: "Trabajando",         desc: "Estás realizando el trabajo",                         hora: "17:35", estado: "activa"    },
  { id: 4, icono: <Flag size={18} />,        titulo: "Terminado",          desc: "Marcaste el trabajo como finalizado — esperando confirmación del cliente", hora: null, estado: "pendiente" },
];

export default function SeguimientoS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const usuarioIdParam = searchParams.get("usuarioId");
  const trabajoIdParam  = searchParams.get("trabajoId");

  const usuarioDinamico = usuarioIdParam ? getUsuario(Number(usuarioIdParam)) : null;
  const trabajoDinamico = trabajoIdParam  ? TRABAJOS.find(t => t.id === Number(trabajoIdParam)) : null;
  const usuarioActivo   = usuarioDinamico || USUARIO_DEFAULT;
  const trabajoActivo   = trabajoDinamico || TRABAJO_DEFAULT;

  const [etapaActiva,       setEtapaActiva]       = useState(3);
  const [toast,             setToast]             = useState(null);
  const [avancePct,         setAvancePct]         = useState(65);
  const [avanceAprobado,    setAvanceAprobado]    = useState(65);  // último % aprobado por el usuario
  const [avancePendiente,   setAvancePendiente]   = useState(false); // esperando aprobación
  const [fotos,             setFotos]             = useState([]);
  const [materiales,        setMateriales]        = useState([]);
  const [nuevoMaterial,     setNuevoMaterial]     = useState({ nombre: "", costo: "" });
  const [mostrarMateriales, setMostrarMateriales] = useState(false);
  const [mostrarResumen,    setMostrarResumen]    = useState(false);
  const [trabajoFinalizado, setTrabajoFinalizado] = useState(false);

  function toast_(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const totalMateriales = materiales.reduce((acc, m) => acc + Number(m.costo || 0), 0);

  // ── PANTALLA DE RESUMEN ──────────────────────────
  if (mostrarResumen) {
    return (
      <div style={{ background: "var(--tp-crema)", minHeight: "100vh", fontFamily: "var(--fuente)" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setMostrarResumen(false)} style={{ border: "none", background: "none", cursor: "pointer" }}>
            <IconoVolver size={20} />
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>Resumen del trabajo</h1>
        </header>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Confirmación */}
          <div style={{ background: "var(--verde-suave)", borderRadius: "var(--r-lg)", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>Trabajo marcado como terminado</p>
            <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", marginTop: 4 }}>El cliente recibirá una notificación para confirmar y liberar el pago.</p>
          </div>

          {/* Cliente y trabajo */}
          <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-marron-suave)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Cliente</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 2px" }}>{usuarioActivo.nombre}</p>
            <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>{trabajoActivo.descripcion}</p>
            <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", marginTop: 4 }}>📍 {TRABAJO_DEFAULT.direccion}</p>
          </div>

          {/* Fotos */}
          {fotos.length > 0 && (
            <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-marron-suave)", margin: "0 0 8px", textTransform: "uppercase" }}>Fotos ({fotos.length})</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {fotos.map((_, i) => (
                  <div key={i} style={{ width: 60, height: 60, borderRadius: 8, background: "var(--tp-rojo-suave)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📷</div>
                ))}
              </div>
            </div>
          )}

          {/* Materiales */}
          {materiales.length > 0 && (
            <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-marron-suave)", margin: "0 0 8px", textTransform: "uppercase" }}>Materiales</p>
              {materiales.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < materiales.length - 1 ? "1px solid rgba(61,31,31,0.06)" : "none" }}>
                  <span style={{ fontSize: 13, color: "var(--tp-marron)" }}>{m.nombre}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)" }}>${Number(m.costo).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(61,31,31,0.12)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)" }}>Total materiales</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--tp-rojo)" }}>${totalMateriales.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Escrow */}
          <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-marron-suave)", margin: "0 0 4px", textTransform: "uppercase" }}>Pago retenido</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>{trabajoActivo.monto || TRABAJO_DEFAULT.montoRetenido}</p>
              </div>
              <span style={{ fontSize: 32 }}>🔒</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: "8px 0 0" }}>Se libera cuando el cliente confirme el trabajo.</p>
          </div>

          <button type="button" onClick={() => navigate("/home-solucionador")}
            style={{ width: "100%", padding: 16, borderRadius: "var(--r-md)", background: "var(--tp-marron)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 700, marginTop: 8 }}>
            Volver al inicio
          </button>
          <button type="button" onClick={() => navigate(`/chat-s`)}
            style={{ width: "100%", padding: 14, borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron)", border: "1px solid rgba(61,31,31,0.15)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14, fontWeight: 600 }}>
            💬 Avisar al cliente por chat
          </button>
        </div>
        <NavInferiorS />
      </div>
    );
  }

  // ── VISTA PRINCIPAL ──────────────────────────────
  return (
    <div className={styles.pantalla}>
      <header className={stylesS.header}>
        <button className={stylesS.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={stylesS.headerTitulo}>Seguimiento</span>
        <button className={stylesS.btnAccionHeader} onClick={() => navigate("/cancelacion")}>
          ?
        </button>
      </header>

      <main className={stylesS.contenido}>

        {/* ── ESTADO + SLIDER AVANCE ── */}
        <section className={stylesS.estadoCard}>
          <div className={stylesS.estadoCardTop}>
            <div className={stylesS.estadoPunto}></div>
            <div className={styles.estadoInfo}>
              <p className={stylesS.estadoLabel}>Estado actual</p>
              <p className={stylesS.estadoTexto}>{ETAPAS[etapaActiva - 1].titulo}</p>
              <p className={stylesS.estadoDesc}>{ETAPAS[etapaActiva - 1].desc}</p>
            </div>
            <div className={stylesS.estadoPct}>{avancePct}%</div>
          </div>
          <div className={stylesS.estadoBarra}>
            <div className={stylesS.estadoBarraRelleno} style={{ width: `${avancePct}%` }} />
          </div>
          <div style={{ marginTop: 12, padding: "0 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>Avance del trabajo</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-rojo)", fontFamily: "var(--fuente)" }}>{avancePct}%</span>
            </div>
            <input type="range" min={avanceAprobado} max={100} step={5} value={avancePct}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= avanceAprobado) {
                  setAvancePct(val);
                  setAvancePendiente(val > avanceAprobado);
                }
              }}
              style={{ width: "100%", accentColor: avancePendiente ? "var(--amarillo)" : "var(--tp-rojo)" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>0%</span>
              <span style={{ fontSize: 10, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>50%</span>
              <span style={{ fontSize: 10, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>100%</span>
            </div>
            {avancePendiente ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: "var(--amarillo)", fontFamily: "var(--fuente)", fontWeight: 600 }}>
                  ⏳ Esperando aprobación del cliente ({avancePct}%)
                </span>
                <button type="button"
                  onClick={() => { setAvancePct(avanceAprobado); setAvancePendiente(false); toast_("Avance cancelado"); }}
                  style={{ fontSize: 11, color: "var(--tp-rojo)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fuente)" }}>
                  Cancelar
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 10, color: "var(--tp-marron-suave)", margin: "6px 0 0", fontFamily: "var(--fuente)" }}>
                ✅ Avance aprobado: {avanceAprobado}% · 👁 El cliente lo ve en tiempo real
              </p>
            )}
          </div>
        </section>

        {/* ── DATOS DEL CLIENTE ── */}
        <section className={stylesS.clienteCard}>
          <div className={stylesS.clienteInfo}>
            <div className={stylesS.clienteAvatar}>
              {usuarioActivo.inicial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className={stylesS.clienteNombre}>{usuarioActivo.nombre}</span>
              <span className={stylesS.clienteDesc}>{trabajoActivo.descripcion} · {TRABAJO_DEFAULT.direccion}</span>
            </div>
          </div>
          <div className={stylesS.clienteAcciones}>
            <button type="button" className={stylesS.btnAccion} onClick={() => navigate(`/chat-s?usuarioId=${usuarioIdParam || 1}&nombre=${encodeURIComponent(usuarioActivo.nombre)}&inicial=${usuarioActivo.inicial}&desde=seguimiento-s`)} title="Chat">
              <MessageCircle size={18} />
            </button>
            <button type="button" className={stylesS.btnAccion}
              onClick={() => navigate(`/perfil-usuario-publico?usuarioId=${usuarioIdParam || 1}&nombre=${encodeURIComponent(usuarioActivo.nombre)}&desde=seguimiento-s`)}
              title="Ver perfil del cliente">
              <HardHat size={18} />
            </button>
            <button type="button" className={stylesS.btnAccion}
              onClick={() => { navigator.clipboard?.writeText(TRABAJO_DEFAULT.direccion); toast_("📍 Dirección copiada"); }}
              title="Copiar dirección" style={{ fontSize: 16 }}>
              📍
            </button>
          </div>
        </section>

        {/* ── ETAPAS ── */}
        <section className={stylesS.seccion}>
          <h2 className={stylesS.seccionTitulo}>Progreso del trabajo</h2>
          <div className={stylesS.etapasLista}>
            {ETAPAS.map((etapa, index) => (
              <div key={etapa.id} className={stylesS.etapaFila}>
                <div className={stylesS.etapaIzquierda}>
                  <div className={`${stylesS.etapaCirculo} ${
                    etapa.estado === "completada" ? stylesS.etapaCirculoCompleta
                    : etapa.estado === "activa"   ? stylesS.etapaCirculoActiva
                    : stylesS.etapaCirculoPendiente
                  }`}>
                    {etapa.estado === "completada" ? "✓" : etapa.estado === "activa" ? etapa.icono : index + 1}
                  </div>
                  {index < ETAPAS.length - 1 && (
                    <div className={`${stylesS.etapaLinea} ${etapa.estado === "completada" ? stylesS.etapaLineaCompleta : stylesS.etapaLineaPendiente}`}></div>
                  )}
                </div>
                <div className={`${stylesS.etapaContenido} ${etapa.estado === "pendiente" ? stylesS.etapaContenidoPendiente : ""}`}>
                  <div className={stylesS.etapaHeader}>
                    <span className={stylesS.etapaTitulo}>{etapa.titulo}</span>
                    {etapa.hora && <span className={stylesS.etapaHora}>{etapa.hora}</span>}
                  </div>
                  <span className={stylesS.etapaDesc}>{etapa.desc}</span>
                  {etapa.estado === "activa" && <div className={stylesS.etapaActivaBadge}>En curso ahora</div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOTOS ── */}
        <section className={stylesS.seccion}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 className={styles.seccionTitulo} style={{ margin: 0 }}>Fotos del avance</h2>
            <span style={{ fontSize: 10, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>👁 Visibles para el cliente</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {fotos.map((_, i) => (
              <div key={i} style={{ width: 72, height: 72, borderRadius: 10, background: "var(--tp-rojo-suave)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative" }}>
                📷
                <button type="button" onClick={() => setFotos(prev => prev.filter((_, j) => j !== i))}
                  style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "var(--tp-rojo)", color: "white", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            ))}
            <label style={{ width: 72, height: 72, borderRadius: 10, border: "2px dashed rgba(61,31,31,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 24 }}>+</span>
              <span style={{ fontSize: 9, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)" }}>Agregar</span>
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) setFotos(prev => [...prev, URL.createObjectURL(e.target.files[0])]); }} />
            </label>
          </div>
        </section>

        {/* ── MATERIALES ── */}
        <section className={stylesS.seccion}>
          <button type="button" onClick={() => setMostrarMateriales(!mostrarMateriales)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", padding: 0 }}>
            <h2 className={styles.seccionTitulo} style={{ margin: 0 }}>
              Materiales utilizados
              {materiales.length > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "var(--tp-rojo)", marginLeft: 8 }}>({materiales.length})</span>}
            </h2>
            <span style={{ fontSize: 18, color: "var(--tp-marron-suave)" }}>{mostrarMateriales ? "▲" : "▼"}</span>
          </button>
          {mostrarMateriales && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {materiales.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "var(--tp-crema-clara)", border: "1px solid rgba(61,31,31,0.08)" }}>
                  <span style={{ flex: 1, fontSize: 13, color: "var(--tp-marron)", fontFamily: "var(--fuente)" }}>{m.nombre}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", fontFamily: "var(--fuente)" }}>${Number(m.costo).toLocaleString()}</span>
                  <button type="button" onClick={() => setMateriales(prev => prev.filter((_, j) => j !== i))}
                    style={{ border: "none", background: "none", cursor: "pointer", color: "var(--tp-rojo)", fontSize: 16 }}>×</button>
                </div>
              ))}
              <div className={stylesS.clienteAcciones}>
                <input type="text" placeholder="Material" value={nuevoMaterial.nombre}
                  onChange={(e) => setNuevoMaterial(p => ({ ...p, nombre: e.target.value }))}
                  style={{ flex: 2, padding: "8px 10px", borderRadius: 8, fontSize: 13, border: "1px solid rgba(61,31,31,0.15)", background: "var(--tp-crema-clara)", fontFamily: "var(--fuente)", color: "var(--tp-marron)" }} />
                <input type="number" placeholder="$ Costo" value={nuevoMaterial.costo}
                  onChange={(e) => setNuevoMaterial(p => ({ ...p, costo: e.target.value }))}
                  style={{ flex: 1, padding: "8px 10px", borderRadius: 8, fontSize: 13, border: "1px solid rgba(61,31,31,0.15)", background: "var(--tp-crema-clara)", fontFamily: "var(--fuente)", color: "var(--tp-marron)" }} />
                <button type="button"
                  onClick={() => { if (nuevoMaterial.nombre) { setMateriales(prev => [...prev, { ...nuevoMaterial }]); setNuevoMaterial({ nombre: "", costo: "" }); } }}
                  style={{ padding: "8px 12px", borderRadius: 8, background: "var(--tp-marron)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
              {materiales.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", fontFamily: "var(--fuente)" }}>
                    Total: ${totalMateriales.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── ESCROW ── */}
        <section className={stylesS.escrowCard}>
          <div className={stylesS.escrowIcono}><Lock size={24} /></div>
          <div className={stylesS.escrowInfo}>
            <p className={stylesS.escrowTitulo}>Pago retenido en garantía</p>
            <p className={stylesS.escrowMonto}>{trabajoActivo.monto || TRABAJO_DEFAULT.montoRetenido}</p>
            <p className={stylesS.escrowDesc}>Se libera cuando el cliente confirme el trabajo.</p>
          </div>
        </section>

        {/* ── BOTONES ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
          {!trabajoFinalizado && etapaActiva < ETAPAS.length && (
            <button type="button" className={stylesS.btnFinalizar}
              onClick={() => { setEtapaActiva(prev => Math.min(prev + 1, ETAPAS.length)); setAvancePct(prev => Math.min(prev + 25, 100)); toast_("✅ Etapa actualizada"); }}>
              <CheckCircle size={16} /> Avanzar etapa
            </button>
          )}
          {etapaActiva === ETAPAS.length && !trabajoFinalizado && (
            <button type="button" className={stylesS.btnFinalizar}
              onClick={() => { setAvancePct(100); setMostrarResumen(true); }}>
              <CheckCircle size={16} /> Marcar como terminado
            </button>
          )}
          {avancePendiente && (
            <button type="button"
              onClick={() => {
                setAvanceAprobado(avancePct);
                setAvancePendiente(false);
                toast_(`✅ Avance ${avancePct}% enviado al cliente para aprobación`);
              }}
              style={{ padding: 14, borderRadius: "var(--r-md)", background: "var(--amarillo)", color: "white", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14, fontWeight: 700 }}>
              📤 Enviar avance {avancePct}% al cliente
            </button>
          )}
          <button type="button"
            onClick={() => toast_("✅ Progreso guardado")}
            style={{ padding: 14, borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron)", border: "1px solid rgba(61,31,31,0.15)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 14, fontWeight: 600 }}>
            💾 Guardar progreso
          </button>
        </div>

        {toast && <div className={stylesS.toast}>{toast}</div>}
      </main>
      <NavInferiorS />
    </div>
  );
}