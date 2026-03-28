import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import styles from "./Presupuestos.module.css";
import { IconoVolver } from "./Iconos";
import {
  DollarSign, Star, Shield, Clock, Zap,
  CheckCircle, MessageCircle, Wrench, Timer,
  LayoutList, BarChart2,
} from "lucide-react";

// ── MOCK: trabajos con solicitud de presupuesto ───────────────
const TRABAJOS_MOCK = [
  {
    id: 1,
    titulo: "Pérdida de agua en baño principal",
    categoria: "Plomería",
    descripcion: "Pérdida bajo la pileta del baño. Hace 2 días. Hay humedad en el mueble.",
    fecha: "Hoy",
    presupuestosCount: 3,
    estado: "pendiente",
  },
  {
    id: 2,
    titulo: "Instalación de luces embutidas",
    categoria: "Electricidad",
    descripcion: "3 luces embutidas en living + 2 apliques dormitorio principal.",
    fecha: "Ayer",
    presupuestosCount: 2,
    estado: "pendiente",
  },
  {
    id: 3,
    titulo: "Pintura living y comedor",
    categoria: "Pintura",
    descripcion: "Living 25m², comedor 15m². Incluye materiales y mano de obra.",
    fecha: "Hace 3 días",
    presupuestosCount: 1,
    estado: "pendiente",
  },
];

// ── MOCK: presupuestos por trabajo ───────────────────────────
const PRESUPUESTOS_POR_TRABAJO = {
  1: [
    {
      id: 1, nombre: "Carlos Mendoza", inicial: "C", nivel: "🥇",
      oficio: "Plomero", reputacion: 4.9, totalReseñas: 87,
      garantia: true, diasGarantia: 30, sinReclamos: true,
      tiempoRespuesta: "8 min", monto: 22000, tiempoEstimado: "2–3 horas",
      descripcion: "Cambio de sifón y sellado completo. Incluye materiales y mano de obra. Garantía de 30 días sobre el trabajo realizado.",
      vence: "2 días", badge: "Mejor precio", color: "#B84030",
    },
    {
      id: 2, nombre: "Roberto Flores", inicial: "R", nivel: "🥈",
      oficio: "Plomero", reputacion: 4.7, totalReseñas: 54,
      garantia: true, diasGarantia: 15, sinReclamos: true,
      tiempoRespuesta: "15 min", monto: 18000, tiempoEstimado: "1–2 horas",
      descripcion: "Revisión y reparación del sifón. Materiales no incluidos. Se cotiza luego de ver el problema in situ.",
      vence: "5 días", badge: null, color: "#2A7D5A",
    },
    {
      id: 3, nombre: "Miguel Saracho", inicial: "M", nivel: "🥇",
      oficio: "Plomero", reputacion: 4.8, totalReseñas: 123,
      garantia: false, diasGarantia: 0, sinReclamos: true,
      tiempoRespuesta: "5 min", monto: 25000, tiempoEstimado: "2 horas",
      descripcion: "Trabajo completo con inspección previa sin cargo. Incluye materiales de primera calidad.",
      vence: "1 día", badge: "Más reseñas", color: "#8C6820",
    },
  ],
  2: [
    {
      id: 4, nombre: "Ana Rodríguez", inicial: "A", nivel: "🥇",
      oficio: "Electricista", reputacion: 4.9, totalReseñas: 63,
      garantia: true, diasGarantia: 30, sinReclamos: true,
      tiempoRespuesta: "12 min", monto: 22000, tiempoEstimado: "3–4 horas",
      descripcion: "3 luces embutidas + 2 apliques. Incluye mano de obra, cables y cañerías. Materiales de iluminación no incluidos.",
      vence: "3 días", badge: "Mejor precio", color: "#B84030",
    },
    {
      id: 5, nombre: "Luis Pereyra", inicial: "L", nivel: "🥈",
      oficio: "Electricista", reputacion: 4.6, totalReseñas: 41,
      garantia: true, diasGarantia: 15, sinReclamos: false,
      tiempoRespuesta: "20 min", monto: 19500, tiempoEstimado: "4–5 horas",
      descripcion: "Instalación completa. Requiero ver el lugar antes de confirmar el precio definitivo.",
      vence: "4 días", badge: null, color: "#2A7D5A",
    },
  ],
  3: [
    {
      id: 6, nombre: "Diego Fernández", inicial: "D", nivel: "🥈",
      oficio: "Pintor", reputacion: 4.7, totalReseñas: 38,
      garantia: true, diasGarantia: 30, sinReclamos: true,
      tiempoRespuesta: "10 min", monto: 45000, tiempoEstimado: "2 días",
      descripcion: "Pintura látex primera marca, 2 manos. Incluye materiales, preparación de superficies y enduido si es necesario.",
      vence: "2 días", badge: "Más reseñas", color: "#534AB7",
    },
  ],
};

