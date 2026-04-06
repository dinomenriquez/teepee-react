import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";

const SECCIONES = [
  {
    id: "cuentas",
    titulo: "Cuentas de usuario y solucionador",
    icono: "🔄",
    preguntas: [
      {
        p: "¿Puedo ser usuario y solucionador con el mismo email?",
        r: "Sí. Un mismo email puede tener asociadas una cuenta de usuario y una cuenta de solucionador. Son perfiles independientes que se inician sesión por separado.",
      },
      {
        p: "¿Cómo creo una cuenta de usuario?",
        r: "Cerrá esta sesión y en la pantalla de bienvenida iniciá el proceso de registro eligiendo el modo usuario. La app detectará automáticamente las cuentas asociadas a tu email.",
      },
      {
        p: "¿Cómo cambio entre modo usuario y modo solucionador?",
        r: "Por el momento debés cerrar sesión e iniciar sesión con la cuenta correspondiente. La app recuerda la última sesión iniciada para que el ingreso sea más rápido.",
      },
    ],
  },
  {
    id: "inicio",
    titulo: "Empezar en TeePee",
    icono: "🚀",
    preguntas: [
      {
        p: "¿Cómo completo mi perfil para recibir solicitudes?",
        r: "En 'Perfil' completá los 4 tabs: Datos personales, Profesional (oficios, certificados, garantía), Cobros (CBU/CVU, CUIT, razón social) y Docs (DNI + boleta de servicio). Un perfil completo aparece mejor posicionado.",
      },
      {
        p: "¿Qué documentos necesito para verificarme?",
        r: "DNI vigente (foto del frente), boleta de servicio de agua o luz que muestre tu nombre y domicilio. Opcionalmente podés subir títulos, certificados de oficio y habilitaciones desde el tab 'Profesional'.",
      },
      {
        p: "¿Cómo configuro mis oficios?",
        r: "En 'Perfil' → tab 'Profesional'. Podés elegir hasta 2 oficios principales (⭐) y hasta 5 secundarios (🔵). Un toque = principal, dos toques = secundario, tres toques = quitar. También podés agregar oficios personalizados.",
      },
      {
        p: "¿Cómo configuro mi disponibilidad?",
        r: "Desde 'Perfil' configurás tu disponibilidad general por días y turnos. Desde 'Agenda' podés ajustar la disponibilidad puntual de cada día sin alterar la configuración general.",
      },
    ],
  },
  {
    id: "solicitudes",
    titulo: "Solicitudes y presupuestos",
    icono: "📋",
    preguntas: [
      {
        p: "¿Cómo recibo y veo las solicitudes?",
        r: "Las solicitudes nuevas aparecen en tu home y en 'Notificaciones'. Desde el home tocá 'Ver y cotizar' para abrir el formulario de presupuesto con todos los datos del usuario.",
      },
      {
        p: "¿Cómo armo un presupuesto?",
        r: "En la pantalla de armar presupuesto tenés 2 pasos: Paso 1 elegís entre Precio fijo (monto total o itemizado) o Precio con visita previa, agregás descripción del trabajo. Paso 2 definís forma de pago, garantía, materiales y validez.",
      },
      {
        p: "¿Qué es el precio con visita previa?",
        r: "Cuando necesitás ver el trabajo antes de presupuestar. Podés cobrar la visita o incluirla en el total. Si el cliente no acepta el presupuesto luego de la visita, se cobra la visita aparte.",
      },
      {
        p: "¿El cliente ve mi comisión?",
        r: "No. El cliente solo ve el monto total acordado. El desglose de tu cobro neto (94%) y la comisión TeePee (6%) es información solo visible para vos.",
      },
      {
        p: "¿Cómo funciona el anticipo?",
        r: "En el paso 2 del presupuesto elegís la forma de pago. Si elegís 'Anticipo + saldo al cierre' o 'Anticipo + avance + cierre', proponés el % de anticipo (10% a 50%). El cliente lo acepta o propone otro.",
      },
    ],
  },
  {
    id: "trabajos",
    titulo: "Seguimiento de trabajos",
    icono: "🔧",
    preguntas: [
      {
        p: "¿Cómo reporto el avance de un trabajo?",
        r: "En 'SeguimientoS' del trabajo → usá el slider de avance (0% a 100%) → se muestra el monto del certificado que corresponde → tocá 'Enviar avance al cliente'. El cliente recibe una notificación.",
      },
      {
        p: "¿Cómo propongo un ajuste de monto?",
        r: "En 'SeguimientoS' → botón '+ Proponer ajuste de monto'. Ingresá el incremento (verás tu cobro neto y la comisión TeePee), agregá descripción detallada y enviá. El cliente deberá aprobar o rechazar.",
      },
      {
        p: "¿Cuándo me habilitan el cobro?",
        r: "Cuando el cliente aprueba un avance, se habilita el pago de ese certificado. El pago llega a tu cuenta una vez que el cliente lo procesa. Podés ver el estado de cada etapa en la sección 'Pagos' del seguimiento.",
      },
      {
        p: "¿Cómo se actualiza el Acuerdo Digital?",
        r: "El Acuerdo Digital se actualiza automáticamente cada vez que el cliente acepta un ajuste de monto. Podés verlo en cualquier momento desde el ícono 📄 del header de SeguimientoS.",
      },
    ],
  },
  {
    id: "cobros",
    titulo: "Cobros e ingresos",
    icono: "💰",
    preguntas: [
      {
        p: "¿Cuánto cobra TeePee de comisión?",
        r: "La comisión es del 6% fijo sobre el monto total de cada trabajo. Se descuenta automáticamente de cada cobro. En tu pantalla de Ingresos podés ver el detalle de cada liquidación.",
      },
      {
        p: "¿Cuándo y cómo cobro?",
        r: "Los pagos se liquidan semanalmente (lunes a domingo). Podés configurar hasta 2 cuentas CBU/CVU para recibir los pagos. También necesitás tu CUIT/CUIL y razón social para facturación.",
      },
      {
        p: "¿Cómo veo mis ingresos?",
        r: "En 'Ingresos' del menú inferior. Encontrás el resumen mensual (bruto y neto), el detalle por semana (lunes a domingo) y el desglose trabajo por trabajo con la comisión descontada.",
      },
      {
        p: "¿Puedo cobrar en efectivo?",
        r: "Sí, podés acordar el pago en efectivo con el cliente. En ese caso el trabajo no tiene la garantía de pago de TeePee (sin escrow). Se recomienda registrar el pago en la app de todas formas.",
      },
    ],
  },
  {
    id: "calificaciones",
    titulo: "Calificaciones y reputación",
    icono: "⭐",
    preguntas: [
      {
        p: "¿Cuándo puedo calificar al cliente?",
        r: "Recién cuando el trabajo está al 100% aprobado y cobrado en su totalidad. La calificación se publica cuando ambos (vos y el cliente) se califiquen mutuamente.",
      },
      {
        p: "¿Cómo se calcula mi puntaje?",
        r: "Fórmula: 80% calificación general + 5% calidad + 5% puntualidad + 5% comunicación + 5% limpieza. El resultado determina tu rating visible en el perfil.",
      },
      {
        p: "¿Cómo mejorar mi posición en las búsquedas?",
        r: "Manteniendo una alta calificación promedio, respondiendo rápido a las solicitudes, completando trabajos sin cancelaciones y teniendo el perfil completo con documentación verificada.",
      },
    ],
  },
  {
    id: "agenda",
    titulo: "Agenda y disponibilidad",
    icono: "📅",
    preguntas: [
      {
        p: "¿Cómo funciona la agenda?",
        r: "En 'Agenda' ves el calendario semanal. Tocá un día para ver o editar la disponibilidad específica de ese día (Mañana 7-12 / Siesta 12-15 / Tarde 15-19 / Noche 19-21). Esto no altera tu disponibilidad general del perfil.",
      },
      {
        p: "¿Qué diferencia hay entre disponibilidad general y diaria?",
        r: "La disponibilidad general (en Perfil) define tus horarios habituales de trabajo. La disponibilidad diaria (en Agenda) permite ajustes puntuales para días específicos sin cambiar la configuración general.",
      },
    ],
  },
  {
    id: "disputas",
    titulo: "Disputas y soporte",
    icono: "⚖️",
    preguntas: [
      {
        p: "¿Qué hago si hay una disputa?",
        r: "Si el cliente abre una disputa, el pago queda retenido. El equipo de TeePee interviene como mediador. Tené el chat, fotos del trabajo y el acuerdo digital como respaldo. El proceso se resuelve en hasta 48 hs hábiles.",
      },
      {
        p: "¿Cómo cancelo un trabajo aceptado?",
        r: "Desde 'Mis trabajos' → el trabajo → 'Cancelar'. Las cancelaciones frecuentes afectan tu visibilidad y posición. Solo cancelá en casos justificados.",
      },
      {
        p: "¿Cómo contacto al soporte?",
        r: "Por email a teepee.arg@gmail.com (respuesta en 24 hs hábiles) o por WhatsApp al (contacto vía chat interno) de lunes a sábado de 8 a 20 hs.",
      },
    ],
  },
];

