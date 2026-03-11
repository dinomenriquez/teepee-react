import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PerfilSolucionadorEdit.module.css'
import {
  IconoPlomeria, IconoGas, IconoPintura,
  IconoAireAcond, IconoCarpinteria, IconoLimpieza,
  IconoCerrajeria, IconoJardineria,
  IconoPerfil, IconoVolver
} from './Iconos'
import { Zap, Hammer, FileText, DollarSign } from 'lucide-react';

const OFICIOS_DISPONIBLES = [
  { id: 'plomeria',    icono: <IconoPlomeria    size={18} />, nombre: 'Plomería'          },
  { id: 'electrico',   icono: <Zap              size={18} />, nombre: 'Electricidad'      },
  { id: 'gas',         icono: <IconoGas         size={18} />, nombre: 'Gas'               },
  { id: 'pintura',     icono: <IconoPintura     size={18} />, nombre: 'Pintura'           },
  { id: 'carpinteria', icono: <IconoCarpinteria size={18} />, nombre: 'Carpintería'       },
  { id: 'aa',          icono: <IconoAireAcond   size={18} />, nombre: 'Aire Acondicionado'},
  { id: 'albanileria', icono: <Hammer           size={18} />, nombre: 'Albañilería'       },
  { id: 'limpieza',    icono: <IconoLimpieza    size={18} />, nombre: 'Limpieza'          },
  { id: 'cerrajeria',  icono: <IconoCerrajeria  size={18} />, nombre: 'Cerrajería'        },
  { id: 'jardineria',  icono: <IconoJardineria  size={18} />, nombre: 'Jardinería'        },
]

const RADIOS = ['5 km', '10 km', '15 km', '20 km', '30 km', 'Sin límite']

const EXPERIENCIA = [
  'Menos de 1 año', '1 a 3 años', '3 a 5 años',
  '5 a 10 años', 'Más de 10 años',
]

const TABS = [
  { id: 'personal',    label: 'Personal',    icono: <IconoPerfil   size={14} /> },
  { id: 'profesional', label: 'Profesional', icono: <IconoPlomeria size={14} /> },
  { id: 'cobros',      label: 'Cobros',      icono: <DollarSign    size={14} /> },
  { id: 'docs',        label: 'Docs',        icono: <FileText      size={14} /> },
]

const CAMPOS_REQUERIDOS = [
  { key: 'foto',            label: 'Foto de perfil'       },
  { key: 'telefono',        label: 'Teléfono'             },
  { key: 'fechaNacimiento', label: 'Fecha de nacimiento'  },
  { key: 'descripcion',     label: 'Descripción'          },
  { key: 'oficios',         label: 'Al menos un oficio'   },
  { key: 'zona',            label: 'Zona de trabajo'      },
  { key: 'cbu',             label: 'CBU para cobros'      },
  { key: 'fotoDni',         label: 'Foto del DNI'         },
]