export default function Presupuestos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trabajoIdParam = searchParams.get("trabajoId");
  const trabajoInicial = trabajoIdParam
    ? TRABAJOS_MOCK.find(t => t.id === Number(trabajoIdParam)) || null
    : null;
  const [trabajoActivo, setTrabajoActivo] = useState(trabajoInicial);
  const [vista, setVista]               = useState("lista"); // "lista" | "comparar"
  const [toast, setToast]               = useState(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const presupuestos = trabajoActivo ? (PRESUPUESTOS_POR_TRABAJO[trabajoActivo.id] || []) : [];
  const menorPrecio  = presupuestos.length ? Math.min(...presupuestos.map(p => p.monto)) : 0;

  // ── VISTA: LISTA DE TRABAJOS ─────────────────────────────
  if (!trabajoActivo) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Mis presupuestos</span>
          <div style={{ width: 36 }} />
        </header>

        <main className={styles.contenido}>
          <p style={{ fontSize: 13, color: "var(--tp-marron-suave)", margin: "0 0 12px", fontFamily: "var(--fuente)" }}>
            Tocá un trabajo para ver los presupuestos recibidos
          </p>

          {TRABAJOS_MOCK.map(t => (
            <button key={t.id} type="button"
              onClick={() => { setTrabajoActivo(t); window.history.pushState(null, "", `/presupuestos?trabajoId=${t.id}`); }}
              style={{
                width: "100%", textAlign: "left", background: "var(--tp-crema-clara)",
                border: "1px solid rgba(61,31,31,0.10)", borderRadius: "var(--r-lg)",
                padding: 14, marginBottom: 10, cursor: "pointer", fontFamily: "var(--fuente)",
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Wrench size={13} style={{ color: "var(--tp-rojo)", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-rojo)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{t.categoria}</span>
                  <span style={{ fontSize: 11, color: "var(--tp-marron-suave)", marginLeft: "auto" }}>{t.fecha}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 4px" }}>{t.titulo}</p>
                <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.descripcion}</p>
              </div>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "var(--tp-marron)", lineHeight: 1 }}>{t.presupuestosCount}</div>
                <div style={{ fontSize: 10, color: "var(--tp-marron-suave)" }}>presup.</div>
              </div>
              <span style={{ fontSize: 18, color: "var(--tp-marron-suave)", flexShrink: 0 }}>›</span>
            </button>
          ))}
        </main>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }

  // ── VISTA: PRESUPUESTOS DE UN TRABAJO ───────────────────
  return (
    <div className={styles.pantalla}>
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => { setTrabajoActivo(null); window.history.pushState(null, "", "/presupuestos"); }}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo} style={{ fontSize: 14 }}>
          {presupuestos.length} presupuesto{presupuestos.length !== 1 ? "s" : ""}
        </span>
        <div className={styles.vistaToggle}>
          <button type="button"
            title="Lista"
            className={`${styles.vistaBtn} ${vista === "lista" ? styles.vistaBtnActivo : ""}`}
            onClick={() => setVista("lista")}
          >
            <LayoutList size={16} />
          </button>
          <button type="button"
            title="Comparar"
            className={`${styles.vistaBtn} ${vista === "comparar" ? styles.vistaBtnActivo : ""}`}
            onClick={() => setVista("comparar")}
          >
            <BarChart2 size={16} />
          </button>
        </div>
      </header>

      <main className={styles.contenido}>
        {/* Tarjeta del trabajo */}
        <div className={styles.trabajoCard}>
          <span className={styles.trabajoCategoria}>
            <Wrench size={14} /> {trabajoActivo.categoria}
          </span>
          <p className={styles.trabajoTitulo}>{trabajoActivo.titulo}</p>
          <p className={styles.trabajoDesc}>{trabajoActivo.descripcion}</p>
        </div>

        {/* ── VISTA LISTA ── */}
        {vista === "lista" && (
          <div className={styles.tarjetasLista}>
            {presupuestos.map((p) => (
              <div key={p.id}
                className={`${styles.tarjeta} ${p.monto === menorPrecio ? styles.tarjetaDestacada : ""}`}
              >
                {p.badge && <div className={styles.tarjetaBadge}>{p.badge}</div>}

                {/* Header solucionador */}
                <div className={styles.tarjetaHeader}>
                  <div className={styles.tarjetaAvatar} style={{ background: p.color }}>
                    {p.inicial}
                    <span className={styles.tarjetaNivel}>{p.nivel}</span>
                  </div>
                  <div className={styles.tarjetaInfo}>
                    <span className={styles.tarjetaNombre}>{p.nombre}</span>
                    <span className={styles.tarjetaOficio}>{p.oficio}</span>
                    <div className={styles.tarjetaRating}>
                      ⭐ {p.reputacion}
                      <span className={styles.tarjetaReseñas}>({p.totalReseñas} reseñas)</span>
                    </div>
                  </div>
                  <div className={styles.tarjetaMonto}>
                    <span className={styles.tarjetaMontoValor}>${p.monto.toLocaleString("es-AR")}</span>
                    {p.monto === menorPrecio && (
                      <span className={styles.tarjetaMontoBadge}>Menor precio</span>
                    )}
                  </div>
                </div>

                {/* Descripción completa */}
                <p className={styles.tarjetaDescripcion}>{p.descripcion}</p>

                {/* Chips */}
                <div className={styles.tarjetaChips}>
                  <span className={`${styles.chip} ${p.garantia ? styles.chipVerde : styles.chipGris}`}>
                    <Shield size={12} />
                    {p.garantia ? `Garantía ${p.diasGarantia} días` : "Sin garantía"}
                  </span>
                  <span className={styles.chip}><Clock size={12} /> {p.tiempoEstimado}</span>
                  <span className={styles.chip}><Zap size={12} /> Responde en {p.tiempoRespuesta}</span>
                  {p.sinReclamos && (
                    <span className={`${styles.chip} ${styles.chipVerde}`}>
                      <CheckCircle size={12} /> Sin reclamos
                    </span>
                  )}
                </div>

                <div className={styles.tarjetaVence}>
                  <Timer size={12} /> Vence en {p.vence}
                </div>

                {/* Botones — solo Ver perfil y Consultar */}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button type="button"
                    className={styles.btnPerfil}
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/perfil?nombre=${encodeURIComponent(p.nombre)}&oficio=${encodeURIComponent(p.oficio)}&reputacion=${p.reputacion}&trabajos=${p.totalReseñas}&desde=presupuestos&trabajoId=${trabajoActivo.id}`)}
                  >
                    Ver perfil
                  </button>
                  <button type="button"
                    className={styles.btnChat}
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => navigate(`/chat?solId=${p.id}&nombre=${encodeURIComponent(p.nombre)}&desde=presupuestos&trabajoId=${trabajoActivo.id}`)}
                  >
                    <MessageCircle size={14} /> Consultar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── VISTA COMPARAR ── */}
        {vista === "comparar" && (
          <div className={styles.tablaWrapper}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.tablaTh}>Criterio</th>
                  {presupuestos.map((p) => (
                    <th key={p.id} className={styles.tablaTh}>
                      <div className={styles.tablaHeaderAvatar} style={{ background: p.color }}>{p.inicial}</div>
                      <div className={styles.tablaHeaderNombre}>{p.nombre.split(" ")[0]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Precio",     icono: <DollarSign size={12}/>, key: "monto",          render: p => `$${p.monto.toLocaleString("es-AR")}` },
                  { label: "Tiempo",     icono: <Clock       size={12}/>, key: "tiempoEstimado", render: p => p.tiempoEstimado },
                  { label: "Garantía",   icono: <Shield      size={12}/>, key: "garantia",       render: p => p.garantia ? `${p.diasGarantia} días` : "No" },
                  { label: "Respuesta",  icono: <Zap         size={12}/>, key: "respuesta",      render: p => p.tiempoRespuesta },
                  { label: "Reputación", icono: <Star        size={12}/>, key: "reputacion",     render: p => `⭐ ${p.reputacion}` },
                  { label: "Sin reclamos", icono: <CheckCircle size={12}/>, key: "sinReclamos",  render: p => p.sinReclamos ? "✓" : "✗" },
                ].map(row => (
                  <tr key={row.key}>
                    <td className={styles.tablaTdLabel}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{row.icono} {row.label}</span>
                    </td>
                    {presupuestos.map(p => (
                      <td key={p.id} className={styles.tablaTd}>{row.render(p)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className={styles.tablaTdLabel}>Acciones</td>
                  {presupuestos.map(p => (
                    <td key={p.id} className={styles.tablaTd}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button type="button" className={styles.tablaElegirBtn}
                          style={{ fontSize: 11, padding: "5px 8px" }}
                          onClick={() => navigate(`/perfil?nombre=${encodeURIComponent(p.nombre)}&oficio=${encodeURIComponent(p.oficio)}&reputacion=${p.reputacion}&desde=presupuestos&trabajoId=${trabajoActivo.id}`)}>
                          Ver perfil
                        </button>
                        <button type="button" className={styles.tablaElegirBtn}
                          style={{ fontSize: 11, padding: "5px 8px" }}
                          onClick={() => navigate(`/chat?solId=${p.id}&nombre=${encodeURIComponent(p.nombre)}&desde=presupuestos&trabajoId=${trabajoActivo.id}`)}>
                          Consultar
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferior />
    </div>
  );
}