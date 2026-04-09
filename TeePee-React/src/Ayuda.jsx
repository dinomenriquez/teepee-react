import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferior from "./NavInferior";
import styles from "./Ayuda.module.css";
import { IconoVolver } from "./Iconos";
import {
  MessageCircle, RefreshCw, Search, ClipboardList,
  BarChart2, CreditCard, Star, User, Scale,
  Mail, ChevronRight,
} from "lucide-react";

const SECCIONES = [
  {
    id: "cuentas",
    titulo: "Cuentas de usuario y solucionador",
    Icono: RefreshCw,
    preguntas: [
      { p: "¿Puedo ser usuario y solucionador con el mismo email?", r: "Sí. Un mismo email puede tener asociadas una cuenta de usuario y una cuenta de solucionador. Son perfiles independientes que se inician sesión por separado." },
      { p: "¿Cómo creo una cuenta de solucionador?", r: "Cerrá esta sesión y en la pantalla de bienvenida iniciá el proceso de registro eligiendo el modo solucionador. La app detectará automáticamente las cuentas asociadas a tu email." },
      { p: "¿Cómo cambio entre modo usuario y modo solucionador?", r: "Por el momento debés cerrar sesión e iniciar sesión con la cuenta correspondiente. La app recuerda la última sesión iniciada para que el ingreso sea más rápido." },
    ],
  },
  {
    id: "busqueda",
    titulo: "Buscar y contratar un solucionador",
    Icono: Search,
    preguntas: [
      { p: "¿Cómo solicito un servicio?", r: "Tocá 'Buscar' en el menú inferior → elegí la categoría del problema → describí el trabajo → confirmá dirección y disponibilidad horaria → en el paso 3 seleccioná el solucionador y presioná 'Solicitar presupuesto y contactar'. El solucionador recibirá tu solicitud." },
      { p: "¿Dónde quedan mis búsquedas anteriores?", r: "En el home tocá 'Mis búsquedas'. Ahí encontrás todas las solicitudes que realizaste, los solucionadores contactados, el estado de cada presupuesto y podés repetir una búsqueda fácilmente." },
      { p: "¿Puedo contactar a más de un solucionador?", r: "Sí. En el paso 3 de la búsqueda se muestran los solucionadores disponibles. Podés contactar a varios y comparar sus presupuestos desde 'Mis búsquedas' → 'Ver presupuestos'." },
      { p: "¿Qué información necesito dar para pedir un presupuesto?", r: "Categoría del trabajo, descripción detallada del problema, dirección del servicio, urgencia y disponibilidad horaria. También podés adjuntar fotos o planos para facilitar el presupuesto." },
    ],
  },
  {
    id: "presupuestos",
    titulo: "Presupuestos y acuerdo",
    Icono: ClipboardList,
    preguntas: [
      { p: "¿Cómo veo los presupuestos recibidos?", r: "Desde 'Mis búsquedas' → tocá 'Ver presupuestos' en la búsqueda correspondiente. Podés ver el monto, forma de pago, garantía, materiales incluidos y validez de cada presupuesto recibido." },
      { p: "¿Qué pasa cuando acepto un presupuesto?", r: "Se genera un Acuerdo Digital (Orden de Trabajo) que resume todas las condiciones: partes, servicio, monto, forma de pago, garantía. Ambos lo firman digitalmente y queda activo el trabajo." },
      { p: "¿Puedo negociar el presupuesto?", r: "Sí. Desde el chat con el solucionador podés consultar o negociar. Si hay cambios, el solucionador puede enviar un presupuesto actualizado." },
      { p: "¿Qué es el 'Precio con visita previa'?", r: "Algunos trabajos requieren que el solucionador vea el problema in situ antes de dar un precio exacto. El costo de la visita se incluye en el monto total si aceptás el trabajo. Si no aceptás el presupuesto luego de la visita, se cobra la visita por separado." },
    ],
  },
  {
    id: "seguimiento",
    titulo: "Seguimiento del trabajo",
    Icono: BarChart2,
    preguntas: [
      { p: "¿Cómo sigo el avance del trabajo?", r: "En 'Mis trabajos' → tocá 'Ver seguimiento'. El solucionador reporta el avance en porcentaje (0% a 100%). Cuando aprobás un avance, se habilita el pago correspondiente a esa etapa." },
      { p: "¿Cómo apruebo un avance de obra?", r: "Cuando el solucionador reporta un avance, recibís una notificación. En la pantalla de Seguimiento aparece el avance pendiente con el monto del certificado. Tocá 'Aprobar avance' y luego podés pagar." },
      { p: "¿Qué hago si el solucionador propone un ajuste de monto?", r: "En la pantalla de Seguimiento verás la propuesta de ajuste con el monto adicional y la descripción detallada. Podés 'Aceptar' o 'Rechazar'. Si aceptás, el acuerdo digital se actualiza automáticamente." },
      { p: "¿Dónde veo el acuerdo firmado?", r: "Desde el ícono de documento en el header de Seguimiento → se abre el Acuerdo Digital en modo solo lectura con todos los ajustes aprobados incorporados." },
    ],
  },
  {
    id: "pagos",
    titulo: "Pagos",
    Icono: CreditCard,
    preguntas: [
      { p: "¿Cómo pago el trabajo?", r: "Cuando un avance es aprobado o el trabajo finaliza, la pantalla de Seguimiento habilita el botón 'Pagar'. Se abre la pantalla de pago donde elegís el medio: tarjeta, transferencia, MercadoPago o efectivo." },
      { p: "¿Cuándo se habilita la calificación?", r: "Recién cuando el trabajo está al 100% aprobado y pagado en su totalidad. Así nos aseguramos que ambas partes completen el proceso antes de calificarse." },
      { p: "¿Qué pasa si elijo 'Pagar más tarde'?", r: "El pago queda marcado como pendiente. Podés realizarlo en cualquier momento desde la pantalla de Seguimiento. La calificación no se habilita hasta que el pago esté completo." },
      { p: "¿TeePee cobra comisión al usuario?", r: "No. La comisión del 6% es absorbida por el solucionador. Vos solo pagás el monto total acordado en el presupuesto." },
    ],
  },
  {
    id: "calificaciones",
    titulo: "Calificaciones",
    Icono: Star,
    preguntas: [
      { p: "¿Cómo califico al solucionador?", r: "Una vez completado y pagado el 100% del trabajo, aparece el botón 'Calificar' en Seguimiento. Calificás en general (1-5 estrellas) y en aspectos específicos: calidad, puntualidad, comunicación y limpieza." },
      { p: "¿Cuándo se publica la calificación?", r: "La calificación se publica recién cuando ambos (usuario y solucionador) se califican mutuamente. De esta forma se garantiza reciprocidad." },
      { p: "¿Cómo se calcula el puntaje del solucionador?", r: "Fórmula: 80% calificación general + 5% calidad + 5% puntualidad + 5% comunicación + 5% limpieza. El resultado es el puntaje final con hasta 1 decimal." },
    ],
  },
  {
    id: "cuenta",
    titulo: "Mi cuenta y perfil",
    Icono: User,
    preguntas: [
      { p: "¿Cómo agrego o edito mis domicilios?", r: "En 'Perfil' → tab 'Domicilios'. Podés editar los existentes, agregar nuevos con su referencia (Casa, Trabajo, etc.) y fijar cuál es el principal. Los domicilios guardados aparecen en el paso 2 de la búsqueda." },
      { p: "¿Cómo guardo métodos de pago?", r: "En 'Perfil' → tab 'Pagos'. Podés agregar MercadoPago (alias o email), tarjeta de crédito y tarjeta de débito. Los datos se guardan para agilizar futuros pagos." },
      { p: "¿Cómo elimino mi cuenta?", r: "En 'Perfil' tocá el botón '?' en el header. Ahí encontrás la información de contacto para solicitar la eliminación de cuenta. Te pediremos confirmación por email." },
      { p: "¿Puedo ser usuario y solucionador al mismo tiempo?", r: "Sí. Una misma cuenta puede tener ambos modos. Desde el menú podés alternar entre la vista de usuario y la de solucionador." },
    ],
  },
  {
    id: "disputas",
    titulo: "Problemas y disputas",
    Icono: Scale,
    preguntas: [
      { p: "¿Qué hago si no estoy conforme con el trabajo?", r: "No apruebes el avance o el cierre. Abrí una disputa desde 'Mis trabajos' → tab 'Cancelados y Disputas'. El equipo de TeePee interviene como mediador." },
      { p: "¿Cómo cancelo un trabajo?", r: "Si el solucionador aún no inició el trabajo, podés cancelar desde 'Mis trabajos' → el trabajo → 'Cancelar'. Si ya está en curso, la devolución depende de lo pagado y las condiciones acordadas." },
      { p: "¿Cómo contacto al soporte?", r: "Por email a teepee.arg@gmail.com (respuesta en 24 hs hábiles) o por WhatsApp al (contacto vía chat interno) de lunes a sábado de 8 a 20 hs." },
    ],
  },
];

