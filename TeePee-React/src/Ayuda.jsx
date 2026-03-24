import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferior from "./NavInferior";
import { IconoVolver } from "./Iconos";

const SECCIONES = [
  {
    id: "cuenta",
    titulo: "Mi cuenta",
    icono: "👤",
    preguntas: [
      { p: "¿Cómo cambio mi contraseña?", r: "Ingresá a tu perfil → tocá 'Editar datos' → 'Cambiar contraseña'. Te vamos a pedir la contraseña actual y la nueva." },
      { p: "¿Puedo tener los dos modos (usuario y solucionador)?", r: "Sí. Desde el avatar en el header podés activar el modo solucionador completando tus datos profesionales. Una vez activado, podés switchear entre ambos modos cuando quieras." },
      { p: "¿Cómo elimino mi cuenta?", r: "Escribinos a soporte@teepee.app con el asunto 'Eliminar cuenta' desde el email registrado. Lo procesamos en 72 hs hábiles." },
    ],
  },
  {
    id: "servicios",
    titulo: "Solicitar servicios",
    icono: "🔍",
    preguntas: [
      { p: "¿Cómo solicito un servicio?", r: "Desde el home tocá 'Solicitar Servicio', elegí la categoría, describí el problema y confirmá. El sistema busca solucionadores disponibles cerca tuyo." },
      { p: "¿Cuánto tarda en aparecer un solucionador?", r: "En promedio 5-15 minutos en horario pico. Podés ver el estado en tiempo real desde 'Trabajos'." },
      { p: "¿Puedo cancelar un servicio?", r: "Sí, pero depende del estado del trabajo. Si el solucionador aún no confirmó, la cancelación es sin costo. Ver política completa en Cancelaciones." },
      { p: "¿Qué significa cada etapa del trabajo?", r: "Etapa 1: Confirmado. Etapa 2: En camino / Iniciado. Etapa 3: Terminado pendiente confirmación. Al confirmar vos, el pago se libera al solucionador." },
    ],
  },
  {
    id: "pagos",
    titulo: "Pagos y presupuestos",
    icono: "💳",
    preguntas: [
      { p: "¿Cómo funciona el sistema de pago?", r: "TeePee usa escrow: el pago queda retenido cuando confirmás el trabajo. Recién se libera al solucionador cuando vos confirmás que el trabajo quedó bien." },
      { p: "¿Qué pasa si no estoy conforme?", r: "Tenés 24 hs para abrir una disputa desde que el solucionador marca el trabajo como terminado. Un mediador de TeePee interviene y resuelve en 48 hs." },
      { p: "¿Cuánto cobra TeePee de comisión?", r: "Entre 6% y 10% sobre el valor del trabajo, según el nivel del solucionador. Esta comisión la paga el solucionador, no el usuario." },
      { p: "¿Puedo pedir factura?", r: "Sí. Desde 'Trabajos' → detalle del trabajo → 'Solicitar comprobante'. Disponible para pagos completados." },
    ],
  },
  {
    id: "solucionadores",
    titulo: "Sobre los solucionadores",
    icono: "🔧",
    preguntas: [
      { p: "¿Los solucionadores están verificados?", r: "Sí. Todos pasan por verificación de identidad y antecedentes antes de poder ofrecer servicios. Los de nivel Élite tienen certificaciones adicionales." },
      { p: "¿Puedo elegir con qué solucionador trabajar?", r: "Sí. Podés elegir de la lista de candidatos que el sistema te muestra, filtrando por calificación, precio y disponibilidad." },
      { p: "¿Cómo califico a un solucionador?", r: "Cuando el trabajo se completa, aparece una notificación para calificarlo. También podés hacerlo desde 'Trabajos' → detalle → 'Calificar'." },
    ],
  },
  {
    id: "tecnico",
    titulo: "Problemas técnicos",
    icono: "⚙️",
    preguntas: [
      { p: "La app no carga, ¿qué hago?", r: "Cerrá y volvé a abrir la app. Si el problema persiste, limpiá el caché del navegador o escribinos a soporte@teepee.app." },
      { p: "No recibí el email de verificación", r: "Revisá la carpeta de spam. Si no aparece, en la pantalla de login tocá 'Reenviar email de verificación'." },
      { p: "¿Cómo contacto al soporte?", r: "Por email a soporte@teepee.app (respuesta en 24 hs hábiles) o por WhatsApp al +54 376 XXX-XXXX en horario de 8 a 20 hs." },
    ],
  },
];

