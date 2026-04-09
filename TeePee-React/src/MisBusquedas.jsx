import { useState } from "react";
import NavInferior from "./NavInferior";
import { useNavigate } from "react-router-dom";
import styles from "./MisBusquedas.module.css";
import { IconoVolver } from "./Iconos";
import {
  Wrench,
  Zap,
  Paintbrush2,
  Home,
  MapPin,
  CalendarDays,
  FileText,
} from "lucide-react";

function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: 2,
  });
}

const BUSQUEDAS_MOCK = [
  {
    id: 1,
    fecha: "Hoy, 14:32",
    categoria: "Plomería",
    descripcion:
      "Pérdida de agua debajo del lavatorio del baño principal. Hay humedad en la pared.",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    urgencia: "Urgente",
    estado: "con_presupuesto",
    solucionadoresContactados: [
      {
        id: 1,
        nombre: "Carlos Mendoza",
        inicial: "C",
        color: "#B84030",
        oficio: "Plomero",
        nivel: "🥇",
        rating: 4.9,
        monto: 22000,
      },
      {
        id: 2,
        nombre: "Roberto Flores",
        inicial: "R",
        color: "#534AB7",
        oficio: "Plomero",
        nivel: "🥈",
        rating: 4.6,
        monto: 32000,
      },
    ],
  },
  {
    id: 2,
    fecha: "Ayer, 10:15",
    categoria: "Electricidad",
    descripcion:
      "El tablero principal salta cuando enciendo el aire acondicionado.",
    direccion: "San Lorenzo 456 — Posadas",
    urgencia: "Normal",
    estado: "sin_respuesta",
    solucionadoresContactados: [
      {
        id: 4,
        nombre: "Javier Torres",
        inicial: "J",
        color: "#2A7D5A",
        oficio: "Electricista",
        nivel: "🥇",
        rating: 4.8,
        monto: null,
      },
    ],
  },
  {
    id: 3,
    fecha: "Hace 3 días",
    categoria: "Pintura",
    descripcion: "Pintar living y comedor, aprox. 40 m². Colores neutros.",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    urgencia: "Normal",
    estado: "trabajo_iniciado",
    solucionadoresContactados: [
      {
        id: 5,
        nombre: "Miguel Saracho",
        inicial: "M",
        color: "#8C6820",
        oficio: "Pintor",
        nivel: "🥇",
        rating: 4.7,
        monto: 45000,
      },
    ],
  },
];

const ESTADO_CONFIG = {
  con_presupuesto: {
    label: "Con presupuesto",
    color: "#B84030",
    bg: "rgba(184,64,48,0.10)",
  },
  sin_respuesta: {
    label: "Esperando respuesta",
    color: "#8C6820",
    bg: "rgba(140,104,32,0.10)",
  },
  trabajo_iniciado: {
    label: "Trabajo en curso",
    color: "#2A7D5A",
    bg: "rgba(42,125,90,0.10)",
  },
  cancelada: { label: "Cancelada", color: "#aaa", bg: "rgba(0,0,0,0.06)" },
};

function IconoCategoria({ categoria }) {
  const props = { size: 20, strokeWidth: 1.8 };
  if (categoria === "Plomería") return <Wrench {...props} />;
  if (categoria === "Electricidad") return <Zap {...props} />;
  if (categoria === "Pintura") return <Paintbrush2 {...props} />;
  return <Home {...props} />;
}

export default function MisBusquedas() {
  const navigate = useNavigate();
  const [abierta, setAbierta] = useState(1);

  return (
    <div className={styles.pantalla}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate("/home")}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mis búsquedas</span>
        <button
          className={styles.btnNueva}
          onClick={() => navigate("/busqueda")}
        >
          + Nueva búsqueda
        </button>
      </header>

      <main className={styles.contenido}>
        {BUSQUEDAS_MOCK.map((b) => {
          const est = ESTADO_CONFIG[b.estado] || ESTADO_CONFIG.sin_respuesta;
          const open = abierta === b.id;
          return (
            <div key={b.id} className={styles.busquedaCard}>
              {/* Header de la búsqueda */}
              <button
                type="button"
                className={styles.busquedaHeader}
                onClick={() => setAbierta(open ? null : b.id)}
              >
                <div className={styles.busquedaCategoriaIcono}>
                  <IconoCategoria categoria={b.categoria} />
                </div>
                <div className={styles.busquedaInfo}>
                  <div className={styles.busquedaInfoTop}>
                    <p className={styles.busquedaCategoria}>{b.categoria}</p>
                    <span
                      className={styles.busquedaEstadoBadge}
                      style={{ color: est.color, background: est.bg }}
                    >
                      {est.label}
                    </span>
                  </div>
                  <p className={styles.busquedaDesc}>{b.descripcion}</p>
                  <div className={styles.busquedaMeta}>
                    <span className={styles.busquedaMetaItem}>
                      <CalendarDays size={11} /> {b.fecha}
                    </span>
                    {b.urgencia === "Urgente" && (
                      <span className={styles.busquedaUrgente}>
                        <Zap size={11} /> Urgente
                      </span>
                    )}
                  </div>
                </div>
                <span className={styles.busquedaFlecha}>
                  {open ? "▲" : "▼"}
                </span>
              </button>

              {/* Detalle expandido */}
              {open && (
                <div className={styles.busquedaDetalle}>
                  <div className={styles.busquedaDetalleInfo}>
                    <div className={styles.busquedaDetalleItem}>
                      <FileText
                        size={14}
                        className={styles.busquedaDetalleIcono}
                      />
                      <p className={styles.busquedaDetalleTexto}>
                        {b.descripcion}
                      </p>
                    </div>
                    <div className={styles.busquedaDetalleItem}>
                      <MapPin
                        size={14}
                        className={styles.busquedaDetalleIcono}
                      />
                      <p className={styles.busquedaDetalleTexto}>
                        {b.direccion}
                      </p>
                    </div>
                  </div>

                  <p className={styles.solLabel}>
                    Solucionadores contactados (
                    {b.solucionadoresContactados.length})
                  </p>

                  <div className={styles.solLista}>
                    {b.solucionadoresContactados.map((sol) => (
                      <div key={sol.id} className={styles.solCard}>
                        <div
                          className={styles.solAvatar}
                          style={{ background: sol.color }}
                        >
                          {sol.inicial}
                        </div>
                        <div className={styles.solInfo}>
                          <p className={styles.solNombre}>
                            {sol.nombre} {sol.nivel}
                          </p>
                          <p className={styles.solOficio}>
                            {sol.oficio} · ⭐ {sol.rating}
                          </p>
                        </div>
                        {sol.monto ? (
                          <div className={styles.solMonto}>
                            <p className={styles.solMontoVal}>
                              ${fmt(sol.monto)}
                            </p>
                            <p className={styles.solMontoLabel}>presupuesto</p>
                          </div>
                        ) : (
                          <span className={styles.solSinResp}>
                            Sin respuesta
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.busquedaBotones}>
                    <button
                      type="button"
                      className={styles.btnVerPpto}
                      onClick={() =>
                        navigate(
                          `/presupuestos?trabajoId=${b.id}&desde=mis-busquedas`,
                        )
                      }
                    >
                      Ver presupuestos
                    </button>
                    <button
                      type="button"
                      className={styles.btnRepetir}
                      onClick={() => navigate("/busqueda")}
                    >
                      Repetir búsqueda
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      <NavInferior />
    </div>
  );
}
