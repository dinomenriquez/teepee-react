import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Pago.module.css";
import { IconoVolver } from "./Iconos";
import {
  Lock,
  Shield,
  Copy,
  CreditCard,
  Building2,
  Banknote,
} from "lucide-react";

const TRABAJO = {
  titulo: "Tablero eléctrico",
  solucionador: "Juan Ledesma",
  inicial: "J",
  nivel: "🥇",
  montoTrabajo: 32000,
  comisionPct: 10,
  garantia: "30 días",
};

const METODOS_PAGO = [
  {
    id: "mercadopago",
    icono: <CreditCard size={20} color="#009ee3" />,
    nombre: "MercadoPago",
    desc: "Pagá con tu cuenta de MercadoPago",
    badge: "Recomendado",
  },
  {
    id: "tarjeta",
    icono: <CreditCard size={20} />,
    nombre: "Tarjeta de crédito / débito",
    desc: "Visa, Mastercard, American Express",
    badge: null,
  },
  {
    id: "transferencia",
    icono: <Building2 size={20} />,
    nombre: "Transferencia bancaria",
    desc: "CBU / CVU · Acreditación inmediata",
    badge: null,
  },
  {
    id: "efectivo",
    icono: <Banknote size={20} />,
    nombre: "Efectivo",
    desc: "Pagás directamente al solucionador al finalizar",
    badge: null,
  },
];

