import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";

const SECCIONES = [
  {
    id: "inicio",
    titulo: "Empezar en TeePee",
    icono: "🚀",
    preguntas: [
      { p: "¿Cómo completo mi perfil para recibir solicitudes?", r: "Ingresá a 'Mi perfil' desde el menú inferior. Completá tus datos personales, oficio principal, certificaciones, disponibilidad horaria y método de cobro. Un perfil completo al 100% aparece mejor posicionado en las búsquedas." },
      { p: "¿Qué documentos necesito para verificarme?", r: "DNI vigente, foto de perfil real, y según tu oficio: matrícula profesional (electricistas, gasistas), seguro de responsabilidad civil recomendado. Los documentos se verifican en 24-48 hs hábiles." },
      { p: "¿Cuándo empiezo a recibir solicitudes?", r: "Una vez que tu perfil esté verificado y tu estado sea 'Disponible'. Aparecés en los resultados de búsqueda dentro de tu radio de cobertura según tu ubicación." },
      { p: "¿Cómo configuro mi zona de trabajo?", r: "En 'Mi perfil' → 'Datos profesionales' podés definir el radio máximo de distancia que estás dispuesto a cubrir. El sistema solo te mostrará solicitudes dentro de esa zona." },
    ],
  },
  {
    id: "solicitudes",
    titulo: "Solicitudes y presupuestos",
    icono: "📋",
    preguntas: [
      { p: "¿Cómo recibo y acepto solicitudes?", r: "Las solicitudes nuevas aparecen en tu home. Podés ver la descripción del trabajo, la disponibilidad del usuario y el presupuesto estimado. Al tocar 'Ver y cotizar' enviás tu presupuesto formal con monto, tiempo estimado y condiciones." },
      { p: "¿Qué pasa si no respondo una solicitud?", r: "Las solicitudes tienen un tiempo de respuesta esperado según tu nivel. Si no respondés en ese tiempo, la solicitud se reasigna a otro solucionador y afecta tu tasa de respuesta, lo que puede bajar tu posición en el ranking." },
      { p: "¿Puedo rechazar solicitudes?", r: "Sí, sin penalización siempre que lo hagas antes de aceptar. Si rechazás con frecuencia solicitudes del mismo tipo, el sistema puede ajustar las que te llegan. Si estás muy ocupado, cambiá tu estado a 'Ocupado'." },
      { p: "¿Cómo envío un presupuesto?", r: "Desde la solicitud tocá 'Ver y cotizar'. Ingresá el monto, tiempo estimado, qué incluye y qué no, y si ofrecés garantía. El usuario recibe el presupuesto y puede aceptarlo, rechazarlo o pedirte cambios." },
    ],
  },
  {
    id: "trabajos",
    titulo: "Gestión de trabajos",
    icono: "🔧",
    preguntas: [
      { p: "¿Cómo avanzo las etapas de un trabajo?", r: "Desde 'Seguimiento' del trabajo en curso, tocá 'Avanzar etapa' cuando completés cada fase. Las etapas son: Confirmado → En camino → Trabajando → Terminado. El usuario ve el avance en tiempo real." },
      { p: "¿Cómo subo fotos del avance?", r: "En la pantalla de Seguimiento hay una sección 'Fotos del avance'. Podés agregar fotos en cualquier momento durante el trabajo. Se recomienda foto de antes, durante y después." },
      { p: "¿Qué hago si el trabajo requiere más tiempo o materiales?", r: "Antes de avanzar, contactá al usuario por chat y explicá la situación. Podés enviar un presupuesto adicional desde el mismo trabajo. Nunca realices trabajo extra sin el acuerdo del usuario." },
      { p: "¿Cómo cancelo un trabajo ya aceptado?", r: "Desde el trabajo en curso → 'Cancelar trabajo'. Si cancelás antes de iniciar, la devolución al usuario es total. Cancelaciones frecuentes afectan tu nivel y visibilidad. Solo cancelá en casos justificados." },
    ],
  },
  {
    id: "cobros",
    titulo: "Cobros y pagos",
    icono: "💰",
    preguntas: [
      { p: "¿Cuándo recibo mi pago?", r: "El pago está en escrow (retenido) desde que el usuario confirma el trabajo. Se libera automáticamente a tu cuenta cuando el usuario confirma que el trabajo quedó bien, o a las 24 hs si no hay disputa." },
      { p: "¿Cuánto cobra TeePee de comisión?", r: "La comisión depende de tu nivel: Bronce 10%, Plata 8%, Oro 6%, Élite 5%. Se descuenta automáticamente de cada cobro. A mayor nivel, menor comisión." },
      { p: "¿Cómo subo de nivel?", r: "Los niveles se calculan automáticamente cada mes según: trabajos completados, calificación promedio, tasa de respuesta y antigüedad. Podés ver tu progreso en 'Mi perfil' → 'Mi nivel'." },
      { p: "¿Qué métodos de cobro hay disponibles?", r: "Transferencia bancaria (CBU/CVU), MercadoPago y efectivo (registrado en la app). Configurá tu método preferido en 'Mi perfil' → 'Datos de cobro'." },
      { p: "¿Qué pasa si hay una disputa sobre el pago?", r: "Si el usuario abre una disputa, el pago queda retenido hasta que un mediador de TeePee resuelva. El proceso tarda hasta 48 hs hábiles. Tené las fotos del trabajo y el chat como respaldo." },
    ],
  },
  {
    id: "calificaciones",
    titulo: "Calificaciones y reputación",
    icono: "⭐",
    preguntas: [
      { p: "¿Cómo afectan las calificaciones a mi perfil?", r: "Las calificaciones son el principal factor de tu posición en las búsquedas. Una calificación promedio alta te da más visibilidad, mejor nivel y menor comisión. Cada calificación es verificada — solo usuarios que tuvieron un trabajo con vos pueden calificar." },
      { p: "¿Puedo responder a una calificación negativa?", r: "Sí. En 'Mi perfil' → 'Reseñas' podés responder públicamente a cualquier calificación. Una respuesta profesional y empática a una crítica negativa genera confianza en futuros usuarios." },
      { p: "¿Qué puedo hacer si una calificación es injusta?", r: "Si creés que una calificación viola las políticas (falsa, ofensiva, de alguien que no fue tu cliente), podés reportarla desde la misma reseña. TeePee la revisa en 72 hs hábiles." },
    ],
  },
  {
    id: "tecnico",
    titulo: "Problemas técnicos",
    icono: "⚙️",
    preguntas: [
      { p: "No me llegan notificaciones de solicitudes", r: "Verificá que las notificaciones de la app estén habilitadas en tu celular. Además, asegurate de que tu estado sea 'Disponible' y no 'Ocupado'. Si el problema persiste, cerrá y volvé a abrir la app." },
      { p: "¿Cómo cambio mi estado de disponibilidad rápido?", r: "Desde el header de tu home tocá el indicador de estado (el botón con el ícono de color). Podés cambiar entre Disponible, Urgente y Ocupado en un toque." },
      { p: "¿Cómo contacto al soporte?", r: "Por email a soporte@teepee.app (respuesta en 24 hs hábiles) o por WhatsApp al +54 376 XXX-XXXX en horario de 8 a 20 hs." },
    ],
  },
];

