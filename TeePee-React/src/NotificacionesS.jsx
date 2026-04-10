import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./NotificacionesS.module.css";
import { IconoVolver } from "./Iconos";

const NOTIFICACIONES = {
  usuario: [
    { id: 1, tipo: "presupuesto",  icono: "📄", titulo: "Nuevo presupuesto recibido",       desc: "Carlos Mendoza te envió un presupuesto de $22.000 para Pérdida de agua.",                                                          tiempo: "hace 5 min",   leida: false, accion: "/presupuestos" },
    { id: 2, tipo: "en-camino",    icono: "🚗", titulo: "Solucionador en camino",            desc: "Juan Ledesma está en camino a tu domicilio. Llega en aprox. 15 min.",                                                              tiempo: "hace 20 min",  leida: false, accion: "/seguimiento" },
    { id: 3, tipo: "completado",   icono: "✅", titulo: "Trabajo completado",                desc: 'Roberto Flores marcó como completado "Instalación de AA". Confirmá para liberar el pago.',                                         tiempo: "hace 1 hora",  leida: false, accion: "/seguimiento" },
    { id: 4, tipo: "devolucion",   icono: "💰", titulo: "Devolución procesada",              desc: "Se acreditaron $22.000 en tu MercadoPago por la cancelación del servicio.",                                                       tiempo: "ayer",         leida: true,  accion: "/trabajos" },
    { id: 5, tipo: "calificar",    icono: "⭐", titulo: "Calificá tu experiencia",           desc: "Ya pasaron 24 hs. ¿Cómo estuvo el trabajo de Miguel Saracho?",                                                                    tiempo: "ayer",         leida: true,  accion: "/calificacion" },
    { id: 6, tipo: "presupuesto",  icono: "📄", titulo: "Presupuesto por vencer",            desc: "El presupuesto de Roberto Flores vence en 24 hs. ¡No lo dejes pasar!",                                                           tiempo: "hace 2 días",  leida: true,  accion: "/presupuestos" },
  ],
  solucionador: [
    { id: 1,  tipo: "solicitud",    icono: "🔔", titulo: "Nueva solicitud entrante",          desc: "Laura Pérez necesita un Plomero — Pérdida de agua en baño. A 2.3 km.",                                                           tiempo: "hace 3 min",   leida: false, accion: "/home-solucionador" },
    { id: 2,  tipo: "aceptado",     icono: "✅", titulo: "Presupuesto aceptado",              desc: "Martín García aceptó tu presupuesto de $35.200 para Tablero eléctrico.",                                                          tiempo: "hace 30 min",  leida: false, accion: "/chat" },
    { id: 3,  tipo: "pago",         icono: "💰", titulo: "Pago acreditado",                  desc: "Se acreditaron $32.688 en tu cuenta por Instalación AA. Ver detalle en Ingresos.",                                               tiempo: "hace 2 horas", leida: false, accion: "/ingresos" },
    { id: 4,  tipo: "calificacion", icono: "⭐", titulo: "Nueva calificación recibida",      desc: 'Ana Gómez te calificó con 5 estrellas: "Excelente trabajo, muy puntual."',                                                        tiempo: "ayer",         leida: true,  accion: "/perfil-solucionador" },
    { id: 5,  tipo: "recordatorio", icono: "📅", titulo: "Trabajo mañana a las 9:00",        desc: "Recordatorio: Tablero eléctrico en Av. Mitre 1234. Cliente: Martín García.",                                                      tiempo: "ayer",         leida: true,  accion: "/agenda" },
    { id: 6,  tipo: "solicitud",    icono: "🔔", titulo: "Solicitud urgente cerca tuyo",     desc: "Roberto Silva necesita un Plomero URGENTE. A solo 1.2 km de tu ubicación.",                                                       tiempo: "hace 2 días",  leida: true,  accion: "/home-solucionador" },
    { id: 7,  tipo: "avance",       icono: "✅", titulo: "Avance aprobado por el cliente",   desc: "Laura Pérez aprobó el 60% de avance en 'Pérdida de agua en baño'. El pago de $8.800 está habilitado.",                           tiempo: "hace 5 min",   leida: false, accion: "/seguimiento-s?trabajoId=1" },
    { id: 8,  tipo: "ajuste",       icono: "📝", titulo: "Ajuste de monto aceptado",         desc: "Laura Pérez aceptó el ajuste de +$4.500. El acuerdo fue actualizado.",                                                            tiempo: "hace 1 min",   leida: false, accion: "/acuerdo-digital?trabajoId=1&modo=firmado" },
    { id: 9,  tipo: "pago",         icono: "💰", titulo: "Pago recibido del cliente",        desc: "Laura Pérez realizó el pago de anticipo de $6.600. Ya podés comenzar el trabajo.",                                               tiempo: "hace 15 min",  leida: false, accion: "/seguimiento-s?trabajoId=1" },
    { id: 10, tipo: "aceptado",     icono: "🤝", titulo: "Acuerdo digital firmado",          desc: "Laura Pérez firmó el acuerdo para 'Pérdida de agua en baño'. Orden ORD-2025-0042 activa.",                                       tiempo: "hace 1 hora",  leida: true,  accion: "/acuerdo-digital?trabajoId=1&modo=firmado" },
    { id: 11, tipo: "calificar",    icono: "⭐", titulo: "Calificá a Carlos Ruiz",           desc: "El trabajo 'Cambio de cerradura' finalizó hace 2 días. Tu calificación ayuda a construir la comunidad TeePee.",                  tiempo: "hace 2 días",  leida: false, accion: "/trabajos-s?tab=finalizados" },
    { id: 12, tipo: "calificar",    icono: "⭐", titulo: "Calificá a Sofía Torres",          desc: "El trabajo 'Reparación persiana' finalizó hace 8 días. Todavía podés calificar al cliente.",                                     tiempo: "hace 8 días",  leida: false, accion: "/trabajos-s?tab=finalizados" },
  ],
};

