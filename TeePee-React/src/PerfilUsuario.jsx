import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PerfilUsuario.module.css";
import { IconoVolver } from './Iconos'

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
  const [editando, setEditando] = useState(false);
  const [toast, setToast] = useState(null);

  const [datosForm, setDatosForm] = useState({
    nombre:          USUARIO.nombre,
    apellido:        'García',
    email:           USUARIO.email,
    telefono:        USUARIO.telefono,
    fechaNacimiento: '15-05-1990',
    foto:            null,
  })

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
        {tab === "perfil" && (
          <button
            className={styles.btnEditar}
            onClick={() => {
              if (editando) mostrarToast("✅ Cambios guardados");
              setEditando((prev) => !prev);
            }}
          >
            {editando ? "Guardar" : "Editar"}
          </button>
        )}
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
          { label: 'Foto de perfil',       completo: false },
          { label: 'Teléfono',             completo: false },
          { label: 'Fecha de nacimiento',  completo: false },
          { label: 'Domicilio principal',  completo: true  },
          { label: 'Método de pago',       completo: true  },
          { label: 'Disponibilidad',       completo: true  },
        ]
        const completados = items.filter(i => i.completo).length
        const porcentaje  = Math.round((completados / items.length) * 100)
        const completo    = porcentaje === 100

        if (completo) return null

        return (
          <div className={styles.completitudBloque}>
            <div className={styles.completitudHeader}>
              <span className={styles.completitudTitulo}>
                Completá tu perfil
              </span>
              <span className={styles.completitudPct}>
                {porcentaje}%
              </span>
            </div>
            <div className={styles.completitudBarra}>
              <div
                className={styles.completitudRelleno}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className={styles.completitudItems}>
              {items.filter(i => !i.completo).map((item) => (
                <div key={item.label} className={styles.completitudItem}>
                  <span className={styles.completitudItemIcono}>○</span>
                  <span className={styles.completitudItemLabel}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.completitudAviso}>
              <span>⚠️</span>
              <p>
                Necesitás el perfil completo para
                solicitar y pagar servicios.
              </p>
            </div>
          </div>
        )
      })()}
      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {[
          { id: "perfil", label: "👤 Datos" },
          { id: "disponibilidad", label: "🕐 Disponibilidad" },
          { id: "domicilios", label: "📍 Domicilios" },
          { id: "pagos", label: "💳 Pagos" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""}`}
            onClick={() => {
              setTab(t.id);
              setEditando(false);
            }}
          >
            {t.label}
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
                {datosForm.foto
                  ? <img src={datosForm.foto} alt="perfil" className={styles.fotoImg} />
                  : <span className={styles.fotoInicial}>
                      {datosForm.nombre?.charAt(0) || 'U'}
                    </span>
                }
              </div>
              <div className={styles.fotoAcciones}>
                <p className={styles.fotoLabel}>Foto de perfil</p>
                <p className={styles.fotoSub}>Opcional — ayuda a generar confianza</p>
                <label className={styles.fotoBtnLabel}>
                  📷 Subir foto
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fotoInput}
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      const url = URL.createObjectURL(file)
                      setDatosForm(prev => ({ ...prev, foto: url }))
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
                  onChange={(e) => setDatosForm(prev => ({
                    ...prev, nombre: e.target.value
                  }))}
                />
              </div>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Apellido</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  value={datosForm.apellido || ''}
                  onChange={(e) => setDatosForm(prev => ({
                    ...prev, apellido: e.target.value
                  }))}
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
                onChange={(e) => setDatosForm(prev => ({
                  ...prev, email: e.target.value
                }))}
              />
            </div>

            {/* Teléfono */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Teléfono</label>
              <input
                type="tel"
                className={styles.campoInput}
                value={datosForm.telefono}
                onChange={(e) => setDatosForm(prev => ({
                  ...prev, telefono: e.target.value
                }))}
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
                value={datosForm.fechaNacimiento || ''}
                max={(() => {
                  const d = new Date()
                  d.setFullYear(d.getFullYear() - 18)
                  return d.toISOString().split('T')[0]
                })()}
                onChange={(e) => {
                  const fecha = e.target.value
                  const edad  = new Date().getFullYear() -
                                new Date(fecha).getFullYear()
                  if (edad < 18) {
                    mostrarToast('⚠️ Debés ser mayor de 18 años')
                    return
                  }
                  setDatosForm(prev => ({ ...prev, fechaNacimiento: fecha }))
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
              onClick={() => mostrarToast('✅ Cambios guardados')}
            >
              Guardar cambios
            </button>

            <button
              type="button"
              className={styles.btnPeligro}
              onClick={() => mostrarToast('Función disponible próximamente')}
            >
              Eliminar cuenta
            </button>

          </section>
        )}

        {/* ── TAB: DISPONIBILIDAD ── */}
        {tab === "disponibilidad" && (
          <section className={styles.seccion}>
            <p className={styles.seccionDesc}>
              Configurá cuándo podés recibir visitas. Esta disponibilidad se
              pre-carga en cada nueva solicitud.
            </p>

            {/* Atajos */}
            <div className={styles.atajosRow}>
              <button
                type="button"
                className={styles.atajoBtn}
                onClick={() =>
                  seleccionarAtajo(["lun", "mar", "mie", "jue", "vie"])
                }
              >
                📅 Lunes a Viernes
              </button>
              <button
                type="button"
                className={styles.atajoBtn}
                onClick={() => seleccionarAtajo(["sab", "dom"])}
              >
                🏖️ Fin de semana
              </button>
            </div>

            {/* Grilla */}
            {DIAS.map((dia) => (
              <div key={dia.id} className={styles.dispFila}>
                <span className={styles.dispDia}>{dia.label}</span>
                <div className={styles.dispTurnos}>
                  {TURNOS.map((turno) => {
                    const key = `${dia.id}-${turno.id}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`${styles.turnoBtn} ${
                          disponibilidad.includes(key)
                            ? styles.turnoBtnActivo
                            : ""
                        }`}
                        onClick={() => toggleTurno(dia.id, turno.id)}
                      >
                        {turno.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="time"
                  className={styles.horaPuntual}
                  value={horasPuntuales[dia.id] || ""}
                  onChange={(e) =>
                    setHorasPuntuales((prev) => ({
                      ...prev,
                      [dia.id]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}

            {turnosSeleccionados > 0 && (
              <div className={styles.dispResumen}>
                ✅ {turnosSeleccionados} turno
                {turnosSeleccionados > 1 ? "s" : ""} configurado
                {turnosSeleccionados > 1 ? "s" : ""}
              </div>
            )}

            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Disponibilidad guardada")}
            >
              Guardar disponibilidad
            </button>
          </section>
        )}

        {/* ── TAB: DOMICILIOS ── */}
        {tab === "domicilios" && (
          <section className={styles.seccion}>
            <p className={styles.seccionDesc}>
              Tus domicilios frecuentes se sugieren automáticamente al hacer una
              solicitud.
            </p>

            {DOMICILIOS.map((dom) => (
              <div key={dom.id} className={styles.domicilioCard}>
                <div className={styles.domicilioIcono}>📍</div>
                <div className={styles.domicilioInfo}>
                  <div className={styles.domicilioLabelRow}>
                    <span className={styles.domicilioLabel}>{dom.label}</span>
                    {dom.principal && (
                      <span className={styles.domicilioPrincipal}>
                        Principal
                      </span>
                    )}
                  </div>
                  <span className={styles.domicilioDireccion}>
                    {dom.direccion}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.domicilioEditar}
                  onClick={() => mostrarToast("Editando domicilio...")}
                >
                  ✏️
                </button>
              </div>
            ))}

            <button
              type="button"
              className={styles.btnAgregar}
              onClick={() => mostrarToast("Agregando domicilio...")}
            >
              + Agregar domicilio
            </button>
          </section>
        )}

        {/* ── TAB: PAGOS ── */}
        {tab === "pagos" && (
          <section className={styles.seccion}>
            <p className={styles.seccionDesc}>
              Tus métodos de pago guardados para agilizar futuras transacciones.
            </p>

            {MEDIOS_PAGO.map((medio) => (
              <div key={medio.id} className={styles.pagoCard}>
                <span className={styles.pagoIcono}>{medio.icono}</span>
                <div className={styles.pagoInfo}>
                  <span className={styles.pagoTipo}>{medio.tipo}</span>
                  <span className={styles.pagoDetalle}>{medio.detalle}</span>
                </div>
                <button
                  type="button"
                  className={styles.pagoEliminar}
                  onClick={() => mostrarToast("Método eliminado")}
                >
                  🗑️
                </button>
              </div>
            ))}

            <button
              type="button"
              className={styles.btnAgregar}
              onClick={() => mostrarToast("Agregando método de pago...")}
            >
              + Agregar método de pago
            </button>
          </section>
        )}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