export default function Ayuda() {
  const navigate = useNavigate();
  const [seccionAbierta, setSeccionAbierta] = useState(null);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  return (
    <div className={styles.pantalla}>

      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Centro de ayuda</span>
      </header>

      {/* Bienvenida */}
      <div className={styles.bienvenidaWrapper}>
        <div className={styles.bienvenidaCard}>
          <div className={styles.bienvenidaIcono}>
            <MessageCircle size={24} />
          </div>
          <div>
            <p className={styles.bienvenidaTitulo}>¿En qué te podemos ayudar?</p>
            <p className={styles.bienvenidaSub}>Encontrá respuestas a las dudas más frecuentes</p>
          </div>
        </div>
      </div>

      {/* Secciones */}
      <div className={styles.seccionesWrapper}>
        {SECCIONES.map((sec) => {
          const IconoSec = sec.Icono;
          return (
            <div key={sec.id} className={styles.seccionCard}>

              {/* Header sección */}
              <button
                type="button"
                className={styles.seccionBtn}
                onClick={() => {
                  setSeccionAbierta(seccionAbierta === sec.id ? null : sec.id);
                  setPreguntaAbierta(null);
                }}
              >
                <span className={styles.seccionIcono}>
                  <IconoSec size={18} />
                </span>
                <span className={styles.seccionTitulo}>{sec.titulo}</span>
                <ChevronRight
                  size={16}
                  className={`${styles.seccionChevron} ${seccionAbierta === sec.id ? styles.seccionChevronAbierto : ""}`}
                />
              </button>

              {/* Preguntas */}
              {seccionAbierta === sec.id && (
                <div className={styles.preguntasWrapper}>
                  {sec.preguntas.map((item, i) => (
                    <div
                      key={i}
                      className={`${styles.preguntaItem} ${i < sec.preguntas.length - 1 ? styles.preguntaItemBorder : ""}`}
                    >
                      <button
                        type="button"
                        className={`${styles.preguntaBtn} ${preguntaAbierta === `${sec.id}-${i}` ? styles.preguntaBtnActivo : ""}`}
                        onClick={() => setPreguntaAbierta(preguntaAbierta === `${sec.id}-${i}` ? null : `${sec.id}-${i}`)}
                      >
                        <ChevronRight size={14} className={styles.preguntaIconoP} />
                        <span className={styles.preguntaTexto}>{item.p}</span>
                        <ChevronRight
                          size={14}
                          className={`${styles.preguntaChevron} ${preguntaAbierta === `${sec.id}-${i}` ? styles.preguntaChevronAbierto : ""}`}
                        />
                      </button>

                      {preguntaAbierta === `${sec.id}-${i}` && (
                        <div className={styles.respuestaWrapper}>
                          <span className={styles.respuestaR}>R</span>
                          <p className={styles.respuestaTexto}>{item.r}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contacto directo */}
      <div className={styles.contactoWrapper}>
        <div className={styles.contactoCard}>
          <p className={styles.contactoTitulo}>¿No encontraste tu respuesta?</p>
          <p className={styles.contactoSub}>Nuestro equipo responde en menos de 24 hs hábiles.</p>
          <div className={styles.contactoBotones}>
            <a
              href="mailto:teepee.arg@gmail.com?subject=Consulta%20desde%20la%20app"
              className={styles.btnEmail}
            >
              <Mail size={13} /> Enviar email
            </a>
            <button
              type="button"
              className={styles.btnChat}
              onClick={() => navigate("/chat?nombre=Soporte%20TeePee&inicial=T&oficio=Administrador%20TeePee&desde=ayuda")}
            >
              <MessageCircle size={13} /> Chat con Soporte
            </button>
          </div>
        </div>
      </div>

      <NavInferior />
    </div>
  );
}