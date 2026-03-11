import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeUsuario.module.css";
import {
  IconoInicio,
  IconoBuscar,
  IconoTrabajos,
  IconoChat,
  IconoPerfil,
  LogoTeePee,
  LogoTexto,
  IconoEstrella,
  IconoPago,
} from "./Iconos";
import { IconoCampana, IconoConfig } from "./Iconos";
import {
  IconoPlomeria,
  IconoGas,
  IconoPintura,
  IconoAireAcond,
  IconoCarpinteria,
  IconoLimpieza,
  IconoCerrajeria,
  IconoJardineria,
} from "./Iconos";
import { Zap, Hammer } from "lucide-react";

const USUARIO = {
  nombre: "Martín García",
  inicial: "M",
  reputacion: 4.8,
  totalTrabajos: 12,
};

const TRABAJO_ACTIVO = {
  solucionador: "Carlos Méndez",
  oficio: "Plomero",
  descripcion: "Reparación de cañería bajo mesada",
  horario: "Hoy 14:30 hs",
  etapaActual: 2,
  totalEtapas: 3,
  progreso: 65,
};

const CATEGORIAS = [
  { id: 1, icono: <IconoPlomeria size={24} />, nombre: "Plomería" },
  { id: 2, icono: <Zap size={24} />, nombre: "Electricidad" },
  { id: 3, icono: <IconoGas size={24} />, nombre: "Gas" },
  { id: 4, icono: <IconoPintura size={24} />, nombre: "Pintura" },
  { id: 5, icono: <IconoAireAcond size={24} />, nombre: "Aire Acond." },
  { id: 6, icono: <IconoCarpinteria size={24} />, nombre: "Carpintería" },
  { id: 7, icono: <IconoLimpieza size={24} />, nombre: "Limpieza" },
  { id: 8, icono: <Hammer size={24} />, nombre: "Albañilería" },
];

const TRABAJOS_RECIENTES = [
  {
    id: 1,
    nombre: "Juan Ledesma",
    inicial: "J",
    tipo: "Electricidad · Cambio de tablero",
    monto: "$45.000",
    estado: "completado",
    estrellas: 5,
    color: "var(--tp-marron)",
  },
  {
    id: 2,
    nombre: "Carlos Méndez",
    inicial: "C",
    tipo: "Plomería · Reparación cañería",
    monto: "$28.000",
    estado: "en-curso",
    estrellas: null,
    color: "var(--tp-rojo)",
  },
  {
    id: 3,
    nombre: "Ana Rodríguez",
    inicial: "A",
    tipo: "Pintura · Interior 3 ambientes",
    monto: "$95.000",
    estado: "pendiente",
    estrellas: 4,
    color: "var(--tp-marron-medio)",
  },
];

const NAV_ITEMS = [
  { id: "inicio", icono: <IconoInicio size={20} />, label: "Inicio" },
  { id: "buscar", icono: <IconoBuscar size={20} />, label: "Buscar" },
  { id: "trabajos", icono: <IconoTrabajos size={20} />, label: "Trabajos" },
  { id: "chat", icono: <IconoChat size={20} />, label: "Chat" },
  { id: "perfil", icono: <IconoPerfil size={20} />, label: "Perfil" },
];

