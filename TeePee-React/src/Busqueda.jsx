import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import { IconoVolver } from "./Iconos";
import styles from "./Busqueda.module.css";
import {
  IconoPlomeria,
  IconoGas,
  IconoPintura,
  IconoAireAcond,
  IconoCarpinteria,
  IconoLimpieza,
  IconoCalendario,
  IconoAlerta,
  IconoCamara,
  IconoEditar,
} from "./Iconos";
import { Zap, Hammer, Clock, Umbrella } from "lucide-react";

const CATEGORIAS = [
  { id: 1,  icono: <IconoPlomeria    size={24} />, nombre: "Plomería" },
  { id: 2,  icono: <Zap              size={24} />, nombre: "Electricidad" },
  { id: 3,  icono: <IconoGas         size={24} />, nombre: "Gas" },
  { id: 4,  icono: <IconoPintura     size={24} />, nombre: "Pintura" },
  { id: 5,  icono: <IconoAireAcond   size={24} />, nombre: "Aire Acond." },
  { id: 6,  icono: <IconoCarpinteria size={24} />, nombre: "Carpintería" },
  { id: 7,  icono: <IconoLimpieza    size={24} />, nombre: "Limpieza" },
  { id: 8,  icono: <Hammer           size={24} />, nombre: "Albañilería" },
];

const CATEGORIAS_EXTRAS = [
  "Herrería", "Soldadura", "Techista", "Pisos y revestimientos",
  "Vidriería", "Fumigación", "Mudanzas", "Jardinería",
  "Electricista industrial", "Gasista matriculado", "Refrigeración",
  "Antenas y CCTV", "Redes y cableado", "Tapicería", "Cerrajería",
];

const URGENCIA_OPCIONES = [
  {
    id: "normal",
    icono: <IconoCalendario size={22} />,
    titulo: "Normal",
    desc: "Todos los solucionadores activos",
    extra: "",
    alerta: null,
  },
  {
    id: "urgente",
    icono: <IconoAlerta size={22} />,
    titulo: "Urgente",
    desc: "Solucionadores listos para hoy",
    extra: "+10%",
    alerta: "El costo del servicio puede incrementarse un 10% por la urgencia",
  },
];

const SOLUCIONADORES_MOCK = [
  { id: 1, nombre: "Juan Ledesma",  inicial: "J", oficio: "Plomero",  nivel: "Oro",    nivelIcono: "🥇", reputacion: 4.9, trabajos: 124, distancia: "1.2 km", tiempoRespuesta: "~15 min", precio: "$18.000 - $35.000", disponible: true, garantia: "30 días", tags: ["Rápido", "Prolijo", "Puntual"] },
  { id: 2, nombre: "Roberto Silva", inicial: "R", oficio: "Plomero",  nivel: "Plata",  nivelIcono: "🥈", reputacion: 4.7, trabajos: 67,  distancia: "2.8 km", tiempoRespuesta: "~25 min", precio: "$15.000 - $28.000", disponible: true, garantia: "15 días", tags: ["Económico", "Confiable"] },
  { id: 3, nombre: "Miguel Torres", inicial: "M", oficio: "Plomero",  nivel: "Bronce", nivelIcono: "🥉", reputacion: 4.5, trabajos: 23,  distancia: "3.5 km", tiempoRespuesta: "~40 min", precio: "$12.000 - $22.000", disponible: true, garantia: "Sin garantía", tags: ["Nuevo", "Económico"] },
  { id: 4, nombre: "Rosa Leiva",    inicial: "R", oficio: "Plomera",  nivel: "Plata",  nivelIcono: "🥈", reputacion: 4.8, trabajos: 55,  distancia: "2.1 km", tiempoRespuesta: "~20 min", precio: "$16.000 - $30.000", disponible: true, garantia: "30 días", tags: ["Prolija", "Puntual"] },
  { id: 5, nombre: "Carlos Acuña",  inicial: "C", oficio: "Plomero",  nivel: "Oro",    nivelIcono: "🥇", reputacion: 4.6, trabajos: 89,  distancia: "5.2 km", tiempoRespuesta: "~35 min", precio: "$18.000 - $32.000", disponible: true, garantia: "15 días", tags: ["Confiable", "Rápido"] },
];

