import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferior from "./NavInferior";
import styles from "./Presupuestos.module.css";
import { IconoVolver } from "./Iconos";
import {
  DollarSign,
  Star,
  Shield,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  MessageCircle,
  Wrench,
  Timer,
} from "lucide-react";

const TRABAJO = {
  titulo: "Pérdida de agua en baño principal",
  categoria: "Plomería",
  descripcion: "Pérdida bajo la pileta del baño. Hace 2 días.",
};

const PRESUPUESTOS = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    inicial: "C",
    nivel: "🥇",
    oficio: "Plomero",
    reputacion: 4.9,
    totalReseñas: 87,
    garantia: true,
    diasGarantia: 30,
    sinReclamos: true,
    tiempoRespuesta: "8 min",
    monto: 22000,
    tiempoEstimado: "2–3 horas",
    descripcion: "Cambio de sifón y sellado completo. Incluye materiales.",
    vence: "2 días",
    badge: "Mejor precio",
  },
  {
    id: 2,
    nombre: "Roberto Flores",
    inicial: "R",
    nivel: "🥈",
    oficio: "Plomero",
    reputacion: 4.7,
    totalReseñas: 54,
    garantia: true,
    diasGarantia: 15,
    sinReclamos: true,
    tiempoRespuesta: "15 min",
    monto: 18000,
    tiempoEstimado: "1–2 horas",
    descripcion: "Revisión y reparación. Materiales no incluidos.",
    vence: "5 días",
    badge: null,
  },
  {
    id: 3,
    nombre: "Miguel Saracho",
    inicial: "M",
    nivel: "🥇",
    oficio: "Plomero",
    reputacion: 4.8,
    totalReseñas: 123,
    garantia: false,
    diasGarantia: 0,
    sinReclamos: true,
    tiempoRespuesta: "5 min",
    monto: 25000,
    tiempoEstimado: "2 horas",
    descripcion: "Trabajo completo con garantía de resultado. Materiales incluidos.",
    vence: "1 día",
    badge: "Más reseñas",
  },
];

const CRITERIOS = [
  { id: "precio", label: "Precio", icono: <DollarSign size={14} /> },
  { id: "rating", label: "Rating", icono: <Star size={14} /> },
  { id: "garantia", label: "Garantía", icono: <Shield size={14} /> },
  { id: "tiempo", label: "Tiempo est.", icono: <Clock size={14} /> },
  { id: "respuesta", label: "Respuesta", icono: <Zap size={14} /> },
  { id: "reclamos", label: "Sin reclamos", icono: <CheckCircle size={14} /> },
];

