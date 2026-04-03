import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import { useAuth } from "./AuthContext";
import styles from "./PerfilSolucionadorEdit.module.css";
import {
  IconoPlomeria,
  IconoGas,
  IconoPintura,
  IconoAireAcond,
  IconoCarpinteria,
  IconoLimpieza,
  IconoCerrajeria,
  IconoJardineria,
  IconoPerfil,
  IconoVolver,
} from "./Iconos";
import { Zap, Hammer, FileText, DollarSign } from "lucide-react";

const OFICIOS_PRINCIPALES = [
  { id: "plomeria", icono: <IconoPlomeria size={18} />, nombre: "Plomería" },
  { id: "electrico", icono: <Zap size={18} />, nombre: "Electricidad" },
  { id: "gas", icono: <IconoGas size={18} />, nombre: "Gas" },
  { id: "pintura", icono: <IconoPintura size={18} />, nombre: "Pintura" },
  {
    id: "carpinteria",
    icono: <IconoCarpinteria size={18} />,
    nombre: "Carpintería",
  },
  {
    id: "aa",
    icono: <IconoAireAcond size={18} />,
    nombre: "Aire Acondicionado",
  },
  { id: "albanileria", icono: <Hammer size={18} />, nombre: "Albañilería" },
  { id: "limpieza", icono: <IconoLimpieza size={18} />, nombre: "Limpieza" },
  {
    id: "cerrajeria",
    icono: <IconoCerrajeria size={18} />,
    nombre: "Cerrajería",
  },
  {
    id: "jardineria",
    icono: <IconoJardineria size={18} />,
    nombre: "Jardinería",
  },
];

const OFICIOS_EXTRAS = [
  { id: "herreria", nombre: "Herrería" },
  { id: "soldadura", nombre: "Soldadura" },
  { id: "techista", nombre: "Techista" },
  { id: "plaquista", nombre: "Plaquista / Durlock" },
  { id: "pisos", nombre: "Pisos y revestimientos" },
  { id: "vidrios", nombre: "Vidriería" },
  { id: "fumigacion", nombre: "Fumigación" },
  { id: "mudanzas", nombre: "Mudanzas" },
  { id: "electricista_industrial", nombre: "Electricista industrial" },
  { id: "gasista_matriculado", nombre: "Gasista matriculado" },
  { id: "refrigeracion", nombre: "Refrigeración" },
  { id: "techos", nombre: "Techos y cubiertas" },
  { id: "antenas", nombre: "Antenas y CCTV" },
  { id: "redes", nombre: "Redes y cableado" },
  { id: "tapiceria", nombre: "Tapicería" },
  { id: "catering", nombre: "Servicios de catering" },
];

const OFICIOS_DISPONIBLES = [...OFICIOS_PRINCIPALES, ...OFICIOS_EXTRAS];

const RADIOS = ["5 km", "10 km", "15 km", "20 km", "30 km", "Sin límite"];

const EXPERIENCIA = [
  "Menos de 1 año",
  "1 a 3 años",
  "3 a 5 años",
  "5 a 10 años",
  "Más de 10 años",
];

const TABS = [
  { id: "personal", label: "Personal", icono: <IconoPerfil size={14} /> },
  {
    id: "profesional",
    label: "Profesional",
    icono: <IconoPlomeria size={14} />,
  },
  { id: "cobros", label: "Cobros", icono: <DollarSign size={14} /> },
  { id: "docs", label: "Docs", icono: <FileText size={14} /> },
];

const CAMPOS_REQUERIDOS = [
  { key: "foto", label: "Foto de perfil" },
  { key: "telefono", label: "Teléfono" },
  { key: "fechaNacimiento", label: "Fecha de nacimiento" },
  { key: "descripcion", label: "Descripción" },
  { key: "oficios", label: "Al menos un oficio" },
  { key: "zona", label: "Zona de trabajo" },
  { key: "cbu", label: "CBU para cobros" },
  { key: "fotoDni", label: "Foto del DNI" },
];