const DOMICILIOS_USUARIO = [
  { id: 1, label: "Casa",    direccion: "Av. Mitre 1240, Posadas",  principal: true },
  { id: 2, label: "Trabajo", direccion: "San Lorenzo 456, Posadas", principal: false },
];

export default function Busqueda() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pasoInicial = Number(searchParams.get("paso")) || 1;
  const [paso, setPaso] = useState(pasoInicial);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [mostrarCategoriasExtras, setMostrarCategoriasExtras] = useState(false);
  const [otraCategoria, setOtraCategoria] = useState("");
  const [escuchando, setEscuchando] = useState(false);
  const [mostrarAlertaUrgente, setMostrarAlertaUrgente] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [urgencia, setUrgencia] = useState("normal");
  const [buscando, setBuscando] = useState(false);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [horasPuntuales, setHorasPuntuales] = useState({});
  const [direccion, setDireccion] = useState(DOMICILIOS_USUARIO.find(d => d.principal)?.direccion || "");
  const [direccionManual, setDireccionManual] = useState("");
  const [toast, setToast] = useState(null);

  function mostrarToast(mensaje) { setToast(mensaje); setTimeout(() => setToast(null), 2500); }
  function scrollTop() { window.scrollTo({ top: 0, behavior: "instant" }); }

  function irAPaso2() {
    if (categoriasSeleccionadas.length === 0 && !otraCategoria.trim()) { mostrarToast("⚠️ Elegí al menos una categoría"); return; }
    if (!descripcion.trim()) { mostrarToast("⚠️ Describí lo que necesitás"); return; }
    setPaso(2); scrollTop();
  }

  function toggleCategoria(id) {
    setCategoriasSeleccionadas(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }

  function iniciarVoz() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) { mostrarToast("Tu navegador no soporta dictado por voz"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "es-AR"; rec.continuous = false; rec.interimResults = false;
    setEscuchando(true);
    rec.onresult = (e) => { setDescripcion(prev => prev ? prev + " " + e.results[0][0].transcript : e.results[0][0].transcript); setEscuchando(false); };
    rec.onerror = () => { setEscuchando(false); mostrarToast("No se pudo reconocer el audio"); };
    rec.onend = () => setEscuchando(false);
    rec.start();
  }

  function irAPaso3() {
    if (!direccion) { mostrarToast("⚠️ Seleccioná una dirección de servicio"); return; }
    if (horariosSeleccionados.length === 0) { mostrarToast("⚠️ Seleccioná al menos un día y turno"); return; }
    setBuscando(true);
    setTimeout(() => { setBuscando(false); setPaso(3); scrollTop(); }, 1800);
  }

  const categoriasActuales = CATEGORIAS.filter(c => categoriasSeleccionadas.includes(c.id));
  const categoriaActual = categoriasActuales[0];
  const urgenciaActual = URGENCIA_OPCIONES.find(u => u.id === urgencia);

  // ── PASO 1 ──────────────────────────────────────────────
  if (paso === 1) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Solicitar servicio</span>
          <div className={styles.pasoIndicador}>
            <span className={styles.pasoActual}>1</span>
            <span className={styles.pasoTotal}>/3</span>
          </div>
        </header>

        <div className={styles.wizardBarra}>
          <div className={styles.wizardBarraRelleno} style={{ width: "33%" }} />
        </div>

        <main className={styles.contenido}>
          <div className={styles.pasoTitulo}>
            <h1 className={styles.pasoTituloTexto}>¿Qué servicio necesitás?</h1>
            <p className={styles.pasoTituloSub}>Elegí la categoría y describí el problema</p>
          </div>

          {/* Categorías */}
          <section>
            <div className={styles.categoriaHeaderRow}>
              <p className={styles.campoLabel}>Categoría</p>
              {categoriasSeleccionadas.length > 0 && (
                <span className={styles.categoriasContador}>
                  {categoriasSeleccionadas.length} seleccionada{categoriasSeleccionadas.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className={styles.categoriasGrid}>
              {CATEGORIAS.map((cat) => (
                <button key={cat.id} type="button"
                  className={`${styles.categoriaBtn} ${categoriasSeleccionadas.includes(cat.id) ? styles.categoriaBtnActiva : ""}`}
                  onClick={() => toggleCategoria(cat.id)}
                >
                  <span className={styles.categoriaBtnIcono}>{cat.icono}</span>
                  <span className={styles.categoriaBtnNombre}>{cat.nombre}</span>
                  {categoriasSeleccionadas.includes(cat.id) && (
                    <span className={styles.categoriaCheck}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Otras categorías */}
            <button type="button" className={styles.btnOtrasCategorias}
              onClick={() => setMostrarCategoriasExtras(!mostrarCategoriasExtras)}>
              <span>+ Otras categorías</span>
              <span>{mostrarCategoriasExtras ? "▲" : "▼"}</span>
            </button>

            {mostrarCategoriasExtras && (
              <div className={styles.extrasPanel}>
                {CATEGORIAS_EXTRAS.map((nombre, i) => {
                  const id = `extra_${i}`;
                  const sel = categoriasSeleccionadas.includes(id);
                  return (
                    <button key={id} type="button"
                      className={sel ? styles.extraBtnActivo : styles.extraBtn}
                      onClick={() => toggleCategoria(id)}>
                      {sel ? "✓ " : ""}{nombre}
                    </button>
                  );
                })}
                <div className={styles.otraCategoriaRow}>
                  <span className={styles.otraCategoriaLabel}>Otra:</span>
                  <input type="text" placeholder="Escribí tu categoría..."
                    value={otraCategoria}
                    onChange={e => setOtraCategoria(e.target.value)}
                    className={styles.otraCategoriaInput}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Descripción */}
          <section className={styles.campoBloque}>
            <div className={styles.descripcionHeader}>
              <p className={styles.campoLabel}>Describí el problema</p>
              <button type="button" onClick={iniciarVoz}
                className={escuchando ? styles.btnDictarActivo : styles.btnDictar}>
                🎤 {escuchando ? "Escuchando..." : "Dictar"}
              </button>
            </div>
            <textarea className={styles.textarea}
              placeholder="Ej: Tengo una pérdida de agua debajo de la pileta de la cocina. Hace 2 días que gotea..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
            />
            <span className={styles.textareaContador}>{descripcion.length}/300</span>
          </section>

          {/* Adjuntos */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>
              Adjuntos <span className={styles.opcional}>(opcional)</span>
              <span className={styles.adjuntoHint}>· Ayuda a cotizar mejor</span>
            </p>
            <div className={styles.adjuntosGrid}>
              <button type="button" className={styles.btnFotos}
                onClick={() => mostrarToast("Función disponible en la app móvil")}>
                <span className={styles.btnFotosIcono}><IconoCamara size={22} /></span>
                <div className={styles.btnFotosTextos}>
                  <span className={styles.btnFotosTexto}>Agregar fotos</span>
                  <span className={styles.btnFotosSub}>JPG, PNG, HEIC</span>
                </div>
              </button>
              <button type="button" className={styles.btnFotos}
                onClick={() => mostrarToast("Función disponible en la app móvil")}>
                <span className={styles.btnFotosIcono}>📁</span>
                <div className={styles.btnFotosTextos}>
                  <span className={styles.btnFotosTexto}>Archivos / planos</span>
                  <span className={styles.btnFotosSub}>PDF, DWG, ZIP</span>
                </div>
              </button>
            </div>
          </section>
        </main>

        <div className={styles.footer}>
          <button type="button" className={styles.btnPrimario} onClick={irAPaso2}>
            Continuar →
          </button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }

  // ── PASO 2 ──────────────────────────────────────────────
  if (paso === 2) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => setPaso(1)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Solicitar servicio</span>
          <div className={styles.pasoIndicador}>
            <span className={styles.pasoActual}>2</span>
            <span className={styles.pasoTotal}>/3</span>
          </div>
        </header>

        <div className={styles.wizardBarra}>
          <div className={styles.wizardBarraRelleno} style={{ width: "66%" }} />
        </div>

        <main className={styles.contenido}>
          <div className={styles.pasoTitulo}>
            <h1 className={styles.pasoTituloTexto}>¿Cuándo y dónde?</h1>
            <p className={styles.pasoTituloSub}>Indicá la urgencia y la dirección</p>
          </div>

          {/* Resumen paso 1 */}
          <div className={styles.resumenPaso1}>
            <span className={styles.resumenIcono}>{categoriaActual?.icono}</span>
            <div className={styles.resumenTexto}>
              <span className={styles.resumenCategoria}>
                {categoriasActuales.length > 1
                  ? categoriasActuales.map(c => c.nombre).join(", ")
                  : categoriaActual?.nombre}
              </span>
              <span className={styles.resumenDesc}>
                {descripcion.length > 60 ? descripcion.slice(0, 60) + "..." : descripcion}
              </span>
            </div>
            <button className={styles.resumenEditar} onClick={() => setPaso(1)}>
              <IconoEditar size={16} />
            </button>
          </div>

          {/* Urgencia */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>Urgencia</p>
            <div className={styles.urgenciaGrid}>
              {URGENCIA_OPCIONES.map((op) => (
                <div key={op.id} className={styles.urgenciaItemWrapper}>
                  <button type="button"
                    className={`${styles.urgenciaBtn} ${urgencia === op.id ? styles.urgenciaBtnActiva : ""}`}
                    onClick={() => setUrgencia(op.id)}
                  >
                    <span className={styles.urgenciaBtnIcono}>{op.icono}</span>
                    <span className={styles.urgenciaBtnTitulo}>{op.titulo}</span>
                    <span className={styles.urgenciaBtnDesc}>{op.desc}</span>
                    {op.extra && (
                      <span className={styles.urgenciaBtnExtra}
                        onMouseEnter={() => op.alerta && setMostrarAlertaUrgente(true)}
                        onMouseLeave={() => setMostrarAlertaUrgente(false)}
                        onClick={e => { e.stopPropagation(); setMostrarAlertaUrgente(!mostrarAlertaUrgente); }}
                      >{op.extra}</span>
                    )}
                  </button>
                  {op.alerta && urgencia === op.id && mostrarAlertaUrgente && (
                    <div className={styles.urgenciaTooltip}>
                      ⚠️ {op.alerta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Dirección */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>Dirección del servicio</p>
            <div className={styles.direccionesCol}>
              {DOMICILIOS_USUARIO.map(d => (
                <button key={d.id} type="button"
                  className={direccion === d.direccion ? styles.domicilioActivo : styles.domicilioBtn}
                  onClick={() => setDireccion(prev => prev === d.direccion ? "" : d.direccion)}
                >
                  <span className={styles.domicilioIcono}>📍</span>
                  <div className={styles.domicilioTexto}>
                    <p className={direccion === d.direccion ? styles.domicilioLabelActivo : styles.domicilioLabel}>
                      {d.label}
                    </p>
                    <p className={direccion === d.direccion ? styles.domicilioDireccionActiva : styles.domicilioDireccion}>
                      {d.direccion}
                    </p>
                  </div>
                  {direccion === d.direccion && <span className={styles.domicilioCheck}>✓</span>}
                </button>
              ))}

              {/* Otra dirección */}
              <div className={direccionManual ? styles.otraDireccionActiva : styles.otraDireccion}>
                <div className={styles.direccionInput}>
                  <span className={styles.direccionIcono}>✏️</span>
                  <input type="text" className={styles.direccionCampo}
                    placeholder="Ingresar otra dirección..."
                    value={direccionManual}
                    onChange={e => { setDireccionManual(e.target.value); if (e.target.value) setDireccion(e.target.value); }}
                  />
                  {direccionManual && (<>
                    <button type="button" className={styles.btnConfirmarDireccion}
                      onClick={() => setDireccion(direccionManual)}>✓</button>
                    <button type="button" className={styles.btnLimpiarDireccion}
                      onClick={() => { setDireccionManual(""); setDireccion(""); }}>✕</button>
                  </>)}
                </div>
              </div>

              <button type="button" className={styles.btnUbicacion}
                onClick={() => {
                  if (!navigator.geolocation) { mostrarToast("Tu dispositivo no soporta GPS"); return; }
                  mostrarToast("📡 Obteniendo ubicación...");
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const { latitude, longitude } = pos.coords;
                      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                        .then(r => r.json())
                        .then(data => {
                          const addr = data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                          setDireccion(addr);
                          setDireccionManual("");
                          mostrarToast("✅ Ubicación obtenida");
                        })
                        .catch(() => {
                          setDireccion(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                          setDireccionManual("");
                          mostrarToast("✅ Ubicación obtenida");
                        });
                    },
                    () => mostrarToast("⚠️ No se pudo acceder al GPS")
                  );
                }}>
                🎯 Usar mi ubicación actual
              </button>
            </div>
          </section>

          {/* Dirección seleccionada — confirmación */}
          {direccion && (
            <div className={styles.direccionConfirmada}>
              <span className={styles.direccionConfirmadaIcono}>📍</span>
              <div className={styles.direccionConfirmadaTexto}>
                <p className={styles.direccionConfirmadaLabel}>Dirección del servicio</p>
                <p className={styles.direccionConfirmadaValor}>{direccion}</p>
              </div>
            </div>
          )}

          {/* Disponibilidad horaria */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>¿Cuándo podés recibir al profesional en el domicilio?</p>
            <p className={styles.campoSublabel}>Seleccioná días y turnos disponibles (o hora preferida)</p>

            <div className={styles.atajosRow}>
              <button type="button" className={styles.atajoBtn}
                onClick={() => {
                  const diasLV = ["lun", "mar", "mie", "jue", "vie"];
                  const keys = diasLV.flatMap(d => ["7-12", "12-15", "15-19", "19-21"].map(t => `${d}-${t}`));
                  const todosActivos = keys.every(k => horariosSeleccionados.includes(k));
                  setHorariosSeleccionados(prev => todosActivos ? prev.filter(h => !keys.includes(h)) : [...new Set([...prev, ...keys])]);
                }}>
                <IconoCalendario size={14} /> Lunes a Viernes
              </button>
              <button type="button" className={styles.atajoBtn}
                onClick={() => {
                  const diasFS = ["sab", "dom"];
                  const keys = diasFS.flatMap(d => ["7-12", "12-15", "15-19", "19-21"].map(t => `${d}-${t}`));
                  const todosActivos = keys.every(k => horariosSeleccionados.includes(k));
                  setHorariosSeleccionados(prev => todosActivos ? prev.filter(h => !keys.includes(h)) : [...new Set([...prev, ...keys])]);
                }}>
                <Umbrella size={14} /> Fin de semana
              </button>
            </div>

            {(() => {
              const hoy = new Date();
              return [
                { dia: "Lunes",     id: "lun", offset: (1 - hoy.getDay() + 7) % 7 },
                { dia: "Martes",    id: "mar", offset: (2 - hoy.getDay() + 7) % 7 },
                { dia: "Miércoles", id: "mie", offset: (3 - hoy.getDay() + 7) % 7 },
                { dia: "Jueves",    id: "jue", offset: (4 - hoy.getDay() + 7) % 7 },
                { dia: "Viernes",   id: "vie", offset: (5 - hoy.getDay() + 7) % 7 },
                { dia: "Sábado",    id: "sab", offset: (6 - hoy.getDay() + 7) % 7 },
                { dia: "Domingo",   id: "dom", offset: (0 - hoy.getDay() + 7) % 7 },
              ].map(d => {
                const fecha = new Date(hoy);
                fecha.setDate(hoy.getDate() + d.offset);
                return { ...d, fecha: `${fecha.getDate()}/${String(fecha.getMonth()+1).padStart(2,'0')}`, esHoy: d.offset === 0 };
              }).sort((a, b) => a.offset - b.offset);
            })().map((fila) => (
              <div key={fila.id} className={styles.disponibilidadFila}>
                <span className={styles.disponibilidadDia}>
                  {fila.dia}
                  <span className={styles.disponibilidadFecha}>{fila.fecha}</span>
                </span>
                {[
                  { id: "7-12",  label: "7–12" },
                  { id: "12-15", label: "12–15" },
                  { id: "15-19", label: "15–19" },
                  { id: "19-21", label: "19–21" },
                ].map((turno) => {
                  const key = `${fila.id}-${turno.id}`;
                  return (
                    <button key={key} type="button"
                      className={`${styles.turnoBtn} ${horariosSeleccionados.includes(key) ? styles.turnoBtnActivo : ""}`}
                      onClick={() => setHorariosSeleccionados(prev => prev.includes(key) ? prev.filter(h => h !== key) : [...prev, key])}>
                      {turno.label}
                    </button>
                  );
                })}
                <select
                  value={horasPuntuales[fila.id] || ""}
                  onChange={(e) => setHorasPuntuales(prev => ({ ...prev, [fila.id]: e.target.value }))}
                  className={horasPuntuales[fila.id] ? styles.horaPuntualActiva : styles.horaPuntual}
                >
                  <option value="">⏰ hora</option>
                  {Array.from({ length: (21 - 7) * 4 + 1 }, (_, i) => {
                    const totalMin = 7 * 60 + i * 15;
                    const h = String(Math.floor(totalMin / 60)).padStart(2, "0");
                    const m = String(totalMin % 60).padStart(2, "0");
                    return `${h}:${m}`;
                  }).map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}

            {horariosSeleccionados.length > 0 && (
              <div className={styles.disponibilidadResumen}>
                ✅ {horariosSeleccionados.length} turno{horariosSeleccionados.length > 1 ? "s" : ""} seleccionado{horariosSeleccionados.length > 1 ? "s" : ""}
              </div>
            )}
          </section>
        </main>

        <div className={styles.footer}>
          {buscando ? (
            <div className={styles.buscandoBloque}>
              <div className={styles.buscandoSpinner}></div>
              <span className={styles.buscandoTexto}>Buscando profesionales cerca tuyo...</span>
            </div>
          ) : (
            <button type="button" className={styles.btnPrimario} onClick={irAPaso3}>
              Buscar profesionales →
            </button>
          )}
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }

  // ── PASO 3 ──────────────────────────────────────────────
  if (paso === 3) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => setPaso(2)}>
            <IconoVolver size={20} />
          </button>
          <span className={styles.headerTitulo}>Profesionales encontrados</span>
          <div className={styles.pasoIndicador}>
            <span className={styles.pasoActual}>3</span>
            <span className={styles.pasoTotal}>/3</span>
          </div>
        </header>

        <div className={styles.wizardBarra}>
          <div className={styles.wizardBarraRelleno} style={{ width: "100%" }} />
        </div>

        <main className={styles.contenido}>
          {/* Resumen búsqueda */}
          <div className={styles.resumenBusqueda}>
            <div className={styles.resumenBusquedaFila1}>
              <span className={styles.resumenBusquedaIcono}>{categoriaActual?.icono}</span>
              <div className={styles.resumenBusquedaInfo}>
                <p className={styles.resumenBusquedaTitulo}>
                  {categoriasActuales.length > 1
                    ? categoriasActuales.map(c => c.nombre).join(" · ")
                    : (categoriaActual?.nombre || "Servicio")}
                </p>
                <span className={urgencia === "urgente" ? styles.badgeUrgente : styles.badgeNormal}>
                  {urgenciaActual?.icono} {urgenciaActual?.titulo}
                </span>
              </div>
            </div>

            {direccion && (
              <div className={styles.resumenDireccion}>
                <span className={styles.resumenDireccionIcono}>📍</span>
                <p className={styles.resumenDireccionTexto}>{direccion}</p>
              </div>
            )}

            {descripcion && (
              <p className={styles.resumenDescripcion}>
                "{descripcion.length > 70 ? descripcion.slice(0, 70) + "…" : descripcion}"
              </p>
            )}
          </div>

          {/* Header resultados */}
          <div className={styles.resultadosHeader}>
            <p className={styles.resultadosTexto}>
              <span className={styles.resultadosNumero}>{SOLUCIONADORES_MOCK.length}</span>{" "}
              profesionales disponibles
            </p>
            <button className={styles.resultadosFiltro} onClick={() => mostrarToast("Filtros próximamente")}>
              ⚙️ Filtrar
            </button>
          </div>

          {/* Lista solucionadores */}
          <div className={styles.solucionadoresLista}>
            {SOLUCIONADORES_MOCK.map((sol, index) => (
              <div key={sol.id} className={`${styles.solucionadorCard} ${index === 0 ? styles.solucionadorCardTop : ""}`}>
                {index < 3 && (
                  <div className={styles.mejorMatchBadge}>
                    {index === 0 ? "⭐ Mejor resultado para vos" : index === 1 ? "⭐ 2° recomendado" : "⭐ 3° recomendado"}
                  </div>
                )}
                <div className={styles.solucionadorTop}>
                  <div className={styles.solucionadorAvatar}>
                    {sol.inicial}
                    <span className={styles.solucionadorNivelIcono}>{sol.nivelIcono}</span>
                  </div>
                  <div className={styles.solucionadorInfo}>
                    <div className={styles.solucionadorNombreRow}>
                      <span className={styles.solucionadorNombre}>{sol.nombre}</span>
                      <span className={styles.solucionadorReputacion}>⭐ {sol.reputacion}</span>
                    </div>
                    <span className={styles.solucionadorOficio}>{sol.oficio} · {sol.trabajos} trabajos</span>
                    <div className={styles.solucionadorMeta}>
                      <span>📍 {sol.distancia}</span>
                      <span>⚡ {sol.tiempoRespuesta}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.solucionadorTags}>
                  {sol.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                  <span className={styles.tagGarantia}>🛡️ {sol.garantia}</span>
                </div>
                <div className={styles.solucionadorPrecio}>
                  <span className={styles.solucionadorPrecioLabel}>Precio estimado:</span>
                  <span className={styles.solucionadorPrecioMonto}>{sol.precio}</span>
                </div>
                <div className={styles.solucionadorAcciones}>
                  <button type="button" className={styles.btnVerPerfil}
                    onClick={() => navigate(`/perfil?nombre=${encodeURIComponent(sol.nombre)}&oficio=${encodeURIComponent(sol.oficio)}&reputacion=${sol.reputacion}&trabajos=${sol.trabajos}&distancia=${encodeURIComponent(sol.distancia)}&precio=${encodeURIComponent(sol.precio)}&garantia=${encodeURIComponent(sol.garantia)}&nivelIcono=${encodeURIComponent(sol.nivelIcono)}&desde=busqueda`)}>
                    Ver perfil
                  </button>
                  <button type="button" className={styles.btnContactar}
                    onClick={() => {
                      const cats = categoriasActuales.map(c => c.nombre).join(", ") || otraCategoria || "Servicio";
                      navigate(`/chat?solId=${sol.id}&nombre=${encodeURIComponent(sol.nombre)}&inicial=${sol.inicial}&oficio=${encodeURIComponent(sol.oficio)}&desde=busqueda&mensaje=solicitud&categoria=${encodeURIComponent(cats)}&descripcion=${encodeURIComponent(descripcion)}&direccion=${encodeURIComponent(direccion)}&urgencia=${encodeURIComponent(urgenciaActual?.titulo || "Normal")}`);
                    }}>
                    Solicitar presupuesto y contactar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botón volver inicio */}
          <button type="button" className={styles.btnVolverInicio} onClick={() => navigate("/home")}>
            Volver a la pantalla de inicio
          </button>
        </main>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }
}