const COLORES_TIPO = {
  presupuesto:  { bg: "rgba(184,64,48,0.08)",  border: "rgba(184,64,48,0.20)"  },
  "en-camino":  { bg: "rgba(42,125,90,0.08)",  border: "rgba(42,125,90,0.20)"  },
  completado:   { bg: "rgba(42,125,90,0.08)",  border: "rgba(42,125,90,0.20)"  },
  devolucion:   { bg: "rgba(42,125,90,0.08)",  border: "rgba(42,125,90,0.20)"  },
  calificar:    { bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.30)" },
  solicitud:    { bg: "rgba(184,64,48,0.08)",  border: "rgba(184,64,48,0.20)"  },
  aceptado:     { bg: "rgba(42,125,90,0.08)",  border: "rgba(42,125,90,0.20)"  },
  pago:         { bg: "rgba(42,125,90,0.08)",  border: "rgba(42,125,90,0.20)"  },
  calificacion: { bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.30)" },
  recordatorio: { bg: "rgba(61,31,31,0.04)",   border: "rgba(61,31,31,0.10)"   },
  avance:       { bg: "rgba(42,125,90,0.08)",  border: "rgba(42,125,90,0.20)"  },
  ajuste:       { bg: "rgba(140,104,32,0.08)", border: "rgba(140,104,32,0.20)" },
};

export default function NotificacionesS() {
  const navigate = useNavigate();
  const rol = "solucionador";
  const [notifs, setNotifs] = useState(NOTIFICACIONES);

  const lista    = notifs[rol];
  const sinLeer  = lista.filter(n => !n.leida).length;
  const noLeidas = lista.filter(n => !n.leida);
  const leidas   = lista.filter(n => n.leida);

  function marcarLeida(id) {
    setNotifs(prev => ({ ...prev, [rol]: prev[rol].map(n => n.id === id ? { ...n, leida: true } : n) }));
  }
  function marcarTodasLeidas() {
    setNotifs(prev => ({ ...prev, [rol]: prev[rol].map(n => ({ ...n, leida: true })) }));
  }
  function handleNotif(notif) { marcarLeida(notif.id); navigate(notif.accion); }

  return (
    <div className={styles.pantalla}>
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>
          Notificaciones
          {sinLeer > 0 && <span className={styles.headerBadge}>{sinLeer}</span>}
        </span>
        {sinLeer > 0 && (
          <button className={styles.btnMarcarTodas} onClick={marcarTodasLeidas}>
            Marcar todas
          </button>
        )}
      </header>

      <main className={styles.contenido}>
        {noLeidas.length > 0 && (
          <div className={styles.grupo}>
            <p className={styles.grupoTitulo}>Sin leer — {noLeidas.length}</p>
            {noLeidas.map(n => <NotifCard key={n.id} notif={n} onClick={() => handleNotif(n)} />)}
          </div>
        )}
        {leidas.length > 0 && (
          <div className={styles.grupo}>
            <p className={styles.grupoTitulo}>Anteriores</p>
            {leidas.map(n => <NotifCard key={n.id} notif={n} onClick={() => handleNotif(n)} />)}
          </div>
        )}
        {lista.length === 0 && (
          <div className={styles.vacio}>
            <span className={styles.vacioIcono}>🔔</span>
            <p className={styles.vacioTexto}>No tenés notificaciones</p>
          </div>
        )}
      </main>

      <NavInferiorS />
    </div>
  );
}

function NotifCard({ notif, onClick }) {
  const color = COLORES_TIPO[notif.tipo] || COLORES_TIPO.recordatorio;

  return (
    <button type="button"
      className={`${styles.card} ${!notif.leida ? styles.cardNoLeida : styles.cardLeida}`}
      style={{
        "--notif-bg":     !notif.leida ? color.bg     : "var(--tp-crema-clara)",
        "--notif-border": !notif.leida ? color.border : "rgba(61,31,31,0.08)",
      }}
      onClick={onClick}
    >
      <div className={styles.cardIcono}>{notif.icono}</div>
      <div className={styles.cardBody}>
        <div className={styles.cardTituloRow}>
          <span className={styles.cardTitulo}>{notif.titulo}</span>
          {!notif.leida && <span className={styles.cardPunto} />}
        </div>
        <p className={styles.cardDesc}>{notif.desc}</p>
        <span className={styles.cardTiempo}>{notif.tiempo}</span>
      </div>
    </button>
  );
}