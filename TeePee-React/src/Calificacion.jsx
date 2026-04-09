import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferior from "./NavInferior";
import { CALIFICACIONES_PENDIENTES, getSolucionador, TRABAJOS } from "./MockData";
import styles from "./Calificacion.module.css";
import { IconoVolver } from "./Iconos";
import {
  Clock, Star, MessageCircle, Sparkles,
  BarChart2, AlertTriangle, Lock,
} from "lucide-react";

const TRABAJO = {
  titulo: "Tablero eléctrico",
  monto: "$32.000",
  fecha: "Hoy, 7 de marzo",
};

const SOLUCIONADOR = {
  nombre: "Juan Ledesma",
  inicial: "J",
  oficio: "Electricista",
  nivel: "🥇",
};

const ASPECTOS = [
  { id: "puntualidad",  icono: <Clock size={16} />,         label: "Puntualidad" },
  { id: "calidad",      icono: <Star size={16} />,          label: "Calidad" },
  { id: "comunicacion", icono: <MessageCircle size={16} />, label: "Comunicación" },
  { id: "limpieza",     icono: <Sparkles size={16} />,      label: "Limpieza" },
];

const TAGS_POSITIVOS = [
  "Puntual", "Prolijo", "Profesional", "Recomendable",
  "Rápido", "Buen precio", "Explicó todo", "Volvería a contratar",
];

const TAGS_NEGATIVOS = [
  "Llegó tarde", "Precio alto", "Dejó sucio", "Poca comunicación",
];

