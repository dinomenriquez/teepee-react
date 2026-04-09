import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";
import { MessageCircle, MapPin, Star, Briefcase } from "lucide-react";
import { getUsuario } from "./MockData";
import styles from "./PerfilUsuarioPublico.module.css";

const USUARIO_DEFAULT = {
  nombre: "Martín García",
  inicial: "M",
  miembro: "Marzo 2024",
  trabajosRealizados: 12,
  reputacion: 4.8,
  barrio: "Centro, Posadas",
  descripcion: "Usuario frecuente de servicios del hogar. Puntual con los pagos y claro con las instrucciones.",
  color: "#B84030",
};

export default function PerfilUsuarioPublico() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const usuarioIdParam  = searchParams.get("usuarioId");
  const desdeParam      = searchParams.get("desde");
  const usuarioDinamico = usuarioIdParam ? getUsuario(Number(usuarioIdParam)) : null;
  const usuario = usuarioDinamico
    ? { ...USUARIO_DEFAULT, nombre: usuarioDinamico.nombre, inicial: usuarioDinamico.inicial, color: usuarioDinamico.color }
    : USUARIO_DEFAULT;

  function volver() { navigate(-1); }

  return (
    <div className={styles.pantalla}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={volver}>
          <IconoVolver size={20} />
        </button>
        <h1 className={styles.headerTitulo}>Perfil del cliente</h1>
      </header>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroAvatar} style={{ background: usuario.color }}>
          {usuario.inicial}
        </div>
        <div className={styles.heroNombreBloque}>
          <p className={styles.heroNombre}>{usuario.nombre}</p>
          <p className={styles.heroMiembro}>Miembro desde {usuario.miembro}</p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <p className={styles.heroStatVal}>{usuario.trabajosRealizados}</p>
            <p className={styles.heroStatLabel}>Trabajos</p>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <p className={styles.heroStatVal}>⭐ {usuario.reputacion}</p>
            <p className={styles.heroStatLabel}>Reputación</p>
          </div>
        </div>

        <button type="button" className={styles.btnChat}
          onClick={() => navigate(`/chat-s?usuarioId=${usuarioIdParam || 1}&nombre=${encodeURIComponent(usuario.nombre)}&inicial=${usuario.inicial}`)}>
          <MessageCircle size={16} /> Enviar mensaje
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        {/* Descripción */}
        <div className={styles.infoCard}>
          <p className={styles.infoCardLabel}>Sobre el cliente</p>
          <p className={styles.infoCardTexto}>{usuario.descripcion}</p>
        </div>

        {/* Ubicación */}
        <div className={styles.infoCardRow}>
          <MapPin size={18} className={styles.infoCardIconoRojo} />
          <div>
            <p className={styles.infoCardLabel}>Zona</p>
            <p className={styles.infoCardTexto}>{usuario.barrio}</p>
          </div>
        </div>

        {/* Historial */}
        <div className={styles.infoCard}>
          <p className={styles.infoCardLabel}>Historial</p>
          <div className={styles.historialFila}>
            <Briefcase size={14} className={styles.historialIcono} />
            <span className={styles.historialTexto}>{usuario.trabajosRealizados} trabajos solicitados</span>
          </div>
          <div className={styles.historialFila}>
            <Star size={14} className={styles.historialIconoAmarillo} />
            <span className={styles.historialTexto}>Reputación {usuario.reputacion} / 5.0</span>
          </div>
        </div>

        {/* Badge verificado */}
        <div className={styles.badgeVerificado}>
          <span className={styles.badgeIcono}>✅</span>
          <p className={styles.badgeTexto}>
            <strong>Cliente verificado</strong> · Identidad confirmada por TeePee
          </p>
        </div>
      </div>

      <NavInferiorS />
    </div>
  );
}