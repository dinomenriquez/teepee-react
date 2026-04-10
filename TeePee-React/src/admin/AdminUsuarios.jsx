import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminUsuarios.module.css";
import {
  Search, Filter, User, MapPin, Phone, Mail,
  Star, Briefcase, AlertTriangle, CheckCircle,
  XCircle, ChevronDown, ChevronUp, Ban, Eye,
} from "lucide-react";

const ESTADOS_FILTRO = ["Todos", "Activo", "Suspendido", "Bloqueado"];
const ROLES_FILTRO   = ["Todos los roles", "Usuario", "Solucionador", "Ambos"];

const USUARIOS = [
  {
    id: 101, tipo: "usuario", nombre: "Laura Pérez", inicial: "L", color: "#B84030",
    email: "laura.perez@gmail.com", telefono: "+54 9 376 412-1111",
    ciudad: "Posadas", estado: "Activo",
    fechaAlta: "12/01/2025", ultimaActividad: "Hace 2 hs",
    trabajos: 8, calificacion: 4.6, gasto: "$284.000",
    roles: ["usuario"], alertas: [],
    historial: [
      { tipo: "registro",   texto: "Usuario registrado",                fecha: "12/01/2025" },
      { tipo: "trabajo",    texto: "Trabajo #2891 iniciado — Plomería", fecha: "Hoy" },
    ],
  },
  {
    id: 102, tipo: "ambos", nombre: "Carlos Méndez", inicial: "C", color: "#2A7D5A",
    email: "carlos.mendez@gmail.com", telefono: "+54 9 376 500-2222",
    ciudad: "Posadas", estado: "Activo",
    fechaAlta: "05/11/2024", ultimaActividad: "Hace 30 min",
    trabajos: 38, calificacion: 4.8, gasto: "$0", ingresos: "$320.000",
    roles: ["usuario", "solucionador"], alertas: [],
    oficio: "Plomero", nivel: "🥈 Plata",
    historial: [
      { tipo: "registro",   texto: "Usuario registrado",                     fecha: "05/11/2024" },
      { tipo: "upgrade",    texto: "Activó rol solucionador",                 fecha: "20/11/2024" },
      { tipo: "trabajo",    texto: "Trabajo #2890 en curso — Electricidad",  fecha: "Hoy" },
    ],
  },
  {
    id: 103, tipo: "usuario", nombre: "Martín García", inicial: "M", color: "#534AB7",
    email: "martin.garcia88@hotmail.com", telefono: "+54 9 376 600-3333",
    ciudad: "Posadas", estado: "Activo",
    fechaAlta: "03/03/2025", ultimaActividad: "Ayer",
    trabajos: 3, calificacion: 4.2, gasto: "$87.000",
    roles: ["usuario"], alertas: [],
    historial: [
      { tipo: "registro", texto: "Usuario registrado", fecha: "03/03/2025" },
    ],
  },
  {
    id: 104, tipo: "solucionador", nombre: "Roberto Flores", inicial: "R", color: "#8C6820",
    email: "roberto.flores.plomero@gmail.com", telefono: "+54 9 376 700-4444",
    ciudad: "Posadas", estado: "Suspendido",
    fechaAlta: "15/09/2024", ultimaActividad: "Hace 5 días",
    trabajos: 12, calificacion: 2.8, gasto: "$0", ingresos: "$95.000",
    roles: ["solucionador"], alertas: ["3 quejas en los últimos 30 días", "Calificación por debajo del umbral (3.0)"],
    oficio: "Plomero", nivel: "🥉 Bronce",
    historial: [
      { tipo: "registro",    texto: "Solucionador registrado",               fecha: "15/09/2024" },
      { tipo: "advertencia", texto: "Advertencia por cancelación tardía",    fecha: "10/03/2025" },
      { tipo: "suspension",  texto: "Suspensión temporal — revisión manual", fecha: "08/04/2026" },
    ],
  },
  {
    id: 105, tipo: "usuario", nombre: "Sofía Torres", inicial: "S", color: "#B84030",
    email: "sofia.torres.posadas@gmail.com", telefono: "+54 9 376 800-5555",
    ciudad: "Posadas", estado: "Activo",
    fechaAlta: "20/02/2025", ultimaActividad: "Hace 3 hs",
    trabajos: 5, calificacion: 4.9, gasto: "$142.000",
    roles: ["usuario"], alertas: [],
    historial: [
      { tipo: "registro", texto: "Usuario registrada", fecha: "20/02/2025" },
    ],
  },
  {
    id: 106, tipo: "solucionador", nombre: "Ana Rodríguez", inicial: "A", color: "#3D1F1F",
    email: "ana.rod.electric@gmail.com", telefono: "+54 9 376 900-6666",
    ciudad: "Posadas", estado: "Bloqueado",
    fechaAlta: "01/08/2024", ultimaActividad: "Hace 12 días",
    trabajos: 4, calificacion: 1.5, gasto: "$0", ingresos: "$32.000",
    roles: ["solucionador"], alertas: ["Comportamiento fraudulento detectado", "2 disputas perdidas consecutivas"],
    oficio: "Electricista", nivel: "🥉 Bronce",
    motivoBloqueo: "Fraude comprobado — cobro sin realizar el servicio.",
    historial: [
      { tipo: "registro",  texto: "Solucionadora registrada",         fecha: "01/08/2024" },
      { tipo: "disputa",   texto: "Disputa #1820 — perdida",          fecha: "15/02/2025" },
      { tipo: "disputa",   texto: "Disputa #2043 — perdida",          fecha: "10/03/2025" },
      { tipo: "bloqueo",   texto: "Cuenta bloqueada por fraude",      fecha: "25/03/2025" },
    ],
  },
];