function Estrellas({ valor, onChange, size = "normal" }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={styles.estrellasRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          className={`${styles.estrella} ${
            size === "grande" ? styles.estrellaGrande :
            size === "pequena" ? styles.estrellaPequena : ""
          } ${n <= (hover || valor) ? styles.estrellaActiva : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Calificacion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const solNombreParam  = searchParams.get("solNombre");
  const solOficioParam  = searchParams.get("solOficio");
  const solInicialParam = searchParams.get("solInicial");
  const solNivelParam   = searchParams.get("solNivel");

  const trabajoDesdeParams = solNombreParam ? {
    solucionador: {
      nombre:  decodeURIComponent(solNombreParam),
      oficio:  solOficioParam  ? decodeURIComponent(solOficioParam)  : "Solucionador",
      inicial: solInicialParam || decodeURIComponent(solNombreParam).charAt(0),
      nivel:   solNivelParam   ? decodeURIComponent(solNivelParam)   : "🥇",
    },
    descripcion: "Trabajo completado",
    fecha: "Hoy",
  } : null;

  const [trabajoActivo, setTrabajoActivo] = useState(trabajoDesdeParams);
  const [estrellasPrincipal, setEstrellasPrincipal] = useState(0);

  const calcularRating = (general, aspectos) => {
    if (!general) return 0;
    const cal = aspectos.calidad      || general;
    const pun = aspectos.puntualidad  || general;
    const com = aspectos.comunicacion || general;
    const lim = aspectos.limpieza     || general;
    return Math.round((0.80 * general + 0.05 * cal + 0.05 * pun + 0.05 * com + 0.05 * lim) * 10) / 10;
  };

  const [estrellasAspectos, setEstrellasAspectos] = useState({
    puntualidad: 0, calidad: 0, comunicacion: 0, limpieza: 0,
  });
  const [tagsSeleccionados, setTagsSeleccionados] = useState([]);
  const [comentario, setComentario] = useState("");
  const [estado, setEstado] = useState("formulario");
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  function toggleTag(tag) {
    setTagsSeleccionados(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  // ── VISTA: LISTA DE PENDIENTES ──
  if (!trabajoActivo) {
    const pendientes = CALIFICACIONES_PENDIENTES.map(c => ({
      ...c,
      solucionador: getSolucionador(c.solucionadorId),
      trabajo: TRABAJOS.find(t => t.id === c.trabajoId),
    }));

    return (
      <div className={styles.pantalla}>
        <header className={styles.header}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <div>
            <h1 className={styles.headerTitulo}>Calificaciones</h1>
            <p className={styles.headerSub}>
              {pendientes.length} {pendientes.length === 1 ? "trabajo pendiente" : "trabajos pendientes"}
            </p>
          </div>
        </header>

        <div className={styles.listaPendientes}>
          {pendientes.length === 0 ? (
            <div className={styles.listaVacia}>
              <Star size={40} className={styles.listaVaciaIcono} />
              <p className={styles.listaVaciaTitulo}>Todo calificado</p>
              <p className={styles.listaVaciaSub}>No tenés calificaciones pendientes</p>
            </div>
          ) : pendientes.map((item) => (
            <button key={item.id} type="button"
              className={styles.pendienteCard}
              onClick={() => setTrabajoActivo(item)}
            >
              <div
                className={styles.pendienteAvatar}
                style={{ background: item.solucionador?.color || "var(--tp-rojo)" }}
              >
                {item.solucionador?.inicial || "?"}
              </div>
              <div className={styles.pendienteInfo}>
                <div className={styles.pendienteInfoTop}>
                  <span className={styles.pendienteNombre}>
                    {item.solucionador?.nombre || "Solucionador"}
                  </span>
                  <span className={styles.pendienteFecha}>{item.fecha}</span>
                </div>
                <span className={styles.pendienteOficio}>
                  {item.solucionador?.oficio} · {item.trabajo?.descripcion || item.descripcion}
                </span>
                <div className={styles.pendienteBadgeRow}>
                  <span className={styles.pendienteBadge}>
                    <Star size={11} /> Calificar →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <NavInferior />
      </div>
    );
  }

  function enviarCalificacion() {
    if (estrellasPrincipal === 0) { mostrarToast("Elegí al menos una estrella"); return; }
    setEstado("enviando");
    setTimeout(() => setEstado("completado"), 2000);
  }

  const textoEstrellas = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

  // ── PANTALLA: ENVIANDO ──
  if (estado === "enviando") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.enviandoBloque}>
          <div className={styles.enviandoSpinner}></div>
          <p className={styles.enviandoTexto}>Enviando calificación...</p>
        </div>
      </div>
    );
  }

  // ── PANTALLA: COMPLETADO ──
  if (estado === "completado") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.completadoBloque}>
          <div className={styles.completadoCirculo}>
            <Star size={32} />
          </div>
          <h2 className={styles.completadoTitulo}>¡Gracias por calificar!</h2>
          <p className={styles.completadoDesc}>
            Tu opinión ayuda a mantener la calidad de TeePee y ayuda a otros usuarios a elegir mejor.
          </p>
          <div className={styles.completadoResumen}>
            <div className={styles.completadoSolucionador}>
              <div className={styles.completadoAvatar}>
                {trabajoActivo?.solucionador?.inicial || SOLUCIONADOR.inicial}
              </div>
              <div>
                <p className={styles.completadoNombre}>{trabajoActivo?.solucionador?.nombre || SOLUCIONADOR.nombre}</p>
                <div className={styles.completadoEstrellas}>
                  {"⭐".repeat(estrellasPrincipal)}{"☆".repeat(5 - estrellasPrincipal)}
                </div>
              </div>
            </div>
            {comentario.trim() && (
              <div className={styles.completadoComentario}>"{comentario}"</div>
            )}
            {tagsSeleccionados.length > 0 && (
              <div className={styles.completadoTags}>
                {tagsSeleccionados.map(tag => (
                  <span key={tag} className={styles.completadoTag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.impactoCard}>
            <span className={styles.impactoIcono}><BarChart2 size={20} /></span>
            <div>
              <p className={styles.impactoTitulo}>Impacto en la reputación de Juan</p>
              <p className={styles.impactoDesc}>
                Puntaje calculado: ⭐ {calcularRating(estrellasPrincipal, estrellasAspectos)} · Tu calificación actualiza su reputación en tiempo real
              </p>
            </div>
          </div>
          <button type="button" className={styles.btnInicio} onClick={() => navigate("/home")}>
            Volver al inicio
          </button>
          <button type="button" className={styles.btnOtroServicio} onClick={() => navigate("/busqueda")}>
            Solicitar otro servicio →
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
        <button className={styles.btnVolver} onClick={() => solNombreParam ? navigate(-1) : setTrabajoActivo(null)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Calificar servicio</span>
        <button className={styles.btnSaltear} onClick={() => navigate("/home")}>
          Omitir
        </button>
      </header>

      <main className={styles.contenido}>
        {/* Resumen del trabajo */}
        <section className={styles.trabajoCard}>
          <div className={styles.trabajoAvatar}>
            {trabajoActivo?.solucionador?.inicial || SOLUCIONADOR.inicial}
            <span className={styles.trabajoNivel}>{trabajoActivo?.solucionador?.nivel || SOLUCIONADOR.nivel}</span>
          </div>
          <div className={styles.trabajoInfo}>
            <p className={styles.trabajoNombre}>{trabajoActivo?.solucionador?.nombre || SOLUCIONADOR.nombre}</p>
            <p className={styles.trabajoOficio}>
              {trabajoActivo?.solucionador?.oficio || SOLUCIONADOR.oficio} · {trabajoActivo?.trabajo?.descripcion || trabajoActivo?.descripcion || TRABAJO.titulo}
            </p>
            <p className={styles.trabajoFecha}>
              {trabajoActivo?.fecha || TRABAJO.fecha} · {trabajoActivo?.trabajo?.monto || TRABAJO.monto}
            </p>
          </div>
        </section>

        {/* Calificación principal */}
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>¿Cómo fue el trabajo?</h2>
          <div className={styles.principalBloque}>
            <Estrellas valor={estrellasPrincipal} onChange={setEstrellasPrincipal} size="grande" />
            {estrellasPrincipal > 0 && (
              <p className={styles.textoEstrellas}>{textoEstrellas[estrellasPrincipal]}</p>
            )}
          </div>
        </section>

        {/* Aspectos */}
        {estrellasPrincipal > 0 && (
          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Calificá cada aspecto</h2>
            <div className={styles.aspectosLista}>
              {ASPECTOS.map((aspecto) => (
                <div key={aspecto.id} className={styles.aspectoFila}>
                  <div className={styles.aspectoLabel}>
                    <span className={styles.aspectoIcono}>{aspecto.icono}</span>
                    <span className={styles.aspectoNombre}>{aspecto.label}</span>
                  </div>
                  <div className={styles.aspectoEstrellaWrapper}>
                    <Estrellas
                      valor={estrellasAspectos[aspecto.id]}
                      size="pequena"
                      onChange={(val) => setEstrellasAspectos(prev => ({ ...prev, [aspecto.id]: val }))}
                    />
                  </div>
                </div>
              ))}
            </div>
            {calcularRating(estrellasPrincipal, estrellasAspectos) > 0 && (
              <div className={styles.ratingCalculado}>
                <span className={styles.ratingCalculadoLabel}>Puntaje calculado:</span>
                <span className={styles.ratingCalculadoValor}>⭐ {calcularRating(estrellasPrincipal, estrellasAspectos)}</span>
                <span className={styles.ratingCalculadoMax}>/5</span>
              </div>
            )}
          </section>
        )}

        {/* Tags */}
        {estrellasPrincipal > 0 && (
          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>¿Qué destacás?</h2>
            <div className={styles.tagsBloque}>
              <p className={styles.tagsSubtitulo}>Positivo</p>
              <div className={styles.tagsGrid}>
                {TAGS_POSITIVOS.map(tag => (
                  <button key={tag} type="button"
                    className={`${styles.tag} ${tagsSeleccionados.includes(tag) ? styles.tagPositivoActivo : ""}`}
                    onClick={() => toggleTag(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
              {estrellasPrincipal <= 3 && (
                <>
                  <p className={styles.tagsSubtitulo}>A mejorar</p>
                  <div className={styles.tagsGrid}>
                    {TAGS_NEGATIVOS.map(tag => (
                      <button key={tag} type="button"
                        className={`${styles.tag} ${tagsSeleccionados.includes(tag) ? styles.tagNegativoActivo : ""}`}
                        onClick={() => toggleTag(tag)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Comentario */}
        {estrellasPrincipal > 0 && (
          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>
              Comentario <span className={styles.opcional}>(opcional)</span>
            </h2>
            <textarea className={styles.textarea}
              placeholder="Contá tu experiencia para ayudar a otros usuarios..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4} maxLength={300}
            />
            <span className={styles.contador}>{comentario.length}/300</span>
          </section>
        )}

        {/* Aviso publicación */}
        {estrellasPrincipal > 0 && (
          <div className={styles.avisoPublicacion}>
            <AlertTriangle size={14} className={styles.avisoIcono} />
            <p className={styles.avisoTexto}>
              Tu calificación será pública en el perfil de {trabajoActivo?.solucionador?.nombre || SOLUCIONADOR.nombre} y afectará su posición en el posicionamiento en TeePee.
            </p>
          </div>
        )}

        {/* Botón enviar */}
        <div className={styles.enviarBloque}>
          {estrellasPrincipal > 0 && (
            <p className={styles.notaMutua}>
              <Lock size={11} className={styles.notaIcono} />
              La calificación se publicará una vez que ambos se califiquen mutuamente.
            </p>
          )}
          <button type="button"
            className={`${styles.btnEnviar} ${estrellasPrincipal === 0 ? styles.btnEnviarDesactivado : ""}`}
            onClick={enviarCalificacion}
            disabled={estrellasPrincipal === 0}>
            {estrellasPrincipal === 0
              ? "Elegí una calificación"
              : <><Star size={15} /> Enviar calificación</>
            }
          </button>
        </div>
      </main>

      <NavInferior />
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}