export default function PerfilSolucionadorEdit() {
  const navigate = useNavigate();
  const { sesion, activarSegundoRol, cambiarRol } = useAuth();

  const [tab, setTab] = useState("personal");
  const [toast, setToast] = useState(null);

  const [datos, setDatos] = useState({
    foto: null,
    nombre: "Juan",
    apellido: "Ledesma",
    email: "juan.ledesma@gmail.com",
    telefono: "",
    fechaNacimiento: "",
    descripcion: "",
    oficiosPrincipales: ["electrico"], // max 2
    oficiosSecundarios: [], // max 5
    oficiosExtras: [], // los que vienen del desplegable (ya visibles en grilla)
    experiencia: "",
    zona: "",
    garantia: false,
    diasGarantia: 30,
    cbu: "",
    aliasCbu: "",
    fotoDni: null,
  });

  function set(key, value) {
    setDatos((prev) => ({ ...prev, [key]: value }));
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const [mostrarExtras, setMostrarExtras] = useState(false);

  // Seleccionar oficio desde la grilla — cicla: sin selección → principal → secundario → sin selección
  function toggleOficio(id) {
    setDatos((prev) => {
      const esPpal = prev.oficiosPrincipales.includes(id);
      const esSec = prev.oficiosSecundarios.includes(id);

      if (!esPpal && !esSec) {
        // No seleccionado → intentar como principal (max 2)
        if (prev.oficiosPrincipales.length < 2) {
          return {
            ...prev,
            oficiosPrincipales: [...prev.oficiosPrincipales, id],
          };
        }
        // Si ya hay 2 principales, intentar como secundario (max 5)
        if (prev.oficiosSecundarios.length < 5) {
          return {
            ...prev,
            oficiosSecundarios: [...prev.oficiosSecundarios, id],
          };
        }
        mostrarToast("Límite alcanzado: 2 principales y 5 secundarios");
        return prev;
      }
      if (esPpal) {
        // Principal → secundario (si no está lleno)
        const sinPpal = prev.oficiosPrincipales.filter((x) => x !== id);
        if (prev.oficiosSecundarios.length < 5) {
          return {
            ...prev,
            oficiosPrincipales: sinPpal,
            oficiosSecundarios: [...prev.oficiosSecundarios, id],
          };
        }
        return { ...prev, oficiosPrincipales: sinPpal };
      }
      if (esSec) {
        // Secundario → deseleccionar (y quitar de extras si era extra)
        const sinSec = prev.oficiosSecundarios.filter((x) => x !== id);
        const sinExt = prev.oficiosExtras.filter((x) => x !== id);
        return { ...prev, oficiosSecundarios: sinSec, oficiosExtras: sinExt };
      }
      return prev;
    });
  }

  // Agregar oficio extra al desplegable y aplicar mismo sistema toque/doble toque
  function agregarOficioExtra(id) {
    setDatos((prev) => {
      // Si ya está en extras, usar el mismo sistema de toggle (ppal → sec → quitar)
      if (prev.oficiosExtras.includes(id)) {
        // Delegamos al toggleOficio que ya maneja el ciclo
        return prev; // toggleOficio se llama por separado
      }
      // Primera vez: agregar a extras como secundario
      const extras = [...prev.oficiosExtras, id];
      if (prev.oficiosSecundarios.length < 5) {
        return {
          ...prev,
          oficiosExtras: extras,
          oficiosSecundarios: [...prev.oficiosSecundarios, id],
        };
      }
      return { ...prev, oficiosExtras: extras };
    });
  }

  // Extra ya agregado → usar toggleOficio para ciclar entre ppal/sec/quitar
  function toggleOficioExtra(id) {
    if (!datos.oficiosExtras.includes(id)) {
      agregarOficioExtra(id);
    } else {
      toggleOficio(id);
    }
  }

  // Calcular completitud
  const completados = CAMPOS_REQUERIDOS.filter((c) => {
    const v = datos[c.key];
    if (Array.isArray(v)) return v.length > 0;
    return v && v !== "";
  });
  const porcentaje = Math.round(
    (completados.length / CAMPOS_REQUERIDOS.length) * 100,
  );
  const perfilCompleto = porcentaje === 100;

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mi Perfil</span>
        <button
          className={styles.btnGuardarHeader}
          onClick={() => {
            mostrarToast("✅ Perfil guardado");
            if (sesion && !sesion.roles?.includes("solucionador")) {
              // activarSegundoRol ya setea rolActivo = 'solucionador' internamente
              activarSegundoRol("solucionador");
              setTimeout(() => navigate("/home-solucionador"), 900);
            }
          }}
        >
          Guardar
        </button>
      </header>

      {/* ── COMPLETITUD ── */}
      <div className={styles.completitudBloque}>
        <div className={styles.completitudHeader}>
          <span className={styles.completitudTitulo}>
            {perfilCompleto ? "✅ Perfil completo" : "Completá tu perfil"}
          </span>
          <span
            className={`${styles.completitudPct} ${
              perfilCompleto ? styles.completitudPctOk : ""
            }`}
          >
            {porcentaje}%
          </span>
        </div>
        <div className={styles.completitudBarra}>
          <div
            className={`${styles.completitudRelleno} ${
              perfilCompleto ? styles.completitudRellenoOk : ""
            }`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        {!perfilCompleto && (
          <div className={styles.completitudPendientes}>
            {CAMPOS_REQUERIDOS.filter((c) => {
              const v = datos[c.key];
              if (Array.isArray(v)) return v.length === 0;
              return !v || v === "";
            }).map((c) => (
              <span key={c.key} className={styles.completitudChip}>
                ○ {c.label}
              </span>
            ))}
          </div>
        )}
        {!perfilCompleto && (
          <p className={styles.completitudAviso}>
            ⚠️ Necesitás el perfil completo para aceptar trabajos y cobrar.
          </p>
        )}
      </div>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.icono} {t.label}
          </button>
        ))}
      </div>

      <main className={styles.contenido}>
        {/* ── TAB: PERSONAL ── */}
        {tab === "personal" && (
          <section className={styles.seccion}>
            {/* Foto */}
            <div className={styles.fotoBloque}>
              <div className={styles.fotoAvatar}>
                {datos.foto ? (
                  <img
                    src={datos.foto}
                    alt="perfil"
                    className={styles.fotoImg}
                  />
                ) : (
                  <span className={styles.fotoInicial}>
                    {datos.nombre?.charAt(0) || "S"}
                  </span>
                )}
              </div>
              <div className={styles.fotoAcciones}>
                <p className={styles.fotoLabel}>Foto de perfil</p>
                <p className={styles.fotoSub}>
                  Genera más confianza y mejora tu ranking
                </p>
                <label className={styles.fotoBtnLabel}>
                  📷 Subir foto
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fotoInput}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      set("foto", URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className={styles.campoFila}>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Nombre</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  value={datos.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                />
              </div>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Apellido</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  value={datos.apellido}
                  onChange={(e) => set("apellido", e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Email</label>
              <input
                type="email"
                className={styles.campoInput}
                value={datos.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>

            {/* Teléfono */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Teléfono <span className={styles.req}>*</span>
              </label>
              <input
                type="tel"
                className={styles.campoInput}
                placeholder="+54 376 xxxxxxx"
                value={datos.telefono}
                onChange={(e) => set("telefono", e.target.value)}
              />
            </div>

            {/* Fecha nacimiento */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Fecha de nacimiento <span className={styles.req}>*</span>
              </label>
              <input
                type="date"
                className={styles.campoInput}
                value={datos.fechaNacimiento}
                max={(() => {
                  const d = new Date();
                  d.setFullYear(d.getFullYear() - 18);
                  return d.toISOString().split("T")[0];
                })()}
                onChange={(e) => {
                  const edad =
                    new Date().getFullYear() -
                    new Date(e.target.value).getFullYear();
                  if (edad < 18) {
                    mostrarToast("⚠️ Debés tener al menos 18 años");
                    return;
                  }
                  set("fechaNacimiento", e.target.value);
                }}
              />
              <span className={styles.campoHint}>
                Debés tener al menos 18 años
              </span>
            </div>

            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Datos personales guardados")}
            >
              Guardar datos personales
            </button>
          </section>
        )}

        {/* ── TAB: PROFESIONAL ── */}
        {tab === "profesional" && (
          <section className={styles.seccion}>
            {/* Descripción */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Descripción / Sobre mí <span className={styles.req}>*</span>
              </label>
              <textarea
                className={styles.campoTextarea}
                placeholder="Contá tu experiencia, cómo trabajás, qué te diferencia..."
                value={datos.descripcion}
                rows={4}
                onChange={(e) => set("descripcion", e.target.value)}
              />
              <span className={styles.campoHint}>
                {datos.descripcion.length}/300 caracteres
              </span>
            </div>

            {/* Oficios */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Oficios <span className={styles.req}>*</span>
              </label>

              {/* Contadores */}
              <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--fuente)",
                    color:
                      datos.oficiosPrincipales.length === 2
                        ? "var(--tp-rojo)"
                        : "var(--tp-marron-suave)",
                  }}
                >
                  ⭐ Principales:{" "}
                  <strong>{datos.oficiosPrincipales.length}/2</strong>
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--fuente)",
                    color:
                      datos.oficiosSecundarios.length === 5
                        ? "var(--tp-rojo)"
                        : "var(--tp-marron-suave)",
                  }}
                >
                  🔵 Secundarios:{" "}
                  <strong>{datos.oficiosSecundarios.length}/5</strong>
                </span>
              </div>

              {/* Instrucción */}
              <p className={styles.campoSublabel} style={{ marginBottom: 10 }}>
                1er toque → <strong>⭐ principal</strong> · 2do toque →{" "}
                <strong>🔵 secundario</strong> · 3er toque → quitar
              </p>

              {/* Grilla — frecuentes fijos + extras seleccionados */}
              <div className={styles.oficiosGrid}>
                {[
                  ...OFICIOS_PRINCIPALES,
                  ...OFICIOS_EXTRAS.filter((o) =>
                    datos.oficiosExtras.includes(o.id),
                  ),
                ].map((o) => {
                  const esPpal = datos.oficiosPrincipales.includes(o.id);
                  const esSec = datos.oficiosSecundarios.includes(o.id);
                  const esExtra = datos.oficiosExtras.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      className={`${styles.oficioBtn} ${
                        esPpal
                          ? styles.oficioBtnPrincipal
                          : esSec
                            ? styles.oficioBtnSecundario
                            : ""
                      }`}
                      onClick={() => toggleOficio(o.id)}
                    >
                      {o.icono && <span>{o.icono}</span>}
                      <span>{o.nombre}</span>
                      {esPpal && (
                        <span style={{ fontSize: 11, marginLeft: "auto" }}>
                          ⭐
                        </span>
                      )}
                      {esSec && (
                        <span style={{ fontSize: 11, marginLeft: "auto" }}>
                          🔵
                        </span>
                      )}
                      {esExtra && !esPpal && !esSec && (
                        <span
                          style={{
                            fontSize: 9,
                            marginLeft: "auto",
                            color: "var(--tp-marron-suave)",
                          }}
                        >
                          ●
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--tp-marron-suave)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  ⭐ Principal (máx. 2)
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--tp-marron-suave)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  🔵 Secundario (máx. 5)
                </span>
              </div>

              {/* Desplegable de otros oficios */}
              <button
                type="button"
                onClick={() => setMostrarExtras(!mostrarExtras)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(61,31,31,0.04)",
                  border: "1px dashed rgba(61,31,31,0.18)",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--tp-marron)",
                    fontWeight: 600,
                  }}
                >
                  + Otros oficios menos frecuentes
                  {datos.oficiosExtras.length > 0 && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 11,
                        color: "var(--tp-rojo)",
                        fontWeight: 700,
                      }}
                    >
                      ({datos.oficiosExtras.length} agregados)
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 16, color: "var(--tp-marron-suave)" }}>
                  {mostrarExtras ? "▲" : "▼"}
                </span>
              </button>

              {mostrarExtras && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 12,
                    background: "rgba(61,31,31,0.03)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid rgba(61,31,31,0.08)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <p
                    style={{
                      width: "100%",
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                      margin: "0 0 6px",
                      fontFamily: "var(--fuente)",
                      fontWeight: 600,
                    }}
                  >
                    Igual que arriba: 1 toque = ⭐ Principal · 2 toques = 🔵
                    Secundario · 3 toques = quitar
                  </p>
                  {OFICIOS_EXTRAS.map((o) => {
                    const sel = datos.oficiosExtras.includes(o.id);
                    const esPpal = datos.oficiosPrincipales.includes(o.id);
                    const esSec = datos.oficiosSecundarios.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggleOficioExtra(o.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--r-full)",
                          border: esPpal
                            ? "2px solid var(--tp-rojo)"
                            : esSec
                              ? "2px solid #2A7D5A"
                              : "1px solid rgba(61,31,31,0.15)",
                          background: esPpal
                            ? "var(--tp-rojo)"
                            : esSec
                              ? "#2A7D5A"
                              : "var(--tp-crema)",
                          color: esPpal || esSec ? "white" : "var(--tp-marron)",
                          fontSize: 12,
                          fontWeight: sel ? 700 : 400,
                          cursor: "pointer",
                          fontFamily: "var(--fuente)",
                        }}
                      >
                        {esPpal ? "⭐ " : esSec ? "🔵 " : ""}
                        {o.nombre}
                      </button>
                    );
                  })}
                  {/* Campo Otro oficio */}
                  <div
                    style={{
                      width: "100%",
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px dashed rgba(61,31,31,0.12)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--tp-marron-suave)",
                        margin: "0 0 6px",
                        fontFamily: "var(--fuente)",
                        fontWeight: 600,
                      }}
                    >
                      Otro oficio no listado:
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Ej: Instalador de aires"
                        value={datos.otroOficio || ""}
                        onChange={(e) => set("otroOficio", e.target.value)}
                        style={{
                          flex: 1,
                          padding: "7px 10px",
                          borderRadius: 8,
                          border: "1px solid rgba(61,31,31,0.15)",
                          background: "var(--tp-crema)",
                          fontFamily: "var(--fuente)",
                          fontSize: 13,
                          color: "var(--tp-marron)",
                          outline: "none",
                        }}
                      />
                      <select
                        value={datos.otroOficioTipo || "secundario"}
                        onChange={(e) => set("otroOficioTipo", e.target.value)}
                        style={{
                          padding: "7px 8px",
                          borderRadius: 8,
                          border: "1px solid rgba(61,31,31,0.15)",
                          background: "var(--tp-crema)",
                          fontFamily: "var(--fuente)",
                          fontSize: 12,
                          color: "var(--tp-marron)",
                          cursor: "pointer",
                        }}
                      >
                        <option value="principal">⭐ Principal</option>
                        <option value="secundario">🔵 Secundario</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Experiencia */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Años de experiencia</label>
              <select
                className={styles.campoSelect}
                value={datos.experiencia}
                onChange={(e) => set("experiencia", e.target.value)}
              >
                <option value="">Seleccioná</option>
                {EXPERIENCIA.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            {/* Zona */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Zona de trabajo <span className={styles.req}>*</span>
              </label>
              <p className={styles.campoSublabel}>
                Radio máximo desde Posadas centro
              </p>
              <div className={styles.zonaGrid}>
                {RADIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`${styles.zonaBtn} ${
                      datos.zona === r ? styles.zonaBtnActivo : ""
                    }`}
                    onClick={() => set("zona", r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificados y títulos */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Títulos y certificados
              </label>
              <p className={styles.campoSublabel}>
                Títulos, certificados de oficio, constancias de trabajo,
                habilitaciones, etc. Podés adjuntar todos los que quieras.
              </p>

              {/* Lista de documentos adjuntos */}
              {(datos.certificados || []).length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  {(datos.certificados || []).map((cert, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: "var(--r-md)",
                        background: "rgba(42,125,90,0.08)",
                        border: "1px solid rgba(42,125,90,0.15)",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>
                        {cert.tipo === "pdf" ? "📄" : "🖼️"}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--tp-marron)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cert.nombre}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--tp-marron-suave)",
                            margin: 0,
                          }}
                        >
                          {cert.label}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            "certificados",
                            (datos.certificados || []).filter(
                              (_, j) => j !== i,
                            ),
                          )
                        }
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "var(--tp-rojo)",
                          fontSize: 16,
                          padding: 4,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón agregar */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "14px 12px",
                  borderRadius: "var(--r-md)",
                  border: "1.5px dashed rgba(61,31,31,0.20)",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: "var(--fuente)",
                }}
              >
                <span style={{ fontSize: 22 }}>📎</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--tp-marron)",
                  }}
                >
                  Adjuntar documento / imagen
                </span>
                <span style={{ fontSize: 11, color: "var(--tp-marron-suave)" }}>
                  JPG, PNG, PDF — sin límite de cantidad
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const nuevos = files.map((f) => ({
                      nombre: f.name,
                      tipo: f.type.includes("pdf") ? "pdf" : "imagen",
                      label: "Certificado / Título",
                    }));
                    set("certificados", [
                      ...(datos.certificados || []),
                      ...nuevos,
                    ]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {/* Garantía */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Garantía de trabajo realizado
              </label>
              <div className={styles.garantiaRow}>
                <button
                  type="button"
                  className={`${styles.garantiaBtn} ${
                    datos.garantia ? styles.garantiaBtnActivo : ""
                  }`}
                  onClick={() => set("garantia", !datos.garantia)}
                >
                  {datos.garantia
                    ? "✅ Ofrezco garantía"
                    : "○ Sin garantía propuesta"}
                </button>
                {datos.garantia && (
                  <div className={styles.garantiaDias}>
                    <label className={styles.campoLabel}>Días</label>
                    <input
                      type="number"
                      className={styles.campoInputSmall}
                      value={datos.diasGarantia}
                      min={1}
                      max={365}
                      onChange={(e) =>
                        set("diasGarantia", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                )}
              </div>
              <span className={styles.campoHint}>
                Ofrecer garantía mejora tu ranking un 15%
              </span>
            </div>

            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Datos profesionales guardados")}
            >
              Guardar datos profesionales
            </button>
          </section>
        )}

        {/* ── TAB: COBROS ── */}
        {tab === "cobros" && (
          <section className={styles.seccion}>
            <div className={styles.infoBloque}>
              <span>💡</span>
              <p>
                Tus cobros se acreditan todos los viernes. Podés tener hasta 2
                cuentas para recibir pagos.
              </p>
            </div>

            {/* Cuenta 1 */}
            <div
              className={styles.campoBloque}
              style={{
                background: "rgba(61,31,31,0.03)",
                borderRadius: "var(--r-md)",
                padding: 12,
                border: "1px solid rgba(61,31,31,0.08)",
                marginBottom: 12,
              }}
            >
              <label
                className={styles.campoLabel}
                style={{ marginBottom: 8, display: "block" }}
              >
                Cuenta 1 <span className={styles.req}>*</span>
              </label>
              <label className={styles.campoLabel}>CBU / CVU</label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="22 dígitos"
                value={datos.cbu}
                maxLength={22}
                onChange={(e) => set("cbu", e.target.value.replace(/\D/g, ""))}
              />
              <span className={styles.campoHint}>
                {datos.cbu.length}/22 dígitos
              </span>
              <label className={styles.campoLabel} style={{ marginTop: 8 }}>
                Alias (opcional)
              </label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="tu.alias.mp"
                value={datos.aliasCbu}
                onChange={(e) => set("aliasCbu", e.target.value)}
              />
              {datos.cbu.length === 22 && (
                <div className={styles.cbuOk}>✅ CBU válido</div>
              )}
            </div>

            {/* Cuenta 2 */}
            <div
              className={styles.campoBloque}
              style={{
                background: "rgba(61,31,31,0.03)",
                borderRadius: "var(--r-md)",
                padding: 12,
                border: "1px solid rgba(61,31,31,0.08)",
                marginBottom: 16,
              }}
            >
              <label
                className={styles.campoLabel}
                style={{ marginBottom: 8, display: "block" }}
              >
                Cuenta 2{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--tp-marron-suave)",
                    fontWeight: 400,
                  }}
                >
                  (opcional)
                </span>
              </label>
              <label className={styles.campoLabel}>CBU / CVU</label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="22 dígitos"
                value={datos.cbu2 || ""}
                maxLength={22}
                onChange={(e) => set("cbu2", e.target.value.replace(/\D/g, ""))}
              />
              <span className={styles.campoHint}>
                {(datos.cbu2 || "").length}/22 dígitos
              </span>
              <label className={styles.campoLabel} style={{ marginTop: 8 }}>
                Alias (opcional)
              </label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="tu.alias2.mp"
                value={datos.aliasCbu2 || ""}
                onChange={(e) => set("aliasCbu2", e.target.value)}
              />
            </div>

            {/* Datos de facturación */}
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--tp-marron)",
                margin: "0 0 10px",
                fontFamily: "var(--fuente)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Datos de facturación
            </p>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                CUIT / CUIL <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="XX-XXXXXXXX-X"
                value={datos.cuit || ""}
                maxLength={13}
                onChange={(e) => set("cuit", e.target.value)}
              />
            </div>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Razón social / Nombre <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="Nombre como aparece en AFIP"
                value={datos.razonSocial || ""}
                onChange={(e) => set("razonSocial", e.target.value)}
              />
            </div>

            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Datos de cobro guardados")}
            >
              Guardar datos de cobro
            </button>
          </section>
        )}

        {/* ── TAB: DOCS ── */}
        {tab === "docs" && (
          <section className={styles.seccion}>
            <div className={styles.infoBloque}>
              <span>🔒</span>
              <p>
                Tu DNI es solo para verificación de identidad. No se comparte
                con los usuarios.
              </p>
            </div>

            {/* Foto DNI */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Foto del DNI <span className={styles.req}>*</span>
              </label>
              <p className={styles.campoSublabel}>
                Frente del documento — debe verse claramente
              </p>

              {datos.fotoDni ? (
                <div className={styles.dniPreview}>
                  <img
                    src={datos.fotoDni}
                    alt="DNI"
                    className={styles.dniImg}
                  />
                  <button
                    type="button"
                    className={styles.dniCambiar}
                    onClick={() => set("fotoDni", null)}
                  >
                    Cambiar foto
                  </button>
                </div>
              ) : (
                <label className={styles.dniUpload}>
                  <span className={styles.dniUploadIcono}>📄</span>
                  <span className={styles.dniUploadTexto}>
                    Tocá para subir foto del DNI
                  </span>
                  <span className={styles.dniUploadSub}>
                    JPG, PNG — máx. 5 MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fotoInput}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      set("fotoDni", URL.createObjectURL(file));
                    }}
                  />
                </label>
              )}
            </div>

            {datos.fotoDni && (
              <div className={styles.verificacionEstado}>
                <span>🕐</span>
                <p>DNI enviado — verificación en proceso (24–48 hs)</p>
              </div>
            )}

            {/* Boleta de servicio */}
            <div className={styles.campoBloque} style={{ marginTop: 8 }}>
              <label className={styles.campoLabel}>
                Boleta de servicio (agua, luz, gas){" "}
                <span className={styles.req}>*</span>
              </label>
              <p className={styles.campoSublabel}>
                Debe mostrar tu nombre, apellido y domicilio claramente
              </p>
              {datos.fotoBoleta ? (
                <div className={styles.dniPreview}>
                  <img
                    src={datos.fotoBoleta}
                    alt="Boleta"
                    className={styles.dniImg}
                  />
                  <button
                    type="button"
                    className={styles.dniCambiar}
                    onClick={() => set("fotoBoleta", null)}
                  >
                    Cambiar boleta
                  </button>
                </div>
              ) : (
                <label className={styles.dniUpload}>
                  <span className={styles.dniUploadIcono}>📄</span>
                  <span className={styles.dniUploadTexto}>
                    Subir boleta de servicio
                  </span>
                  <span className={styles.dniUploadSub}>
                    Agua · Luz · Gas · AYSAM · EPEC
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className={styles.fotoInput}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) =>
                          set("fotoBoleta", ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Documentación guardada")}
            >
              Guardar documentación
            </button>
          </section>
        )}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}