export default function PerfilSolucionadorEdit() {
  const navigate = useNavigate()

  const [tab, setTab]         = useState('personal')
  const [toast, setToast]     = useState(null)

  const [datos, setDatos] = useState({
    foto:            null,
    nombre:          'Juan',
    apellido:        'Ledesma',
    email:           'juan.ledesma@gmail.com',
    telefono:        '',
    fechaNacimiento: '',
    descripcion:     '',
    oficios:         ['electrico'],
    oficioP:         'electrico',
    experiencia:     '',
    zona:            '',
    garantia:        false,
    diasGarantia:    30,
    cbu:             '',
    aliasCbu:        '',
    fotoDni:         null,
  })

  function set(key, value) {
    setDatos(prev => ({ ...prev, [key]: value }))
  }

  function mostrarToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function toggleOficio(id) {
    setDatos(prev => {
      const ya = prev.oficios.includes(id)
      const nuevos = ya
        ? prev.oficios.filter(o => o !== id)
        : [...prev.oficios, id]
      const oficioP = nuevos.includes(prev.oficioP)
        ? prev.oficioP
        : nuevos[0] || ''
      return { ...prev, oficios: nuevos, oficioP }
    })
  }

  // Calcular completitud
  const completados = CAMPOS_REQUERIDOS.filter(c => {
    const v = datos[c.key]
    if (Array.isArray(v)) return v.length > 0
    return v && v !== ''
  })
  const porcentaje = Math.round(
    (completados.length / CAMPOS_REQUERIDOS.length) * 100
  )
  const perfilCompleto = porcentaje === 100

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
          onClick={() => mostrarToast('✅ Cambios guardados')}
        >
          Guardar
        </button>
      </header>

      {/* ── COMPLETITUD ── */}
      <div className={styles.completitudBloque}>
        <div className={styles.completitudHeader}>
          <span className={styles.completitudTitulo}>
            {perfilCompleto ? '✅ Perfil completo' : 'Completá tu perfil'}
          </span>
          <span className={`${styles.completitudPct} ${
            perfilCompleto ? styles.completitudPctOk : ''
          }`}>
            {porcentaje}%
          </span>
        </div>
        <div className={styles.completitudBarra}>
          <div
            className={`${styles.completitudRelleno} ${
              perfilCompleto ? styles.completitudRellenoOk : ''
            }`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        {!perfilCompleto && (
          <div className={styles.completitudPendientes}>
            {CAMPOS_REQUERIDOS.filter(c => {
              const v = datos[c.key]
              if (Array.isArray(v)) return v.length === 0
              return !v || v === ''
            }).map(c => (
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
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icono} {t.label}
          </button>
        ))}
      </div>

      <main className={styles.contenido}>

        {/* ── TAB: PERSONAL ── */}
        {tab === 'personal' && (
          <section className={styles.seccion}>

            {/* Foto */}
            <div className={styles.fotoBloque}>
              <div className={styles.fotoAvatar}>
                {datos.foto
                  ? <img src={datos.foto} alt="perfil"
                      className={styles.fotoImg} />
                  : <span className={styles.fotoInicial}>
                      {datos.nombre?.charAt(0) || 'S'}
                    </span>
                }
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
                      const file = e.target.files[0]
                      if (!file) return
                      set('foto', URL.createObjectURL(file))
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
                  onChange={e => set('nombre', e.target.value)}
                />
              </div>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Apellido</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  value={datos.apellido}
                  onChange={e => set('apellido', e.target.value)}
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
                onChange={e => set('email', e.target.value)}
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
                onChange={e => set('telefono', e.target.value)}
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
                  const d = new Date()
                  d.setFullYear(d.getFullYear() - 18)
                  return d.toISOString().split('T')[0]
                })()}
                onChange={e => {
                  const edad = new Date().getFullYear() -
                               new Date(e.target.value).getFullYear()
                  if (edad < 18) {
                    mostrarToast('⚠️ Debés tener al menos 18 años')
                    return
                  }
                  set('fechaNacimiento', e.target.value)
                }}
              />
              <span className={styles.campoHint}>
                Debés tener al menos 18 años
              </span>
            </div>

            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast('✅ Datos personales guardados')}
            >
              Guardar datos personales
            </button>

          </section>
        )}

        {/* ── TAB: PROFESIONAL ── */}
        {tab === 'profesional' && (
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
                onChange={e => set('descripcion', e.target.value)}
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
              <p className={styles.campoSublabel}>
                Seleccioná todos los que ofrecés
              </p>
              <div className={styles.oficiosGrid}>
                {OFICIOS_DISPONIBLES.map(o => (
                  <button
                    key={o.id}
                    type="button"
                    className={`${styles.oficioBtn} ${
                      datos.oficios.includes(o.id)
                        ? styles.oficioBtnActivo : ''
                    }`}
                    onClick={() => toggleOficio(o.id)}
                  >
                    <span>{o.icono}</span>
                    <span>{o.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Oficio principal */}
            {datos.oficios.length > 1 && (
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>
                  Oficio principal
                </label>
                <select
                  className={styles.campoSelect}
                  value={datos.oficioP}
                  onChange={e => set('oficioP', e.target.value)}
                >
                  {datos.oficios.map(id => {
                    const o = OFICIOS_DISPONIBLES.find(x => x.id === id)
                    return (
                      <option key={id} value={id}>
                        {o?.icono} {o?.nombre}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {/* Experiencia */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Años de experiencia</label>
              <select
                className={styles.campoSelect}
                value={datos.experiencia}
                onChange={e => set('experiencia', e.target.value)}
              >
                <option value="">Seleccioná</option>
                {EXPERIENCIA.map(e => (
                  <option key={e} value={e}>{e}</option>
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
                {RADIOS.map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`${styles.zonaBtn} ${
                      datos.zona === r ? styles.zonaBtnActivo : ''
                    }`}
                    onClick={() => set('zona', r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Garantía */}
            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Garantía</label>
              <div className={styles.garantiaRow}>
                <button
                  type="button"
                  className={`${styles.garantiaBtn} ${
                    datos.garantia ? styles.garantiaBtnActivo : ''
                  }`}
                  onClick={() => set('garantia', !datos.garantia)}
                >
                  {datos.garantia ? '✅ Ofrezco garantía' : '○ Sin garantía'}
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
                      onChange={e => set('diasGarantia',
                        parseInt(e.target.value) || 0
                      )}
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
              onClick={() => mostrarToast('✅ Datos profesionales guardados')}
            >
              Guardar datos profesionales
            </button>

          </section>
        )}

        {/* ── TAB: COBROS ── */}
        {tab === 'cobros' && (
          <section className={styles.seccion}>

            <div className={styles.infoBloque}>
              <span>💡</span>
              <p>
                Tus cobros se acreditan todos los viernes.
                Necesitás un CBU o alias válido para recibir pagos.
              </p>
            </div>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                CBU <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="22 dígitos"
                value={datos.cbu}
                maxLength={22}
                onChange={e => set('cbu',
                  e.target.value.replace(/\D/g, '')
                )}
              />
              <span className={styles.campoHint}>
                {datos.cbu.length}/22 dígitos
              </span>
            </div>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Alias (opcional)
              </label>
              <input
                type="text"
                className={styles.campoInput}
                placeholder="tu.alias.mp"
                value={datos.aliasCbu}
                onChange={e => set('aliasCbu', e.target.value)}
              />
            </div>

            {datos.cbu.length === 22 && (
              <div className={styles.cbuOk}>
                ✅ CBU válido — listo para recibir pagos
              </div>
            )}

            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast('✅ Datos de cobro guardados')}
            >
              Guardar datos de cobro
            </button>

          </section>
        )}

        {/* ── TAB: DOCS ── */}
        {tab === 'docs' && (
          <section className={styles.seccion}>

            <div className={styles.infoBloque}>
              <span>🔒</span>
              <p>
                Tu DNI es solo para verificación de identidad.
                No se comparte con los usuarios.
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
                    onClick={() => set('fotoDni', null)}
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
                    onChange={e => {
                      const file = e.target.files[0]
                      if (!file) return
                      set('fotoDni', URL.createObjectURL(file))
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

            <button
              type="button"
              className={styles.btnGuardar}
              onClick={() => mostrarToast('✅ Documentación guardada')}
            >
              Guardar documentación
            </button>

          </section>
        )}

      </main>

      {toast && <div className={styles.toast}>{toast}</div>}

    </div>
  )
}