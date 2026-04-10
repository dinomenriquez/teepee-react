import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";
import {
  Plus, Send, MessageCircle, CheckCircle,
  AlertCircle, Clock, Edit3, ChevronRight, X,
} from "lucide-react";
import styles from "./PresupuestosS.module.css";

function fmtCom(n) {
  const num = Number(n);
  if (isNaN(num)) return "0,00";
  return num.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmt(n) {
  const num = Number(n);
  if (isNaN(num)) return "0";
  const dec = num % 1 === 0 ? 0 : 2;
  return num.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: 2 });
}

const SOLICITUDES_HOME = [
  { id: 1, cliente: "Laura Pérez",     inicial: "L", color: "#B84030", servicio: "Pérdida de agua en baño principal",  descripcionDetallada: "Hay una pérdida importante debajo de la pileta del baño principal. El piso ya está húmedo y hay manchas en el cielorraso del piso de abajo. Urgente antes de que empeore.", direccion: "Av. Mitre 1240, Piso 3, Dpto B — Posadas", distancia: "2.3 km", presupuestoEstimado: "$15.000 - $25.000", urgente: false, fotos: 2, disponibilidad: [{ dia: "Lun", turnos: ["7-12","15-19"] },{ dia: "Mié", turnos: ["7-12"] },{ dia: "Sáb", turnos: ["7-12","12-15"] }], horaPuntual: null },
  { id: 2, cliente: "Roberto Silva",   inicial: "R", color: "#2A7D5A", servicio: "Instalación de calefón nuevo",        descripcionDetallada: "Tengo un calefón nuevo marca Orbis 13 litros que compré pero no tengo quién lo instale. El viejo se rompió hace una semana. También necesito que revisen la conexión de gas.", direccion: "San Lorenzo 456, Posadas", distancia: "4.1 km", presupuestoEstimado: "$30.000 - $45.000", urgente: true, fotos: 1, disponibilidad: [{ dia: "Mar", turnos: ["15-19","19-21"] },{ dia: "Jue", turnos: ["15-19"] }], horaPuntual: "08:30" },
  { id: 3, cliente: "Diego Fernández", inicial: "D", color: "#8C6820", servicio: "Cambio de canilla y sifón cocina",    descripcionDetallada: "La canilla de la cocina gotea constantemente y el sifón está roto. Quisiera reemplazarla por una monocomando.", direccion: "Junín 789, Posadas", distancia: "1.8 km", presupuestoEstimado: "$8.000 - $15.000", urgente: false, fotos: 0, disponibilidad: [{ dia: "Vie", turnos: ["7-12"] },{ dia: "Sáb", turnos: ["7-12","12-15","15-19"] }], horaPuntual: null },
];

const PRESUPUESTOS_MOCK = [
  { id: 1, cliente: "Martín García",   inicial: "M", color: "#B84030", servicio: "Pérdida de agua en baño principal", estado: "por_enviar", fecha: "Hoy",        monto: null,  solicitud: { descripcionDetallada: "Hay una pérdida importante debajo de la pileta.", urgente: false, direccion: "Av. Mitre 1240, Posadas", distancia: "1.2 km", presupuestoEstimado: "$15.000 - $25.000", disponibilidad: [{ dia: "Lun", turnos: ["7-12","15-19"] }], horaPuntual: null, fotos: 2 } },
  { id: 2, cliente: "Laura Sánchez",   inicial: "L", color: "#2A7D5A", servicio: "Instalación calefón nuevo",          estado: "esperando",  fecha: "Hace 2 hs",  monto: 32000, etapas: "50/50",    solicitud: { descripcionDetallada: "Calefón Orbis 13l para instalar.", urgente: true, direccion: "San Lorenzo 456, Posadas", distancia: "3.4 km", presupuestoEstimado: "$30.000 - $45.000", disponibilidad: [{ dia: "Mar", turnos: ["15-19"] }], horaPuntual: "08:30", fotos: 1 } },
  { id: 3, cliente: "Diego Fernández", inicial: "D", color: "#8C6820", servicio: "Cambio de canilla cocina",           estado: "aceptado",   fecha: "Ayer",       monto: 8500,  etapas: "total",    solicitud: { descripcionDetallada: "Canilla que gotea, reemplazar por monocomando.", urgente: false, direccion: "Junín 789, Posadas", distancia: "2.1 km", presupuestoEstimado: "$8.000 - $12.000", disponibilidad: [{ dia: "Vie", turnos: ["7-12"] }], horaPuntual: null, fotos: 0 } },
  { id: 4, cliente: "Roberto Silva",   inicial: "R", color: "#534AB7", servicio: "Reparación cañería externa",         estado: "borrador",   fecha: "Hace 3 días",monto: 45000, etapas: "30/40/30", solicitud: { descripcionDetallada: "Cañería rota exterior, charco permanente.", urgente: false, direccion: "Salta 1122, Posadas", distancia: "4.8 km", presupuestoEstimado: "$40.000 - $60.000", disponibilidad: [{ dia: "Lun", turnos: ["7-12"] }], horaPuntual: "09:00", fotos: 3 } },
];

