import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminAprobaciones.module.css";
import {
  CheckCircle, XCircle, Clock, Eye, FileText,
  MapPin, Phone, Mail, Star, ChevronDown, ChevronUp, AlertTriangle,
} from "lucide-react";

const ESTADOS = ["Todos", "Pendiente", "Aprobado", "Rechazado"];

const SOLICITUDES = [
  {
    id: 1,
    nombre: "Rodrigo Castillo",
    inicial: "R",
    color: "#534AB7",
    oficio: "Plomero",
    telefono: "+54 9 376 412-3456",
    email: "rodrigo.castillo@gmail.com",
    direccion: "Av. López Torres 890, Posadas",
    estado: "Pendiente",
    fechaSolicitud: "Hoy, 09:14",
    nivel: null,
    reputacion: null,
    trabajosPrevios: 0,
    garantia: true,
    docs: [
      { id: "dni",  label: "DNI",              ok: true  },
      { id: "cuil", label: "CUIL / AFIP",       ok: true  },
      { id: "foto", label: "Foto de perfil",    ok: true  },
      { id: "cert", label: "Certificado oficio",ok: false },
    ],
    descripcion: "Plomero con 8 años de experiencia en instalaciones sanitarias, reparaciones y destapaciones. Cuento con herramientas propias y movilidad.",
    alertas: [],
  },
  {
    id: 2,
    nombre: "Valentina Ruiz",
    inicial: "V",
    color: "#B84030",
    oficio: "Electricista",
    telefono: "+54 9 376 555-7890",
    email: "vruiz.electric@hotmail.com",
    direccion: "Catamarca 234, Posadas",
    estado: "Pendiente",
    fechaSolicitud: "Hoy, 08:02",
    nivel: null,
    reputacion: null,
    trabajosPrevios: 0,
    garantia: false,
    docs: [
      { id: "dni",  label: "DNI",              ok: true  },
      { id: "cuil", label: "CUIL / AFIP",       ok: true  },
      { id: "foto", label: "Foto de perfil",    ok: true  },
      { id: "cert", label: "Certificado oficio",ok: true  },
    ],
    descripcion: "Electricista matriculada con habilitación municipal. Instalaciones residenciales y comerciales, tableros, iluminación LED.",
    alertas: [],
  },
  {
    id: 3,
    nombre: "Lucas Pereyra",
    inicial: "L",
    color: "#2A7D5A",
    oficio: "Pintor",
    telefono: "+54 9 376 600-1234",
    email: "lucas.pintor89@gmail.com",
    direccion: "Entre Ríos 567, Posadas",
    estado: "Pendiente",
    fechaSolicitud: "Ayer, 17:30",
    nivel: null,
    reputacion: null,
    trabajosPrevios: 0,
    garantia: false,
    docs: [
      { id: "dni",  label: "DNI",              ok: true  },
      { id: "cuil", label: "CUIL / AFIP",       ok: false },
      { id: "foto", label: "Foto de perfil",    ok: true  },
      { id: "cert", label: "Certificado oficio",ok: false },
    ],
    descripcion: "Pintor de interiores y exteriores. 5 años en el rubro, experiencia en pintura al agua, látex y esmalte.",
    alertas: ["CUIL no verificado — revisar antes de aprobar"],
  },
  {
    id: 4,
    nombre: "Marcela Sosa",
    inicial: "M",
    color: "#8C6820",
    oficio: "Limpieza",
    telefono: "+54 9 376 700-5678",
    email: "marcela.sosa.clean@gmail.com",
    direccion: "San Lorenzo 123, Posadas",
    estado: "Aprobado",
    fechaSolicitud: "Hace 2 días",
    nivel: "Bronce",
    reputacion: 4.8,
    trabajosPrevios: 3,
    garantia: false,
    docs: [
      { id: "dni",  label: "DNI",              ok: true  },
      { id: "cuil", label: "CUIL / AFIP",       ok: true  },
      { id: "foto", label: "Foto de perfil",    ok: true  },
      { id: "cert", label: "Certificado oficio",ok: true  },
    ],
    descripcion: "Servicio de limpieza doméstica y comercial. Trabajo con productos propios.",
    alertas: [],
  },
  {
    id: 5,
    nombre: "Hernán Vega",
    inicial: "H",
    color: "#3D1F1F",
    oficio: "Gasista",
    telefono: "+54 9 376 800-9999",
    email: "hernan.vega.gas@gmail.com",
    direccion: "Mitre 999, Posadas",
    estado: "Rechazado",
    fechaSolicitud: "Hace 3 días",
    nivel: null,
    reputacion: null,
    trabajosPrevios: 0,
    garantia: true,
    docs: [
      { id: "dni",  label: "DNI",              ok: false },
      { id: "cuil", label: "CUIL / AFIP",       ok: false },
      { id: "foto", label: "Foto de perfil",    ok: false },
      { id: "cert", label: "Certificado oficio",ok: false },
    ],
    descripcion: "Gasista matriculado.",
    alertas: ["Documentación incompleta — DNI ilegible", "Sin foto de perfil válida"],
    motivoRechazo: "Documentación insuficiente. Solicitado reenvío.",
  },
];