const ICONO_HISTORIAL = {
  registro:    { color: "#2A7D5A", label: "Alta" },
  trabajo:     { color: "#3D1F1F", label: "Trabajo" },
  upgrade:     { color: "#534AB7", label: "Upgrade" },
  advertencia: { color: "#d4891a", label: "Aviso" },
  suspension:  { color: "#B84030", label: "Suspensión" },
  bloqueo:     { color: "#7B0000", label: "Bloqueo" },
  disputa:     { color: "#B84030", label: "Disputa" },
};

export default function AdminUsuarios() {
  const [busqueda, setBusqueda]   = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroRol, setFiltroRol] = useState("Todos los roles");
  const [expandido, setExpandido] = useState(null);
  const [usuarios, setUsuarios]   = useState(USUARIOS);
  const [modal, setModal]         = useState(null);
  const [motivoAccion, setMotivoAccion] = useState("");

  const lista = usuarios.filter(u => {
    const matchBusq = !busqueda || u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) || String(u.id).includes(busqueda);
    const matchEstado = filtroEstado === "Todos" || u.estado === filtroEstado;
    const matchRol = filtroRol === "Todos los roles" ||
      (filtroRol === "Usuario" && u.roles.includes("usuario") && !u.roles.includes("solucionador")) ||
      (filtroRol === "Solucionador" && u.roles.includes("solucionador") && !u.roles.includes("usuario")) ||
      (filtroRol === "Ambos" && u.roles.length === 2);
    return matchBusq && matchEstado && matchRol;
  });

  function cambiarEstado(id, nuevoEstado, motivo) {
    setUsuarios(prev => prev.map(u =>
      u.id === id ? {
        ...u, estado: nuevoEstado,
        motivoBloqueo: nuevoEstado === "Bloqueado" ? motivo : u.motivoBloqueo,
        historial: [...u.historial, {
          tipo: nuevoEstado === "Activo" ? "registro" : nuevoEstado === "Suspendido" ? "suspension" : "bloqueo",
          texto: nuevoEstado === "Activo" ? "Cuenta reactivada" : nuevoEstado === "Suspendido" ? `Suspendido: ${motivo}` : `Bloqueado: ${motivo}`,
          fecha: "Ahora",
        }],
      } : u
    ));
    setModal(null);
    setMotivoAccion("");
    setExpandido(null);
  }

  return (
    <div className={styles.pagina}>

      {/* Buscador + filtros */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={15} className={styles.searchIcono} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por nombre, email o ID..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <div className={styles.filtros}>
          {ESTADOS_FILTRO.map(e => (
            <button key={e} type="button"
              className={`${styles.filtroBtn} ${filtroEstado === e ? styles.filtroBtnActivo : ""}`}
              onClick={() => setFiltroEstado(e)}>{e}</button>
          ))}
        </div>
        <select className={styles.selectRol} value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
          {ROLES_FILTRO.map(r => <option key={r}>{r}</option>)}
        </select>
        <p className={styles.count}>{lista.length} usuario{lista.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Tabla / lista */}
      <div className={styles.lista}>
        {lista.map(u => {
          const abierto = expandido === u.id;
          return (
            <div key={u.id} className={`${styles.card} ${abierto ? styles.cardAbierta : ""} ${u.estado === "Bloqueado" ? styles.cardBloqueada : u.estado === "Suspendido" ? styles.cardSuspendida : ""}`}>

              {/* Fila resumen */}
              <button type="button" className={styles.cardRow}
                onClick={() => setExpandido(abierto ? null : u.id)}>
                <div className={styles.avatar} style={{ background: u.color, opacity: u.estado !== "Activo" ? 0.5 : 1 }}>
                  {u.inicial}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardNombre}>{u.nombre}</span>
                    <span className={styles.cardId}>#{u.id}</span>
                    <span className={`${styles.estadoBadge} ${styles[`est_${u.estado.toLowerCase()}`]}`}>{u.estado}</span>
                    {u.roles.map(r => (
                      <span key={r} className={`${styles.rolBadge} ${r === "solucionador" ? styles.rolSol : styles.rolUsr}`}>{r}</span>
                    ))}
                  </div>
                  <div className={styles.cardMeta}>
                    <span>{u.email}</span>
                    <span>·</span>
                    <span>{u.ciudad}</span>
                    <span>·</span>
                    <span>Activo {u.ultimaActividad}</span>
                  </div>
                  {u.alertas.length > 0 && (
                    <div className={styles.cardAlerta}><AlertTriangle size={11} /> {u.alertas[0]}</div>
                  )}
                </div>
                <div className={styles.cardStats}>
                  <span className={styles.statVal}>{u.trabajos}</span>
                  <span className={styles.statLabel}>trabajos</span>
                </div>
                <div className={styles.cardStats}>
                  <span className={styles.statVal}>⭐ {u.calificacion}</span>
                  <span className={styles.statLabel}>score</span>
                </div>
                {abierto ? <ChevronUp size={16} className={styles.chevron} /> : <ChevronDown size={16} className={styles.chevron} />}
              </button>

              {/* Detalle expandido */}
              {abierto && (
                <div className={styles.detalle}>
                  <div className={styles.detalleGrid}>

                    {/* Contacto */}
                    <div className={styles.sec}>
                      <p className={styles.secLabel}>Contacto</p>
                      <div className={styles.secItem}><Mail size={12} />{u.email}</div>
                      <div className={styles.secItem}><Phone size={12} />{u.telefono}</div>
                      <div className={styles.secItem}><MapPin size={12} />{u.ciudad}</div>
                    </div>

                    {/* Métricas */}
                    <div className={styles.sec}>
                      <p className={styles.secLabel}>Métricas</p>
                      <div className={styles.secItem}><Briefcase size={12} />{u.trabajos} trabajos realizados</div>
                      <div className={styles.secItem}><Star size={12} />Calificación: {u.calificacion}</div>
                      {u.gasto  !== "$0" && <div className={styles.secItem}>💰 Gasto total: {u.gasto}</div>}
                      {u.ingresos && <div className={styles.secItem}>💰 Ingresos: {u.ingresos}</div>}
                      {u.oficio && <div className={styles.secItem}><User size={12} />{u.oficio} · {u.nivel}</div>}
                      <div className={styles.secItem}><CheckCircle size={12} />Alta: {u.fechaAlta}</div>
                    </div>

                    {/* Alertas */}
                    {u.alertas.length > 0 && (
                      <div className={styles.sec}>
                        <p className={styles.secLabel}>Alertas</p>
                        {u.alertas.map((a, i) => (
                          <div key={i} className={styles.alertaItem}><AlertTriangle size={12} />{a}</div>
                        ))}
                        {u.motivoBloqueo && (
                          <div className={styles.motivoBloqueo}>{u.motivoBloqueo}</div>
                        )}
                      </div>
                    )}

                    {/* Historial */}
                    <div className={styles.sec} style={{ gridColumn: u.alertas.length > 0 ? "auto" : "1 / -1" }}>
                      <p className={styles.secLabel}>Historial de cuenta</p>
                      <div className={styles.timeline}>
                        {[...u.historial].reverse().map((h, i) => {
                          const cfg = ICONO_HISTORIAL[h.tipo] || { color: "#888", label: h.tipo };
                          return (
                            <div key={i} className={styles.timelineItem}>
                              <div className={styles.timelineDot} style={{ background: cfg.color }} />
                              <div className={styles.timelineTexto}>
                                <span className={styles.timelineBadge} style={{ color: cfg.color, background: cfg.color + "18" }}>{cfg.label}</span>
                                <span className={styles.timelineDesc}>{h.texto}</span>
                                <span className={styles.timelineFecha}>{h.fecha}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Acciones de moderación */}
                  <div className={styles.acciones}>
                    {u.estado === "Activo" && (
                      <>
                        <button type="button" className={styles.btnSuspender}
                          onClick={() => setModal({ id: u.id, accion: "suspender", nombre: u.nombre })}>
                          <AlertTriangle size={14} /> Suspender
                        </button>
                        <button type="button" className={styles.btnBloquear}
                          onClick={() => setModal({ id: u.id, accion: "bloquear", nombre: u.nombre })}>
                          <Ban size={14} /> Bloquear
                        </button>
                      </>
                    )}
                    {u.estado === "Suspendido" && (
                      <>
                        <button type="button" className={styles.btnReactivar}
                          onClick={() => cambiarEstado(u.id, "Activo", "")}>
                          <CheckCircle size={14} /> Reactivar
                        </button>
                        <button type="button" className={styles.btnBloquear}
                          onClick={() => setModal({ id: u.id, accion: "bloquear", nombre: u.nombre })}>
                          <Ban size={14} /> Bloquear
                        </button>
                      </>
                    )}
                    {u.estado === "Bloqueado" && (
                      <button type="button" className={styles.btnReactivar}
                        onClick={() => cambiarEstado(u.id, "Activo", "")}>
                        <CheckCircle size={14} /> Desbloquear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {lista.length === 0 && (
          <div className={styles.vacio}>
            <Search size={28} style={{ opacity: 0.3 }} />
            <p className={styles.vacioTexto}>Sin resultados para "{busqueda}"</p>
          </div>
        )}
      </div>

      {/* Modal moderación */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcono}>
              {modal.accion === "suspender"
                ? <AlertTriangle size={34} style={{ color: "#d4891a" }} />
                : <Ban size={34} style={{ color: "var(--tp-rojo)" }} />}
            </div>
            <p className={styles.modalTitulo}>
              {modal.accion === "suspender" ? "Suspender" : "Bloquear"} a {modal.nombre}
            </p>
            <p className={styles.modalDesc}>
              {modal.accion === "suspender"
                ? "La cuenta quedará suspendida temporalmente. El usuario podrá ser reactivado."
                : "La cuenta quedará bloqueada permanentemente. Esta acción requiere un motivo."}
            </p>
            <textarea className={styles.modalTextarea} rows={3}
              placeholder={modal.accion === "suspender" ? "Motivo de la suspensión..." : "Motivo del bloqueo (obligatorio)..."}
              value={motivoAccion} onChange={e => setMotivoAccion(e.target.value)} />
            <div className={styles.modalAcciones}>
              <button type="button" className={styles.modalBtnCancelar} onClick={() => setModal(null)}>Cancelar</button>
              <button type="button"
                className={modal.accion === "suspender" ? styles.modalBtnSuspender : styles.modalBtnBloquear}
                disabled={modal.accion === "bloquear" && !motivoAccion.trim()}
                onClick={() => cambiarEstado(modal.id, modal.accion === "suspender" ? "Suspendido" : "Bloqueado", motivoAccion)}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}