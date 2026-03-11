import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PerfilSolucionador.module.css";
import { IconoVolver } from './Iconos'

const SOLUCIONADOR = {
  nombre: "Juan Ledesma",
  inicial: "J",
  oficio: "Electricista",
  nivel: "Oro",
  nivelIcono: "🥇",
  reputacion: 4.9,
  totalTrabajos: 124,
  totalReseñas: 98,
  distancia: "1.2 km",
  tiempoRespuesta: "~15 min",
  miembro: "Marzo 2023",
  descripcion:
    "Electricista matriculado con más de 8 años de experiencia en instalaciones residenciales y comerciales. Trabajo con materiales de primera calidad y garantizo todos mis trabajos.",
  garantia: "30 días",
  disponibilidad: ["Lun", "Mar", "Mié", "Jue", "Vie"],
  horario: "8:00 - 18:00 hs",
  precio: "$18.000 - $35.000",
  oficios: [
    { icono: "⚡", nombre: "Electricidad", principal: true },
    { icono: "💡", nombre: "Iluminación", principal: false },
    { icono: "🔌", nombre: "Instalaciones", principal: false },
  ],
  certificaciones: [
    "✅ Matrícula profesional verificada",
    "✅ Identidad verificada (DNI)",
    "✅ Sin antecedentes penales",
  ],
};

const RESEÑAS = [
  {
    id: 1,
    usuario: "Martín G.",
    inicial: "M",
    estrellas: 5,
    fecha: "hace 2 semanas",
    texto:
      "Excelente trabajo. Llegó puntual, resolvió el problema rápido y dejó todo limpio. Lo recomiendo.",
    trabajo: "Cambio de tablero eléctrico",
  },
  {
    id: 2,
    usuario: "Laura P.",
    inicial: "L",
    estrellas: 5,
    fecha: "hace 1 mes",
    texto:
      "Muy profesional. Explicó todo lo que iba haciendo y el precio fue justo.",
    trabajo: "Instalación de aire acondicionado",
  },
  {
    id: 3,
    usuario: "Carlos R.",
    inicial: "C",
    estrellas: 4,
    fecha: "hace 2 meses",
    texto:
      "Buen trabajo, tardó un poco más de lo esperado pero el resultado fue muy bueno.",
    trabajo: "Reparación de circuito",
  },
];

const FOTOS_TRABAJOS = ["🏠", "⚡", "🔌", "💡", "🏗️", "✨"];

