import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import {
  TrendingUp, TrendingDown, Users, Wrench,
  AlertTriangle, CheckCircle, Clock, ArrowRight,
  BadgeCheck, CreditCard, RefreshCw,
} from "lucide-react";

const hoy = new Date();
function fmt(n) { return n.toLocaleString("es-AR"); }

const KPI = [
  {
    label: "GMV hoy",
    valor: 284350,
    display: "$284k",
    delta: +12,
    deltaLabel: "vs ayer",
    tipo: "subida",
    icono: TrendingUp,
    color: "verde",
  },
  {
    label: "Comisiones hoy",
    valor: 17061,
    display: "$17k",
    delta: +8,
    deltaLabel: "vs ayer",
    tipo: "subida",
    icono: CreditCard,
    color: "verde",
  },
  {
    label: "Trabajos activos",
    valor: 143,
    display: "143",
    delta: +6,
    deltaLabel: "desde ayer",
    tipo: "subida",
    icono: RefreshCw,
    color: "neutro",
  },
  {
    label: "Nuevos usuarios hoy",
    valor: 12,
    display: "12",
    delta: -3,
    deltaLabel: "vs ayer",
    tipo: "bajada",
    icono: Users,
    color: "neutro",
  },
  {
    label: "Solucionadores activos",
    valor: 58,
    display: "58",
    delta: +2,
    deltaLabel: "esta semana",
    tipo: "subida",
    icono: Wrench,
    color: "neutro",
  },
  {
    label: "Disputas abiertas",
    valor: 2,
    display: "2",
    delta: null,
    deltaLabel: "requieren atención",
    tipo: "alerta",
    icono: AlertTriangle,
    color: "rojo",
  },
  {
    label: "Aprobaciones pendientes",
    valor: 4,
    display: "4",
    delta: null,
    deltaLabel: "solucionadores",
    tipo: "alerta",
    icono: BadgeCheck,
    color: "amarillo",
  },
  {
    label: "Tasa de aceptación",
    valor: 78,
    display: "78%",
    delta: +3,
    deltaLabel: "vs semana anterior",
    tipo: "subida",
    icono: CheckCircle,
    color: "verde",
  },
];

const CATEGORIAS = [
  { label: "Plomería",     pct: 78, monto: "$221k" },
  { label: "Electricidad", pct: 52, monto: "$148k" },
  { label: "Pintura",      pct: 38, monto: "$108k" },
  { label: "Gas",          pct: 24, monto: "$68k"  },
  { label: "Albañilería",  pct: 18, monto: "$51k"  },
  { label: "Limpieza",     pct: 12, monto: "$34k"  },
];

const ALERTAS = [
  { id: 1, tipo: "danger", titulo: "Disputa sin resolver",       desc: "Trabajo #2891 — cliente vs. solucionador ID 38",    tiempo: "hace 4 hs",  ruta: "/admin/reclamos" },
  { id: 2, tipo: "danger", titulo: "Pago bloqueado",             desc: "Solucionador ID 482 — error MercadoPago",           tiempo: "hace 6 hs",  ruta: "/admin/pagos" },
  { id: 3, tipo: "warn",   titulo: "4 perfiles sin aprobar",     desc: "Solucionadores esperando verificación",             tiempo: "hoy",        ruta: "/admin/aprobaciones" },
  { id: 4, tipo: "warn",   titulo: "Calificación sospechosa",    desc: "Score 1.2 — solucionador ID 91, patrón atípico",    tiempo: "hace 2 hs",  ruta: "/admin/antifraude" },
  { id: 5, tipo: "info",   titulo: "12 nuevos registros",        desc: "8 usuarios · 4 solucionadores hoy",                 tiempo: "hoy",        ruta: "/admin/usuarios" },
  { id: 6, tipo: "info",   titulo: "Liquidación semanal lista",  desc: "58 solucionadores · $1.2M neto total",              tiempo: "viernes",    ruta: "/admin/pagos" },
];