export default function Presupuestos() {
  const navigate = useNavigate();

  const [seleccionado, setSeleccionado] = useState(null);
  const [vista, setVista] = useState("tarjetas");
  // vistas: tarjetas | tabla
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function elegirPresupuesto(id) {
    setSeleccionado(id);
    mostrarToast("✅ Presupuesto aceptado — abriendo chat...");
    setTimeout(() => navigate("/chat"), 1500);
  }

  const menorPrecio = Math.min(...PRESUPUESTOS.map((p) => p.monto));

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Presupuestos</span>
        <div className={styles.vistaToggle}>
          <button
            type="button"
            className={`${styles.vistaBtn} ${vista === "tarjetas" ? styles.vistaBtnActivo : ""}`}
            onClick={() => setVista("tarjetas")}
          >
            ▦
          </button>
          <button
            type="button"
            className={`${styles.vistaBtn} ${vista === "tabla" ? styles.vistaBtnActivo : ""}`}
            onClick={() => setVista("tabla")}
          >
            ☰
          </button>
        </div>
      </header>

      <main className={styles.contenido}>
        {/* ── TRABAJO ── */}
        <div className={styles.trabajoCard}>
          <span className={styles.trabajoCategoria}>
            <Wrench size={14} /> {TRABAJO.categoria}
          </span>
          <p className={styles.trabajoTitulo}>{TRABAJO.titulo}</p>
          <p className={styles.trabajoDesc}>{TRABAJO.descripcion}</p>
        </div>

        <div className={styles.contadorRow}>
          <span className={styles.contador}>
            {PRESUPUESTOS.length} presupuestos recibidos
          </span>
          <span className={styles.contadorVence}>
            <Timer size={12} /> Vencen en 1–5 días
          </span>
        </div>

        {/* ── VISTA TARJETAS ── */}
        {vista === "tarjetas" && (
          <div className={styles.tarjetasLista}>
            {PRESUPUESTOS.map((p) => (
              <div
                key={p.id}
                className={`${styles.tarjeta} ${
                  seleccionado === p.id ? styles.tarjetaSeleccionada : ""
                } ${p.monto === menorPrecio ? styles.tarjetaDestacada : ""}`}
              >
                {/* Badge */}
                {p.badge && (
                  <div className={styles.tarjetaBadge}>{p.badge}</div>
                )}

                {/* Header solucionador */}
                <div className={styles.tarjetaHeader}>
                  <div className={styles.tarjetaAvatar}>
                    {p.inicial}
                    <span className={styles.tarjetaNivel}>{p.nivel}</span>
                  </div>
                  <div className={styles.tarjetaInfo}>
                    <span className={styles.tarjetaNombre}>{p.nombre}</span>
                    <span className={styles.tarjetaOficio}>{p.oficio}</span>
                    <div className={styles.tarjetaRating}>
                      ⭐ {p.reputacion}
                      <span className={styles.tarjetaReseñas}>
                        ({p.totalReseñas} reseñas)
                      </span>
                    </div>
                  </div>
                  <div className={styles.tarjetaMonto}>
                    <span className={styles.tarjetaMontoValor}>
                      ${p.monto.toLocaleString("es-AR")}
                    </span>
                    {p.monto === menorPrecio && (
                      <span className={styles.tarjetaMontoBadge}>
                        Menor precio
                      </span>
                    )}
                  </div>
                </div>

                {/* Detalles */}
                <p className={styles.tarjetaDescripcion}>{p.descripcion}</p>

                {/* Chips de características */}
                <div className={styles.tarjetaChips}>
                  <span
                    className={`${styles.chip} ${
                      p.garantia ? styles.chipVerde : styles.chipGris
                    }`}
                  >
                    <Shield size={12} />
                    {p.garantia
                      ? `Garantía ${p.diasGarantia} días`
                      : "Sin garantía"}
                  </span>
                  <span className={styles.chip}>
                    <Clock size={12} /> {p.tiempoEstimado}
                  </span>
                  <span className={styles.chip}>
                    <Zap size={12} /> Responde en {p.tiempoRespuesta}
                  </span>
                  {p.sinReclamos && (
                    <span className={`${styles.chip} ${styles.chipVerde}`}>
                      <CheckCircle size={12} /> Sin reclamos
                    </span>
                  )}
                </div>

                {/* Vencimiento */}
                <div className={styles.tarjetaVence}>
                  <Timer size={12} /> Vence en {p.vence}
                </div>

                {/* Botones */}
                <div className={styles.tarjetaBotones}>
                  <div className={styles.tarjetaBotonesTop}>
                    <button
                      type="button"
                      className={styles.btnPerfil}
                      onClick={() => navigate(`/perfil?nombre=${encodeURIComponent(p.nombre)}&oficio=${encodeURIComponent(p.oficio)}`)}
                    >
                      Ver perfil
                    </button>
                    <button
                      type="button"
                      className={styles.btnChat}
                      onClick={() => navigate(`/chat?solId=${p.id}`)}
                    >
                      <MessageCircle size={14} /> Preguntar
                    </button>
                  </div>
                  <button
                    type="button"
                    className={styles.btnElegir}
                    onClick={() => elegirPresupuesto(p.id)}
                  >
                    Elegir →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── VISTA TABLA ── */}
        {vista === "tabla" && (
          <div className={styles.tablaWrapper}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.tablaTh}>Criterio</th>
                  {PRESUPUESTOS.map((p) => (
                    <th key={p.id} className={styles.tablaTh}>
                      <div className={styles.tablaHeaderAvatar}>
                        {p.inicial}
                      </div>
                      <div className={styles.tablaHeaderNombre}>
                        {p.nombre.split(" ")[0]}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CRITERIOS.map((criterio) => (
                  <tr key={criterio.id} className={styles.tablaTr}>
                    <td className={styles.tablaTdLabel}>
                      {criterio.icono} {criterio.label}
                    </td>
                    {PRESUPUESTOS.map((p) => (
                      <td key={p.id} className={styles.tablaTd}>
                        {criterio.id === "precio" && (
                          <span
                            className={`${styles.tablaValor} ${
                              p.monto === menorPrecio
                                ? styles.tablaValorDestacado
                                : ""
                            }`}
                          >
                            ${p.monto.toLocaleString("es-AR")}
                          </span>
                        )}
                        {criterio.id === "rating" && (
                          <span className={styles.tablaValor}>
                            <Star size={12} /> {p.reputacion}
                          </span>
                        )}
                        {criterio.id === "garantia" && (
                          <span
                            className={`${styles.tablaValor} ${
                              p.garantia
                                ? styles.tablaValorVerde
                                : styles.tablaValorGris
                            }`}
                          >
                            {p.garantia ? (
                              <>
                                <CheckCircle size={12} /> {p.diasGarantia}d
                              </>
                            ) : (
                              <XCircle size={12} />
                            )}
                          </span>
                        )}
                        {criterio.id === "tiempo" && (
                          <span className={styles.tablaValor}>
                            {p.tiempoEstimado}
                          </span>
                        )}
                        {criterio.id === "respuesta" && (
                          <span className={styles.tablaValor}>
                            {p.tiempoRespuesta}
                          </span>
                        )}
                        {criterio.id === "reclamos" && (
                          <span
                            className={`${styles.tablaValor} ${
                              p.sinReclamos
                                ? styles.tablaValorVerde
                                : styles.tablaValorGris
                            }`}
                          >
                            {p.sinReclamos ? (
                              <CheckCircle size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Fila de acción */}
                <tr className={styles.tablaTr}>
                  <td className={styles.tablaTdLabel}>Elegir</td>
                  {PRESUPUESTOS.map((p) => (
                    <td key={p.id} className={styles.tablaTd}>
                      <button
                        type="button"
                        className={styles.tablaElegirBtn}
                        onClick={() => elegirPresupuesto(p.id)}
                      >
                        Elegir
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>

      <NavInferior />
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}