export default function PerfilSolucionador() {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState("info");
  const [toast, setToast] = useState(null);
  const [modalContacto, setModalContacto] = useState(false);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER con foto de fondo ── */}
      <div className={styles.heroBloque}>
        <div className={styles.heroAcciones}>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            <IconoVolver size={20} />
          </button>
          <button
            className={styles.btnCompartir}
            onClick={() => mostrarToast("Compartir perfil")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="18"
                cy="5"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="6"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="19"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8.59"
                y1="13.51"
                x2="15.42"
                y2="17.49"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="15.41"
                y1="6.51"
                x2="8.59"
                y2="10.49"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Avatar grande */}
        <div className={styles.heroAvatar}>
          <div className={styles.heroAvatarCirculo}>{SOLUCIONADOR.inicial}</div>
          <div className={styles.heroNivelBadge}>{SOLUCIONADOR.nivelIcono}</div>
        </div>

        {/* Info principal */}
        <div className={styles.heroInfo}>
          <h1 className={styles.heroNombre}>{SOLUCIONADOR.nombre}</h1>
          <p className={styles.heroOficio}>
            {SOLUCIONADOR.oficio} · Nivel {SOLUCIONADOR.nivel}
          </p>

          {/* Stats rápidos */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {SOLUCIONADOR.reputacion}
              </span>
              <span className={styles.heroStatLabel}>⭐ Reputación</span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {SOLUCIONADOR.totalTrabajos}
              </span>
              <span className={styles.heroStatLabel}>Trabajos</span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {SOLUCIONADOR.tiempoRespuesta}
              </span>
              <span className={styles.heroStatLabel}>Respuesta</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {[
          { id: "info", label: "Información" },
          { id: "fotos", label: "Trabajos" },
          { id: "disponibilidad", label: "Disponibilidad" },
          { id: "reseñas", label: `Reseñas (${SOLUCIONADOR.totalReseñas})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${
              tabActiva === tab.id ? styles.tabActiva : ""
            }`}
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO DE TABS ── */}
      <main className={styles.contenido}>
        {/* TAB: INFORMACIÓN */}
        {tabActiva === "info" && (
          <div className={styles.tabContenido}>
            {/* Descripción */}
            <section className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Sobre mí</h2>
              <p className={styles.descripcion}>{SOLUCIONADOR.descripcion}</p>
            </section>

            {/* Certificaciones */}
            <section className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Verificaciones</h2>
              <div className={styles.certificacionesLista}>
                {SOLUCIONADOR.certificaciones.map((cert, i) => (
                  <div key={i} className={styles.certificacionItem}>
                    {cert}
                  </div>
                ))}
              </div>
            </section>

            {/* Oficios */}
            <section className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Servicios que ofrece</h2>
              <div className={styles.oficiosLista}>
                {SOLUCIONADOR.oficios.map((oficio) => (
                  <div key={oficio.nombre} className={styles.oficioCard}>
                    <span className={styles.oficioIcono}>{oficio.icono}</span>
                    <span className={styles.oficioNombre}>{oficio.nombre}</span>
                    {oficio.principal && (
                      <span className={styles.oficioPrincipal}>Principal</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Disponibilidad */}
            <section className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Disponibilidad</h2>
              <div className={styles.disponibilidadDias}>
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                  (dia) => (
                    <div
                      key={dia}
                      className={`${styles.diaChip} ${
                        SOLUCIONADOR.disponibilidad.includes(dia)
                          ? styles.diaChipActivo
                          : styles.diaChipInactivo
                      }`}
                    >
                      {dia}
                    </div>
                  ),
                )}
              </div>
              <p className={styles.horarioTexto}>🕐 {SOLUCIONADOR.horario}</p>
            </section>

            {/* Garantía */}
            <section className={styles.garantiaCard}>
              <span className={styles.garantiaIcono}>🛡️</span>
              <div className={styles.garantiaInfo}>
                <p className={styles.garantiaTitulo}>Garantía de trabajo</p>
                <p className={styles.garantiaValor}>{SOLUCIONADOR.garantia}</p>
                <p className={styles.garantiaDesc}>
                  Si algo falla en ese período, vuelve sin costo adicional
                </p>
              </div>
            </section>

            {/* Precio */}
            <section className={styles.precioCard}>
              <div className={styles.precioInfo}>
                <p className={styles.precioLabel}>Precio estimado</p>
                <p className={styles.precioMonto}>{SOLUCIONADOR.precio}</p>
                <p className={styles.precioDesc}>
                  El precio final se define en el presupuesto
                </p>
              </div>
              <div className={styles.precioDistancia}>
                <p className={styles.precioDistanciaNum}>
                  {SOLUCIONADOR.distancia}
                </p>
                <p className={styles.precioDistanciaLabel}>de distancia</p>
              </div>
            </section>
          </div>
        )}

        {/* TAB: FOTOS DE TRABAJOS */}
        {tabActiva === "fotos" && (
          <div className={styles.tabContenido}>
            <p className={styles.fotosSubtitulo}>
              {SOLUCIONADOR.totalTrabajos} trabajos realizados
            </p>
            <div className={styles.fotosGrid}>
              {FOTOS_TRABAJOS.map((foto, i) => (
                <div
                  key={i}
                  className={styles.fotoCard}
                  onClick={() => mostrarToast("Ver foto " + (i + 1))}
                >
                  <span className={styles.fotoEmoji}>{foto}</span>
                  <div className={styles.fotoOverlay}>
                    <span className={styles.fotoOverlayTexto}>Ver foto</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.fotosNota}>
              📸 Las fotos son de trabajos reales verificados por TeePee
            </p>
          </div>
        )}
        {/* TAB: DISPONIBILIDAD */}
        {tabActiva === "disponibilidad" && (
          <div className={styles.tabContenido}>
            <p className={styles.disponibilidadDesc}>
              Horarios en los que Juan suele estar disponible. Confirmá con él
              por chat antes de agendar.
            </p>

            {[
              { dia: "Lunes", turnos: ["manana", "tarde"] },
              { dia: "Martes", turnos: ["manana", "tarde"] },
              { dia: "Miércoles", turnos: ["manana"] },
              { dia: "Jueves", turnos: ["manana", "tarde", "noche"] },
              { dia: "Viernes", turnos: ["tarde", "noche"] },
              { dia: "Sábado", turnos: ["manana"] },
              { dia: "Domingo", turnos: [] },
            ].map((fila) => (
              <div key={fila.dia} className={styles.disponibilidadFila}>
                <span className={styles.disponibilidadDia}>{fila.dia}</span>
                <div className={styles.disponibilidadTurnos}>
                  {fila.turnos.length === 0 ? (
                    <span className={styles.disponibilidadNoDisp}>
                      No disponible
                    </span>
                  ) : (
                    ["manana", "tarde", "noche"].map((turno) => (
                      <span
                        key={turno}
                        className={`${styles.disponibilidadTurno} ${
                          fila.turnos.includes(turno)
                            ? styles.disponibilidadTurnoActivo
                            : styles.disponibilidadTurnoVacio
                        }`}
                      >
                        {turno === "manana"
                          ? "☀️ Mañana"
                          : turno === "tarde"
                            ? "🌤 Tarde"
                            : "🌙 Noche"}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}

            <div className={styles.disponibilidadAviso}>
              <span>💬</span>
              <p>
                ¿Necesitás un horario especial? Escribile por chat y coordiná
                directamente con él.
              </p>
            </div>
          </div>
        )}
        {/* TAB: RESEÑAS */}
        {tabActiva === "reseñas" && (
          <div className={styles.tabContenido}>
            {/* Resumen de reputación */}
            <div className={styles.reputacionResumen}>
              <div className={styles.reputacionNumGrande}>
                {SOLUCIONADOR.reputacion}
              </div>
              <div className={styles.reputacionDetalle}>
                <div className={styles.estrellas}>
                  {"⭐".repeat(Math.round(SOLUCIONADOR.reputacion))}
                </div>
                <p className={styles.reputacionTotal}>
                  {SOLUCIONADOR.totalReseñas} reseñas verificadas
                </p>
              </div>
            </div>

            {/* Lista de reseñas */}
            <div className={styles.reseñasLista}>
              {RESEÑAS.map((reseña) => (
                <div key={reseña.id} className={styles.reseñaCard}>
                  <div className={styles.reseñaHeader}>
                    <div className={styles.reseñaAvatar}>{reseña.inicial}</div>
                    <div className={styles.reseñaHeaderInfo}>
                      <span className={styles.reseñaUsuario}>
                        {reseña.usuario}
                      </span>
                      <span className={styles.reseñaFecha}>{reseña.fecha}</span>
                    </div>
                    <div className={styles.reseñaEstrellas}>
                      {"⭐".repeat(reseña.estrellas)}
                    </div>
                  </div>

                  <p className={styles.reseñaTexto}>{reseña.texto}</p>

                  <div className={styles.reseñaTrabajo}>
                    🔧 {reseña.trabajo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER FIJO CON BOTÓN ── */}
      <div className={styles.footer}>
        <div className={styles.footerPrecio}>
          <span className={styles.footerPrecioLabel}>Desde</span>
          <span className={styles.footerPrecioMonto}>
            {SOLUCIONADOR.precio}
          </span>
        </div>
        <button
          type="button"
          className={styles.btnContactar}
          onClick={() => setModalContacto(true)}
        >
          Contactar →
        </button>
      </div>

      {/* ── MODAL CONTACTO ── */}
      {modalContacto && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalContacto(false);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHandle}></div>
            <div className={styles.modalIcono}>⚡</div>
            <h2 className={styles.modalTitulo}>
              Contactar a {SOLUCIONADOR.nombre}
            </h2>
            <p className={styles.modalDesc}>
              Al contactarlo vas a poder chatear, recibir su presupuesto y
              coordinar el trabajo.
            </p>
            <div className={styles.modalOpciones}>
              <button
                type="button"
                className={styles.modalOpcion}
                onClick={() => {
                  setModalContacto(false);
                  navigate("/chat");
                }}
              >
                <span>💬</span>
                <div>
                  <span className={styles.modalOpcionTitulo}>
                    Enviar mensaje
                  </span>
                  <span className={styles.modalOpcionDesc}>
                    Chateá y pedí presupuesto
                  </span>
                </div>
                <span>›</span>
              </button>
              <button
                type="button"
                className={`${styles.modalOpcion} ${styles.modalOpcionUrgente}`}
                onClick={() => {
                  setModalContacto(false);
                  navigate("/chat");
                }}
              >
                <span>🚨</span>
                <div>
                  <span className={styles.modalOpcionTitulo}>
                    Solicitud urgente
                  </span>
                  <span className={styles.modalOpcionDesc}>
                    Necesito atención inmediata
                  </span>
                </div>
                <span>›</span>
              </button>
            </div>
            <button
              type="button"
              className={styles.modalCancelar}
              onClick={() => setModalContacto(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
