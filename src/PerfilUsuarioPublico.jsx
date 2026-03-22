import { useNavigate, useSearchParams } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { IconoVolver } from "./Iconos";
import { MessageCircle, MapPin, Star, Briefcase } from "lucide-react";
import { getUsuario } from "./MockData";

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
  const usuarioIdParam = searchParams.get("usuarioId");
  const desdeParam     = searchParams.get("desde");
  const usuarioDinamico = usuarioIdParam ? getUsuario(Number(usuarioIdParam)) : null;
  const usuario = usuarioDinamico
    ? { ...USUARIO_DEFAULT, nombre: usuarioDinamico.nombre, inicial: usuarioDinamico.inicial, color: usuarioDinamico.color }
    : USUARIO_DEFAULT;

  function volver() {
    if (desdeParam === "seguimiento-s") navigate(-1);
    else navigate(-1);
  }

  return (
    <div style={{ background: "var(--tp-crema)", minHeight: "100vh", fontFamily: "var(--fuente)" }}>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--tp-crema)", borderBottom: "1px solid rgba(61,31,31,0.08)",
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={volver} style={{ border: "none", background: "none", cursor: "pointer" }}>
          <IconoVolver size={20} />
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>Perfil del cliente</h1>
      </header>

      {/* Hero */}
      <div style={{
        background: "var(--tp-crema-oscura)", padding: "24px 16px 20px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: usuario.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "white",
        }}>
          {usuario.inicial}
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>{usuario.nombre}</p>
          <p style={{ fontSize: 12, color: "var(--tp-marron-suave)", marginTop: 2 }}>Miembro desde {usuario.miembro}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 24, marginTop: 4 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>{usuario.trabajosRealizados}</p>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>Trabajos</p>
          </div>
          <div style={{ width: 1, background: "rgba(61,31,31,0.10)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--tp-marron)", margin: 0 }}>⭐ {usuario.reputacion}</p>
            <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: 0 }}>Reputación</p>
          </div>
        </div>

        {/* Botón chat */}
        <button
          type="button"
          onClick={() => navigate(`/chat-s?usuarioId=${usuarioIdParam || 1}&nombre=${encodeURIComponent(usuario.nombre)}&inicial=${usuario.inicial}`)}
          style={{
            marginTop: 8, display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: "var(--r-full)",
            background: "var(--tp-marron)", color: "var(--tp-crema)",
            border: "none", cursor: "pointer", fontFamily: "var(--fuente)",
            fontSize: 13, fontWeight: 700,
          }}
        >
          <MessageCircle size={16} /> Enviar mensaje
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Descripción */}
        <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-marron-suave)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sobre el cliente</p>
          <p style={{ fontSize: 13, color: "var(--tp-marron)", margin: 0, lineHeight: 1.6 }}>{usuario.descripcion}</p>
        </div>

        {/* Ubicación */}
        <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <MapPin size={18} style={{ color: "var(--tp-rojo)", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-marron-suave)", margin: 0 }}>Zona</p>
            <p style={{ fontSize: 13, color: "var(--tp-marron)", margin: 0 }}>{usuario.barrio}</p>
          </div>
        </div>

        {/* Historial como cliente */}
        <div style={{ background: "var(--tp-crema-clara)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid rgba(61,31,31,0.08)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--tp-marron-suave)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Historial</p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Briefcase size={14} style={{ color: "var(--tp-marron-suave)" }} />
              <span style={{ fontSize: 13, color: "var(--tp-marron)" }}>{usuario.trabajosRealizados} trabajos solicitados</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <Star size={14} style={{ color: "var(--amarillo)" }} />
            <span style={{ fontSize: 13, color: "var(--tp-marron)" }}>Reputación {usuario.reputacion} / 5.0</span>
          </div>
        </div>

        {/* Badge de confianza */}
        <div style={{
          background: "var(--verde-suave)", borderRadius: "var(--r-md)", padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 8,
          border: "1px solid rgba(42,125,90,0.15)",
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <p style={{ fontSize: 12, color: "var(--tp-marron)", margin: 0 }}>
            <strong>Cliente verificado</strong> · Identidad confirmada por TeePee
          </p>
        </div>

      </div>
      <NavInferiorS />
    </div>
  );
}