export default function AdminAprobaciones() {
  const [filtro, setFiltro]           = useState("Todos");
  const [expandido, setExpandido]     = useState(null);
  const [solicitudes, setSolicitudes] = useState(SOLICITUDES);
  const [modal, setModal]             = useState(null); // { id, accion: "aprobar"|"rechazar" }
  const [motivoRechazo, setMotivoRechazo] = useState("");

  const lista = filtro === "Todos"
    ? solicitudes
    : solicitudes.filter(s => s.estado === filtro);

  const pendientes = solicitudes.filter(s => s.estado === "Pendiente").length;

  function aprobar(id) {
    setSolicitudes(prev => prev.map(s =>
      s.id === id ? { ...s, estado: "Aprobado", nivel: "Bronce", reputacion: 0, trabajosPrevios: 0 } : s
    ));
    setExpandido(null);
    setModal(null);
  }

  function rechazar(id, motivo) {
    setSolicitudes(prev => prev.map(s =>
      s.id === id ? { ...s, estado: "Rechazado", motivoRechazo: motivo } : s
    ));
    setExpandido(null);
    setModal(null);
    setMotivoRechazo("");
  }

  return (
    <div className={styles.pagina}>

      {/* Header con filtros */}
      <div className={styles.toolbar}>
        <div className={styles.filtros}>
          {ESTADOS.map(e => (
            <button key={e} type="button"
              className={`${styles.filtroBtn} ${filtro === e ? styles.filtroBtnActivo : ""}`}
              onClick={() => setFiltro(e)}>
              {e}
              {e === "Pendiente" && pendientes > 0 && (
                <span className={styles.filtroBadge}>{pendientes}</span>
              )}
            </button>
          ))}
        </div>
        <p className={styles.toolbarCount}>{lista.length} resultado{lista.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Lista de solicitudes */}
      <div className={styles.lista}>
        {lista.map(s => {
          const abierto = expandido === s.id;
          const docsOk  = s.docs.filter(d => d.ok).length;
          return (
            <div key={s.id} className={`${styles.card} ${abierto ? styles.cardAbierta : ""}`}>

              {/* Cabecera de la card */}
              <button type="button" className={styles.cardHeader}
                onClick={() => setExpandido(abierto ? null : s.id)}>
                <div className={styles.avatar} style={{ background: s.color }}>
                  {s.inicial}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardNombre}>{s.nombre}</span>
                    <span className={`${styles.estadoBadge} ${styles[`estado_${s.estado.toLowerCase()}`]}`}>
                      {s.estado}
                    </span>
                  </div>
                  <div className={styles.cardMeta}>
                    <span>{s.oficio}</span>
                    <span>·</span>
                    <span>{s.fechaSolicitud}</span>
                    <span>·</span>
                    <span className={docsOk === s.docs.length ? styles.docsOk : styles.docsWarn}>
                      {docsOk}/{s.docs.length} docs
                    </span>
                  </div>
                  {s.alertas.length > 0 && (
                    <div className={styles.cardAlerta}>
                      <AlertTriangle size={11} /> {s.alertas[0]}
                    </div>
                  )}
                </div>
                {abierto ? <ChevronUp size={16} className={styles.chevron} /> : <ChevronDown size={16} className={styles.chevron} />}
              </button>

              {/* Detalle expandible */}
              {abierto && (
                <div className={styles.detalle}>
                  <div className={styles.detalleGrid}>

                    {/* Datos personales */}
                    <div className={styles.detalleSeccion}>
                      <p className={styles.detalleSecLabel}>Datos de contacto</p>
                      <div className={styles.detalleItem}><Phone size={13} /> {s.telefono}</div>
                      <div className={styles.detalleItem}><Mail size={13} /> {s.email}</div>
                      <div className={styles.detalleItem}><MapPin size={13} /> {s.direccion}</div>
                    </div>

                    {/* Documentación */}
                    <div className={styles.detalleSeccion}>
                      <p className={styles.detalleSecLabel}>Documentación</p>
                      {s.docs.map(d => (
                        <div key={d.id} className={styles.docRow}>
                          {d.ok
                            ? <CheckCircle size={13} className={styles.docOk} />
                            : <XCircle    size={13} className={styles.docFail} />
                          }
                          <span className={d.ok ? styles.docLabelOk : styles.docLabelFail}>{d.label}</span>
                          {!d.ok && <span className={styles.docAccion}>Solicitado →</span>}
                        </div>
                      ))}
                    </div>

                    {/* Descripción */}
                    <div className={styles.detalleSeccion} style={{ gridColumn: "1 / -1" }}>
                      <p className={styles.detalleSecLabel}>Descripción del solucionador</p>
                      <p className={styles.detalleDesc}>"{s.descripcion}"</p>
                      <div className={styles.detalleTags}>
                        {s.garantia && <span className={styles.tagVerde}>✓ Con garantía</span>}
                        {!s.garantia && <span className={styles.tagGris}>Sin garantía</span>}
                      </div>
                    </div>

                    {/* Alertas */}
                    {s.alertas.length > 0 && (
                      <div className={styles.detalleSeccion} style={{ gridColumn: "1 / -1" }}>
                        <p className={styles.detalleSecLabel}>Alertas</p>
                        {s.alertas.map((a, i) => (
                          <div key={i} className={styles.alertaRow}>
                            <AlertTriangle size={13} className={styles.alertaIcono} /> {a}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Motivo de rechazo */}
                    {s.estado === "Rechazado" && s.motivoRechazo && (
                      <div className={styles.detalleSeccion} style={{ gridColumn: "1 / -1" }}>
                        <p className={styles.detalleSecLabel}>Motivo de rechazo</p>
                        <p className={styles.motivoRechazoTexto}>{s.motivoRechazo}</p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  {s.estado === "Pendiente" && (
                    <div className={styles.acciones}>
                      <button type="button" className={styles.btnRechazar}
                        onClick={() => setModal({ id: s.id, accion: "rechazar" })}>
                        <XCircle size={15} /> Rechazar
                      </button>
                      <button type="button" className={styles.btnSolicitar}
                        onClick={() => setModal({ id: s.id, accion: "solicitar" })}>
                        <FileText size={15} /> Pedir más info
                      </button>
                      <button type="button" className={styles.btnAprobar}
                        onClick={() => setModal({ id: s.id, accion: "aprobar" })}>
                        <CheckCircle size={15} /> Aprobar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {lista.length === 0 && (
          <div className={styles.vacio}>
            <Clock size={32} className={styles.vacioIcono} />
            <p className={styles.vacioTexto}>No hay solicitudes {filtro !== "Todos" ? `en estado "${filtro}"` : ""}</p>
          </div>
        )}
      </div>

      {/* Modal confirmación */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            {modal.accion === "aprobar" && (
              <>
                <div className={styles.modalIcono} style={{ color: "var(--verde)" }}>
                  <CheckCircle size={36} />
                </div>
                <p className={styles.modalTitulo}>Confirmar aprobación</p>
                <p className={styles.modalDesc}>
                  El solucionador recibirá acceso a la plataforma con nivel Bronce.
                  Se le enviará una notificación automática.
                </p>
                <div className={styles.modalAcciones}>
                  <button type="button" className={styles.modalBtnCancelar} onClick={() => setModal(null)}>Cancelar</button>
                  <button type="button" className={styles.modalBtnConfirmar} onClick={() => aprobar(modal.id)}>
                    Aprobar acceso
                  </button>
                </div>
              </>
            )}
            {modal.accion === "rechazar" && (
              <>
                <div className={styles.modalIcono} style={{ color: "var(--tp-rojo)" }}>
                  <XCircle size={36} />
                </div>
                <p className={styles.modalTitulo}>Rechazar solicitud</p>
                <p className={styles.modalDesc}>Ingresá el motivo del rechazo. Se notificará al solucionador.</p>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Ej: Documentación incompleta. El DNI no es legible..."
                  value={motivoRechazo}
                  onChange={e => setMotivoRechazo(e.target.value)}
                  rows={3}
                />
                <div className={styles.modalAcciones}>
                  <button type="button" className={styles.modalBtnCancelar} onClick={() => setModal(null)}>Cancelar</button>
                  <button type="button" className={styles.modalBtnRechazar}
                    disabled={!motivoRechazo.trim()}
                    onClick={() => rechazar(modal.id, motivoRechazo)}>
                    Confirmar rechazo
                  </button>
                </div>
              </>
            )}
            {modal.accion === "solicitar" && (
              <>
                <div className={styles.modalIcono} style={{ color: "#d4891a" }}>
                  <FileText size={36} />
                </div>
                <p className={styles.modalTitulo}>Solicitar más información</p>
                <p className={styles.modalDesc}>Indicá qué documentación o información falta.</p>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Ej: Necesitamos el certificado de oficio actualizado..."
                  value={motivoRechazo}
                  onChange={e => setMotivoRechazo(e.target.value)}
                  rows={3}
                />
                <div className={styles.modalAcciones}>
                  <button type="button" className={styles.modalBtnCancelar} onClick={() => setModal(null)}>Cancelar</button>
                  <button type="button" className={styles.modalBtnSolicitar}
                    disabled={!motivoRechazo.trim()}
                    onClick={() => { setModal(null); setMotivoRechazo(""); }}>
                    Enviar solicitud
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}