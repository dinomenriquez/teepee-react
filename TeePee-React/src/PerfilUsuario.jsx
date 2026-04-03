import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PerfilUsuario.module.css";
import { IconoVolver } from "./Iconos";

const USUARIO = {
  nombre: "Martín García",
  email: "martin.garcia@gmail.com",
  telefono: "+54 376 412-3456",
  inicial: "M",
  miembro: "Marzo 2024",
  trabajosRealizados: 12,
  reputacion: 4.8,
};

const DOMICILIOS = [
  {
    id: 1,
    label: "Casa",
    direccion: "Av. Mitre 1234, Posadas",
    principal: true,
  },
  {
    id: 2,
    label: "Trabajo",
    direccion: "San Lorenzo 456, Posadas",
    principal: false,
  },
];

const MEDIOS_PAGO = [
  {
    id: 1,
    tipo: "MercadoPago",
    detalle: "martin.garcia@gmail.com",
    icono: "🔵",
  },
  { id: 2, tipo: "Visa", detalle: "**** **** **** 4521", icono: "💳" },
];

const DIAS = [
  { id: "lun", label: "Lunes" },
  { id: "mar", label: "Martes" },
  { id: "mie", label: "Miércoles" },
  { id: "jue", label: "Jueves" },
  { id: "vie", label: "Viernes" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
];

const TURNOS = [
  { id: "7-12", label: "7–12" },
  { id: "12-15", label: "12–15" },
  { id: "15-19", label: "15–19" },
  { id: "19-21", label: "19–21" },
];

export default function PerfilUsuario() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("perfil");
  const [toast, setToast] = useState(null);

  // Estado domicilios
  const [domicilios, setDomicilios] = useState([
    {
      id: 1,
      label: "Casa",
      direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
      principal: true,
      editando: false,
    },
    {
      id: 2,
      label: "Trabajo",
      direccion: "San Lorenzo 456 — Posadas",
      principal: false,
      editando: false,
    },
  ]);
  const [nuevoDom, setNuevoDom] = useState({ label: "", direccion: "" });
  const [agregandoDom, setAgregandoDom] = useState(false);

  // Estado medios de pago
  const [medios, setMedios] = useState([
    {
      id: 1,
      tipo: "MercadoPago",
      subtipo: "billetera",
      detalle: "laura.perez@gmail.com",
      icono: "💙",
    },
    {
      id: 2,
      tipo: "Visa",
      subtipo: "credito",
      detalle: "**** **** **** 4521",
      icono: "💳",
      vence: "06/27",
    },
  ]);
  const [agregandoMedio, setAgregandoMedio] = useState(false);
  const [nuevoMedio, setNuevoMedio] = useState({
    tipo: "mercadopago",
    numero: "",
    titular: "",
    vence: "",
    alias: "",
  });

  const [datosForm, setDatosForm] = useState({
    nombre: USUARIO.nombre,
    apellido: "García",
    email: USUARIO.email,
    telefono: USUARIO.telefono,
    fechaNacimiento: "15-05-1990",
    foto: null,
  });

  const [disponibilidad, setDisponibilidad] = useState([
    "lun-7-12",
    "lun-15-19",
    "mie-7-12",
    "sab-7-12",
    "sab-12-15",
  ]);

  const [horasPuntuales, setHorasPuntuales] = useState({});

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function toggleTurno(diaId, turnoId) {
    const key = `${diaId}-${turnoId}`;
    setDisponibilidad((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function seleccionarAtajo(dias) {
    const keys = dias.flatMap((d) => TURNOS.map((t) => `${d}-${t.id}`));
    const todosActivos = keys.every((k) => disponibilidad.includes(k));
    setDisponibilidad((prev) =>
      todosActivos
        ? prev.filter((k) => !keys.includes(k))
        : [...new Set([...prev, ...keys])],
    );
  }

  const turnosSeleccionados = disponibilidad.length;

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mi Perfil</span>
        <div style={{ width: 36 }} />
      </header>

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroAvatar}>{USUARIO.inicial}</div>
        <div className={styles.heroInfo}>
          <p className={styles.heroNombre}>{USUARIO.nombre}</p>
          <p className={styles.heroMiembro}>Miembro desde {USUARIO.miembro}</p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatVal}>
              {USUARIO.trabajosRealizados}
            </span>
            <span className={styles.heroStatLabel}>Trabajos</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatVal}>⭐ {USUARIO.reputacion}</span>
            <span className={styles.heroStatLabel}>Reputación</span>
          </div>
        </div>
      </div>
      {/* ── COMPLETITUD DEL PERFIL ── */}
      {(() => {
        const items = [
          { label: "Foto de perfil", completo: false },
          { label: "Teléfono", completo: false },
          { label: "Fecha de nacimiento", completo: false },
          { label: "Domicilio principal", completo: true },
          { label: "Método de pago", completo: true },
          { label: "Disponibilidad", completo: true },
        ];
        const completados = items.filter((i) => i.completo).length;
        const porcentaje = Math.round((completados / items.length) * 100);
        const completo = porcentaje === 100;

        if (completo) return null;

        return (
          <div className={styles.completitudBloque}>
            <div className={styles.completitudHeader}>
              <span className={styles.completitudTitulo}>
                Completá tu perfil
              </span>
              <span className={styles.completitudPct}>{porcentaje}%</span>
            </div>
            <div className={styles.completitudBarra}>
              <div
                className={styles.completitudRelleno}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className={styles.completitudItems}>
              {items
                .filter((i) => !i.completo)
                .map((item) => (
                  <div key={item.label} className={styles.completitudItem}>
                    <span className={styles.completitudItemIcono}>○</span>
                    <span className={styles.completitudItemLabel}>
                      {item.label}
                    </span>
                  </div>
                ))}
            </div>
            <div className={styles.completitudAviso}>
              <span>⚠️</span>
              <p>
                Necesitás el perfil completo para solicitar y pagar servicios.
              </p>
            </div>
          </div>
        );
      })()}
      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {[
          { id: "perfil", icono: "👤", label: "Datos" },
          { id: "domicilios", icono: "📍", label: "Domicilios" },
          { id: "pagos", icono: "💳", label: "Pagos" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span style={{ fontSize: 16, display: "block", lineHeight: 1.2 }}>
              {t.icono}
            </span>
            <span style={{ display: "block" }}>{t.label}</span>
          </button>
        ))}
      </div>

      <main className={styles.contenido}>
        {/* ── TAB: DATOS ── */}
        {tab === "perfil" && (
          <section className={styles.seccion}>
            {/* Foto de perfil */}
            <div className={styles.fotoBloque}>
              <div className={styles.fotoAvatar}>
                {datosForm.foto ? (
                  <img
                    src={datosForm.foto}
                    alt="perfil"
                    className={styles.fotoImg}
                  />
                ) : (
                  <span className={styles.fotoInicial}>
                    {datosForm.nombre?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div className={styles.fotoAcciones}>
                <p className={styles.fotoLabel}>Foto de perfil</p>
                <p className={styles.fotoSub}>
                  Opcional — ayuda a generar confianza
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
                      const url = URL.createObjectURL(file);
                      setDatosForm((prev) => ({ ...prev, foto: url }));
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
                  value={datosForm.nombre}
                  onChange={(e) =>
                    setDatosForm((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Apellido</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  value={datosForm.apellido || ""}
                  onChange={(e) =>
                    setDatosForm((prev) => ({
                      ...prev,
                      apellido: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Email</label>
              <input
                type="email"
                className={styles.campoInput}
                value={datosForm.email}
                onChange={(e) =>
                  setDatosForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>

            {/* Teléfono */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Teléfono</label>
              <input
                type="tel"
                className={styles.campoInput}
                value={datosForm.telefono}
                onChange={(e) =>
                  setDatosForm((prev) => ({
                    ...prev,
                    telefono: e.target.value,
                  }))
                }
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Fecha de nacimiento
                <span className={styles.campoRequerido}> *</span>
              </label>
              <input
                type="date"
                className={styles.campoInput}
                value={datosForm.fechaNacimiento || ""}
                max={(() => {
                  const d = new Date();
                  d.setFullYear(d.getFullYear() - 18);
                  return d.toISOString().split("T")[0];
                })()}
                onChange={(e) => {
                  const fecha = e.target.value;
                  const edad =
                    new Date().getFullYear() - new Date(fecha).getFullYear();
                  if (edad < 18) {
                    mostrarToast("⚠️ Debés ser mayor de 18 años");
                    return;
                  }
                  setDatosForm((prev) => ({ ...prev, fechaNacimiento: fecha }));
                }}
              />
              <span className={styles.campoHint}>
                Debés tener al menos 18 años para usar TeePee
              </span>
            </div>

            {/* Botón guardar */}
            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Cambios guardados")}
            >
              Guardar cambios
            </button>

            <button
              type="button"
              className={styles.btnPeligro}
              onClick={() => mostrarToast("Función disponible próximamente")}
            >
              Eliminar cuenta
            </button>
          </section>
        )}

        {/* ── TAB: DISPONIBILIDAD ── */}

        {/* ── TAB: DOMICILIOS ── */}
        {tab === "domicilios" && (
          <section className={styles.seccion}>
            <p className={styles.seccionDesc}>
              Tus domicilios se sugieren al hacer una solicitud de servicio.
            </p>

            {domicilios.map((dom) => (
              <div
                key={dom.id}
                style={{
                  background: "var(--tp-crema-clara)",
                  borderRadius: "var(--r-md)",
                  padding: 14,
                  marginBottom: 10,
                  border: "1px solid rgba(61,31,31,0.08)",
                }}
              >
                {dom.editando ? (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <input
                      type="text"
                      placeholder="Referencia (Casa, Trabajo...)"
                      value={dom.label}
                      onChange={(e) =>
                        setDomicilios((prev) =>
                          prev.map((d) =>
                            d.id === dom.id
                              ? { ...d, label: e.target.value }
                              : d,
                          ),
                        )
                      }
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(61,31,31,0.15)",
                        fontFamily: "var(--fuente)",
                        fontSize: 13,
                        color: "var(--tp-marron)",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Dirección completa"
                      value={dom.direccion}
                      onChange={(e) =>
                        setDomicilios((prev) =>
                          prev.map((d) =>
                            d.id === dom.id
                              ? { ...d, direccion: e.target.value }
                              : d,
                          ),
                        )
                      }
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(61,31,31,0.15)",
                        fontFamily: "var(--fuente)",
                        fontSize: 13,
                        color: "var(--tp-marron)",
                        outline: "none",
                      }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setDomicilios((prev) =>
                            prev.map((d) =>
                              d.id === dom.id ? { ...d, editando: false } : d,
                            ),
                          );
                          mostrarToast("✅ Domicilio guardado");
                        }}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: 8,
                          background: "var(--tp-marron)",
                          color: "var(--tp-crema)",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--fuente)",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDomicilios((prev) =>
                            prev.map((d) =>
                              d.id === dom.id ? { ...d, editando: false } : d,
                            ),
                          )
                        }
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: 8,
                          background: "none",
                          color: "var(--tp-marron-suave)",
                          border: "1px solid rgba(61,31,31,0.15)",
                          cursor: "pointer",
                          fontFamily: "var(--fuente)",
                          fontSize: 13,
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span style={{ fontSize: 20 }}>📍</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--tp-marron)",
                            fontFamily: "var(--fuente)",
                          }}
                        >
                          {dom.label}
                        </span>
                        {dom.principal && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "var(--tp-rojo)",
                              background: "rgba(184,64,48,0.10)",
                              padding: "1px 7px",
                              borderRadius: 20,
                              fontFamily: "var(--fuente)",
                            }}
                          >
                            Principal
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--tp-marron-suave)",
                          fontFamily: "var(--fuente)",
                        }}
                      >
                        {dom.direccion}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {!dom.principal && (
                        <button
                          type="button"
                          onClick={() =>
                            setDomicilios((prev) =>
                              prev.map((d) => ({
                                ...d,
                                principal: d.id === dom.id,
                              })),
                            )
                          }
                          style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            borderRadius: 20,
                            border: "1px solid rgba(61,31,31,0.15)",
                            background: "none",
                            cursor: "pointer",
                            color: "var(--tp-marron-suave)",
                            fontFamily: "var(--fuente)",
                          }}
                        >
                          Fijar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setDomicilios((prev) =>
                            prev.map((d) =>
                              d.id === dom.id ? { ...d, editando: true } : d,
                            ),
                          )
                        }
                        style={{
                          fontSize: 16,
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDomicilios((prev) =>
                            prev.filter((d) => d.id !== dom.id),
                          )
                        }
                        style={{
                          fontSize: 16,
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Agregar nuevo domicilio */}
            {agregandoDom ? (
              <div
                style={{
                  background: "var(--tp-crema-clara)",
                  borderRadius: "var(--r-md)",
                  padding: 14,
                  border: "1px dashed rgba(61,31,31,0.20)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <input
                  type="text"
                  placeholder="Referencia (Casa, Trabajo, etc.)"
                  value={nuevoDom.label}
                  onChange={(e) =>
                    setNuevoDom((p) => ({ ...p, label: e.target.value }))
                  }
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(61,31,31,0.15)",
                    fontFamily: "var(--fuente)",
                    fontSize: 13,
                    color: "var(--tp-marron)",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Dirección completa"
                  value={nuevoDom.direccion}
                  onChange={(e) =>
                    setNuevoDom((p) => ({ ...p, direccion: e.target.value }))
                  }
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(61,31,31,0.15)",
                    fontFamily: "var(--fuente)",
                    fontSize: 13,
                    color: "var(--tp-marron)",
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!nuevoDom.label || !nuevoDom.direccion) {
                        mostrarToast("⚠️ Completá los dos campos");
                        return;
                      }
                      setDomicilios((prev) => [
                        ...prev,
                        {
                          id: Date.now(),
                          ...nuevoDom,
                          principal: false,
                          editando: false,
                        },
                      ]);
                      setNuevoDom({ label: "", direccion: "" });
                      setAgregandoDom(false);
                      mostrarToast("✅ Domicilio agregado");
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      background: "var(--tp-rojo)",
                      color: "var(--tp-crema)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--fuente)",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAgregandoDom(false)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      background: "none",
                      color: "var(--tp-marron-suave)",
                      border: "1px solid rgba(61,31,31,0.15)",
                      cursor: "pointer",
                      fontFamily: "var(--fuente)",
                      fontSize: 13,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.btnAgregar}
                onClick={() => setAgregandoDom(true)}
              >
                + Agregar domicilio
              </button>
            )}
          </section>
        )}

        {/* ── TAB: PAGOS ── */}
        {tab === "pagos" && (
          <section className={styles.seccion}>
            <p className={styles.seccionDesc}>
              Tus métodos de pago guardados para agilizar el proceso de pago.
            </p>

            {medios.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--tp-crema-clara)",
                  borderRadius: "var(--r-md)",
                  marginBottom: 10,
                  border: "1px solid rgba(61,31,31,0.08)",
                }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{m.icono}</span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--tp-marron)",
                      margin: 0,
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    {m.tipo}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--tp-marron-suave)",
                      margin: 0,
                      fontFamily: "var(--fuente)",
                    }}
                  >
                    {m.detalle}
                    {m.vence ? ` · Vence ${m.vence}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMedios((prev) => prev.filter((x) => x.id !== m.id));
                    mostrarToast("Método eliminado");
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}

            {/* Formulario agregar medio */}
            {agregandoMedio ? (
              <div
                style={{
                  background: "var(--tp-crema-clara)",
                  borderRadius: "var(--r-md)",
                  padding: 14,
                  border: "1px dashed rgba(61,31,31,0.20)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Selector de tipo */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 6,
                  }}
                >
                  {[
                    { id: "mercadopago", label: "MercadoPago", icono: "💙" },
                    { id: "credito", label: "Tarj. Crédito", icono: "💳" },
                    { id: "debito", label: "Tarj. Débito", icono: "🏦" },
                  ].map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() =>
                        setNuevoMedio((p) => ({ ...p, tipo: op.id }))
                      }
                      style={{
                        padding: "8px 4px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--fuente)",
                        fontSize: 11,
                        fontWeight: 600,
                        textAlign: "center",
                        background:
                          nuevoMedio.tipo === op.id
                            ? "var(--tp-marron)"
                            : "rgba(61,31,31,0.06)",
                        color:
                          nuevoMedio.tipo === op.id
                            ? "var(--tp-crema)"
                            : "var(--tp-marron)",
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 2 }}>
                        {op.icono}
                      </div>
                      {op.label}
                    </button>
                  ))}
                </div>

                {nuevoMedio.tipo === "mercadopago" && (
                  <input
                    type="text"
                    placeholder="Email o alias de MercadoPago"
                    value={nuevoMedio.alias}
                    onChange={(e) =>
                      setNuevoMedio((p) => ({ ...p, alias: e.target.value }))
                    }
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(61,31,31,0.15)",
                      fontFamily: "var(--fuente)",
                      fontSize: 13,
                      color: "var(--tp-marron)",
                      outline: "none",
                    }}
                  />
                )}

                {(nuevoMedio.tipo === "credito" ||
                  nuevoMedio.tipo === "debito") && (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del titular"
                      value={nuevoMedio.titular}
                      onChange={(e) =>
                        setNuevoMedio((p) => ({
                          ...p,
                          titular: e.target.value,
                        }))
                      }
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(61,31,31,0.15)",
                        fontFamily: "var(--fuente)",
                        fontSize: 13,
                        color: "var(--tp-marron)",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      value={nuevoMedio.numero}
                      onChange={(e) =>
                        setNuevoMedio((p) => ({ ...p, numero: e.target.value }))
                      }
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(61,31,31,0.15)",
                        fontFamily: "var(--fuente)",
                        fontSize: 13,
                        color: "var(--tp-marron)",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Vencimiento (MM/AA)"
                      value={nuevoMedio.vence}
                      onChange={(e) =>
                        setNuevoMedio((p) => ({ ...p, vence: e.target.value }))
                      }
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(61,31,31,0.15)",
                        fontFamily: "var(--fuente)",
                        fontSize: 13,
                        color: "var(--tp-marron)",
                        outline: "none",
                      }}
                    />
                  </>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const iconos = {
                        mercadopago: "💙",
                        credito: "💳",
                        debito: "🏦",
                      };
                      const tipos = {
                        mercadopago: "MercadoPago",
                        credito: "Tarjeta Crédito",
                        debito: "Tarjeta Débito",
                      };
                      const detalle =
                        nuevoMedio.tipo === "mercadopago"
                          ? nuevoMedio.alias
                          : nuevoMedio.numero
                            ? `**** ${nuevoMedio.numero.slice(-4)}`
                            : "Sin número";
                      setMedios((prev) => [
                        ...prev,
                        {
                          id: Date.now(),
                          tipo: tipos[nuevoMedio.tipo],
                          subtipo: nuevoMedio.tipo,
                          detalle,
                          icono: iconos[nuevoMedio.tipo],
                          vence: nuevoMedio.vence,
                          titular: nuevoMedio.titular,
                        },
                      ]);
                      setNuevoMedio({
                        tipo: "mercadopago",
                        numero: "",
                        titular: "",
                        vence: "",
                        alias: "",
                      });
                      setAgregandoMedio(false);
                      mostrarToast("✅ Medio de pago agregado");
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      background: "var(--tp-rojo)",
                      color: "var(--tp-crema)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--fuente)",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAgregandoMedio(false)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      background: "none",
                      color: "var(--tp-marron-suave)",
                      border: "1px solid rgba(61,31,31,0.15)",
                      cursor: "pointer",
                      fontFamily: "var(--fuente)",
                      fontSize: 13,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.btnAgregar}
                onClick={() => setAgregandoMedio(true)}
              >
                + Agregar medio de pago
              </button>
            )}
          </section>
        )}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
