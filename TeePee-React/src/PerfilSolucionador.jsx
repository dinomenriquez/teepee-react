import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IconoOk,
  IconoGarantia,
  IconoTrofeo,
  IconoReloj,
  IconoUbicacion,
  IconoEstrella,
} from "./Iconos";
import { getSolucionador } from "./MockData";
import styles from "./PerfilSolucionador.module.css";
import { IconoVolver } from "./Iconos";

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
  oficiosPrincipales: ["Electricidad", "Iluminación"],
  oficiosSecundarios: ["Instalaciones", "Tableros"],
  oficios: [
    { icono: "⚡", nombre: "Electricidad", tipo: "principal" },
    { icono: "💡", nombre: "Iluminación", tipo: "principal" },
    { icono: "🔌", nombre: "Instalaciones", tipo: "secundario" },
    { icono: "🗂️", nombre: "Tableros", tipo: "secundario" },
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
  const [searchParams] = useSearchParams();
  const solIdParam = searchParams.get("solId");
  const nombreParam = searchParams.get("nombre");
  const oficioParam = searchParams.get("oficio");
  const reputacionParam = searchParams.get("reputacion");
  const trabajosParam = searchParams.get("trabajos");
  const distanciaParam = searchParams.get("distancia");
  const precioParam = searchParams.get("precio");
  const garantiaParam = searchParams.get("garantia");
  const nivelIconoParam = searchParams.get("nivelIcono");
  const desdeParam = searchParams.get("desde");
  const trabajoIdBack = searchParams.get("trabajoId");

  // Resolver solucionador: solId (MockData) > params completos > mock local
  const solDinamico = solIdParam ? getSolucionador(Number(solIdParam)) : null;
  const SOLUCIONADOR_ACTIVO = solDinamico
    ? {
        ...SOLUCIONADOR,
        nombre: solDinamico.nombre,
        oficio: solDinamico.oficio,
        inicial: solDinamico.inicial,
        calificacion: solDinamico.calificacion,
      }
    : nombreParam
      ? {
          ...SOLUCIONADOR,
          nombre: decodeURIComponent(nombreParam),
          inicial: decodeURIComponent(nombreParam).charAt(0),
          oficio: oficioParam
            ? decodeURIComponent(oficioParam)
            : SOLUCIONADOR.oficio,
          reputacion: reputacionParam
            ? Number(reputacionParam)
            : SOLUCIONADOR.reputacion,
          calificacion: reputacionParam
            ? Number(reputacionParam)
            : SOLUCIONADOR.reputacion,
          totalTrabajos: trabajosParam
            ? Number(trabajosParam)
            : SOLUCIONADOR.totalTrabajos,
          trabajos: trabajosParam
            ? Number(trabajosParam)
            : SOLUCIONADOR.totalTrabajos,
          distancia: distanciaParam
            ? decodeURIComponent(distanciaParam)
            : SOLUCIONADOR.distancia,
          precio: precioParam
            ? decodeURIComponent(precioParam)
            : SOLUCIONADOR.precio,
          garantia: garantiaParam
            ? decodeURIComponent(garantiaParam)
            : SOLUCIONADOR.garantia,
          nivelIcono: nivelIconoParam
            ? decodeURIComponent(nivelIconoParam)
            : SOLUCIONADOR.nivelIcono,
        }
      : SOLUCIONADOR;
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
          <button
            className={styles.btnVolver}
            onClick={() => {
              if (desdeParam === "busqueda") navigate("/busqueda?paso=3");
              else if (desdeParam === "seguimiento")
                navigate(
                  `/seguimiento${solIdParam ? `?solId=${solIdParam}` : ""}`,
                );
              else if (desdeParam === "presupuestos" && trabajoIdBack)
                navigate(`/presupuestos?trabajoId=${trabajoIdBack}`);
              else navigate(-1); // presupuestos, misTrabajos, y cualquier otro caso
            }}
          >
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
          <div className={styles.heroAvatarCirculo}>
            {SOLUCIONADOR_ACTIVO.inicial}
          </div>
          <div className={styles.heroNivelBadge}>
            {SOLUCIONADOR_ACTIVO.nivelIcono}
          </div>
        </div>

        {/* Info principal */}
        <div className={styles.heroInfo}>
          <h1 className={styles.heroNombre}>{SOLUCIONADOR_ACTIVO.nombre}</h1>
          <p className={styles.heroOficio}>
            {SOLUCIONADOR_ACTIVO.oficio} · Nivel {SOLUCIONADOR_ACTIVO.nivel}
          </p>

          {/* Stats rápidos */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {SOLUCIONADOR_ACTIVO.calificacion ||
                  SOLUCIONADOR_ACTIVO.reputacion}
              </span>
              <span
                className={styles.heroStatLabel}
                style={{ display: "flex", alignItems: "center", gap: 3 }}
              >
                <IconoEstrella size={11} />
                Reputación
              </span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {SOLUCIONADOR_ACTIVO.trabajos ||
                  SOLUCIONADOR_ACTIVO.totalTrabajos}
              </span>
              <span
                className={styles.heroStatLabel}
                style={{ display: "flex", alignItems: "center", gap: 3 }}
              >
                <IconoTrofeo size={11} />
                Trabajos
              </span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {SOLUCIONADOR_ACTIVO.tiempoRespuesta}
              </span>
              <span
                className={styles.heroStatLabel}
                style={{ display: "flex", alignItems: "center", gap: 3 }}
              >
                <IconoReloj size={11} />
                Respuesta
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {[
          { id: "info", icono: <IconoOk size={15} />, label: "Información" },
          { id: "fotos", icono: <IconoTrofeo size={15} />, label: "Trabajos" },
          {
            id: "disponibilidad",
            icono: <IconoReloj size={15} />,
            label: "Disponibilidad",
          },
          {
            id: "reseñas",
            icono: <IconoEstrella size={15} />,
            label: `Reseñas (${SOLUCIONADOR_ACTIVO.totalReseñas})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${
              tabActiva === tab.id ? styles.tabActiva : ""
            }`}
            onClick={() => setTabActiva(tab.id)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {tab.icono}
              {tab.label}
            </span>
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
              <p className={styles.descripcion}>
                {SOLUCIONADOR_ACTIVO.descripcion}
              </p>
            </section>

            {/* Certificaciones */}
            <section className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>
                <IconoOk
                  size={16}
                  style={{
                    marginRight: 6,
                    verticalAlign: "middle",
                    color: "var(--verde)",
                  }}
                />
                Verificaciones
              </h2>
              <div className={styles.certificacionesLista}>
                {SOLUCIONADOR_ACTIVO.certificaciones.map((cert, i) => (
                  <div key={i} className={styles.certificacionItem}>
                    {cert}
                  </div>
                ))}
              </div>
            </section>

            {/* Oficios */}
            <section className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>
                <IconoTrofeo
                  size={16}
                  style={{
                    marginRight: 6,
                    verticalAlign: "middle",
                    color: "var(--tp-rojo)",
                  }}
                />
                Servicios que ofrece
              </h2>

              {/* Principales */}
              {SOLUCIONADOR_ACTIVO.oficios.filter((o) => o.tipo === "principal")
                .length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--tp-marron-suave)",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      margin: "0 0 6px",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    ⭐ Principal
                  </p>
                  <div className={styles.oficiosLista}>
                    {SOLUCIONADOR_ACTIVO.oficios
                      .filter((o) => o.tipo === "principal")
                      .map((oficio) => (
                        <div
                          key={oficio.nombre}
                          className={styles.oficioCard}
                          style={{
                            background: "var(--amarillo-suave)",
                            border: "1px solid rgba(140,104,32,0.2)",
                          }}
                        >
                          <span className={styles.oficioIcono}>
                            {oficio.icono}
                          </span>
                          <span className={styles.oficioNombre}>
                            {oficio.nombre}
                          </span>
                          <span style={{ fontSize: 12, marginLeft: "auto" }}>
                            ⭐
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Secundarios */}
              {SOLUCIONADOR_ACTIVO.oficios.filter(
                (o) => o.tipo === "secundario",
              ).length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--tp-marron-suave)",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      margin: "0 0 6px",
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    🔵 Secundario
                  </p>
                  <div className={styles.oficiosLista}>
                    {SOLUCIONADOR_ACTIVO.oficios
                      .filter((o) => o.tipo === "secundario")
                      .map((oficio) => (
                        <div key={oficio.nombre} className={styles.oficioCard}>
                          <span className={styles.oficioIcono}>
                            {oficio.icono}
                          </span>
                          <span className={styles.oficioNombre}>
                            {oficio.nombre}
                          </span>
                          <span style={{ fontSize: 12, marginLeft: "auto" }}>
                            🔵
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </section>

            {/* Garantía */}
            <section className={styles.garantiaCard}>
              <span className={styles.garantiaIcono}>🛡️</span>
              <div className={styles.garantiaInfo}>
                <p className={styles.garantiaTitulo}>
                  <IconoGarantia
                    size={14}
                    style={{ marginRight: 4, verticalAlign: "middle" }}
                  />{" "}
                  Garantía de trabajo
                </p>
                <p className={styles.garantiaValor}>
                  {SOLUCIONADOR_ACTIVO.garantia}
                </p>
                <p className={styles.garantiaDesc}>
                  Si algo falla en ese período, vuelve sin costo adicional
                </p>
              </div>
            </section>

            {/* Precio */}
            <section className={styles.precioCard}>
              <div className={styles.precioInfo}>
                <p className={styles.precioLabel}>Precio estimado</p>
                <p className={styles.precioMonto}>
                  {SOLUCIONADOR_ACTIVO.precio}
                </p>
                <p className={styles.precioDesc}>
                  El precio final se define en el presupuesto
                </p>
              </div>
              <div className={styles.precioDistancia}>
                <p className={styles.precioDistanciaNum}>
                  {SOLUCIONADOR_ACTIVO.distancia}
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
              {SOLUCIONADOR_ACTIVO.trabajos ||
                SOLUCIONADOR_ACTIVO.totalTrabajos}{" "}
              trabajos realizados
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
              Días y horarios en que {SOLUCIONADOR_ACTIVO.nombre.split(" ")[0]}{" "}
              suele estar disponible. Confirmá por chat antes de agendar.
            </p>

            {/* Encabezado turnos */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 4,
                paddingLeft: 84,
              }}
            >
              {["7–12", "12–15", "15–19", "19–21"].map((t) => (
                <div
                  key={t}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--tp-marron-suave)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* Grilla días × turnos */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { dia: "Lunes", key: "Lun" },
                { dia: "Martes", key: "Mar" },
                { dia: "Miércoles", key: "Mié" },
                { dia: "Jueves", key: "Jue" },
                { dia: "Viernes", key: "Vie" },
                { dia: "Sábado", key: "Sáb" },
                { dia: "Domingo", key: "Dom" },
              ].map((fila) => {
                const activo = SOLUCIONADOR_ACTIVO.disponibilidad.includes(
                  fila.key,
                );
                return (
                  <div
                    key={fila.key}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <span
                      style={{
                        width: 80,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "var(--fuente)",
                        color: activo
                          ? "var(--tp-marron)"
                          : "var(--tp-marron-suave)",
                        opacity: activo ? 1 : 0.35,
                      }}
                    >
                      {fila.dia}
                    </span>
                    {[
                      { id: "7-12", label: "7–12" },
                      { id: "12-15", label: "12–15" },
                      { id: "15-19", label: "15–19" },
                      { id: "19-21", label: "19–21" },
                    ].map((turno) => {
                      const disponible =
                        activo &&
                        (turno.id === "7-12" ||
                          turno.id === "12-15" ||
                          (fila.key !== "Sáb" &&
                            fila.key !== "Dom" &&
                            turno.id === "15-19"));
                      return (
                        <div
                          key={turno.id}
                          style={{
                            flex: 1,
                            padding: "7px 2px",
                            borderRadius: 6,
                            textAlign: "center",
                            fontSize: 11,
                            fontFamily: "var(--fuente)",
                            fontWeight: disponible ? 700 : 400,
                            background: disponible
                              ? "var(--tp-rojo-suave)"
                              : "rgba(61,31,31,0.04)",
                            color: disponible
                              ? "var(--tp-rojo)"
                              : "rgba(61,31,31,0.12)",
                            border: disponible
                              ? "1px solid rgba(184,64,48,0.2)"
                              : "1px solid rgba(61,31,31,0.06)",
                          }}
                        >
                          {disponible ? turno.label : ""}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: RESEÑAS */}
        {tabActiva === "reseñas" && (
          <div className={styles.tabContenido}>
            {/* Resumen de reputación */}
            <div className={styles.reputacionResumen}>
              <div className={styles.reputacionNumGrande}>
                {SOLUCIONADOR_ACTIVO.calificacion ||
                  SOLUCIONADOR_ACTIVO.reputacion}
              </div>
              <div className={styles.reputacionDetalle}>
                <div className={styles.estrellas}>
                  {"⭐".repeat(
                    Math.round(
                      SOLUCIONADOR_ACTIVO.calificacion ||
                        SOLUCIONADOR_ACTIVO.reputacion ||
                        5,
                    ),
                  )}
                </div>
                <p className={styles.reputacionTotal}>
                  {SOLUCIONADOR_ACTIVO.totalReseñas} reseñas verificadas
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
            {SOLUCIONADOR_ACTIVO.precio}
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
              Contactar a {SOLUCIONADOR_ACTIVO_ACTIVO.nombre}
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
                  navigate(`/chat?solId=${solIdParam || 1}`);
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
                  navigate(`/chat?solId=${solIdParam || 1}`);
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
