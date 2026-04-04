import { useState } from "react";
import NavInferior from "./NavInferior";
import { useNavigate } from "react-router-dom";
import { IconoVolver } from "./Iconos";

function fmt(n) {
  return Number(n).toLocaleString("es-AR");
}

const BUSQUEDAS_MOCK = [
  {
    id: 1,
    fecha: "Hoy, 14:32",
    categoria: "Plomería",
    descripcion: "Pérdida de agua debajo del lavatorio del baño principal. Hay humedad en la pared.",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    urgencia: "Urgente",
    estado: "con_presupuesto",
    solucionadoresContactados: [
      { id: 1, nombre: "Carlos Mendoza", inicial: "C", color: "#B84030", oficio: "Plomero", nivel: "🥇", rating: 4.9, monto: 22000 },
      { id: 2, nombre: "Roberto Flores",  inicial: "R", color: "#534AB7", oficio: "Plomero", nivel: "🥈", rating: 4.6, monto: 32000 },
    ],
  },
  {
    id: 2,
    fecha: "Ayer, 10:15",
    categoria: "Electricidad",
    descripcion: "El tablero principal salta cuando enciendo el aire acondicionado.",
    direccion: "San Lorenzo 456 — Posadas",
    urgencia: "Normal",
    estado: "sin_respuesta",
    solucionadoresContactados: [
      { id: 4, nombre: "Javier Torres", inicial: "J", color: "#2A7D5A", oficio: "Electricista", nivel: "🥇", rating: 4.8, monto: null },
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
      { id: 5, nombre: "Miguel Saracho", inicial: "M", color: "#8C6820", oficio: "Pintor", nivel: "🥇", rating: 4.7, monto: 45000 },
    ],
  },
];

const ESTADO_CONFIG = {
  con_presupuesto:  { label: "Con presupuesto",   color: "#B84030", bg: "rgba(184,64,48,0.10)"  },
  sin_respuesta:    { label: "Esperando respuesta", color: "#8C6820", bg: "rgba(140,104,32,0.10)" },
  trabajo_iniciado: { label: "Trabajo en curso",   color: "#2A7D5A", bg: "rgba(42,125,90,0.10)"  },
  cancelada:        { label: "Cancelada",           color: "#aaa",    bg: "rgba(0,0,0,0.06)"      },
};

export default function MisBusquedas() {
  const navigate = useNavigate();
  const [abierta, setAbierta] = useState(1);

  return (
    <div style={{ minHeight: "100vh", background: "var(--tp-crema)", fontFamily: "var(--fuente)", paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate('/home')}
          style={{ border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
          <IconoVolver size={20} />
        </button>
        <div>
          <p style={{ fontSize: 16, fontWeight: 900, color: "var(--tp-marron)", margin: 0 }}>Mis búsquedas</p>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>{BUSQUEDAS_MOCK.length} búsquedas realizadas</p>
        </div>
        <button onClick={() => navigate("/busqueda")}
          style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: "var(--r-full)", background: "var(--tp-rojo)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 12, fontWeight: 700 }}>
          + Nueva búsqueda
        </button>
      </header>

      <main style={{ padding: "16px 16px 0" }}>
        {BUSQUEDAS_MOCK.map(b => {
          const est = ESTADO_CONFIG[b.estado] || ESTADO_CONFIG.sin_respuesta;
          const open = abierta === b.id;
          return (
            <div key={b.id} style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-lg)", marginBottom: 12, border: "1px solid rgba(61,31,31,0.08)", overflow: "hidden" }}>
              {/* Header de la búsqueda */}
              <button type="button" onClick={() => setAbierta(open ? null : b.id)}
                style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 14px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--tp-marron)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {b.categoria === "Plomería" ? "🔧" : b.categoria === "Electricidad" ? "⚡" : b.categoria === "Pintura" ? "🖌️" : "🏠"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>{b.categoria}</p>
                    <span style={{ fontSize: 10, fontWeight: 700, color: est.color, background: est.bg, padding: "2px 8px", borderRadius: 20, flexShrink: 0, marginLeft: 8 }}>
                      {est.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.descripcion}
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>📅 {b.fecha}</span>
                    {b.urgencia === "Urgente" && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--tp-rojo)" }}>⚡ Urgente</span>}
                  </div>
                </div>
                <span style={{ fontSize: 16, color: "var(--tp-marron-suave)", flexShrink: 0, marginTop: 2 }}>{open ? "▲" : "▼"}</span>
              </button>

              {/* Detalle expandido */}
              {open && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(61,31,31,0.07)" }}>
                  {/* Descripción + dirección */}
                  <div style={{ marginTop: 12, marginBottom: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>📝</span>
                      <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0, lineHeight: 1.5 }}>{b.descripcion}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>📍</span>
                      <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>{b.direccion}</p>
                    </div>
                  </div>

                  {/* Solucionadores contactados */}
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--tp-marron-suave)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>
                    Solucionadores contactados ({b.solucionadoresContactados.length})
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {b.solucionadoresContactados.map(sol => (
                      <div key={sol.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--r-md)", background: "var(--tp-crema)", border: "1px solid rgba(61,31,31,0.08)" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: sol.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                          {sol.inicial}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: "0 0 1px" }}>{sol.nombre} {sol.nivel}</p>
                          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>{sol.oficio} · ⭐ {sol.rating}</p>
                        </div>
                        {sol.monto ? (
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 15, fontWeight: 900, color: "var(--tp-marron)", margin: 0 }}>${fmt(sol.monto)}</p>
                            <p style={{ fontSize: 10, color: "var(--tp-marron-suave)", margin: 0 }}>presupuesto</p>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>Sin respuesta</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Acciones */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button type="button"
                      onClick={() => navigate(`/presupuestos?trabajoId=${b.id}&desde=mis-busquedas`)}
                      style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", background: "var(--tp-marron)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 13, fontWeight: 700 }}>
                      Ver presupuestos
                    </button>
                    <button type="button"
                      onClick={() => navigate("/busqueda")}
                      style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", background: "none", color: "var(--tp-marron)", border: "1px solid rgba(61,31,31,0.15)", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 13, fontWeight: 600 }}>
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