export default function AyudaS() {
  const navigate = useNavigate();
  const [seccionAbierta, setSeccionAbierta] = useState(null);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  return (
    <div
      style={{
        background: "var(--tp-crema)",
        minHeight: "100vh",
        fontFamily: "var(--fuente)",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--tp-crema)",
          borderBottom: "1px solid rgba(61,31,31,0.08)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: 4,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          <IconoVolver size={20} />
        </button>
        <div>
          <h1
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "var(--tp-marron)",
              margin: 0,
            }}
          >
            Centro de ayuda
          </h1>
          <p
            style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}
          >
            Para solucionadores
          </p>
        </div>
      </header>

      <div style={{ padding: "20px 16px 8px" }}>
        <div
          style={{
            background: "var(--verde-suave)",
            borderRadius: "var(--r-lg)",
            padding: "16px",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 28 }}>🔧</span>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--tp-marron)",
                margin: 0,
              }}
            >
              Todo lo que necesitás saber
            </p>
            <p
              style={{
                fontSize: 11,
                color: "var(--tp-marron-suave)",
                margin: "2px 0 0",
              }}
            >
              Guía completa para solucionadores TeePee
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "8px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {SECCIONES.map((sec) => (
          <div
            key={sec.id}
            style={{
              background: "var(--tp-crema-clara)",
              border: "1px solid rgba(61,31,31,0.08)",
              borderRadius: "var(--r-md)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSeccionAbierta(seccionAbierta === sec.id ? null : sec.id);
                setPreguntaAbierta(null);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
              }}
            >
              <span style={{ fontSize: 20 }}>{sec.icono}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--tp-marron)",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {sec.titulo}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: "var(--tp-marron-suave)",
                  transform:
                    seccionAbierta === sec.id ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                ›
              </span>
            </button>

            {seccionAbierta === sec.id && (
              <div style={{ borderTop: "1px solid rgba(61,31,31,0.06)" }}>
                {sec.preguntas.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom:
                        i < sec.preguntas.length - 1
                          ? "1px solid rgba(61,31,31,0.06)"
                          : "none",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setPreguntaAbierta(
                          preguntaAbierta === `${sec.id}-${i}`
                            ? null
                            : `${sec.id}-${i}`,
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        background:
                          preguntaAbierta === `${sec.id}-${i}`
                            ? "rgba(61,31,31,0.03)"
                            : "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--fuente)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--verde)",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        P
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--tp-marron)",
                          textAlign: "left",
                          flex: 1,
                        }}
                      >
                        {item.p}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          color: "var(--tp-marron-suave)",
                          flexShrink: 0,
                          transform:
                            preguntaAbierta === `${sec.id}-${i}`
                              ? "rotate(90deg)"
                              : "none",
                          transition: "transform 0.2s",
                        }}
                      >
                        ›
                      </span>
                    </button>

                    {preguntaAbierta === `${sec.id}-${i}` && (
                      <div style={{ padding: "0 16px 14px 36px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              color: "var(--verde)",
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            →
                          </span>
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--tp-marron-suave)",
                              margin: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            {item.r}
                          </p>
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
        <div
          style={{
            background: "var(--tp-crema-clara)",
            borderRadius: "var(--r-md)",
            border: "1px solid rgba(61,31,31,0.08)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--tp-marron)",
              margin: 0,
            }}
          >
            ¿Necesitás ayuda personalizada?
          </p>
          <p
            style={{ fontSize: 12, color: "var(--tp-marron-suave)", margin: 0 }}
          >
            Nuestro equipo de soporte para solucionadores responde en menos de
            24 hs hábiles.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href="mailto:teepee.arg@gmail.com?subject=Consulta%20Solucionador%20desde%20la%20app"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "var(--r-sm)",
                background: "var(--tp-rojo)",
                color: "var(--tp-crema)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              📧 Enviar email
            </a>
            <button
              onClick={() =>
                navigate(
                  "/chat-s?usuarioId=admin&nombre=Soporte%20TeePee&inicial=T&oficio=Administrador&desde=ayuda-s",
                )
              }
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "var(--r-sm)",
                background: "var(--verde)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fuente)",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              💬 Chat con Soporte
            </button>
          </div>
        </div>
      </div>

      <NavInferiorS />
    </div>
  );
}