const ESTADO = {
  por_enviar: { label: "Por enviar",  color: "#8C6820", bg: "#F5EAD0",             icono: <AlertCircle  size={11} /> },
  esperando:  { label: "Esperando",   color: "#2A7D5A", bg: "#D4EFE3",             icono: <Clock        size={11} /> },
  aceptado:   { label: "Aceptado ✓",  color: "#2A7D5A", bg: "#D4EFE3",             icono: <CheckCircle  size={11} /> },
  borrador:   { label: "Borrador",    color: "#8C5A5A", bg: "rgba(61,31,31,0.08)", icono: <Edit3        size={11} /> },
};

const ETAPAS_OPCIONES = [
  { id: "total",    label: "100% al cierre",             sub: "Pago total al finalizar el trabajo" },
  { id: "anticipo", label: "Anticipo + saldo al cierre", sub: "Proponé un % de anticipo" },
  { id: "etapas",   label: "Anticipo + avance + cierre", sub: "Pago en 3 etapas según avance" },
  { id: "convenir", label: "A convenir",                 sub: "Lo definís directamente con el cliente" },
];

// ── FORMULARIO ────────────────────────────────────────────────
function Formulario({ solicitud, onVolver, onEnviar, navigate }) {
  const [paso, setPaso]                   = useState(1);
  const [tipo, setTipo]                   = useState("cerrado");
  const [monto, setMonto]                 = useState("");
  const [montoMin, setMontoMin]           = useState("");
  const [montoMax, setMontoMax]           = useState("");
  const [descripcionTrabajo, setDescripcionTrabajo] = useState("");
  const [etapas, setEtapas]               = useState("total");
  const [garantia, setGarantia]           = useState("30");
  const [materiales, setMateriales]       = useState(true);
  const [validez, setValidez]             = useState("7");
  const [costoVisita, setCostoVisita]     = useState("");
  const [enviandoChat, setEnviandoChat]   = useState(false);
  const [mostrarVisita, setMostrarVisita] = useState(false);
  const [anticipo, setAnticipo]           = useState("30");
  const [items, setItems]                 = useState([]);
  const [mostrarItems, setMostrarItems]   = useState(false);
  const [modalVisita, setModalVisita]     = useState(false);

  const sol = solicitud.solicitud;
  const COM = 0.06;
  const montoNum = tipo === "cerrado" ? Number(monto) :
    (montoMin && montoMax ? (Number(montoMin) + Number(montoMax)) / 2 : 0);
  const montoItemizado = items.reduce((s, i) => s + (Number(i.precio) * Number(i.cantidad || 1)), 0);
  const montoBase = mostrarItems && montoItemizado > 0 ? montoItemizado : montoNum;
  const netoSol   = montoBase * (1 - COM);
  const comisionApp = montoBase * COM;
  const montoFinal = tipo === "cerrado"
    ? (monto ? `$${fmt(monto)}` : "")
    : (montoMin && montoMax ? `$${fmt(montoMin)} – $${fmt(montoMax)}` : "");
  const paso1Completo = tipo === "cerrado" ? (mostrarItems ? montoItemizado > 0 : !!monto) : true;

  function enviarAlChat() {
    setEnviandoChat(true);
    const montoBase2 = mostrarItems && montoItemizado > 0 ? montoItemizado : montoNum;
    const montoDisplay = tipo === "cerrado"
      ? (mostrarItems && montoItemizado > 0 ? `$${fmt(montoItemizado)}` : monto ? `$${fmt(monto)}` : "A confirmar")
      : (montoMin || montoMax ? `$${fmt(montoMin)} – $${fmt(montoMax)}` : "A confirmar tras la visita");
    const etapasEncode = encodeURIComponent(
      etapas === "total"    ? "100% al cierre del trabajo" :
      etapas === "anticipo" ? `Anticipo ${anticipo}% + saldo al cierre` :
      etapas === "etapas"   ? `Anticipo ${anticipo}% + avance + cierre` :
      "A convenir con el cliente"
    );
    setTimeout(() => {
      navigate(`/chat-s?usuarioId=1&nombre=${encodeURIComponent(solicitud.cliente)}&inicial=${solicitud.inicial}&mensaje=presupuesto&monto=${encodeURIComponent(montoDisplay)}&etapas=${etapasEncode}&garantia=${encodeURIComponent(garantia === "0" ? "Sin garantía" : `Garantía ${garantia} días`)}&materiales=${encodeURIComponent(materiales ? "Materiales incluidos" : "Materiales no incluidos")}&tipo=${encodeURIComponent(tipo === "cerrado" ? (mostrarItems ? "Precio itemizado" : "Precio fijo") : "Con visita previa")}&desc=${encodeURIComponent(descripcionTrabajo)}&neto=${encodeURIComponent(`$${fmtCom(montoBase2 * 0.94)}`)}&visita=${encodeURIComponent(costoVisita ? `$${fmt(costoVisita)}` : "")}`);
    }, 400);
  }

  return (
    <div className={styles.formWrapper}>
      {/* Header formulario — wrapper fijo */}
      <div className={styles.headerWrapper}>
        <div className={styles.formHeader}>
          <button className={styles.formBtnVolver} onClick={paso === 2 ? () => setPaso(1) : onVolver}>
            <IconoVolver size={20} />
          </button>
          <div className={styles.formHeaderInfo}>
            <p className={styles.formHeaderTitulo}>{paso === 1 ? "Armar presupuesto" : "Condiciones"}</p>
            <p className={styles.formHeaderSub}>Paso {paso} de 2 · {solicitud.cliente}</p>
          </div>
          <button type="button" className={styles.formBtnConsultar}
            onClick={() => navigate(`/chat-s?usuarioId=1&nombre=${encodeURIComponent(solicitud.cliente)}&inicial=${solicitud.inicial}&desde=presupuestos-s&solicitudId=${solicitud.id || 1}&volverPaso=1`)}>
            <MessageCircle size={14} /> Consultar sobre el problema
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className={styles.progresoPasos}>
        {[1, 2].map(n => (
          <div key={n} className={`${styles.progresoPaso} ${paso >= n ? styles.progresoPasoActivo : ""}`} />
        ))}
      </div>

      {/* Detalle de la solicitud */}
      {sol && (
        <div className={styles.solicitudCard}>
          <div className={styles.solicitudCardHeader}>
            <div className={styles.solicitudCardAvatar} style={{ background: solicitud.color }}>
              {solicitud.inicial}
            </div>
            <div>
              <p className={styles.solicitudCardNombre}>{solicitud.cliente}</p>
              <p className={styles.solicitudCardServicio}>{solicitud.servicio}</p>
            </div>
            {sol.urgente && <span className={styles.urgenteBadge}>🚨 URGENTE</span>}
          </div>

          <p className={styles.solicitudCardDesc}>"{sol.descripcionDetallada}"</p>

          <div className={styles.solicitudCardData}>
            <div className={styles.solicitudCardFila}>
              <span className={styles.solicitudCardIcono}>📍</span>
              <span className={styles.solicitudCardTexto}>{sol.direccion} · {sol.distancia}</span>
            </div>
            {sol.fotos > 0 && (
              <div>
                <div className={styles.solicitudCardFila}>
                  <span className={styles.solicitudCardIcono}>📷</span>
                  <span className={styles.solicitudCardTexto}>{sol.fotos} foto{sol.fotos > 1 ? "s" : ""} adjunta{sol.fotos > 1 ? "s" : ""}</span>
                </div>
                <div className={styles.fotosRow}>
                  {Array.from({ length: sol.fotos }).map((_, i) => (
                    <div key={i} className={styles.fotoThumb}>📷</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.disponibilidadBloque}>
            <p className={styles.disponibilidadLabel}>Disponibilidad del cliente</p>
            <div className={styles.disponibilidadFila}>
              {sol.disponibilidad?.map((fila, i) => (
                <div key={i} className={styles.disponibilidadRow}>
                  <span className={styles.disponibilidadDia}>{fila.dia}</span>
                  <div className={styles.disponibilidadTurnos}>
                    {fila.turnos.map(t => <span key={t} className={styles.disponibilidadTurno}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
            {sol.horaPuntual && <p className={styles.horaPuntual}>⏰ Hora puntual preferida: {sol.horaPuntual}</p>}
          </div>
        </div>
      )}

      {/* Aclaración */}
      <div className={styles.aclaracion}>
        <p className={styles.aclaracionTitulo}>Para enviar el presupuesto definí:</p>
        <div className={styles.aclaracionLista}>
          {["💰 Precio del trabajo","💳 Forma de pago","🛡️ Garantía","🔧 Materiales incluidos o no","📅 Validez del presupuesto"].map(item => (
            <p key={item} className={styles.aclaracionItem}>{item}</p>
          ))}
        </div>
      </div>

      {/* PASO 1 */}
      {paso === 1 && (
        <div className={styles.formCampos}>
          {/* Tipo de precio */}
          <div className={styles.fCard}>
            <p className={styles.fLabel}>¿Cómo es el precio?</p>
            <div className={styles.tipoPrecioGrid}>
              {[
                { id: "cerrado",  emoji: "🔒", titulo: "Precio fijo",              sub: "Monto exacto propuesto" },
                { id: "estimado", emoji: "🔍", titulo: "Precio con visita previa", sub: "Se confirma luego de ver el trabajo" },
              ].map(op => (
                <button key={op.id} type="button"
                  className={`${styles.tipoPrecioBtn} ${tipo === op.id ? styles.tipoPrecioBtnActivo : ""}`}
                  onClick={() => { setTipo(op.id); if (op.id === "estimado") setMostrarVisita(true); }}>
                  <span className={styles.tipoPrecioEmoji}>{op.emoji}</span>
                  <p className={styles.tipoPrecioTitulo}>{op.titulo}</p>
                  <p className={styles.tipoPrecioSub}>{op.sub}</p>
                </button>
              ))}
            </div>

            {tipo === "estimado" && (
              <div className={styles.visitaBloque}>
                <div className={styles.visitaBloqueHeader}>
                  <span className={styles.visitaLabel}>Costo de visita (opcional)</span>
                  <div className={styles.visitaMontoRow}>
                    <span className={styles.visitaPeso}>$</span>
                    <input type="number" placeholder="0 = gratis" value={costoVisita}
                      onChange={e => setCostoVisita(e.target.value)}
                      className={styles.visitaInput} />
                  </div>
                </div>
                <p className={styles.visitaNota}>El costo de visita está incluido en el monto total acordado. Si el cliente no acepta el presupuesto luego de la visita, se cobra aparte.</p>
              </div>
            )}
          </div>

          {/* Monto */}
          <div className={styles.fCard}>
            <p className={styles.fLabel}>{tipo === "cerrado" ? "Monto total" : "Rango estimado (opcional)"}</p>

            {tipo === "cerrado" ? (
              <>
                <div className={styles.itemizadoToggle}>
                  {[false, true].map(v => (
                    <button key={String(v)} type="button"
                      className={`${styles.itemizadoBtn} ${mostrarItems === v ? styles.itemizadoBtnActivo : ""}`}
                      onClick={() => setMostrarItems(v)}>
                      {v ? "Valor itemizado" : "Valor total"}
                    </button>
                  ))}
                </div>

                {!mostrarItems ? (
                  <div className={styles.montoRow}>
                    <span className={styles.montoPeso}>$</span>
                    <input type="number" placeholder="0" value={monto} onChange={e => setMonto(e.target.value)}
                      className={styles.montoInput} />
                  </div>
                ) : (
                  <div>
                    <div className={styles.itemsHeader}>
                      <span className={styles.itemsHeaderDetalle}>Detalle ítem</span>
                      <span className={styles.itemsHeaderCant}>Cant.</span>
                      <span className={styles.itemsHeaderPrecio}>Precio unit.</span>
                      <span className={styles.itemsHeaderSpacer} />
                    </div>
                    {items.map((item, i) => (
                      <div key={i} className={styles.itemRow}>
                        <input type="text" placeholder="Descripción" value={item.desc}
                          onChange={e => setItems(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))}
                          className={styles.itemInputDesc} />
                        <input type="text" inputMode="decimal" placeholder="1" value={item.cantidad}
                          onChange={e => setItems(prev => prev.map((x, j) => j === i ? { ...x, cantidad: e.target.value.replace(/[^0-9.]/g, "") } : x))}
                          className={styles.itemInputCant} />
                        <div className={styles.itemPrecioWrapper}>
                          <span className={styles.itemPrecioPeso}>$</span>
                          <input type="text" inputMode="decimal" placeholder="0" value={item.precio}
                            onChange={e => setItems(prev => prev.map((x, j) => j === i ? { ...x, precio: e.target.value.replace(/[^0-9.]/g, "") } : x))}
                            className={styles.itemInputPrecio} />
                        </div>
                        <button type="button" className={styles.itemEliminar}
                          onClick={() => setItems(prev => prev.filter((_, j) => j !== i))}>✕</button>
                      </div>
                    ))}
                    <button type="button" className={styles.btnAgregarItem}
                      onClick={() => setItems(prev => [...prev, { desc: "", cantidad: "1", precio: "" }])}>
                      + Agregar ítem
                    </button>
                    {montoItemizado > 0 && (
                      <div className={styles.totalItemizado}>
                        <span className={styles.totalItemizadoLabel}>Total itemizado</span>
                        <span className={styles.totalItemizadoVal}>${fmt(montoItemizado)}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.rangoGrid}>
                <div className={styles.rangoItem}>
                  <span className={styles.rangoLabel}>$ mín</span>
                  <input type="number" placeholder="optativo" value={montoMin} onChange={e => setMontoMin(e.target.value)} className={styles.rangoInput} />
                </div>
                <span className={styles.rangoDash}>—</span>
                <div className={styles.rangoItem}>
                  <span className={styles.rangoLabel}>$ máx</span>
                  <input type="number" placeholder="optativo" value={montoMax} onChange={e => setMontoMax(e.target.value)} className={styles.rangoInput} />
                </div>
              </div>
            )}

            {tipo === "cerrado" && montoBase > 0 && (
              <>
                <p className={styles.montoNota}>ℹ️ El cliente solo verá el monto total. El desglose neto/comisión es solo para vos.</p>
                <div className={styles.desglose}>
                  <div className={styles.desgloseFilaMin}>
                    <span className={styles.desgloseLabel}>Tu cobro neto (94%)</span>
                    <span className={styles.desgloseVal}>${fmtCom(netoSol)}</span>
                  </div>
                  <div className={styles.desgloseFilaMin}>
                    <span className={styles.desgloseLabel}>Comisión TeePee (6%)</span>
                    <span className={styles.desgloseLabel}>${fmtCom(comisionApp)}</span>
                  </div>
                  <div className={styles.desgloseTotal}>
                    <span className={styles.desgloseTotalLabel}>Monto total al cliente</span>
                    <span className={styles.desgloseTotalVal}>${fmt(montoBase)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Descripción */}
          <div className={styles.fCard}>
            <p className={styles.fLabel}>¿Qué incluye el trabajo?</p>
            <textarea className={styles.formTextarea}
              placeholder="Describí qué vas a hacer, qué incluye, y qué no incluye..."
              value={descripcionTrabajo} onChange={e => setDescripcionTrabajo(e.target.value)} rows={4} />
          </div>

          {/* Resumen monto */}
          {paso1Completo && (
            <div className={styles.resumenMonto}>
              <div>
                <p className={styles.resumenMontoLabel}>
                  {tipo === "cerrado" && !mostrarItems ? "Monto total" :
                   tipo === "cerrado" && mostrarItems ? "Total itemizado" :
                   "Precio con visita previa"}
                </p>
                <p className={styles.resumenMontoVal}>
                  {tipo === "cerrado" && !mostrarItems && monto ? `$${fmt(monto)}` :
                   tipo === "cerrado" && mostrarItems && montoItemizado > 0 ? `$${fmt(montoItemizado)}` :
                   tipo === "estimado" && (montoMin || montoMax) ? `$${fmt(montoMin)} – $${fmt(montoMax)}` :
                   tipo === "estimado" ? "A confirmar tras la visita" : "—"}
                </p>
              </div>
              <span className={styles.resumenNeto}>
                {tipo === "cerrado" ? `Neto: $${fmtCom(netoSol)}` : costoVisita ? `Visita: $${fmt(costoVisita)}` : ""}
              </span>
            </div>
          )}

          <button type="button" disabled={!paso1Completo} onClick={() => setPaso(2)}
            className={`${styles.btnContinuar} ${!paso1Completo ? styles.btnContinuarDesactivado : ""}`}>
            Continuar con este monto →
          </button>
        </div>
      )}

      {/* PASO 2 */}
      {paso === 2 && (
        <div className={styles.formCampos}>
          {/* Resumen paso 1 */}
          <div className={`${styles.fCard} ${styles.fCardRow}`}>
            <div>
              <p className={styles.fLabel}>Monto propuesto</p>
              <p className={styles.resumenP1Monto}>{montoFinal || <span className={styles.resumenP1Vacio}>Sin monto definido</span>}</p>
            </div>
            <button className={styles.btnCambiarMonto} onClick={() => setPaso(1)}>Cambiar</button>
          </div>

          {/* Forma de cobro */}
          <div className={styles.fCard}>
            <p className={styles.fLabel}>Forma de pago</p>
            <div className={styles.etapasList}>
              {ETAPAS_OPCIONES.map(op => (
                <button key={op.id} type="button"
                  className={`${styles.etapaBtn} ${etapas === op.id ? styles.etapaBtnActivo : ""}`}
                  onClick={() => setEtapas(op.id)}>
                  <div className={`${styles.etapaRadio} ${etapas === op.id ? styles.etapaRadioActivo : ""}`}>
                    {etapas === op.id && <div className={styles.etapaRadioDot} />}
                  </div>
                  <div>
                    <p className={`${styles.etapaBtnLabel} ${etapas === op.id ? styles.etapaBtnLabelActivo : ""}`}>{op.label}</p>
                    <p className={`${styles.etapaBtnSub} ${etapas === op.id ? styles.etapaBtnSubActivo : ""}`}>{op.sub}</p>
                  </div>
                </button>
              ))}
            </div>

            {(etapas === "anticipo" || etapas === "etapas") && (
              <div className={styles.anticipoBloque}>
                <p className={styles.anticipoLabel}>% de anticipo propuesto</p>
                <div className={styles.anticipoSliderRow}>
                  <input type="range" min={10} max={50} step={5} value={anticipo}
                    onChange={e => setAnticipo(e.target.value)}
                    className={styles.anticipoSlider} />
                  <span className={styles.anticipoPct}>{anticipo}%</span>
                </div>
                {montoBase > 0 && (
                  <div className={styles.anticipoMonto}>
                    <span className={styles.anticipoMontoLabel}>Anticipo ({anticipo}%)</span>
                    <span className={styles.anticipoMontoVal}>${fmtCom(montoBase * (anticipo / 100))}</span>
                  </div>
                )}
                <p className={styles.anticipoNota}>El cliente deberá aceptar o proponer un % diferente</p>
              </div>
            )}
          </div>

          {/* Garantía + Materiales */}
          <div className={styles.garantiaMaterialesGrid}>
            <div className={styles.fCard}>
              <p className={styles.fLabel}>Garantía</p>
              <select value={garantia} onChange={e => setGarantia(e.target.value)} className={styles.fSelect}>
                <option value="0">Sin garantía</option>
                <option value="7">7 días</option>
                <option value="15">15 días</option>
                <option value="30">30 días</option>
                <option value="60">60 días</option>
              </select>
            </div>
            <div className={styles.fCard}>
              <p className={styles.fLabel}>Materiales</p>
              <div className={styles.materialesBtns}>
                {[true, false].map(v => (
                  <button key={String(v)} type="button"
                    className={`${styles.materialesBtn} ${materiales === v ? styles.materialesBtnActivo : ""}`}
                    onClick={() => setMateriales(v)}>
                    {v ? "Incluidos" : "Sin mat."}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Validez */}
          <div className={`${styles.fCard} ${styles.fCardRow}`}>
            <p className={`${styles.fLabel} ${styles.fLabelNoMargin}`}>Validez del presupuesto</p>
            <select value={validez} onChange={e => setValidez(e.target.value)} className={styles.fSelect}>
              <option value="3">3 días</option>
              <option value="5">5 días</option>
              <option value="7">7 días</option>
              <option value="15">15 días</option>
            </select>
          </div>

          {/* Botones envío */}
          <button type="button" className={styles.btnEnviarChat} onClick={enviarAlChat}
            style={{ opacity: enviandoChat ? 0.7 : 1 }}>
            <MessageCircle size={16} /> Enviar al chat del cliente
          </button>
          <button type="button" className={styles.btnEnviarSinChat} onClick={onEnviar}>
            <Send size={14} /> Enviar sin chat
          </button>
          <button type="button" className={styles.btnBorrador} onClick={onVolver}>
            Guardar borrador
          </button>
        </div>
      )}

      {/* Modal visita previa */}
      {modalVisita && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitulo}>🔍 Visita previa</p>
              <button onClick={() => setModalVisita(false)} className={styles.modalCerrar}><X size={20} /></button>
            </div>
            <p className={styles.modalDesc}>Podés cobrar un costo de visita para evaluar el trabajo. Si el cliente acepta el presupuesto final, ese monto se descuenta del total.</p>
            <div className={styles.fCard}>
              <p className={styles.fLabel}>Costo de visita</p>
              <div className={styles.montoRow}>
                <span className={styles.montoPeso}>$</span>
                <input type="number" placeholder="0  (dejar en 0 si es gratis)" value={costoVisita}
                  onChange={e => setCostoVisita(e.target.value)} className={styles.montoInput} />
              </div>
            </div>
            <button type="button" className={styles.modalConfirmar} onClick={() => setModalVisita(false)}>
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MODAL VER PRESUPUESTO ─────────────────────────────────────
function ModalVerPresupuesto({ p, onClose }) {
  if (!p) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalVer}>
        <div className={styles.modalHeader}>
          <p className={styles.modalTitulo}>Resumen del presupuesto</p>
          <button onClick={onClose} className={styles.modalCerrar}>✕</button>
        </div>
        <div className={styles.modalVerCliente}>
          <div className={styles.modalVerAvatar} style={{ background: p.color }}>{p.inicial}</div>
          <div>
            <p className={styles.modalVerNombre}>{p.cliente}</p>
            <p className={styles.modalVerServicio}>{p.servicio}</p>
          </div>
        </div>
        {p.solicitud?.descripcionDetallada && (
          <div className={styles.modalVerDesc}>
            <p className={styles.modalVerDescLabel}>Descripción del problema</p>
            <p className={styles.modalVerDescTexto}>{p.solicitud.descripcionDetallada}</p>
          </div>
        )}
        {p.monto && (
          <div className={styles.modalVerMonto}>
            <p className={styles.modalVerMontoLabel}>Monto propuesto</p>
            <p className={styles.modalVerMontoVal}>${fmt(p.monto)}</p>
            <p className={styles.modalVerMontoEtapas}>
              {p.etapas === "total" ? "100% al cierre" :
               p.etapas === "50/50" ? "Anticipo 50% + cierre 50%" :
               p.etapas === "30/40/30" ? "Anticipo 30% + avance 40% + cierre 30%" : p.etapas}
            </p>
          </div>
        )}
        {p.solicitud?.direccion && <p className={styles.modalVerDireccion}>📍 {p.solicitud.direccion}</p>}
        {p.solicitud?.urgente    && <p className={styles.modalVerUrgente}>⚡ Urgente</p>}
        <button type="button" className={styles.modalVerCerrar} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

// ── PANTALLA PRINCIPAL ────────────────────────────────────────
export default function PresupuestosS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const solicitudIdParam = searchParams.get("solicitudId");
  const desdeParam       = searchParams.get("desde") || "";
  const categoriaParam   = searchParams.get("categoria");
  const descripcionParam = searchParams.get("descripcion");
  const direccionParam   = searchParams.get("direccion");
  const urgenciaParam    = searchParams.get("urgencia");
  const usuarioNomParam  = searchParams.get("nombre");
  const usuarioIniParam  = searchParams.get("inicial");

  const solicitudDesdeBusqueda = desdeParam === "busqueda" && categoriaParam ? {
    cliente: usuarioNomParam ? decodeURIComponent(usuarioNomParam) : "Laura Pérez",
    inicial: usuarioIniParam || "L", color: "#2A7D5A",
    servicio: decodeURIComponent(categoriaParam), monto: null,
    solicitud: { descripcionDetallada: descripcionParam ? decodeURIComponent(descripcionParam) : "", direccion: direccionParam ? decodeURIComponent(direccionParam) : "", urgente: urgenciaParam === "Urgente", distancia: "Cercano", presupuestoEstimado: "A definir", disponibilidad: [], fotos: [] },
  } : null;

  const solicitudDesdeHome = solicitudIdParam
    ? (() => {
        const s = SOLICITUDES_HOME.find(x => x.id === Number(solicitudIdParam));
        if (!s) return null;
        return { cliente: s.cliente, inicial: s.inicial, color: s.color, servicio: s.servicio, monto: null, solicitud: { descripcionDetallada: s.descripcionDetallada, direccion: s.direccion, distancia: s.distancia, presupuestoEstimado: s.presupuestoEstimado, urgente: s.urgente, fotos: s.fotos, disponibilidad: s.disponibilidad, horaPuntual: s.horaPuntual } };
      })()
    : null;

  const [formulario, setFormulario]       = useState(solicitudDesdeBusqueda || solicitudDesdeHome);
  const [verPresupuesto, setVerPresupuesto] = useState(null);
  const [toast, setToast]                 = useState(null);
  const [filtro, setFiltro]               = useState("todos");

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const presupuestosFiltrados = filtro === "todos" ? PRESUPUESTOS_MOCK :
    filtro === "pendientes" ? PRESUPUESTOS_MOCK.filter(p => p.estado === "por_enviar" || p.estado === "borrador") :
    PRESUPUESTOS_MOCK.filter(p => p.estado === "esperando" || p.estado === "aceptado");

  if (formulario) {
    return (
      <div className={styles.formPantalla}>
        <Formulario solicitud={formulario} navigate={navigate}
          onVolver={() => { if (desdeParam === "home-solucionador") navigate(-1); else setFormulario(null); }}
          onEnviar={() => { setFormulario(null); mostrarToast("✅ Presupuesto enviado"); }} />
        <ModalVerPresupuesto p={verPresupuesto} onClose={() => setVerPresupuesto(null)} />
        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferiorS />
      </div>
    );
  }

  return (
    <div className={styles.pantalla}>
      {/* Header wrapper fijo */}
      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Presupuestos</span>
          <button type="button" className={styles.btnNuevo}
            onClick={() => setFormulario({ cliente: "", servicio: "", inicial: "C", color: "#B84030", monto: null })}>
            <Plus size={18} />
          </button>
        </header>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        {[
          { id: "todos",      label: "Todos" },
          { id: "pendientes", label: "Por enviar" },
          { id: "enviados",   label: "Enviados" },
        ].map(f => (
          <button key={f.id} type="button" className={`${styles.filtroBtn} ${filtro === f.id ? styles.filtroBtnActivo : ""}`}
            onClick={() => setFiltro(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className={styles.lista}>
        {presupuestosFiltrados.map(p => {
          const est = ESTADO[p.estado];
          return (
            <div key={p.id} className={styles.pCard}>
              {/* Cabecera */}
              <div className={styles.pCardHeader}>
                <div className={styles.pCardAvatar} style={{ background: p.color }}>{p.inicial}</div>
                <div className={styles.pCardInfo}>
                  <p className={styles.pCardCliente}>{p.cliente}</p>
                  <p className={styles.pCardServicio}>{p.servicio}</p>
                </div>
                <span className={styles.pCardBadge} style={{ background: est.bg, color: est.color }}>
                  {est.icono} {est.label}
                </span>
              </div>

              {/* Monto */}
              {p.monto && (
                <div className={styles.pCardMonto}>
                  <p className={styles.pCardMontoVal}>${fmt(p.monto)}</p>
                  <span className={styles.pCardMontoDivider} />
                  <p className={styles.pCardEtapas}>
                    {p.etapas === "total"     ? "100% al cierre" :
                     p.etapas === "50/50"     ? "Anticipo 50% + cierre 50%" :
                     p.etapas === "30/40/30"  ? "Anticipo 30% + avance 40% + cierre 30%" :
                     "A convenir"}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className={styles.pCardAcciones}>
                <span className={styles.pCardFecha}>{p.fecha}</span>
                <button type="button" className={styles.pCardBtnChat}
                  onClick={() => navigate(`/chat-s?usuarioId=1&nombre=${encodeURIComponent(p.cliente)}&inicial=${p.inicial}`)}>
                  <MessageCircle size={14} />
                </button>
                {(p.estado === "por_enviar" || p.estado === "borrador") && (
                  <button type="button" className={styles.pCardBtnPpto} onClick={() => setFormulario(p)}>
                    {p.estado === "borrador" ? "Editar" : "Presupuestar"} <ChevronRight size={13} />
                  </button>
                )}
                {p.estado === "esperando" && (
                  <button type="button" className={styles.pCardBtnVer} onClick={() => setVerPresupuesto(p)}>
                    Ver
                  </button>
                )}
                {p.estado === "aceptado" && (
                  <span className={styles.pCardAcordado}>✓ Acordado</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ModalVerPresupuesto p={verPresupuesto} onClose={() => setVerPresupuesto(null)} />
      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}