import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavInferiorS from "./NavInferiorS";
import styles from "./Agenda.module.css";
import { IconoVolver } from "./Iconos";
import {
  CheckCircle,
  Clock,
  RefreshCw,
  MessageCircle,
  MapPin,
  User,
  Calendar,
} from "lucide-react";

// ── DATOS DE EJEMPLO ──────────────────────────
const HOY = new Date();

function getFechaSemana(offset = 0) {
  const d = new Date(HOY);
  d.setDate(HOY.getDate() + offset);
  return d;
}

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const TRABAJOS = [
  {
    id: 1, usuarioId: 1,
    titulo: "Tablero eléctrico",
    cliente: "María González",
    direccion: "Av. Mitre 1234",
    horaInicio: "09:00",
    horaFin: "12:00",
    estado: "confirmado",
    monto: "$32.000",
    diaOffset: 0,
  },
  {
    id: 2, usuarioId: 2,
    titulo: "Instalación de luces",
    cliente: "Roberto Sosa",
    direccion: "Belgrano 456",
    horaInicio: "14:00",
    horaFin: "16:00",
    estado: "confirmado",
    monto: "$18.000",
    diaOffset: 0,
  },
  {
    id: 3, usuarioId: 3,
    titulo: "Corte de luz revisión",
    cliente: "Ana Ramírez",
    direccion: "San Lorenzo 789",
    horaInicio: "10:00",
    horaFin: "11:30",
    estado: "pendiente",
    monto: "$12.000",
    diaOffset: 1,
  },
  {
    id: 4, usuarioId: 4,
    titulo: "Tomacorrientes nuevos",
    cliente: "Luis Pereyra",
    direccion: "Corrientes 321",
    horaInicio: "15:00",
    horaFin: "17:00",
    estado: "confirmado",
    monto: "$25.000",
    diaOffset: 2,
  },
  {
    id: 5, usuarioId: 5,
    titulo: "Revisión general",
    cliente: "Silvia Torres",
    direccion: "España 654",
    horaInicio: "09:00",
    horaFin: "10:00",
    estado: "reprogramar",
    monto: "$8.000",
    diaOffset: 3,
  },
];

const HORARIOS_DISPONIBILIDAD = [
  { id: "manana",  label: "Mañana", rango: "7:00 – 12:00" },
  { id: "siesta",  label: "Siesta", rango: "12:00 – 15:00" },
  { id: "tarde",   label: "Tarde",  rango: "15:00 – 19:00" },
  { id: "noche",   label: "Noche",  rango: "19:00 – 21:00" },
];

const ESTADO_CONFIG = {
  confirmado: {
    color: styles.estadoVerde,
    icono: <CheckCircle size={12} />,
    label: "Confirmado",
  },
  pendiente: {
    color: styles.estadoNaranja,
    icono: <Clock size={12} />,
    label: "Pendiente",
  },
  reprogramar: {
    color: styles.estadoRojo,
    icono: <RefreshCw size={12} />,
    label: "Reprogramar",
  },
};

