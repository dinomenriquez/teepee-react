import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import styles from "./Pago.module.css";
import { IconoVolver } from "./Iconos";
import { CreditCard, Building2, Wallet, Banknote, CheckCircle } from "lucide-react";

function fmt(n) { return Number(n).toLocaleString("es-AR"); }

const MEDIOS = [
  { id: "tarjeta",       Icono: CreditCard, label: "Tarjeta de crédito / débito" },
  { id: "transferencia", Icono: Building2,  label: "Transferencia bancaria"       },
  { id: "mp",            Icono: Wallet,     label: "MercadoPago"                  },
  { id: "efectivo",      Icono: Banknote,   label: "Efectivo"                     },
];

export default function Pago() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function dec(key, fallback = "") {
    try { const v = searchParams.get(key); return v ? decodeURIComponent(v) : fallback; }
    catch { return fallback; }
  }

  const monto      = Number(searchParams.get("monto") || 0);
  const concepto   = dec("concepto",  "Pago de servicio");
  const solNombre  = dec("solNombre", "Carlos Mendoza");
  const solOficio  = dec("solOficio", "Plomero");
  const solInicial = searchParams.get("solInicial") || "C";
  const solColor   = dec("solColor",  "#B84030");
  const trabajoId  = searchParams.get("trabajoId")  || "1";
  const desde      = searchParams.get("desde")      || "seguimiento";

  const [medioSel, setMedioSel]   = useState(null);
  const [pagado, setPagado]       = useState(false);
  const [pendiente, setPendiente] = useState(false);

  function confirmarPago() { if (!medioSel) return; setPagado(true); }
  function omitirPago()    { setPendiente(true); }
  function volver()        { navigate(`/${desde}?trabajoId=${trabajoId}`); }

  // ── PANTALLA PAGADO ──
  if (pagado) {
    return (
      <div className={styles.pantallaExito}>
        <span className={styles.exitoIcono}>✅</span>
        <p className={styles.exitoTitulo}>¡Pago confirmado!</p>
        <p className={styles.exitoConcepto}>{concepto}</p>
        <p className={styles.exitoMonto}>${fmt(monto)}</p>
        <button type="button" className={styles.exitoBtn} onClick={volver}>
          Volver al seguimiento →
        </button>
      </div>
    );
  }

  // ── PANTALLA PENDIENTE ──
  if (pendiente) {
    return (
      <div className={styles.pantallaPendiente}>
        <span className={styles.pendienteIcono}>⏳</span>
        <p className={styles.pendienteTitulo}>Pago pendiente</p>
        <p className={styles.pendienteConcepto}>{concepto}</p>
        <p className={styles.pendienteMonto}>${fmt(monto)}</p>
        <p className={styles.pendienteDesc}>
          Podés realizar el pago en cualquier momento desde la pantalla de seguimiento.
        </p>
        <button type="button" className={styles.pendienteBtn} onClick={volver}>
          Volver al seguimiento
        </button>
      </div>
    );
  }

  // ── FORMULARIO PAGO ──
  return (
    <div className={styles.pantalla}>
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={volver}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Confirmar pago</span>
      </header>

      <div className={styles.contenido}>
        {/* Solucionador */}
        <div className={styles.solCard}>
          <div className={styles.solAvatar} style={{ background: solColor }}>
            {solInicial}
          </div>
          <div>
            <p className={styles.solNombre}>{solNombre}</p>
            <p className={styles.solOficio}>{solOficio}</p>
          </div>
        </div>

        {/* Concepto y monto */}
        <div className={styles.montoCard}>
          <p className={styles.montoConcepto}>{concepto}</p>
          <p className={styles.montoVal}>${fmt(monto)}</p>
          <p className={styles.montoSub}>Monto total a pagar</p>
        </div>

        {/* Medios de pago */}
        <div>
          <p className={styles.mediosLabel}>Elegí cómo pagar</p>
          <div className={styles.mediosLista}>
            {MEDIOS.map(m => {
              const activo = medioSel === m.id;
              return (
                <button key={m.id} type="button"
                  className={`${styles.medioBtn} ${activo ? styles.medioBtnActivo : ""}`}
                  onClick={() => setMedioSel(m.id)}>
                  <m.Icono size={20} className={styles.medioIcono} />
                  <span className={styles.medioLabel}>{m.label}</span>
                  {activo && <CheckCircle size={18} className={styles.medioCheck} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirmar */}
        <button type="button"
          className={`${styles.btnConfirmar} ${!medioSel ? styles.btnConfirmarDesactivado : ""}`}
          onClick={confirmarPago}
          disabled={!medioSel}>
          Confirmar pago ${fmt(monto)}
        </button>

        {/* Omitir */}
        <button type="button" className={styles.btnOmitir} onClick={omitirPago}>
          Pagar más tarde — quedará pendiente
        </button>
      </div>
    </div>
  );
}