export default function HomeUsuario() {
  const navigate = useNavigate();
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [navActiva, setNavActiva] = useState("inicio");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2500);
  }

  function handleSolicitar() {
    setModal({
      icono: "🔍",
      titulo: "Solicitar Servicio",
      mensaje:
        "En el Paso 5 (FastAPI) acá va a conectar con el motor de matching real de TeePee.",
      urgente: false,
    });
  }

  function handleUrgente() {
    setModal({
      icono: "🚨",
      titulo: "URGENTE AHORA",
      mensaje:
        "Buscando solucionadores disponibles en 15 km...\n\nEn el Paso 5 esto conecta con la API en tiempo real.",
      urgente: true,
    });
  }

  function handleCategoria(categoria) {
    setCategoriaActiva(categoria.id === categoriaActiva ? null : categoria.id);
    navigate("/busqueda");
  }

  return (
    <div className={styles.pantalla}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <LogoTeePee size={32} />
          <LogoTexto size={16} />
        </div>
        <div className={styles.headerAcciones}>
          <button
            className={styles.btnIcono}
            title="Notificaciones"
            onClick={() => navigate("/notificaciones")}
          >
            <IconoCampana size={20} />
            <div className={styles.notifBadge}></div>
          </button>
          <button className={styles.btnIcono} title="Configuración">
            <IconoConfig size={20} />
          </button>
        </div>
      </header>

      <main className={styles.contenido}>
        <section className={styles.saludo}>
          <div>
            <p className={styles.saludoSub}>¡Bienvenido de nuevo! 👋</p>
            <h1 className={styles.saludoNombre}>{USUARIO.nombre}</h1>
          </div>
          <div className={styles.avatar}>{USUARIO.inicial}</div>
        </section>

        <section className={styles.trabajoActivo}>
          <div className={styles.trabajoActivoHeader}>
            <div className={styles.trabajoActivoLabel}>
              <div className={styles.puntoActivo}></div>
              Trabajo en curso
            </div>
            <button
              type="button"
              className={styles.trabajoActivoBtn}
              onClick={() => navigate("/seguimiento")}
            >
              Ver detalle →
            </button>
          </div>
          <h2 className={styles.trabajoActivoNombre}>
            {TRABAJO_ACTIVO.solucionador} — {TRABAJO_ACTIVO.oficio}
          </h2>
          <p className={styles.trabajoActivoDesc}>
            {TRABAJO_ACTIVO.descripcion} · {TRABAJO_ACTIVO.horario}
          </p>
          <div className={styles.progreso}>
            <div
              className={styles.progresoBarra}
              style={{ width: `${TRABAJO_ACTIVO.progreso}%` }}
            />
          </div>
          <div className={styles.progresoLabels}>
            <span className={styles.progresoTexto}>
              Etapa {TRABAJO_ACTIVO.etapaActual} de {TRABAJO_ACTIVO.totalEtapas}
            </span>
            <span className={styles.progresoPct}>
              {TRABAJO_ACTIVO.progreso}%
            </span>
          </div>
        </section>
        {/* ── PRESUPUESTOS ── */}
        <section className={styles.presupuestosSection}>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>Presupuestos</h2>
            <button
              type="button"
              className={styles.seccionVerTodo}
              onClick={() => navigate("/presupuestos")}
            >
              Ver todos →
            </button>
          </div>
          <button
            type="button"
            className={styles.presupuestosBanner}
            onClick={() => navigate("/presupuestos")}
          >
            <div className={styles.presupuestosBannerLeft}>
              <span className={styles.presupuestosBadge}>3</span>
              <div>
                <p className={styles.presupuestosBannerTitulo}>
                  Presupuestos pendientes
                </p>
                <p className={styles.presupuestosBannerDesc}>
                  Pérdida de agua · Instalación luces · Pintura
                </p>
              </div>
            </div>
            <span className={styles.presupuestosFlecha}>›</span>
          </button>
        </section>
        <section className={styles.accionesPrincipales}>
          <p className={styles.accionesTitulo}>¿Qué necesitás?</p>
          <button
            type="button"
            className={styles.btnSolicitar}
            onClick={handleSolicitar}
          >
            <div className={styles.btnSolicitarIcono}>🔍</div>
            <div className={styles.btnSolicitarTexto}>
              <span className={styles.btnSolicitarTitulo}>
                Solicitar Servicio
              </span>
              <span className={styles.btnSolicitarSub}>
                Encontrá al profesional ideal
              </span>
            </div>
            <span className={styles.btnFlecha}>›</span>
          </button>
          <button
            type="button"
            className={styles.btnUrgente}
            onClick={handleUrgente}
          >
            <span className={styles.btnUrgenteIcono}>🚨</span>
            <div className={styles.btnUrgenteTexto}>
              <span className={styles.btnUrgenteTitulo}>URGENTE AHORA</span>
              <span className={styles.btnUrgenteSub}>
                Profesionales disponibles · radio 15 km
              </span>
            </div>
          </button>
          <div className={styles.accionesGrilla}>
            {[
              {
                icono: <IconoTrabajos size={22} />,
                titulo: "Mis trabajos",
                sub: "3 activos",
                ruta: "/trabajos",
              },
              {
                icono: <IconoChat size={22} />,
                titulo: "Mensajes",
                sub: "2 sin leer",
                ruta: "/chat",
              },
              {         
                icono: <IconoEstrella size={22} />,
                titulo: "Calificar",
                sub: "1 pendiente",
                ruta: "/calificacion",
              },
            ].map((item) => (
              <button
                key={item.titulo}
                type="button"
                className={styles.btnSecundario}
                onClick={() => navigate(item.ruta)}
              >
                <div className={styles.btnSecIcono}>{item.icono}</div>
                <span className={styles.btnSecTitulo}>{item.titulo}</span>
                <span className={styles.btnSecSub}>{item.sub}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>Servicios</h2>
            <a href="#" className={styles.seccionVerTodo}>
              Ver todos →
            </a>
          </div>
          <div className={styles.categoriasScroll}>
            {CATEGORIAS.map((cat) => (
              <div
                key={cat.id}
                className={`${styles.categoriaCard} ${categoriaActiva === cat.id ? styles.categoriaCardActiva : ""}`}
                onClick={() => handleCategoria(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoria(cat);
                  }
                }}
              >
                <div className={styles.categoriaIcono}>{cat.icono}</div>
                <span className={styles.categoriaNombre}>{cat.nombre}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>Recientes</h2>
            <a href="#" className={styles.seccionVerTodo}>
              Ver historial →
            </a>
          </div>
          <ul className={styles.trabajosLista}>
            {TRABAJOS_RECIENTES.map((trabajo) => (
              <li
                key={trabajo.id}
                className={styles.trabajoCard}
                onClick={() =>
                  mostrarToast(trabajo.nombre + " · " + trabajo.estado)
                }
              >
                <div
                  className={styles.trabajoAvatar}
                  style={{ background: trabajo.color }}
                >
                  {trabajo.inicial}
                </div>
                <div className={styles.trabajoInfo}>
                  <span className={styles.trabajoNombre}>{trabajo.nombre}</span>
                  <span className={styles.trabajoTipo}>{trabajo.tipo}</span>
                  {trabajo.estrellas && (
                    <div className={styles.estrellas}>
                      {"⭐".repeat(trabajo.estrellas)}
                      {"☆".repeat(5 - trabajo.estrellas)}
                    </div>
                  )}
                </div>
                <div className={styles.trabajoMeta}>
                  <span className={styles.trabajoMonto}>{trabajo.monto}</span>
                  <span
                    className={`${styles.trabajoEstado} ${styles["estado-" + trabajo.estado]}`}
                  >
                    {trabajo.estado === "completado" && "Completado"}
                    {trabajo.estado === "en-curso" && "En curso"}
                    {trabajo.estado === "pendiente" && "Pendiente"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.reputacionCard}>
          <div className={styles.reputacionIcono}>🏅</div>
          <div className={styles.reputacionInfo}>
            <p className={styles.reputacionTitulo}>Tu reputación en TeePee</p>
            <p className={styles.reputacionScore}>
              {USUARIO.reputacion} <span>/ 5.0</span>
            </p>
            <p className={styles.reputacionDesc}>
              Basado en {USUARIO.totalTrabajos} trabajos completados
            </p>
            <div className={styles.repBarraContainer}>
              <div
                className={styles.repBarra}
                style={{ width: `${(USUARIO.reputacion / 5) * 100}%` }}
              />
            </div>
          </div>
        </section>
      </main>

      <nav className={styles.navInferior}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${navActiva === item.id ? styles.navItemActivo : ""}`}
            onClick={() => {
              setNavActiva(item.id);
              if (item.id === "buscar") navigate("/busqueda");
              if (item.id === "chat") navigate("/chat");
              if (item.id === "perfil") navigate("/perfil-usuario");
              if (item.id === "trabajos") navigate("/trabajos");
            }}
          >
            <span className={styles.navIcono}>{item.icono}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      {toast && <div className={styles.toast}>{toast}</div>}

      {modal && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHandle}></div>
            <div className={styles.modalIcono}>{modal.icono}</div>
            <h2
              className={`${styles.modalTitulo} ${modal.urgente ? styles.modalTituloUrgente : ""}`}
            >
              {modal.titulo}
            </h2>
            <p className={styles.modalMensaje}>{modal.mensaje}</p>
            <button
              type="button"
              className={`${styles.modalBtn} ${modal.urgente ? styles.modalBtnUrgente : ""}`}
              onClick={() => setModal(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