// ── COMPONENTE MODAL REPROGRAMAR ──────────────
function ModalReprogramar({ trabajo, onCerrar, onConfirmar }) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  return (
    <div className={styles.modalOverlay} onClick={onCerrar}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitulo}>Reprogramar trabajo</h3>
        <p className={styles.modalSubtitulo}>
          {trabajo.titulo} — {trabajo.cliente}
        </p>

        <div className={styles.campoBloque}>
          <label className={styles.campoLabel}>Nueva fecha</label>
          <input
            type="date"
            className={styles.campoInput}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className={styles.campoBloque}>
          <label className={styles.campoLabel}>Nueva hora</label>
          <input
            type="time"
            className={styles.campoInput}
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>

        <div className={styles.modalBotones}>
          <button
            type="button"
            className={styles.modalBtnCancelar}
            onClick={onCerrar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`${styles.modalBtnConfirmar} ${
              !fecha || !hora ? styles.btnDesactivado : ""
            }`}
            disabled={!fecha || !hora}
            onClick={() => onConfirmar(trabajo.id, fecha, hora)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────
export default function Agenda() {
  const navigate = useNavigate();

  const [diaSeleccionado, setDiaSeleccionado] = useState(0);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [disponibilidad, setDisponibilidad] = useState(["manana", "tarde"]);
  const [trabajoReprogramar, setTrabajoReprogramar] = useState(null);
  const [toast, setToast] = useState(null);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function toggleDisponibilidad(id) {
    setDisponibilidad((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  }

  function confirmarReprogramar(id, fecha, hora) {
    setTrabajoReprogramar(null);
    mostrarToast("✅ Solicitud de reprogramación enviada");
  }

  // Generar los 7 días de la semana actual
  const diasSemana = Array.from({ length: 7 }, (_, i) => {
    const fecha = getFechaSemana(semanaOffset * 7 + i);
    return {
      offset: semanaOffset * 7 + i,
      fecha,
      diaNombre: DIAS_SEMANA[fecha.getDay()],
      diaNum: fecha.getDate(),
      esHoy: fecha.toDateString() === HOY.toDateString(),
    };
  });

  // Trabajos del día seleccionado
  const trabajosDelDia = TRABAJOS.filter(
    (t) => t.diaOffset === diaSeleccionado,
  ).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const diaActual = diasSemana.find((d) => d.offset === diaSeleccionado);

  // Totales del día
  const totalDia = trabajosDelDia
    .filter((t) => t.estado === "confirmado")
    .reduce((acc, t) => acc + parseInt(t.monto.replace(/\D/g, "")), 0);

  return (
    <div className={styles.pantalla}>
      {/* ── HEADER ── */}
      <header className={styles.header} style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <button className={styles.btnVolver} onClick={() => navigate(-1)}>
          <IconoVolver size={20} />
        </button>
        <span className={styles.headerTitulo}>Mi Agenda</span>
        <button
          className={styles.btnHoy}
          onClick={() => {
            setSemanaOffset(0);
            setDiaSeleccionado(0);
          }}
        >
          Hoy
        </button>
      </header>

      <main className={styles.contenido}>
        {/* ── SELECTOR DE SEMANA ── */}
        <section className={styles.selectorSemana}>
          <div className={styles.semanaNav}>
            <button
              type="button"
              className={styles.semanaNavBtn}
              onClick={() => setSemanaOffset((prev) => prev - 1)}
            >
              ‹
            </button>
            <span className={styles.semanaTitulo}>
              {MESES[diasSemana[0].fecha.getMonth()]}
              {diasSemana[0].fecha.getMonth() !== diasSemana[6].fecha.getMonth()
                ? ` – ${MESES[diasSemana[6].fecha.getMonth()]}`
                : ""}{" "}
              {diasSemana[0].fecha.getFullYear()}
            </span>
            <button
              type="button"
              className={styles.semanaNavBtn}
              onClick={() => setSemanaOffset((prev) => prev + 1)}
            >
              ›
            </button>
          </div>

          <div className={styles.diasRow}>
            {diasSemana.map((dia) => {
              const tieneTrabajo = TRABAJOS.some(
                (t) => t.diaOffset === dia.offset,
              );
              return (
                <button
                  key={dia.offset}
                  type="button"
                  className={`${styles.diaBtn} ${
                    dia.offset === diaSeleccionado ? styles.diaBtnActivo : ""
                  } ${dia.esHoy ? styles.diaBtnHoy : ""}`}
                  onClick={() => setDiaSeleccionado(dia.offset)}
                >
                  <span className={styles.diaNombre}>{dia.diaNombre}</span>
                  <span className={styles.diaNum}>{dia.diaNum}</span>
                  {tieneTrabajo && <span className={styles.diaPunto}></span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── DISPONIBILIDAD ── */}
        <section className={styles.disponibilidadCard}>
          <div className={styles.disponibilidadHeader}>
            <div>
              <span className={styles.disponibilidadTitulo}>
                Disponibilidad del día
              </span>
              <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: "2px 0 0", fontFamily: "var(--fuente)" }}>
                {diaActual?.esHoy ? "Hoy" : diaActual ? `${diaActual.diaNombre} ${diaActual.diaNum}` : "—"} · Solo aplica a este día
              </p>
            </div>
            <button
              type="button"
              className={styles.disponibilidadGuardar}
              onClick={() => mostrarToast("✅ Disponibilidad del día guardada")}
            >
              Guardar
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--tp-marron-suave)", margin: "0 0 8px", fontFamily: "var(--fuente)", lineHeight: 1.5 }}>
            No modifica tu disponibilidad general de perfil
          </p>
          <div className={styles.disponibilidadOpciones}>
            {HORARIOS_DISPONIBILIDAD.map((h) => (
              <button
                key={h.id}
                type="button"
                className={`${styles.disponibilidadOpcion} ${
                  disponibilidad.includes(h.id)
                    ? styles.disponibilidadOpcionActiva
                    : ""
                }`}
                onClick={() => toggleDisponibilidad(h.id)}
              >
                <span className={styles.disponibilidadLabel}>{h.label}</span>
                <span className={styles.disponibilidadRango}>{h.rango}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── TRABAJOS DEL DÍA ── */}
        <section>
          <div className={styles.diaHeaderRow}>
            <h2 className={styles.diaTitulo}>
              {diaActual?.esHoy ? "Hoy · " : ""}
              {diaActual
                ? `${diaActual.diaNombre} ${diaActual.diaNum} de ${MESES[diaActual.fecha.getMonth()]}`
                : ""}
            </h2>
            {trabajosDelDia.length > 0 && (
              <span className={styles.totalDia}>
                ${totalDia.toLocaleString("es-AR")}
              </span>
            )}
          </div>

          {trabajosDelDia.length === 0 ? (
            <div className={styles.sinTrabajos}>
              <span className={styles.sinTrabajosIcono}>
                <Calendar size={32} />
              </span>
              <p className={styles.sinTrabajosTexto}>Sin trabajos agendados</p>
              <p className={styles.sinTrabajosDesc}>
                Estás disponible todo el día
              </p>
            </div>
          ) : (
            <div className={styles.trabajosList}>
              {trabajosDelDia.map((trabajo) => {
                const cfg = ESTADO_CONFIG[trabajo.estado];
                return (
                  <div key={trabajo.id} className={styles.trabajoCard}>
                    <div className={styles.trabajoHora}>
                      <span className={styles.trabajoHoraInicio}>
                        {trabajo.horaInicio}
                      </span>
                      <div className={styles.trabajoLinea}></div>
                      <span className={styles.trabajoHoraFin}>
                        {trabajo.horaFin}
                      </span>
                    </div>

                    <div className={styles.trabajoInfo}>
                      <div className={styles.trabajoInfoTop}>
                        <span className={styles.trabajoTitulo}>
                          {trabajo.titulo}
                        </span>
                        <span
                          className={`${styles.trabajoEstado} ${cfg.color}`}
                        >
                          {cfg.icono} {cfg.label}
                        </span>
                      </div>
                      <span className={styles.trabajoCliente}>
                        <User size={12} /> {trabajo.cliente}
                      </span>
                      <span className={styles.trabajoDireccion}>
                        <MapPin size={12} /> {trabajo.direccion}
                      </span>
                      <div className={styles.trabajoFooter}>
                        <span className={styles.trabajoMonto}>
                          {trabajo.monto}
                        </span>
                        <div className={styles.trabajoBotones}>
                          <button
                            type="button"
                            className={styles.btnChat}
                            onClick={() => navigate(`/chat-s?usuarioId=${trabajo.usuarioId}&nombre=${encodeURIComponent(trabajo.cliente)}&inicial=${trabajo.cliente?.charAt(0)}&desde=agenda`)}
                          >
                            <MessageCircle size={14} /> Chat
                          </button>
                          <button
                            type="button"
                            className={styles.btnReprogramar}
                            onClick={() => setTrabajoReprogramar(trabajo)}
                          >
                            <RefreshCw size={14} /> Reprogramar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── RESUMEN SEMANA ── */}
        <section className={styles.resumenSemana}>
          <h2 className={styles.seccionTitulo}>Resumen de la semana</h2>
          <div className={styles.resumenGrid}>
            <div className={styles.resumenItem}>
              <span className={styles.resumenValor}>
                {
                  TRABAJOS.filter(
                    (t) =>
                      t.diaOffset >= semanaOffset * 7 &&
                      t.diaOffset < semanaOffset * 7 + 7,
                  ).length
                }
              </span>
              <span className={styles.resumenLabel}>Trabajos</span>
            </div>
            <div className={styles.resumenItem}>
              <span className={styles.resumenValor}>
                {
                  TRABAJOS.filter(
                    (t) =>
                      t.diaOffset >= semanaOffset * 7 &&
                      t.diaOffset < semanaOffset * 7 + 7 &&
                      t.estado === "confirmado",
                  ).length
                }
              </span>
              <span className={styles.resumenLabel}>Confirmados</span>
            </div>
            <div className={styles.resumenItem}>
              <span className={styles.resumenValor}>
                $
                {TRABAJOS.filter(
                  (t) =>
                    t.diaOffset >= semanaOffset * 7 &&
                    t.diaOffset < semanaOffset * 7 + 7 &&
                    t.estado === "confirmado",
                )
                  .reduce(
                    (acc, t) => acc + parseInt(t.monto.replace(/\D/g, "")),
                    0,
                  )
                  .toLocaleString("es-AR")}
              </span>
              <span className={styles.resumenLabel}>Ingresos est.</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── MODAL REPROGRAMAR ── */}
      {trabajoReprogramar && (
        <ModalReprogramar
          trabajo={trabajoReprogramar}
          onCerrar={() => setTrabajoReprogramar(null)}
          onConfirmar={confirmarReprogramar}
        />
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
      <NavInferiorS />
    </div>
  );
}