const TRABAJOS_RECIENTES = [
  { id: 2891, categoria: "Plomería",  usuario: "Laura Pérez",    solucionador: "Carlos Méndez",   monto: "$28.000", estado: "disputa",   estadoLabel: "En disputa" },
  { id: 2890, categoria: "Eléctrico", usuario: "Martín García",  solucionador: "Ana Rodríguez",   monto: "$45.000", estado: "activo",    estadoLabel: "En curso" },
  { id: 2889, categoria: "Gas",       usuario: "Sofía Torres",   solucionador: "Roberto Flores",  monto: "$18.000", estado: "completado",estadoLabel: "Completado" },
  { id: 2888, categoria: "Pintura",   usuario: "Diego Molina",   solucionador: "Miguel Saracho",  monto: "$62.000", estado: "activo",    estadoLabel: "En curso" },
  { id: 2887, categoria: "Limpieza",  usuario: "Ana González",   solucionador: "Héctor Giménez",  monto: "$9.500",  estado: "completado",estadoLabel: "Completado" },
];

const PERIODO_OPCIONES = ["Hoy", "Esta semana", "Este mes"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState("Hoy");

  return (
    <div className={styles.pagina}>

      {/* Selector de período */}
      <div className={styles.periodoBar}>
        {PERIODO_OPCIONES.map(p => (
          <button key={p} type="button"
            className={`${styles.periodoBtn} ${periodo === p ? styles.periodoBtnActivo : ""}`}
            onClick={() => setPeriodo(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* KPI grid */}
      <div className={styles.kpiGrid}>
        {KPI.map(k => {
          const Icono = k.icono;
          return (
            <div key={k.label} className={`${styles.kpiCard} ${styles[`kpi_${k.color}`]}`}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <div className={`${styles.kpiIconoWrapper} ${styles[`kpiIcono_${k.color}`]}`}>
                  <Icono size={14} />
                </div>
              </div>
              <p className={styles.kpiValor}>{k.display}</p>
              <p className={`${styles.kpiDelta} ${k.tipo === "subida" ? styles.kpiDeltaUp : k.tipo === "alerta" ? styles.kpiDeltaAlert : styles.kpiDeltaDown}`}>
                {k.delta !== null ? (k.delta > 0 ? `+${k.delta}%` : `${k.delta}%`) : ""} {k.deltaLabel}
              </p>
            </div>
          );
        })}
      </div>

      {/* Fila media — barras categoría + alertas */}
      <div className={styles.midGrid}>

        {/* Volumen por categoría */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitulo}>Volumen por categoría</h2>
            <span className={styles.panelSub}>{periodo}</span>
          </div>
          <div className={styles.barras}>
            {CATEGORIAS.map(c => (
              <div key={c.label} className={styles.barraFila}>
                <span className={styles.barraLabel}>{c.label}</span>
                <div className={styles.barraTruck}>
                  <div className={styles.barraRelleno} style={{ width: `${c.pct}%` }} />
                </div>
                <span className={styles.barraMonto}>{c.monto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitulo}>Alertas recientes</h2>
            <span className={styles.alertaContador}>
              {ALERTAS.filter(a => a.tipo === "danger").length} urgentes
            </span>
          </div>
          <div className={styles.alertaLista}>
            {ALERTAS.map(a => (
              <button key={a.id} type="button"
                className={styles.alertaRow}
                onClick={() => navigate(a.ruta)}>
                <div className={`${styles.alertaDot} ${styles[`dot_${a.tipo}`]}`} />
                <div className={styles.alertaTexto}>
                  <span className={styles.alertaTitulo}>{a.titulo}</span>
                  <span className={styles.alertaDesc}>{a.desc}</span>
                </div>
                <span className={styles.alertaTiempo}>{a.tiempo}</span>
                <ArrowRight size={14} className={styles.alertaFlecha} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trabajos recientes */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitulo}>Trabajos recientes</h2>
          <button type="button" className={styles.panelVerTodo} onClick={() => navigate("/admin/solucionadores")}>
            Ver todos →
          </button>
        </div>
        <div className={styles.tablaWrapper}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Categoría</th>
                <th className={styles.th}>Usuario</th>
                <th className={styles.th}>Solucionador</th>
                <th className={styles.th}>Monto</th>
                <th className={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {TRABAJOS_RECIENTES.map(t => (
                <tr key={t.id} className={styles.tr}>
                  <td className={styles.td}><span className={styles.tdId}>#{t.id}</span></td>
                  <td className={styles.td}>{t.categoria}</td>
                  <td className={styles.td}>{t.usuario}</td>
                  <td className={styles.td}>{t.solucionador}</td>
                  <td className={styles.td}><strong>{t.monto}</strong></td>
                  <td className={styles.td}>
                    <span className={`${styles.estadoBadge} ${styles[`estado_${t.estado}`]}`}>
                      {t.estadoLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}