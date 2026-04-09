import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./CalificacionS.module.css";
import { IconoVolver } from "./Iconos";
import {
  Clock,
  Star,
  MessageCircle,
  CreditCard,
  Handshake,
  AlertTriangle,
  Lock,
  BarChart2,
} from "lucide-react";
import NavInferiorS from "./NavInferiorS";

const ASPECTOS = [
  { id: "puntualidad", label: "Puntualidad", Icono: Clock },
  { id: "comunicacion", label: "Comunicación", Icono: MessageCircle },
  { id: "pago", label: "Pago en tiempo", Icono: CreditCard },
  { id: "trato", label: "Trato", Icono: Handshake },
];

const TAGS_POSITIVOS = [
  "Puntual al pagar",
  "Claro con el trabajo",
  "Buen trato",
  "Volvería a trabajar",
  "Fácil de coordinar",
  "Disponible y comunicativo",
];
const TAGS_NEGATIVOS = [
  "Tardó en pagar",
  "Poca comunicación",
  "Cambió condiciones",
  "Difícil de contactar",
];

function calcularRating(general, aspectos) {
  if (!general) return 0;
  const pun = aspectos.puntualidad || general;
  const com = aspectos.comunicacion || general;
  const pag = aspectos.pago || general;
  const tra = aspectos.trato || general;
  return (
    Math.round(
      (0.8 * general + 0.05 * pun + 0.05 * com + 0.05 * pag + 0.05 * tra) * 10,
    ) / 10
  );
}

