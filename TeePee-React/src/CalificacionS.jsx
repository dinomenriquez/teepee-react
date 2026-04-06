import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IconoVolver } from "./Iconos";
import { Star } from "lucide-react";
import NavInferiorS from "./NavInferiorS";

const ASPECTOS = [
  { id: "puntualidad", label: "Puntualidad", icono: "⏰" },
  { id: "comunicacion", label: "Comunicación", icono: "💬" },
  { id: "pago", label: "Pago en tiempo", icono: "💳" },
  { id: "trato", label: "Trato", icono: "🤝" },
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

function Estrellas({ valor, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 28,
            padding: 0,
            color: n <= (hover || valor) ? "#F5C842" : "rgba(61,31,31,0.15)",
          }}
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
  const [estrellasAspectos, setEstrellasAspectos] = useState({});
  const [tagsSelect, setTagsSelect] = useState([]);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  // Fórmula: 80% general + 5% cada aspecto
  function calcularRating(general, aspectos) {
    if (!general) return 0;
    const pun = aspectos.puntualidad || general;
    const com = aspectos.comunicacion || general;
    const pag = aspectos.pago || general;
    const tra = aspectos.trato || general;
    return (
      Math.round(
        (0.8 * general + 0.05 * pun + 0.05 * com + 0.05 * pag + 0.05 * tra) *
          10,
      ) / 10
    );
  }

  const rating = calcularRating(estrellasPrincipal, estrellasAspectos);
  const textos = ["", "Muy mal", "Regular", "Bien", "Muy bien", "Excelente"];

  function toggleTag(t) {
    setTagsSelect((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  if (enviado) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--verde)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          fontFamily: "var(--fuente)",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>⭐</div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "white",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          ¡Calificación enviada!
        </p>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.80)",
            margin: "0 0 6px",
            textAlign: "center",
          }}
        >
          Calificaste a {usuNombre}
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "white",
            margin: "0 0 8px",
          }}
        >
          ⭐ {rating}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.65)",
            margin: "0 0 32px",
            textAlign: "center",
          }}
        >
          La calificación será pública una vez que ambos se califiquen
          mutuamente.
        </p>
        <button
          type="button"
          onClick={() => navigate("/trabajos-s")}
          style={{
            padding: "14px 32px",
            borderRadius: "var(--r-full)",
            background: "white",
            color: "var(--verde)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--fuente)",
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          Volver a mis trabajos →
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--tp-crema)",
        fontFamily: "var(--fuente)",
        paddingBottom: 80,
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--tp-crema)",
          borderBottom: "1px solid rgba(61,31,31,0.08)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <IconoVolver size={20} />
        </button>
        <p
          style={{
            fontSize: 16,
            fontWeight: 900,
            color: "var(--tp-marron)",
            margin: 0,
          }}
        >
          Calificar al cliente
        </p>
      </header>

      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Cliente */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderRadius: "var(--r-lg)",
            background: "var(--tp-crema-clara)",
            border: "1px solid rgba(61,31,31,0.08)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: usuColor,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {usuInicial}
          </div>
          <div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--tp-marron)",
                margin: 0,
              }}
            >
              {usuNombre}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--tp-marron-suave)",
                margin: 0,
              }}
            >
              Cliente
            </p>
          </div>
        </div>

        {/* Calificación general */}
        <div
          style={{
            background: "var(--tp-crema-clara)",
            borderRadius: "var(--r-lg)",
            padding: 20,
            border: "1px solid rgba(61,31,31,0.08)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--tp-marron)",
              margin: "0 0 12px",
            }}
          >
            ¿Cómo fue trabajar con {usuNombre.split(" ")[0]}?
          </p>
          <Estrellas
            valor={estrellasPrincipal}
            onChange={setEstrellasPrincipal}
          />
          {estrellasPrincipal > 0 && (
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--tp-rojo)",
                margin: "8px 0 0",
              }}
            >
              {textos[estrellasPrincipal]}
            </p>
          )}
        </div>

        {/* Aspectos */}
        {estrellasPrincipal > 0 && (
          <div
            style={{
              background: "var(--tp-crema-clara)",
              borderRadius: "var(--r-lg)",
              padding: 16,
              border: "1px solid rgba(61,31,31,0.08)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--tp-marron-suave)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 12px",
              }}
            >
              Aspectos específicos
            </p>
            {ASPECTOS.map((asp) => (
              <div
                key={asp.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 13, color: "var(--tp-marron)" }}>
                  {asp.icono} {asp.label}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setEstrellasAspectos((prev) => ({
                          ...prev,
                          [asp.id]: n,
                        }))
                      }
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: 20,
                        padding: 0,
                        color:
                          n <= (estrellasAspectos[asp.id] || 0)
                            ? "#F5C842"
                            : "rgba(61,31,31,0.15)",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Rating calculado */}
            {rating > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 8,
                  padding: "8px 16px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(61,31,31,0.06)",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--tp-marron-suave)" }}>
                  Puntaje calculado:
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "var(--tp-marron)",
                  }}
                >
                  ⭐ {rating}
                </span>
                <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>
                  /5
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {estrellasPrincipal > 0 && (
          <div
            style={{
              background: "var(--tp-crema-clara)",
              borderRadius: "var(--r-lg)",
              padding: 16,
              border: "1px solid rgba(61,31,31,0.08)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--tp-marron-suave)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 10px",
              }}
            >
              {estrellasPrincipal >= 4 ? "¿Qué destacás?" : "¿Qué mejorarías?"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(estrellasPrincipal >= 4 ? TAGS_POSITIVOS : TAGS_NEGATIVOS).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--r-full)",
                      border: tagsSelect.includes(t)
                        ? "none"
                        : "1px solid rgba(61,31,31,0.15)",
                      background: tagsSelect.includes(t)
                        ? "var(--tp-marron)"
                        : "none",
                      color: tagsSelect.includes(t)
                        ? "var(--tp-crema)"
                        : "var(--tp-marron)",
                      fontFamily: "var(--fuente)",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: tagsSelect.includes(t) ? 700 : 400,
                    }}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Comentario */}
        {estrellasPrincipal > 0 && (
          <div
            style={{
              background: "var(--tp-crema-clara)",
              borderRadius: "var(--r-lg)",
              padding: 16,
              border: "1px solid rgba(61,31,31,0.08)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--tp-marron-suave)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 8px",
              }}
            >
              Comentario (opcional)
            </p>
            <textarea
              placeholder="Contá cómo fue la experiencia..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                fontSize: 13,
                color: "var(--tp-marron)",
                border: "none",
                background: "none",
                outline: "none",
                fontFamily: "var(--fuente)",
                resize: "none",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Nota: publicación mutua */}
        {estrellasPrincipal > 0 && (
          <p
            style={{
              fontSize: 11,
              color: "var(--tp-marron-suave)",
              textAlign: "center",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            🔒 La calificación se publicará una vez que ambos se califiquen
            mutuamente.
          </p>
        )}

        {/* Enviar */}
        <button
          type="button"
          disabled={!estrellasPrincipal}
          onClick={() => setEnviado(true)}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: "var(--r-md)",
            border: "none",
            cursor: estrellasPrincipal ? "pointer" : "not-allowed",
            fontFamily: "var(--fuente)",
            fontSize: 15,
            fontWeight: 800,
            background: estrellasPrincipal
              ? "var(--tp-rojo)"
              : "rgba(61,31,31,0.12)",
            color: estrellasPrincipal
              ? "var(--tp-crema)"
              : "var(--tp-marron-suave)",
          }}
        >
          Enviar calificación
        </button>
      </div>

      <NavInferiorS />
    </div>
  );
}