export default function Ayuda() {
  const navigate = useNavigate();
  const [seccionAbierta, setSeccionAbierta] = useState(null);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  return (
    <div style={{ background: "var(--tp-crema)", minHeight: "100vh", fontFamily: "var(--fuente)" }}>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)",
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer" }}>
          <IconoVolver size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>Centro de ayuda</h1>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>Preguntas frecuentes</p>
        </div>
      </header>

      {/* Bienvenida */}
      <div style={{ padding: "20px 16px 8px" }}>
        <div style={{
          background: "var(--tp-rojo-suave)", borderRadius: "var(--r-lg)",
          padding: "16px", display: "flex", gap: 12, alignItems: "center",
        }}>
          <span style={{ fontSize: 28 }}>💬</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>¿En qué te podemos ayudar?</p>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: "2px 0 0" }}>Encontrá respuestas a las dudas más frecuentes</p>
          </div>
        </div>
      </div>

      {/* Secciones */}
      <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {SECCIONES.map((sec) => (
          <div key={sec.id} style={{
            background: "var(--tp-crema-clara)",
            border: "1px solid rgba(61,31,31,0.08)",
            borderRadius: "var(--r-md)", overflow: "hidden",
          }}>
            {/* Header sección */}
            <button
              type="button"
              onClick={() => {
                setSeccionAbierta(seccionAbierta === sec.id ? null : sec.id);
                setPreguntaAbierta(null);
              }}
              style={{
                width: "100%", padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 10,
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--fuente)",
              }}
            >
              <span style={{ fontSize: 20 }}>{sec.icono}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--tp-marron)", flex: 1, textAlign: "left" }}>
                {sec.titulo}
              </span>
              <span style={{
                fontSize: 18, color: "var(--tp-marron-suave)",
                transform: seccionAbierta === sec.id ? "rotate(90deg)" : "none",
                transition: "transform 0.2s",
              }}>›</span>
            </button>

            {/* Preguntas */}
            {seccionAbierta === sec.id && (
              <div style={{ borderTop: "1px solid rgba(61,31,31,0.06)" }}>
                {sec.preguntas.map((item, i) => (
                  <div key={i} style={{ borderBottom: i < sec.preguntas.length - 1 ? "1px solid rgba(61,31,31,0.06)" : "none" }}>
                    <button
                      type="button"
                      onClick={() => setPreguntaAbierta(preguntaAbierta === `${sec.id}-${i}` ? null : `${sec.id}-${i}`)}
                      style={{
                        width: "100%", padding: "12px 16px",
                        display: "flex", alignItems: "flex-start", gap: 8,
                        background: preguntaAbierta === `${sec.id}-${i}` ? "rgba(61,31,31,0.03)" : "none",
                        border: "none", cursor: "pointer", fontFamily: "var(--fuente)",
                      }}
                    >
                      <span style={{ fontSize: 14, color: "var(--tp-rojo)", flexShrink: 0, marginTop: 1 }}>›</span>
                      <span style={{ fontSize: 13, color: "var(--tp-marron)", textAlign: "left", flex: 1 }}>{item.p}</span>
                      <span style={{
                        fontSize: 14, color: "var(--tp-marron-suave)", flexShrink: 0,
                        transform: preguntaAbierta === `${sec.id}-${i}` ? "rotate(90deg)" : "none",
                        transition: "transform 0.2s",
                      }}>›</span>
                    </button>

                    {preguntaAbierta === `${sec.id}-${i}` && (
                      <div style={{ padding: "0 16px 14px 36px" }}>
                        <div style={{
                          display: "flex", gap: 8, alignItems: "flex-start",
                        }}>
                          <span style={{ fontSize: 12, color: "var(--verde)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>R</span>
                          <p style={{ fontSize: 13, color: "var(--tp-marron-suave)", margin: 0, lineHeight: 1.6 }}>{item.r}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contacto directo */}
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{
          background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)",
          border: "1px solid rgba(61,31,31,0.08)", padding: "16px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>¿No encontraste tu respuesta?</p>
          <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>Nuestro equipo responde en menos de 24 hs hábiles.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              flex: 1, padding: "10px", borderRadius: "var(--r-sm)",
              background: "var(--tp-rojo)", color: "var(--tp-crema)",
              border: "none", cursor: "pointer", fontFamily: "var(--fuente)",
              fontSize: 12, fontWeight: 700,
            }}>
              📧 Email
            </button>
            <button style={{
              flex: 1, padding: "10px", borderRadius: "var(--r-sm)",
              background: "var(--verde)", color: "white",
              border: "none", cursor: "pointer", fontFamily: "var(--fuente)",
              fontSize: 12, fontWeight: 700,
            }}>
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>

      <NavInferior />
    </div>
  );
}