function Estrellas({ valor, onChange, size = "normal" }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={styles.estrellasRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.estrella} ${
            size === "grande"
              ? styles.estrellaGrande
              : size === "pequena"
                ? styles.estrellaPequena
                : ""
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

export default function CalificacionS() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const usuNombre = searchParams.get("usuNombre")
    ? decodeURIComponent(searchParams.get("usuNombre"))
    : "Laura Pérez";
  const usuInicial = searchParams.get("usuInicial") || "L";
  const usuColor = searchParams.get("usuColor")
    ? decodeURIComponent(searchParams.get("usuColor"))
    : "#2A7D5A";
  const trabajoId = searchParams.get("trabajoId") || "1";

  const [estrellasPrincipal, setEstrellasPrincipal] = useState(0);
  const [estrellasAspectos, setEstrellasAspectos] = useState({
    puntualidad: 0,
    comunicacion: 0,
    pago: 0,
    trato: 0,
  });
  const [tagsSeleccionados, setTagsSeleccionados] = useState([]);
  const [comentario, setComentario] = useState("");
  const [estado, setEstado] = useState("formulario");

  const rating = calcularRating(estrellasPrincipal, estrellasAspectos);
  const textoEstrellas = [
    "",
    "Malo",
    "Regular",
    "Bueno",
    "Muy bueno",
    "Excelente",
  ];

  function toggleTag(t) {
    setTagsSeleccionados((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }
  function enviarCalificacion() {
    if (!estrellasPrincipal) return;
    setEstado("enviando");
    setTimeout(() => setEstado("completado"), 2000);
  }

  // ── ENVIANDO ──
  if (estado === "enviando") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.enviandoBloque}>
          <div className={styles.enviandoSpinner} />
          <p className={styles.enviandoTexto}>Enviando calificación...</p>
        </div>
      </div>
    );
  }

  // ── COMPLETADO ──
  if (estado === "completado") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.completadoBloque}>
          <div className={styles.completadoCirculo}>
            <Star size={32} />
          </div>
          <h2 className={styles.completadoTitulo}>¡Gracias por calificar!</h2>
          <p className={styles.completadoDesc}>
            Tu opinión contribuye a la comunidad de TeePee.
          </p>
          <div className={styles.completadoResumen}>
            <div className={styles.completadoCliente}>
              <div
                className={styles.completadoAvatar}
                style={{ background: usuColor }}
              >
                {usuInicial}
              </div>
              <div>
                <p className={styles.completadoNombre}>{usuNombre}</p>
                <div className={styles.completadoEstrellas}>
                  {"⭐".repeat(estrellasPrincipal)}
                  {"☆".repeat(5 - estrellasPrincipal)}
                </div>
              </div>
            </div>
            {comentario.trim() && (
              <div className={styles.completadoComentario}>"{comentario}"</div>
            )}
            {tagsSeleccionados.length > 0 && (
              <div className={styles.completadoTags}>
                {tagsSeleccionados.map((t) => (
                  <span key={t} className={styles.completadoTag}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.impactoCard}>
            <span className={styles.impactoIcono}>
              <BarChart2 size={20} />
            </span>
            <div>
              <p className={styles.impactoTitulo}>
                Puntaje calculado para {usuNombre.split(" ")[0]}
              </p>
              <p className={styles.impactoDesc}>
                ⭐ {rating} · Se publicará cuando ambos se califiquen
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.btnInicio}
            onClick={() => navigate("/trabajos-s")}
          >
            Volver a mis trabajos →
          </button>
        </div>
      </div>
    );
  }

  // ── FORMULARIO ──
  return (
    <div className={styles.pantalla}>
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Calificar al cliente</span>
        <button className={styles.btnSaltear} onClick={() => navigate(-1)}>
          Omitir
        </button>
      </header>

      <main className={styles.contenido}>
        {/* Resumen del cliente */}
        <section className={styles.trabajoCard}>
          <div
            className={styles.trabajoAvatar}
            style={{ background: usuColor }}
          >
            {usuInicial}
          </div>
          <div className={styles.trabajoInfo}>
            <p className={styles.trabajoNombre}>{usuNombre}</p>
            <p className={styles.trabajoOficio}>
              Cliente · Trabajo #{trabajoId}
            </p>
          </div>
        </section>

        {/* Calificación principal */}
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>
            ¿Cómo fue trabajar con {usuNombre.split(" ")[0]}?
          </h2>
          <div className={styles.principalBloque}>
            <Estrellas
              valor={estrellasPrincipal}
              onChange={setEstrellasPrincipal}
              size="grande"
            />
            {estrellasPrincipal > 0 && (
              <p className={styles.textoEstrellas}>
                {textoEstrellas[estrellasPrincipal]}
              </p>
            )}
          </div>
        </section>

        {/* Aspectos */}
        {estrellasPrincipal > 0 && (
          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Calificá cada aspecto</h2>
            <div className={styles.aspectosLista}>
              {ASPECTOS.map((asp) => (
                <div key={asp.id} className={styles.aspectoFila}>
                  <div className={styles.aspectoLabel}>
                    <asp.Icono size={15} className={styles.aspectoIcono} />
                    <span className={styles.aspectoNombre}>{asp.label}</span>
                  </div>
                  <div className={styles.aspectoEstrellaWrapper}>
                    <Estrellas
                      valor={estrellasAspectos[asp.id]}
                      size="pequena"
                      onChange={(val) =>
                        setEstrellasAspectos((prev) => ({
                          ...prev,
                          [asp.id]: val,
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            {rating > 0 && (
              <div className={styles.ratingCalculado}>
                <span className={styles.ratingCalculadoLabel}>
                  Puntaje calculado:
                </span>
                <span className={styles.ratingCalculadoValor}>⭐ {rating}</span>
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
                {TAGS_POSITIVOS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.tag} ${tagsSeleccionados.includes(t) ? styles.tagPositivoActivo : ""}`}
                    onClick={() => toggleTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {estrellasPrincipal <= 3 && (
                <>
                  <p className={styles.tagsSubtitulo}>A mejorar</p>
                  <div className={styles.tagsGrid}>
                    {TAGS_NEGATIVOS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`${styles.tag} ${tagsSeleccionados.includes(t) ? styles.tagNegativoActivo : ""}`}
                        onClick={() => toggleTag(t)}
                      >
                        {t}
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
            <textarea
              className={styles.textarea}
              placeholder="Contá cómo fue trabajar con este cliente..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              maxLength={300}
            />
            <span className={styles.contador}>{comentario.length}/300</span>
          </section>
        )}

        {/* Aviso */}
        {estrellasPrincipal > 0 && (
          <div className={styles.avisoPublicacion}>
            <AlertTriangle size={14} className={styles.avisoIcono} />
            <p className={styles.avisoTexto}>
              Tu calificación afectará la visibilidad del cliente en TeePee.
            </p>
          </div>
        )}

        {/* Botón enviar */}
        <div className={styles.enviarBloque}>
          {estrellasPrincipal > 0 && (
            <p className={styles.notaMutua}>
              <Lock size={11} className={styles.notaIcono} />
              La calificación se publicará una vez que ambos se califiquen
              mutuamente.
            </p>
          )}
          <button
            type="button"
            className={`${styles.btnEnviar} ${!estrellasPrincipal ? styles.btnEnviarDesactivado : ""}`}
            onClick={enviarCalificacion}
            disabled={!estrellasPrincipal}
          >
            {!estrellasPrincipal ? (
              "Elegí una calificación"
            ) : (
              <>
                <Star size={15} /> Enviar calificación{" "}
              </>
            )}
          </button>
        </div>
      </main>

      <NavInferiorS />
    </div>
  );
}
