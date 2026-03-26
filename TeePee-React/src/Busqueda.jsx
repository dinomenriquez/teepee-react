import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
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
  {
    id: 1,
    nombre: "Juan Ledesma",
    inicial: "J",
    oficio: "Plomero",
    nivel: "Oro",
    nivelIcono: "🥇",
    reputacion: 4.9,
    trabajos: 124,
    distancia: "1.2 km",
    tiempoRespuesta: "~15 min",
    precio: "$18.000 - $35.000",
    disponible: true,
    garantia: "30 días",
    tags: ["Rápido", "Prolijo", "Puntual"],
  },
  {
    id: 2,
    nombre: "Roberto Silva",
    inicial: "R",
    oficio: "Plomero",
    nivel: "Plata",
    nivelIcono: "🥈",
    reputacion: 4.7,
    trabajos: 67,
    distancia: "2.8 km",
    tiempoRespuesta: "~25 min",
    precio: "$15.000 - $28.000",
    disponible: true,
    garantia: "15 días",
    tags: ["Económico", "Confiable"],
  },
  {
    id: 3, nombre: "Miguel Torres", inicial: "M", oficio: "Plomero",
    nivel: "Bronce", nivelIcono: "🥉", reputacion: 4.5, trabajos: 23,
    distancia: "3.5 km", tiempoRespuesta: "~40 min",
    precio: "$12.000 - $22.000", disponible: true, garantia: "Sin garantía",
    tags: ["Nuevo", "Económico"],
  },
  {
    id: 4, nombre: "Rosa Leiva", inicial: "R", oficio: "Plomera",
    nivel: "Plata", nivelIcono: "🥈", reputacion: 4.8, trabajos: 55,
    distancia: "2.1 km", tiempoRespuesta: "~20 min",
    precio: "$16.000 - $30.000", disponible: true, garantia: "30 días",
    tags: ["Prolija", "Puntual"],
  },
  {
    id: 5, nombre: "Carlos Acuña", inicial: "C", oficio: "Plomero",
    nivel: "Oro", nivelIcono: "🥇", reputacion: 4.6, trabajos: 89,
    distancia: "5.2 km", tiempoRespuesta: "~35 min",
    precio: "$18.000 - $32.000", disponible: true, garantia: "15 días",
    tags: ["Confiable", "Rápido"],
  },
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
  const [toast, setToast] = useState(null);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2500);
  }

  function irAPaso2() {
    if (categoriasSeleccionadas.length === 0 && !otraCategoria.trim()) {
      mostrarToast("⚠️ Elegí al menos una categoría");
      return;
    }
    if (!descripcion.trim()) {
      mostrarToast("⚠️ Describí lo que necesitás");
      return;
    }
    setPaso(2);
  }

  function toggleCategoria(id) {
    setCategoriasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  function iniciarVoz() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      mostrarToast("Tu navegador no soporta dictado por voz");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "es-AR";
    rec.continuous = false;
    rec.interimResults = false;
    setEscuchando(true);
    rec.onresult = (e) => {
      const texto = e.results[0][0].transcript;
      setDescripcion(prev => prev ? prev + " " + texto : texto);
      setEscuchando(false);
    };
    rec.onerror = () => { setEscuchando(false); mostrarToast("No se pudo reconocer el audio"); };
    rec.onend = () => setEscuchando(false);
    rec.start();
  }

  function irAPaso3() {
    // Simulamos búsqueda con loading
    setBuscando(true);
    setTimeout(() => {
      setBuscando(false);
      setPaso(3);
    }, 1800);
    /*
      En el Paso 5 (FastAPI) acá va a ir
      una llamada real a la API:
      fetch('/api/búsqueda?categoria=plomeria&lat=...&lng=...')
      Por ahora simulamos el delay con setTimeout.
    */
  }

  const categoriasActuales = CATEGORIAS.filter(c => categoriasSeleccionadas.includes(c.id));
  const categoriaActual = categoriasActuales[0]; // para compatibilidad

  const urgenciaActual = URGENCIA_OPCIONES.find((u) => u.id === urgencia);

  // ── PASO 1: ¿Qué necesitás? ──
  if (paso === 1) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <span className={styles.headerTitulo}>Solicitar servicio</span>
          <div className={styles.pasoIndicador}>
            <span className={styles.pasoActual}>1</span>
            <span className={styles.pasoTotal}>/3</span>
          </div>
        </header>

        {/* Barra de progreso del wizard */}
        <div className={styles.wizardBarra}>
          <div className={styles.wizardBarraRelleno} style={{ width: "33%" }} />
        </div>

        <main className={styles.contenido}>
          <div className={styles.pasoTitulo}>
            <h1 className={styles.pasoTituloTexto}>¿Qué servicio necesitás?</h1>
            <p className={styles.pasoTituloSub}>
              Elegí la categoría y describí el problema
            </p>
          </div>

          {/* Categorías — múltiple selección */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p className={styles.campoLabel} style={{ margin: 0 }}>Categoría</p>
              {categoriasSeleccionadas.length > 0 && (
                <span style={{ fontSize: 11, color: "var(--tp-rojo)", fontWeight: 700, fontFamily: "var(--fuente)" }}>
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
                    <span style={{ position: "absolute", top: 4, right: 4, fontSize: 10, color: "var(--tp-crema)", background: "var(--tp-rojo)", borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Otras categorías desplegable */}
            <button type="button"
              onClick={() => setMostrarCategoriasExtras(!mostrarCategoriasExtras)}
              style={{ width: "100%", marginTop: 10, padding: "10px 14px", borderRadius: "var(--r-md)", border: "1px dashed rgba(61,31,31,0.20)", background: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 13, color: "var(--tp-marron-suave)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>+ Otras categorías</span>
              <span>{mostrarCategoriasExtras ? "▲" : "▼"}</span>
            </button>
            {mostrarCategoriasExtras && (
              <div style={{ marginTop: 8, padding: 12, background: "rgba(61,31,31,0.03)", borderRadius: "var(--r-md)", border: "1px solid rgba(61,31,31,0.08)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIAS_EXTRAS.map((nombre, i) => {
                  const id = `extra_${i}`;
                  const sel = categoriasSeleccionadas.includes(id);
                  return (
                    <button key={id} type="button"
                      onClick={() => toggleCategoria(id)}
                      style={{ padding: "6px 12px", borderRadius: "var(--r-full)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 12, fontWeight: sel ? 700 : 400,
                        background: sel ? "var(--tp-rojo)" : "var(--tp-crema)",
                        color: sel ? "white" : "var(--tp-marron)" }}>
                      {sel ? "✓ " : ""}{nombre}
                    </button>
                  );
                })}
                {/* Otra: texto libre */}
                <div style={{ width: "100%", marginTop: 4, display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--tp-marron-suave)", fontFamily: "var(--fuente)", whiteSpace: "nowrap" }}>Otra:</span>
                  <input type="text" placeholder="Escribí tu categoría..."
                    value={otraCategoria}
                    onChange={e => setOtraCategoria(e.target.value)}
                    style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(61,31,31,0.15)", background: "var(--tp-crema)", fontFamily: "var(--fuente)", fontSize: 13, color: "var(--tp-marron)", outline: "none" }} />
                </div>
              </div>
            )}
          </section>

          {/* Descripción con dictado por voz */}
          <section className={styles.campoBloque}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p className={styles.campoLabel} style={{ margin: 0 }}>Describí el problema</p>
              <button type="button" onClick={iniciarVoz}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: "var(--r-full)", border: "1px solid rgba(61,31,31,0.15)", background: escuchando ? "var(--tp-rojo)" : "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 11, color: escuchando ? "white" : "var(--tp-marron-suave)", fontWeight: 600 }}>
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

          {/* Fotos + Archivos */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>
              Adjuntos <span className={styles.opcional}>(opcional)</span>
              <span style={{ fontSize: 11, color: "var(--tp-marron-suave)", fontWeight: 400, marginLeft: 6 }}>· Ayuda a cotizar mejor</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button type="button" className={styles.btnFotos}
                onClick={() => mostrarToast("Función disponible en la app móvil")}
                style={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                <span className={styles.btnFotosIcono}><IconoCamara size={20} /></span>
                <span className={styles.btnFotosTexto}>Agregar</span>
                <span className={styles.btnFotosSub}>fotos</span>
              </button>
              <button type="button" className={styles.btnFotos}
                onClick={() => mostrarToast("Función disponible en la app móvil")}
                style={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                <span className={styles.btnFotosIcono}>📁</span>
                <span className={styles.btnFotosTexto}>Agregar</span>
                <span className={styles.btnFotosSub}>archivos / planos</span>
              </button>
            </div>
          </section>
        </main>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnPrimario}
            onClick={irAPaso2}
          >
            Continuar →
          </button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }

  // ── PASO 2: ¿Cuándo y dónde? ──
  if (paso === 2) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => setPaso(1)}>
            ← Volver
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
            <p className={styles.pasoTituloSub}>
              Indicá la urgencia y la dirección
            </p>
          </div>

          {/* Resumen paso 1 — categorías + voz + archivos */}
          <div className={styles.resumenPaso1}>
            <span className={styles.resumenIcono}>
              {categoriaActual?.icono}
            </span>
            <div className={styles.resumenTexto}>
              <span className={styles.resumenCategoria}>
                {categoriasActuales.length > 1
                  ? categoriasActuales.map(c => c.nombre).join(", ")
                  : categoriaActual?.nombre}
              </span>
              <span className={styles.resumenDesc}>
                {descripcion.length > 60
                  ? descripcion.slice(0, 60) + "..."
                  : descripcion}
              </span>
            </div>
            <button className={styles.resumenEditar} onClick={() => setPaso(1)}>
              <IconoEditar size={16} />
            </button>
          </div>

          {/* Urgencia */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>Urgencia</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {URGENCIA_OPCIONES.map((op) => (
                  <div key={op.id} style={{ position: "relative" }}>
                    <button type="button"
                      className={`${styles.urgenciaBtn} ${urgencia === op.id ? styles.urgenciaBtnActiva : ""}`}
                      onClick={() => setUrgencia(op.id)}
                      style={{ width: "100%" }}
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
                      <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 0, right: 0, background: "var(--tp-marron)", color: "var(--tp-crema)", padding: "8px 10px", borderRadius: "var(--r-md)", fontSize: 11, lineHeight: 1.5, zIndex: 10, fontFamily: "var(--fuente)" }}>
                        ⚠️ {op.alerta}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>

          {/* Dirección */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>Dirección</p>
            <div className={styles.direccionInput}>
              <span className={styles.direccionIcono}>📍</span>
              <input
                type="text"
                className={styles.direccionCampo}
                placeholder="Ej: Av. Mitre 1240, Posadas"
                defaultValue="Av. Mitre 1240, Posadas"
              />
            </div>
            <button
              type="button"
              className={styles.btnUbicacion}
              onClick={() => mostrarToast("Usando tu ubicación actual")}
            >
              🎯 Usar mi ubicación actual
            </button>
          </section>

          {/* Disponibilidad horaria */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>
              ¿Cuándo podés recibir al profesional en el domicilio?
            </p>
            <p className={styles.campoSublabel}>
              Seleccioná días y turnos disponibles
            </p>

            {/* Atajos rápidos */}
            <div className={styles.atajosRow}>
              <button
                type="button"
                className={styles.atajoBtn}
                onClick={() => {
                  const diasLV = ["lun", "mar", "mie", "jue", "vie"];
                  const keys = diasLV.flatMap((d) =>
                    ["7-12", "12-15", "15-19", "19-21"].map((t) => `${d}-${t}`),
                  );
                  const todosActivos = keys.every((k) =>
                    horariosSeleccionados.includes(k),
                  );
                  setHorariosSeleccionados((prev) =>
                    todosActivos
                      ? prev.filter((h) => !keys.includes(h))
                      : [...new Set([...prev, ...keys])],
                  );
                }}
              >
                <IconoCalendario size={14} /> Lunes a Viernes
              </button>
              <button
                type="button"
                className={styles.atajoBtn}
                onClick={() => {
                  const diasFS = ["sab", "dom"];
                  const keys = diasFS.flatMap((d) =>
                    ["7-12", "12-15", "15-19", "19-21"].map((t) => `${d}-${t}`),
                  );
                  const todosActivos = keys.every((k) =>
                    horariosSeleccionados.includes(k),
                  );
                  setHorariosSeleccionados((prev) =>
                    todosActivos
                      ? prev.filter((h) => !keys.includes(h))
                      : [...new Set([...prev, ...keys])],
                  );
                }}
              >
                <Umbrella size={14} /> Fin de semana
              </button>
            </div>
            {/* Grilla por día */}
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
              ]
              .map(d => {
                const fecha = new Date(hoy);
                fecha.setDate(hoy.getDate() + d.offset);
                return { ...d, fecha: `${fecha.getDate()}/${String(fecha.getMonth()+1).padStart(2,'0')}`, esHoy: d.offset === 0 };
              })
              .sort((a, b) => a.offset - b.offset);
            })().map((fila) => (
              <div key={fila.id} className={styles.disponibilidadFila}>
                <span className={styles.disponibilidadDia}>
                  {fila.dia}
                  <span style={{ fontSize: 9, display: "block", color: "var(--tp-marron-suave)", fontWeight: 400 }}>{fila.fecha}</span>
                </span>

                <div className={styles.disponibilidadTurnos}>
                  {[
                    { id: "7-12", label: "7–12" },
                    { id: "12-15", label: "12–15" },
                    { id: "15-19", label: "15–19" },
                    { id: "19-21", label: "19–21" },
                  ].map((turno) => {
                    const key = `${fila.id}-${turno.id}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`${styles.turnoBtn} ${
                          horariosSeleccionados.includes(key)
                            ? styles.turnoBtnActivo
                            : ""
                        }`}
                        onClick={() =>
                          setHorariosSeleccionados((prev) =>
                            prev.includes(key)
                              ? prev.filter((h) => h !== key)
                              : [...prev, key],
                          )
                        }
                      >
                        {turno.label}
                      </button>
                    );
                  })}
                </div>

                {/* Hora puntual por día — selector custom */}
                <select
                  className={styles.horaPuntual}
                  value={horasPuntuales[fila.id] || ""}
                  onChange={(e) => setHorasPuntuales(prev => ({ ...prev, [fila.id]: e.target.value }))}
                  style={{ fontSize: 11, padding: "4px 2px", borderRadius: 6, border: "1px solid rgba(61,31,31,0.15)", background: "var(--tp-crema)", color: "var(--tp-marron)", fontFamily: "var(--fuente)", cursor: "pointer" }}
                >
                  <option value="">hora preferida</option>
                  {Array.from({ length: (21 - 7) * 4 + 1 }, (_, i) => {
                    const totalMin = 7 * 60 + i * 15;
                    const h = String(Math.floor(totalMin / 60)).padStart(2, "0");
                    const m = String(totalMin % 60).padStart(2, "0");
                    return `${h}:${m}`;
                  }).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}

            {horariosSeleccionados.length > 0 && (
              <div className={styles.disponibilidadResumen}>
                ✅ {horariosSeleccionados.length} turno
                {horariosSeleccionados.length > 1 ? "s" : ""} seleccionado
                {horariosSeleccionados.length > 1 ? "s" : ""}
              </div>
            )}
          </section>
        </main>

        <div className={styles.footer}>
          {buscando ? (
            <div className={styles.buscandoBloque}>
              <div className={styles.buscandoSpinner}></div>
              <span className={styles.buscandoTexto}>
                Buscando profesionales cerca tuyo...
              </span>
            </div>
          ) : (
            <button
              type="button"
              className={styles.btnPrimario}
              onClick={irAPaso3}
            >
              Buscar profesionales →
            </button>
          )}
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }

  // ── PASO 3: Resultados del búsqueda ──
  if (paso === 3) {
    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => setPaso(2)}>
            ← Volver
          </button>
          <span className={styles.headerTitulo}>Profesionales encontrados</span>
          <div className={styles.pasoIndicador}>
            <span className={styles.pasoActual}>3</span>
            <span className={styles.pasoTotal}>/3</span>
          </div>
        </header>

        <div className={styles.wizardBarra}>
          <div
            className={styles.wizardBarraRelleno}
            style={{ width: "100%" }}
          />
        </div>

        <main className={styles.contenido}>
          {/* Resumen de la búsqueda */}
          <div className={styles.resumenBusqueda}>
            <div className={styles.resumenBusquedaTop}>
              <span className={styles.resumenBusquedaIcono}>
                {categoriaActual?.icono}
              </span>
              <div>
                <p className={styles.resumenBusquedaTitulo}>
                  {categoriaActual?.nombre}
                </p>
                <p className={styles.resumenBusquedaSub}>
                  {urgenciaActual?.icono} {urgenciaActual?.titulo}· 📍 Posadas
                </p>
              </div>
            </div>
          </div>

          {/* Resultado del búsqueda */}
          <div className={styles.resultadosHeader}>
            <p className={styles.resultadosTexto}>
              <span className={styles.resultadosNumero}>
                {SOLUCIONADORES_MOCK.length}
              </span>{" "}
              profesionales disponibles
            </p>
            <button
              className={styles.resultadosFiltro}
              onClick={() => mostrarToast("Filtros próximamente")}
            >
              ⚙️ Filtrar
            </button>
          </div>

          {/* Lista de solucionadores */}
          <div className={styles.solucionadoresLista}>
            {SOLUCIONADORES_MOCK.map((sol, index) => (
              <div
                key={sol.id}
                className={`${styles.solucionadorCard} ${
                  index === 0 ? styles.solucionadorCardTop : ""
                }`}
              >
                {index < 3 && (
                  <div className={styles.mejorMatchBadge}>
                    {index === 0 ? "⭐ Mejor resultado para vos" : index === 1 ? "⭐ 2° recomendado" : "⭐ 3° recomendado"}
                  </div>
                )}

                <div className={styles.solucionadorTop}>
                  <div className={styles.solucionadorAvatar}>
                    {sol.inicial}
                    <span className={styles.solucionadorNivelIcono}>
                      {sol.nivelIcono}
                    </span>
                  </div>

                  <div className={styles.solucionadorInfo}>
                    <div className={styles.solucionadorNombreRow}>
                      <span className={styles.solucionadorNombre}>
                        {sol.nombre}
                      </span>
                      <span className={styles.solucionadorReputacion}>
                        ⭐ {sol.reputacion}
                      </span>
                    </div>
                    <span className={styles.solucionadorOficio}>
                      {sol.oficio} · {sol.trabajos} trabajos
                    </span>
                    <div className={styles.solucionadorMeta}>
                      <span>📍 {sol.distancia}</span>
                      <span>⚡ {sol.tiempoRespuesta}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className={styles.solucionadorTags}>
                  {sol.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                  <span className={styles.tagGarantia}>🛡️ {sol.garantia}</span>
                </div>

                {/* Precio estimado */}
                <div className={styles.solucionadorPrecio}>
                  <span className={styles.solucionadorPrecioLabel}>
                    Precio estimado:
                  </span>
                  <span className={styles.solucionadorPrecioMonto}>
                    {sol.precio}
                  </span>
                </div>

                {/* Acciones */}
                <div className={styles.solucionadorAcciones}>
                  <button
                    type="button"
                    className={styles.btnVerPerfil}
                    onClick={() => navigate(`/perfil?nombre=${encodeURIComponent(sol.nombre)}&oficio=${encodeURIComponent(sol.oficio)}&reputacion=${sol.reputacion}&trabajos=${sol.trabajos}&distancia=${encodeURIComponent(sol.distancia)}&precio=${encodeURIComponent(sol.precio)}&garantia=${encodeURIComponent(sol.garantia)}&nivelIcono=${encodeURIComponent(sol.nivelIcono)}&desde=busqueda`)}
                  >
                    Ver perfil
                  </button>
                  <button
                    type="button"
                    className={styles.btnContactar}
                    onClick={() => navigate(`/chat?solId=${sol.id}&nombre=${encodeURIComponent(sol.nombre)}&inicial=${sol.inicial}&oficio=${encodeURIComponent(sol.oficio)}&desde=busqueda&mensaje=presupuesto`)}
                  >
                    Solicitar presupuesto y contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Botón volver al inicio */}
        <div style={{ padding: "0 0 16px" }}>
          <button type="button"
            onClick={() => navigate("/home")}
            style={{ width: "100%", padding: 16, borderRadius: "var(--r-md)", background: "var(--tp-rojo)", color: "var(--tp-crema)", border: "none", cursor: "pointer", fontFamily: "var(--fuente)", fontSize: 15, fontWeight: 700 }}>
            Volver a la pantalla de inicio
          </button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }
}