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
  { id: 1, icono: <IconoPlomeria size={24} />, nombre: "Plomería" },
  { id: 2, icono: <Zap size={24} />, nombre: "Electricidad" },
  { id: 3, icono: <IconoGas size={24} />, nombre: "Gas" },
  { id: 4, icono: <IconoPintura size={24} />, nombre: "Pintura" },
  { id: 5, icono: <IconoAireAcond size={24} />, nombre: "Aire Acond." },
  { id: 6, icono: <IconoCarpinteria size={24} />, nombre: "Carpintería" },
  { id: 7, icono: <IconoLimpieza size={24} />, nombre: "Limpieza" },
  { id: 8, icono: <Hammer size={24} />, nombre: "Albañilería" },
];

const URGENCIA_OPCIONES = [
  {
    id: "normal",
    icono: <IconoCalendario size={20} />,
    titulo: "Normal",
    desc: "En los próximos días",
    extra: "",
  },
  {
    id: "hoy",
    icono: <Clock size={20} />,
    titulo: "Hoy",
    desc: "Lo antes posible hoy",
    extra: "+5%",
  },
  {
    id: "urgente",
    icono: <IconoAlerta size={20} />,
    titulo: "Urgente",
    desc: "En menos de 2 horas",
    extra: "+10%",
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
    id: 3,
    nombre: "Miguel Torres",
    inicial: "M",
    oficio: "Plomero",
    nivel: "Bronce",
    nivelIcono: "🥉",
    reputacion: 4.5,
    trabajos: 23,
    distancia: "3.5 km",
    tiempoRespuesta: "~40 min",
    precio: "$12.000 - $22.000",
    disponible: true,
    garantia: "Sin garantía",
    tags: ["Nuevo", "Económico"],
  },
];

export default function Busqueda() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pasoInicial = Number(searchParams.get("paso")) || 1;
  const [paso, setPaso] = useState(pasoInicial);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [urgencia, setUrgencia] = useState("normal");
  const [buscando, setBuscando] = useState(false);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [toast, setToast] = useState(null);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2500);
  }

  function irAPaso2() {
    if (!categoriaSeleccionada) {
      mostrarToast("⚠️ Elegí una categoría primero");
      return;
    }
    if (!descripcion.trim()) {
      mostrarToast("⚠️ Describí lo que necesitás");
      return;
    }
    setPaso(2);
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
      fetch('/api/matching?categoria=plomeria&lat=...&lng=...')
      Por ahora simulamos el delay con setTimeout.
    */
  }

  const categoriaActual = CATEGORIAS.find(
    (c) => c.id === categoriaSeleccionada,
  );

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

          {/* Categorías */}
          <section>
            <p className={styles.campoLabel}>Categoría</p>
            <div className={styles.categoriasGrid}>
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.categoriaBtn} ${
                    categoriaSeleccionada === cat.id
                      ? styles.categoriaBtnActiva
                      : ""
                  }`}
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                >
                  <span className={styles.categoriaBtnIcono}>{cat.icono}</span>
                  <span className={styles.categoriaBtnNombre}>
                    {cat.nombre}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Descripción */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>Describí el problema</p>
            <textarea
              className={styles.textarea}
              placeholder="Ej: Tengo una pérdida de agua debajo de la pileta de la cocina. Hace 2 días que gotea y manchó el mueble..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
            />
            <span className={styles.textareaContador}>
              {descripcion.length}/300
            </span>
          </section>

          {/* Fotos */}
          <section className={styles.campoBloque}>
            <p className={styles.campoLabel}>
              Fotos del problema{" "}
              <span className={styles.opcional}>(opcional)</span>
            </p>
            <button
              type="button"
              className={styles.btnFotos}
              onClick={() => mostrarToast("Función disponible en la app móvil")}
            >
              <span className={styles.btnFotosIcono}>
                <IconoCamara size={20} className={styles.btnFotosIcono} />
              </span>
              <span className={styles.btnFotosTexto}>Agregar fotos</span>
              <span className={styles.btnFotosSub}>
                Ayuda a obtener presupuestos más precisos
              </span>
            </button>
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

          {/* Resumen paso 1 */}
          <div className={styles.resumenPaso1}>
            <span className={styles.resumenIcono}>
              {categoriaActual?.icono}
            </span>
            <div className={styles.resumenTexto}>
              <span className={styles.resumenCategoria}>
                {categoriaActual?.nombre}
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
            <div className={styles.urgenciaOpciones}>
              {URGENCIA_OPCIONES.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  className={`${styles.urgenciaBtn} ${
                    urgencia === op.id ? styles.urgenciaBtnActiva : ""
                  }`}
                  onClick={() => setUrgencia(op.id)}
                >
                  <span className={styles.urgenciaBtnIcono}>{op.icono}</span>
                  <span className={styles.urgenciaBtnTitulo}>{op.titulo}</span>
                  <span className={styles.urgenciaBtnDesc}>{op.desc}</span>
                  {op.extra && (
                    <span className={styles.urgenciaBtnExtra}>{op.extra}</span>
                  )}
                </button>
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
              ¿Cuándo podés recibir al profesional?
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
            {[
              { dia: "Lunes", id: "lun" },
              { dia: "Martes", id: "mar" },
              { dia: "Miércoles", id: "mie" },
              { dia: "Jueves", id: "jue" },
              { dia: "Viernes", id: "vie" },
              { dia: "Sábado", id: "sab" },
              { dia: "Domingo", id: "dom" },
            ].map((fila) => (
              <div key={fila.id} className={styles.disponibilidadFila}>
                <span className={styles.disponibilidadDia}>{fila.dia}</span>

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

                {/* Hora puntual por día */}
                <input
                  type="time"
                  className={styles.horaPuntual}
                  placeholder="hora exacta"
                  onChange={() => {}}
                />
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

  // ── PASO 3: Resultados del matching ──
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

          {/* Resultado del matching */}
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
                {/* Badge "Mejor match" para el primero */}
                {index === 0 && (
                  <div className={styles.mejorMatchBadge}>
                    ⭐ Mejor match para vos
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
                    onClick={() => navigate(`/chat?solId=${sol.id}&nombre=${encodeURIComponent(sol.nombre)}&inicial=${sol.inicial}&oficio=${encodeURIComponent(sol.oficio)}&desde=busqueda`)}
                  >
                    Contactar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {toast && <div className={styles.toast}>{toast}</div>}
        <NavInferior />
      </div>
    );
  }
}