export default function Pago() {
  const navigate = useNavigate();
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("mercadopago");
  const [estado, setEstado] = useState("formulario");
  // estados: formulario | procesando | exito | error

  const [datosCard, setDatosCard] = useState({
    numero: "",
    nombre: "",
    vencimiento: "",
    cvv: "",
  });

  const [toast, setToast] = useState(null);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const comision = Math.round(
    (TRABAJO.montoTrabajo * TRABAJO.comisionPct) / 100,
  );
  const total = TRABAJO.montoTrabajo + comision;
  const formatPesos = (n) => "$" + n.toLocaleString("es-AR");

  function procesarPago() {
    setEstado("procesando");
    setTimeout(() => {
      setEstado("exito");
    }, 2500);
  }

  // ── PANTALLA: PROCESANDO ──
  if (estado === "procesando") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.procesandoBloque}>
          <div className={styles.procesandoSpinner}></div>
          <h2 className={styles.procesandoTitulo}>Procesando pago</h2>
          <p className={styles.procesandoDesc}>No cierres la aplicación...</p>
          <div className={styles.procesandoMonto}>{formatPesos(total)}</div>
        </div>
      </div>
    );
  }

  // ── PANTALLA: ÉXITO ──
  if (estado === "exito") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.exitoBloque}>
          <div className={styles.exitoCirculo}>
            <span className={styles.exitoCheck}>✓</span>
          </div>

          <h2 className={styles.exitoTitulo}>¡Pago exitoso!</h2>
          <p className={styles.exitoDesc}>
            El dinero está retenido en escrow. Se liberará a Juan cuando
            confirmes el trabajo completo.
          </p>

          <div className={styles.exitoCard}>
            <div className={styles.exitoFila}>
              <span>Trabajo</span>
              <span>{TRABAJO.titulo}</span>
            </div>
            <div className={styles.exitoFila}>
              <span>Solucionador</span>
              <span>{TRABAJO.solucionador}</span>
            </div>
            <div className={styles.exitoFila}>
              <span>Total pagado</span>
              <span className={styles.exitoMonto}>{formatPesos(total)}</span>
            </div>
            <div className={styles.exitoFila}>
              <span>Estado del escrow</span>
              <span className={styles.exitoEscrow}>
                <Lock size={12} /> Retenido
              </span>
            </div>
          </div>

          <button
            type="button"
            className={styles.btnSeguimiento}
            onClick={() => navigate("/seguimiento")}
          >
            Ver seguimiento del trabajo →
          </button>

          <button
            type="button"
            className={styles.btnInicio}
            onClick={() => navigate("/home")}
          >
            Volver al inicio
          </button>
        </div>
        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    );
  }

  // ── PANTALLA: FORMULARIO ──
  return (
    <div className={styles.pantalla}>
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Confirmar pago</span>
        <div className={styles.headerSeguro}>
          <Lock size={12} /> SSL
        </div>
      </header>

      <main className={styles.contenido}>
        {/* ── RESUMEN DEL TRABAJO ── */}
        <section className={styles.resumenCard}>
          <div className={styles.resumenTop}>
            <div className={styles.resumenAvatar}>
              {TRABAJO.inicial}
              <span className={styles.resumenNivel}>{TRABAJO.nivel}</span>
            </div>
            <div className={styles.resumenInfo}>
              <span className={styles.resumenTitulo}>{TRABAJO.titulo}</span>
              <span className={styles.resumenSolucionador}>
                {TRABAJO.solucionador}
              </span>
              <span className={styles.resumenGarantia}>
                <Shield size={12} /> Garantía {TRABAJO.garantia}
              </span>
            </div>
          </div>
        </section>

        {/* ── DESGLOSE DE MONTOS ── */}
        <section className={styles.montoCard}>
          <h2 className={styles.seccionTitulo}>Detalle del pago</h2>

          <div className={styles.montoFilas}>
            <div className={styles.montoFila}>
              <span className={styles.montoLabel}>Servicio</span>
              <span className={styles.montoValor}>
                {formatPesos(TRABAJO.montoTrabajo)}
              </span>
            </div>
            <div className={styles.montoFila}>
              <span className={styles.montoLabel}>
                Comisión TeePee ({TRABAJO.comisionPct}%)
              </span>
              <span className={styles.montoValor}>{formatPesos(comision)}</span>
            </div>
            <div className={`${styles.montoFila} ${styles.montoFilaTotal}`}>
              <span className={styles.montoTotalLabel}>Total</span>
              <span className={styles.montoTotalValor}>
                {formatPesos(total)}
              </span>
            </div>
          </div>

          <div className={styles.escrowInfo}>
            <span>
              <Lock size={16} />
            </span>
            <p className={styles.escrowTexto}>
              El dinero queda retenido en escrow hasta que confirmés que el
              trabajo está completo.
            </p>
          </div>
        </section>

        {/* ── MÉTODOS DE PAGO ── */}
        <section className={styles.metodosSección}>
          <h2 className={styles.seccionTitulo}>Método de pago</h2>

          <div className={styles.metodosList}>
            {METODOS_PAGO.map((metodo) => (
              <button
                key={metodo.id}
                type="button"
                className={`${styles.metodoCard} ${
                  metodoSeleccionado === metodo.id
                    ? styles.metodoCardActivo
                    : ""
                }`}
                onClick={() => setMetodoSeleccionado(metodo.id)}
              >
                <span className={styles.metodoIcono}>{metodo.icono}</span>
                <div className={styles.metodoInfo}>
                  <div className={styles.metodoNombreRow}>
                    <span className={styles.metodoNombre}>{metodo.nombre}</span>
                    {metodo.badge && (
                      <span className={styles.metodoBadge}>{metodo.badge}</span>
                    )}
                  </div>
                  <span className={styles.metodoDesc}>{metodo.desc}</span>
                </div>
                <div
                  className={`${styles.metodoRadio} ${
                    metodoSeleccionado === metodo.id
                      ? styles.metodoRadioActivo
                      : ""
                  }`}
                ></div>
              </button>
            ))}
          </div>
        </section>

        {/* ── FORMULARIO TARJETA ── */}
        {metodoSeleccionado === "tarjeta" && (
          <section className={styles.tarjetaForm}>
            <h2 className={styles.seccionTitulo}>Datos de la tarjeta</h2>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Número de tarjeta</label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={datosCard.numero}
                onChange={(e) =>
                  setDatosCard({
                    ...datosCard,
                    numero: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Nombre en la tarjeta</label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="MARTIN GARCIA"
                value={datosCard.nombre}
                onChange={(e) =>
                  setDatosCard({
                    ...datosCard,
                    nombre: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className={styles.campoFila}>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Vencimiento</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  placeholder="MM/AA"
                  maxLength={5}
                  value={datosCard.vencimiento}
                  onChange={(e) =>
                    setDatosCard({
                      ...datosCard,
                      vencimiento: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>CVV</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  placeholder="123"
                  maxLength={4}
                  value={datosCard.cvv}
                  onChange={(e) =>
                    setDatosCard({
                      ...datosCard,
                      cvv: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.tarjetaSeguridad}>
              <Lock size={12} /> Tus datos están encriptados con SSL de 256 bits
            </div>
          </section>
        )}

        {/* Info MercadoPago */}
        {metodoSeleccionado === "mercadopago" && (
          <section className={styles.mpInfo}>
            <span className={styles.mpIcono}>
              <CreditCard size={24} />
            </span>
            <p className={styles.mpTexto}>
              Serás redirigido a MercadoPago para completar el pago de forma
              segura.
            </p>
          </section>
        )}

        {/* Info Transferencia */}
        {metodoSeleccionado === "transferencia" && (
          <section className={styles.transferenciaInfo}>
            <h2 className={styles.seccionTitulo}>Datos bancarios</h2>
            <div className={styles.transferenciaCard}>
              {[
                { label: "Destinatario", valor: "TeePee S.A." },
                { label: "CBU", valor: "0000003100012345678901" },
                { label: "Alias", valor: "TEEPEE.PAGOS" },
                { label: "Monto exacto", valor: formatPesos(total) },
                { label: "Referencia", valor: "TP-2024-0847" },
              ].map((item) => (
                <div key={item.label} className={styles.transferenciaFila}>
                  <span className={styles.transferenciaLabel}>
                    {item.label}
                  </span>
                  <span className={styles.transferenciaValor}>
                    {item.valor}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.btnCopiarCBU}
              onClick={() => mostrarToast("CBU copiado al portapapeles")}
            >
              <Copy size={14} /> Copiar CBU
            </button>
          </section>
        )}
        {metodoSeleccionado === "efectivo" && (
          <section className={styles.mpInfo}>
            <Banknote size={24} color="#5C2E2E" />
            <p className={styles.mpTexto}>
              El pago se realiza en mano al solucionador al finalizar el
              trabajo. El escrow no aplica para pagos en efectivo.
            </p>
          </section>
        )}
      </main>

      {/* ── FOOTER CON BOTÓN PAGAR ── */}
      <div className={styles.footer}>
        <div className={styles.footerResumen}>
          <span className={styles.footerLabel}>Total a pagar</span>
          <span className={styles.footerMonto}>{formatPesos(total)}</span>
        </div>
        <button
          type="button"
          className={styles.btnPagar}
          onClick={procesarPago}
        >
          <Lock size={16} /> Pagar {formatPesos(total)}
        </button>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
