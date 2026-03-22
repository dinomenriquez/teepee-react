import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./Ingresos.module.css";
import { IconoVolver, IconoPerfil } from "./Iconos";

const NIVELES = [
  { id: "bronce", label: "Bronce", comision: 10, desde: 0, hasta: 50000 },
  { id: "plata", label: "Plata", comision: 8, desde: 50000, hasta: 150000 },
  { id: "oro", label: "Oro", comision: 6, desde: 150000, hasta: 300000 },
  { id: "elite", label: "Élite", comision: 4, desde: 300000, hasta: null },
];

const SEMANAS = [
  {
    id: 1,
    label: "Semana del 4 al 8 Mar",
    total: 87200,
    liquidado: true,
    trabajos: [
      {
        titulo: "Tablero eléctrico",
        cliente: "Martín García",
        bruto: 35200,
        comision: 2112,
        neto: 33088,
      },
      {
        titulo: "Instalación luces",
        cliente: "Ana Gómez",
        bruto: 28000,
        comision: 1680,
        neto: 26320,
      },
      {
        titulo: "Reparación enchufe",
        cliente: "Laura Pérez",
        bruto: 24000,
        comision: 1440,
        neto: 22560,
      },
    ],
  },
  {
    id: 2,
    label: "Semana del 25 Feb al 1 Mar",
    total: 64500,
    liquidado: true,
    trabajos: [
      {
        titulo: "Cambio tablero",
        cliente: "Roberto Silva",
        bruto: 40000,
        comision: 2400,
        neto: 37600,
      },
      {
        titulo: "Instalación AA",
        cliente: "Carlos Ruiz",
        bruto: 24500,
        comision: 1470,
        neto: 23030,
      },
    ],
  },
  {
    id: 3,
    label: "Semana del 18 al 22 Feb",
    total: 45000,
    liquidado: true,
    trabajos: [
      {
        titulo: "Cableado exterior",
        cliente: "Sofía Torres",
        bruto: 45000,
        comision: 2700,
        neto: 42300,
      },
    ],
  },
];

const NIVEL_ACTUAL = NIVELES[1]; // Plata
const INGRESOS_MES = 196700;
const PROXIMO_NIVEL = NIVELES[2]; // Oro
const FALTAN = PROXIMO_NIVEL.desde - INGRESOS_MES;

export default function Ingresos() {
  const navigate = useNavigate();
  const [semanaAbierta, setSemanaAbierta] = useState(1);

  const comisionMes = Math.round(INGRESOS_MES * (NIVEL_ACTUAL.comision / 100));
  const netoMes = INGRESOS_MES - comisionMes;

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mis Ingresos</span>
      </header>

      <main className={styles.contenido}>
        {/* ── HERO ── */}
        <div className={styles.hero}>
          <p className={styles.heroLabel}>Ingresos netos este mes</p>
          <p className={styles.heroMonto}>${netoMes.toLocaleString("es-AR")}</p>
          <p className={styles.heroBruto}>
            Bruto: ${INGRESOS_MES.toLocaleString("es-AR")} — Comisión{" "}
            {NIVEL_ACTUAL.comision}%: -${comisionMes.toLocaleString("es-AR")}
          </p>

          {/* Nivel actual */}
          <div className={styles.nivelRow}>
            <span className={styles.nivelBadge}>
              {NIVEL_ACTUAL.id === "bronce"
                ? "🥉"
                : NIVEL_ACTUAL.id === "plata"
                  ? "🥈"
                  : NIVEL_ACTUAL.id === "oro"
                    ? "🥇"
                    : "💎"}{" "}
              {NIVEL_ACTUAL.label}
            </span>
            <span className={styles.nivelComision}>
              Comisión {NIVEL_ACTUAL.comision}%
            </span>
          </div>

          {/* Progreso hacia próximo nivel */}
          {PROXIMO_NIVEL && (
            <div className={styles.progresoBloque}>
              <div className={styles.progresoLabels}>
                <span className={styles.progresoTexto}>
                  Faltan ${FALTAN.toLocaleString("es-AR")} para{" "}
                  {PROXIMO_NIVEL.label}
                </span>
                <span className={styles.progresoPct}>
                  {Math.round((INGRESOS_MES / PROXIMO_NIVEL.desde) * 100)}%
                </span>
              </div>
              <div className={styles.progresoBarra}>
                <div
                  className={styles.progresoRelleno}
                  style={{
                    width: `${Math.min(
                      (INGRESOS_MES / PROXIMO_NIVEL.desde) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── ESCALA DE COMISIONES ── */}
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Escala de comisiones</h2>
          <div className={styles.escalaLista}>
            {NIVELES.map((n) => (
              <div
                key={n.id}
                className={`${styles.escalaItem} ${
                  n.id === NIVEL_ACTUAL.id ? styles.escalaItemActivo : ""
                }`}
              >
                <span className={styles.escalaIcono}>
                  {n.id === "bronce"
                    ? "🥉"
                    : n.id === "plata"
                      ? "🥈"
                      : n.id === "oro"
                        ? "🥇"
                        : "💎"}
                </span>
                <span className={styles.escalaLabel}>{n.label}</span>
                <span className={styles.escalaRango}>
                  {n.hasta
                    ? `$${(n.desde / 1000).toFixed(0)}k – $${(n.hasta / 1000).toFixed(0)}k`
                    : `+$${(n.desde / 1000).toFixed(0)}k`}
                </span>
                <span
                  className={`${styles.escalaComision} ${
                    n.id === NIVEL_ACTUAL.id ? styles.escalaComisionActiva : ""
                  }`}
                >
                  {n.comision}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CUENTA CORRIENTE ── */}
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Cuenta corriente</h2>
          <p className={styles.seccionDesc}>
            Liquidaciones semanales — todos los viernes
          </p>
          {SEMANAS.map((semana) => (
            <div key={semana.id} className={styles.semanaCard}>
              <button
                type="button"
                className={styles.semanaHeader}
                onClick={() =>
                  setSemanaAbierta(
                    semanaAbierta === semana.id ? null : semana.id,
                  )
                }
              >
                <div className={styles.semanaHeaderLeft}>
                  <span className={styles.semanaLabel}>{semana.label}</span>
                  <span className={styles.semanaTotal}>
                    ${semana.total.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className={styles.semanaHeaderRight}>
                  {semana.liquidado && (
                    <span className={styles.semanaLiquidado}>Liquidado</span>
                  )}
                  <span className={styles.semanaFlecha}>
                    {semanaAbierta === semana.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {semanaAbierta === semana.id && (
                <div className={styles.semanaDetalle}>
                  {semana.trabajos.map((t, i) => (
                    <div key={i} className={styles.trabajoFila}>
                      <div className={styles.trabajoInfo}>
                        <span className={styles.trabajoTitulo}>{t.titulo}</span>
                        <span className={styles.trabajoCliente}>
                          <IconoPerfil size={12} /> {t.cliente}
                        </span>
                      </div>
                      <div className={styles.trabajoMontos}>
                        <span className={styles.trabajoBruto}>
                          ${t.bruto.toLocaleString("es-AR")}
                        </span>
                        <span className={styles.trabajoComision}>
                          -{t.comision.toLocaleString("es-AR")}
                        </span>
                        <span className={styles.trabajoNeto}>
                          ${t.neto.toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className={styles.semanaTotal2}>
                    <span>Total neto acreditado</span>
                    <span className={styles.semanaTotalVal}>
                      $
                      {semana.trabajos
                        .reduce((a, t) => a + t.neto, 0)
                        .toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
      <NavInferiorS />
    </div>
  );
}