export default function AyudaS() {
  const navigate = useNavigate();
  const [seccionAbierta, setSeccionAbierta] = useState(null);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  return (
    <div style={{ background: "var(--tp-crema)", minHeight: "100vh", fontFamily: "var(--fuente)" }}>

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
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>Para solucionadores</p>
        </div>
      </header>

      <div style={{ padding: "20px 16px 8px" }}>
        <div style={{
          background: "var(--verde-suave)", borderRadius: "var(--r-lg)",
          padding: "16px", display: "flex", gap: 12, alignItems: "center",
        }}>
          <span style={{ fontSize: 28 }}>🔧</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>Todo lo que necesitás saber</p>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: "2px 0 0" }}>Guía completa para solucionadores TeePee</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {SECCIONES.map((sec) => (
          <div key={sec.id} style={{
            background: "var(--tp-crema-clara)",
            border: "1px solid rgba(61,31,31,0.08)",
            borderRadius: "var(--r-md)", overflow: "hidden",
          }}>
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
                      <span style={{ fontSize: 12, color: "var(--verde)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>P</span>
                      <span style={{ fontSize: 13, color: "var(--tp-marron)", textAlign: "left", flex: 1 }}>{item.p}</span>
                      <span style={{
                        fontSize: 14, color: "var(--tp-marron-suave)", flexShrink: 0,
                        transform: preguntaAbierta === `${sec.id}-${i}` ? "rotate(90deg)" : "none",
                        transition: "transform 0.2s",
                      }}>›</span>
                    </button>

                    {preguntaAbierta === `${sec.id}-${i}` && (
                      <div style={{ padding: "0 16px 14px 36px" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 14, color: "var(--verde)", flexShrink: 0, marginTop: 1 }}>→</span>
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

      <div style={{ padding: "0 16px 24px" }}>
        <div style={{
          background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)",
          border: "1px solid rgba(61,31,31,0.08)", padding: "16px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-marron)", margin: 0 }}>¿Necesitás ayuda personalizada?</p>
          <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}>Nuestro equipo de soporte para solucionadores responde en menos de 24 hs hábiles.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              flex: 1, padding: "10px", borderRadius: "var(--r-sm)",
              background: "var(--tp-rojo)", color: "var(--tp-crema)",
              border: "none", cursor: "pointer", fontFamily: "var(--fuente)",
              fontSize: 12, fontWeight: 700,
            }}>📧 Email</button>
            <button style={{
              flex: 1, padding: "10px", borderRadius: "var(--r-sm)",
              background: "var(--verde)", color: "white",
              border: "none", cursor: "pointer", fontFamily: "var(--fuente)",
              fontSize: 12, fontWeight: 700,
            }}>💬 WhatsApp</button>
          </div>
        </div>
      </div>

      <NavInferiorS />
    </div>
  );
}