import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./Ingresos.module.css";
import { IconoVolver, IconoPerfil } from "./Iconos";

function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: 2 });
}

const SEMANAS = [
  {
    id: 1,
    label: "Semana del 4 al 10 Mar",
    total: 87200,
    liquidado: true,
    trabajos: [
      { titulo: "Tablero eléctrico",   cliente: "Martín García", bruto: 35200, comision: 2112, neto: 33088 },
      { titulo: "Instalación luces",   cliente: "Ana Gómez",     bruto: 28000, comision: 1680, neto: 26320 },
      { titulo: "Reparación enchufe",  cliente: "Laura Pérez",   bruto: 24000, comision: 1440, neto: 22560 },
    ],
  },
  {
    id: 2,
    label: "Semana del 25 Feb al 3 Mar",
    total: 64500,
    liquidado: true,
    trabajos: [
      { titulo: "Cambio tablero",  cliente: "Roberto Silva", bruto: 40000, comision: 2400, neto: 37600 },
      { titulo: "Instalación AA", cliente: "Carlos Ruiz",   bruto: 24500, comision: 1470, neto: 23030 },
    ],
  },
  {
    id: 3,
    label: "Semana del 18 al 24 Feb",
    total: 45000,
    liquidado: true,
    trabajos: [
      { titulo: "Cableado exterior", cliente: "Sofía Torres", bruto: 45000, comision: 2700, neto: 42300 },
    ],
  },
];

const INGRESOS_MES = 196700;

export default function Ingresos() {
  const navigate = useNavigate();
  const [semanaAbierta, setSemanaAbierta] = useState(1);

  const COM = 0.06;
  const comisionMes = Math.round(INGRESOS_MES * COM);
  const netoMes = INGRESOS_MES - comisionMes;

  return (
    <div className={styles.pantalla}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mis Ingresos</span>
      </header>

      <main className={styles.contenido}>
        {/* Hero */}
        <div className={styles.hero}>
          <p className={styles.heroLabel}>Ingresos netos este mes</p>
          <p className={styles.heroMonto}>${fmt(netoMes)}</p>
          <p className={styles.heroBruto}>
            Bruto: ${fmt(INGRESOS_MES)} · Comisión 6%: -${fmt(comisionMes)}
          </p>
        </div>

        {/* Cuenta corriente */}
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Cuenta corriente</h2>
          <p className={styles.seccionDesc}>Liquidaciones semanales — todos los viernes</p>

          {SEMANAS.map((semana) => (
            <div key={semana.id} className={styles.semanaCard}>
              <button type="button" className={styles.semanaHeader}
                onClick={() => setSemanaAbierta(semanaAbierta === semana.id ? null : semana.id)}>
                <div className={styles.semanaHeaderLeft}>
                  <span className={styles.semanaLabel}>{semana.label}</span>
                  <span className={styles.semanaTotal}>${fmt(semana.total)}</span>
                </div>
                <div className={styles.semanaHeaderRight}>
                  {semana.liquidado && <span className={styles.semanaLiquidado}>Liquidado</span>}
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
                        <span className={styles.trabajoBruto}>${fmt(t.bruto)}</span>
                        <span className={styles.trabajoComision}>Comisión 6%: -{t.comision.toLocaleString("es-AR")}</span>
                        <span className={styles.trabajoNeto}>${fmt(t.neto)}</span>
                      </div>
                    </div>
                  ))}
                  <div className={styles.semanaTotal2}>
                    <span>Total neto acreditado</span>
                    <span className={styles.semanaTotalVal}>
                      ${semana.trabajos.reduce((a, t) => a + t.neto, 0).toLocaleString("es-AR")}
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