import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PerfilUsuario.module.css";
import { IconoVolver } from './Iconos';
import NavInferior from "./NavInferior";
import { User, MapPin, CreditCard, Camera, AlertTriangle, Home, Pencil, Trash2, Wallet, Building2, Banknote } from "lucide-react";

const USUARIO = {
  nombre: "Martín García",
  email: "martin.garcia@gmail.com",
  telefono: "+54 376 412-3456",
  inicial: "M",
  miembro: "Marzo 2024",
  trabajosRealizados: 12,
  reputacion: 4.8,
};

const MEDIOS_TIPO = [
  { id: "mercadopago", label: "MercadoPago",   Icono: Wallet    },
  { id: "credito",     label: "Tarj. Crédito", Icono: CreditCard },
  { id: "debito",      label: "Tarj. Débito",  Icono: Building2  },
];

export default function PerfilUsuario() {
  const navigate = useNavigate();

  const [tab, setTab]     = useState("perfil");
  const [toast, setToast] = useState(null);

  const [domicilios, setDomicilios] = useState([
    { id: 1, label: "Casa",    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas", principal: true,  editando: false },
    { id: 2, label: "Trabajo", direccion: "San Lorenzo 456 — Posadas",               principal: false, editando: false },
  ]);
  const [nuevoDom, setNuevoDom]       = useState({ label: "", direccion: "" });
  const [agregandoDom, setAgregandoDom] = useState(false);

  const [medios, setMedios] = useState([
    { id: 1, tipo: "MercadoPago", subtipo: "billetera", detalle: "laura.perez@gmail.com", Icono: Wallet    },
    { id: 2, tipo: "Visa",        subtipo: "credito",   detalle: "**** **** **** 4521",   Icono: CreditCard, vence: "06/27" },
  ]);
  const [agregandoMedio, setAgregandoMedio] = useState(false);
  const [nuevoMedio, setNuevoMedio] = useState({ tipo: "mercadopago", numero: "", titular: "", vence: "", alias: "" });

  const [datosForm, setDatosForm] = useState({
    nombre:          USUARIO.nombre,
    apellido:        'García',
    email:           USUARIO.email,
    telefono:        USUARIO.telefono,
    fechaNacimiento: '15-05-1990',
    foto:            null,
  });

  function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  // Completitud
  const items = [
    { label: 'Foto de perfil',       completo: false },
    { label: 'Teléfono',             completo: false },
    { label: 'Fecha de nacimiento',  completo: false },
    { label: 'Domicilio principal',  completo: true  },
    { label: 'Método de pago',       completo: true  },
    { label: 'Disponibilidad',       completo: true  },
  ];
  const completados = items.filter(i => i.completo).length;
  const porcentaje  = Math.round((completados / items.length) * 100);
  const perfilCompleto = porcentaje === 100;

  return (
    <div className={styles.pantalla}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mi Perfil</span>
        <div className={styles.headerSpacer} />
      </header>

      {/* Hero — compacto */}
      <div className={styles.hero}>
        <div className={styles.heroAvatar}>{USUARIO.inicial}</div>
        <div className={styles.heroInfo}>
          <p className={styles.heroNombre}>{USUARIO.nombre}</p>
          <p className={styles.heroMiembro}>Miembro desde {USUARIO.miembro}</p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatVal}>{USUARIO.trabajosRealizados}</span>
            <span className={styles.heroStatLabel}>Trabajos</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatVal}>⭐ {USUARIO.reputacion}</span>
            <span className={styles.heroStatLabel}>Reputación</span>
          </div>
        </div>
      </div>

      {/* Completitud — compacto horizontal */}
      {!perfilCompleto && (
        <div className={styles.completitudBloque}>
          <div className={styles.completitudHeader}>
            <span className={styles.completitudTitulo}>Completá tu perfil</span>
            <span className={styles.completitudPct}>{porcentaje}%</span>
          </div>
          <div className={styles.completitudBarra}>
            <div className={styles.completitudRelleno} style={{ width: `${porcentaje}%` }} />
          </div>
          <div className={styles.completitudItems}>
            {items.filter(i => !i.completo).map(item => (
              <span key={item.label} className={styles.completitudChip}>○ {item.label}</span>
            ))}
          </div>
          <div className={styles.completitudAviso}>
            <AlertTriangle size={13} className={styles.completitudAvisoIcono} />
            <p>Necesitás el perfil completo para solicitar y pagar servicios.</p>
          </div>
        </div>
      )}

      {/* Tabs con Lucide */}
      <div className={styles.tabs}>
        {[
          { id: "perfil",     Icono: User,       label: "Datos"      },
          { id: "domicilios", Icono: Home,        label: "Domicilios" },
          { id: "pagos",      Icono: CreditCard,  label: "Pagos"      },
        ].map(t => (
          <button key={t.id} type="button"
            className={`${styles.tab} ${tab === t.id ? styles.tabActivo : ""}`}
            onClick={() => setTab(t.id)}>
            <t.Icono size={15} className={styles.tabIcono} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <main className={styles.contenido}>

        {/* TAB: DATOS */}
        {tab === "perfil" && (
          <section className={styles.seccion}>
            <div className={styles.fotoBloque}>
              <div className={styles.fotoAvatar}>
                {datosForm.foto
                  ? <img src={datosForm.foto} alt="perfil" className={styles.fotoImg} />
                  : <span className={styles.fotoInicial}>{datosForm.nombre?.charAt(0) || 'U'}</span>}
              </div>
              <div className={styles.fotoAcciones}>
                <p className={styles.fotoLabel}>Foto de perfil</p>
                <p className={styles.fotoSub}>Opcional — ayuda a generar confianza</p>
                <label className={styles.fotoBtnLabel}>
                  <Camera size={13} /> Subir foto
                  <input type="file" accept="image/*" className={styles.fotoInput}
                    onChange={e => { const f = e.target.files[0]; if (f) setDatosForm(prev => ({ ...prev, foto: URL.createObjectURL(f) })) }} />
                </label>
              </div>
            </div>

            <div className={styles.campoFila}>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Nombre</label>
                <input type="text" className={styles.campoInput} value={datosForm.nombre}
                  onChange={e => setDatosForm(prev => ({ ...prev, nombre: e.target.value }))} />
              </div>
              <div className={styles.campoBloque}>
                <label className={styles.campoLabel}>Apellido</label>
                <input type="text" className={styles.campoInput} value={datosForm.apellido || ''}
                  onChange={e => setDatosForm(prev => ({ ...prev, apellido: e.target.value }))} />
              </div>
            </div>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Email</label>
              <input type="email" className={styles.campoInput} value={datosForm.email}
                onChange={e => setDatosForm(prev => ({ ...prev, email: e.target.value }))} />
            </div>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>Teléfono</label>
              <input type="tel" className={styles.campoInput} value={datosForm.telefono}
                onChange={e => setDatosForm(prev => ({ ...prev, telefono: e.target.value }))} />
            </div>

            <div className={styles.campoBloque}>
              <label className={styles.campoLabel}>
                Fecha de nacimiento <span className={styles.campoRequerido}>*</span>
              </label>
              <input type="date" className={styles.campoInput} value={datosForm.fechaNacimiento || ''}
                max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().split('T')[0] })()}
                onChange={e => {
                  const edad = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                  if (edad < 18) { mostrarToast('⚠️ Debés ser mayor de 18 años'); return; }
                  setDatosForm(prev => ({ ...prev, fechaNacimiento: e.target.value }));
                }} />
              <span className={styles.campoHint}>Debés tener al menos 18 años para usar TeePee</span>
            </div>

            <button type="button" className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Datos personales guardados")}>
              Guardar datos personales
            </button>

            <button type="button" className={styles.btnPeligro} style={{ display: "none" }}
              onClick={() => mostrarToast('Función disponible próximamente')}>
              Eliminar cuenta
            </button>
          </section>
        )}

        {/* TAB: DOMICILIOS */}
        {tab === "domicilios" && (
          <section className={styles.seccion}>
            <p className={styles.seccionDesc}>Tus domicilios se sugieren al hacer una solicitud de servicio.</p>

            {domicilios.map(dom => (
              <div key={dom.id} className={styles.domCard}>
                {dom.editando ? (
                  <div className={styles.domForm}>
                    <input type="text" className={styles.domInput} placeholder="Referencia (Casa, Trabajo...)"
                      value={dom.label}
                      onChange={e => setDomicilios(prev => prev.map(d => d.id === dom.id ? { ...d, label: e.target.value } : d))} />
                    <input type="text" className={styles.domInput} placeholder="Dirección completa"
                      value={dom.direccion}
                      onChange={e => setDomicilios(prev => prev.map(d => d.id === dom.id ? { ...d, direccion: e.target.value } : d))} />
                    <div className={styles.domBotones}>
                      <button type="button" className={styles.domBtnGuardar}
                        onClick={() => { setDomicilios(prev => prev.map(d => d.id === dom.id ? { ...d, editando: false } : d)); mostrarToast("✅ Domicilio guardado"); }}>
                        Guardar
                      </button>
                      <button type="button" className={styles.domBtnCancelar}
                        onClick={() => setDomicilios(prev => prev.map(d => d.id === dom.id ? { ...d, editando: false } : d))}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.domRow}>
                    <MapPin size={16} className={styles.domIcono} />
                    <div className={styles.domInfo}>
                      <div className={styles.domLabelRow}>
                        <span className={styles.domLabel}>{dom.label}</span>
                        {dom.principal && <span className={styles.domBadge}>Principal</span>}
                      </div>
                      <span className={styles.domDireccion}>{dom.direccion}</span>
                    </div>
                    <div className={styles.domAcciones}>
                      {!dom.principal && (
                        <button type="button" className={styles.domBtnFijar}
                          onClick={() => setDomicilios(prev => prev.map(d => ({ ...d, principal: d.id === dom.id })))}>
                          Fijar
                        </button>
                      )}
                      <button type="button" className={styles.domBtnIcono}
                        onClick={() => setDomicilios(prev => prev.map(d => d.id === dom.id ? { ...d, editando: true } : d))}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" className={styles.domBtnIcono}
                        onClick={() => setDomicilios(prev => prev.filter(d => d.id !== dom.id))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {agregandoDom ? (
              <div className={styles.domCardNuevo}>
                <input type="text" className={styles.domInput} placeholder="Referencia (Casa, Trabajo, etc.)"
                  value={nuevoDom.label} onChange={e => setNuevoDom(p => ({ ...p, label: e.target.value }))} />
                <input type="text" className={styles.domInput} placeholder="Dirección completa"
                  value={nuevoDom.direccion} onChange={e => setNuevoDom(p => ({ ...p, direccion: e.target.value }))} />
                <div className={styles.domBotones}>
                  <button type="button" className={styles.domBtnGuardar}
                    onClick={() => {
                      if (!nuevoDom.label || !nuevoDom.direccion) { mostrarToast("⚠️ Completá los dos campos"); return; }
                      setDomicilios(prev => [...prev, { id: Date.now(), ...nuevoDom, principal: false, editando: false }]);
                      setNuevoDom({ label: "", direccion: "" });
                      setAgregandoDom(false);
                      mostrarToast("✅ Domicilio agregado");
                    }}>
                    Agregar
                  </button>
                  <button type="button" className={styles.domBtnCancelar} onClick={() => setAgregandoDom(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className={styles.btnAgregar} onClick={() => setAgregandoDom(true)}>
                + Agregar domicilio
              </button>
            )}

            <button type="button" className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Domicilios guardados")}>
              Guardar domicilios
            </button>
          </section>
        )}

        {/* TAB: PAGOS */}
        {tab === "pagos" && (
          <section className={styles.seccion}>
            <p className={styles.seccionDesc}>Tus métodos de pago guardados para agilizar el proceso de pago.</p>

            {medios.map(m => (
              <div key={m.id} className={styles.medioCard}>
                <m.Icono size={22} className={styles.medioIcono} />
                <div className={styles.medioInfo}>
                  <p className={styles.medioTipo}>{m.tipo}</p>
                  <p className={styles.medioDetalle}>{m.detalle}{m.vence ? ` · Vence ${m.vence}` : ""}</p>
                </div>
                <button type="button" className={styles.medioEliminar}
                  onClick={() => { setMedios(prev => prev.filter(x => x.id !== m.id)); mostrarToast("Método eliminado"); }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {agregandoMedio ? (
              <div className={styles.medioFormCard}>
                <div className={styles.medioTipoGrid}>
                  {MEDIOS_TIPO.map(op => (
                    <button key={op.id} type="button"
                      className={`${styles.medioTipoBtn} ${nuevoMedio.tipo === op.id ? styles.medioTipoBtnActivo : ""}`}
                      onClick={() => setNuevoMedio(p => ({ ...p, tipo: op.id }))}>
                      <op.Icono size={18} className={styles.medioTipoIcono} />
                      {op.label}
                    </button>
                  ))}
                </div>

                {nuevoMedio.tipo === "mercadopago" && (
                  <input type="text" className={styles.domInput} placeholder="Email o alias de MercadoPago"
                    value={nuevoMedio.alias} onChange={e => setNuevoMedio(p => ({ ...p, alias: e.target.value }))} />
                )}
                {(nuevoMedio.tipo === "credito" || nuevoMedio.tipo === "debito") && (
                  <>
                    <input type="text" className={styles.domInput} placeholder="Nombre del titular"
                      value={nuevoMedio.titular} onChange={e => setNuevoMedio(p => ({ ...p, titular: e.target.value }))} />
                    <input type="text" className={styles.domInput} placeholder="Número de tarjeta"
                      value={nuevoMedio.numero} onChange={e => setNuevoMedio(p => ({ ...p, numero: e.target.value }))} />
                    <input type="text" className={styles.domInput} placeholder="Vencimiento (MM/AA)"
                      value={nuevoMedio.vence} onChange={e => setNuevoMedio(p => ({ ...p, vence: e.target.value }))} />
                  </>
                )}

                <div className={styles.domBotones}>
                  <button type="button" className={styles.domBtnGuardar}
                    onClick={() => {
                      const IconoMap = { mercadopago: Wallet, credito: CreditCard, debito: Building2 };
                      const tipos   = { mercadopago: "MercadoPago", credito: "Tarjeta Crédito", debito: "Tarjeta Débito" };
                      const detalle = nuevoMedio.tipo === "mercadopago" ? nuevoMedio.alias
                        : nuevoMedio.numero ? `**** ${nuevoMedio.numero.slice(-4)}` : "Sin número";
                      setMedios(prev => [...prev, { id: Date.now(), tipo: tipos[nuevoMedio.tipo], subtipo: nuevoMedio.tipo, detalle, Icono: IconoMap[nuevoMedio.tipo], vence: nuevoMedio.vence, titular: nuevoMedio.titular }]);
                      setNuevoMedio({ tipo: "mercadopago", numero: "", titular: "", vence: "", alias: "" });
                      setAgregandoMedio(false);
                      mostrarToast("✅ Medio de pago agregado");
                    }}>
                    Guardar
                  </button>
                  <button type="button" className={styles.domBtnCancelar} onClick={() => setAgregandoMedio(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className={styles.btnAgregar} onClick={() => setAgregandoMedio(true)}>
                + Agregar medio de pago
              </button>
            )}

            <button type="button" className={styles.btnGuardar}
              onClick={() => mostrarToast("✅ Medios de pago guardados")}>
              Guardar medios de pago
            </button>
          </section>
        )}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferior />
    </div>
  );
}