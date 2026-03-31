// ══════════════════════════════════════════════════════════════
// MockData.jsx — Fuente única de datos para todo el frontend
// Al conectar el backend, reemplazar estas funciones por llamadas API
// ══════════════════════════════════════════════════════════════

// ── USUARIOS ──────────────────────────────────────────────────
export const USUARIOS = [
  {
    id: 1,
    nombre: "Laura Pérez",
    inicial: "L",
    color: "#2A7D5A",
    email: "laura.perez@email.com",
    telefono: "+54 9 376 410-2233",
    domicilios: [
      { id: 1, label: "Casa",    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas", principal: true },
      { id: 2, label: "Trabajo", direccion: "San Lorenzo 456 — Posadas", principal: false },
    ],
  },
];

// ── SOLUCIONADORES ────────────────────────────────────────────
export const SOLUCIONADORES = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    inicial: "C",
    color: "#B84030",
    oficio: "Plomero",
    nivel: "🥇",
    nivelNombre: "Oro",
    reputacion: 4.9,
    totalTrabajos: 87,
    tiempoRespuesta: "~8 min",
    garantia: "30 días",
    tags: ["Rápido", "Prolijo", "Puntual"],
  },
  {
    id: 2,
    nombre: "Roberto Flores",
    inicial: "R",
    color: "#534AB7",
    oficio: "Plomero",
    nivel: "🥈",
    nivelNombre: "Plata",
    reputacion: 4.7,
    totalTrabajos: 54,
    tiempoRespuesta: "~15 min",
    garantia: "15 días",
    tags: ["Económico", "Confiable"],
  },
  {
    id: 3,
    nombre: "Miguel Saracho",
    inicial: "M",
    color: "#8C6820",
    oficio: "Plomero",
    nivel: "🥇",
    nivelNombre: "Oro",
    reputacion: 4.8,
    totalTrabajos: 123,
    tiempoRespuesta: "~5 min",
    garantia: "30 días",
    tags: ["Más reseñas", "Prolijo"],
  },
];

// ── TRABAJOS ACTIVOS ──────────────────────────────────────────
export const TRABAJOS_ACTIVOS = [
  {
    id: 1,
    ordenId: "ORD-2025-0042",
    usuarioId: 1,
    solucionadorId: 1,
    titulo: "Pérdida de agua en baño principal",
    descripcion: "Cambio de sifón y sellado completo bajo pileta del baño principal. Incluye materiales y mano de obra.",
    categoria: "Plomería",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    fechaEstimada: "Lunes 31/03 · 9:00 – 12:00 hs",
    monto: 22000,
    estado: "enCurso",
    color: "#B84030",
    // Avance
    avanceReportado: 60,
    avanceAprobado: 40,
    pendienteAprobacion: true,
    // Etapas de pago
    formaCobro: "etapas",
    etapasPago: [
      { id: 1, label: "Anticipo 30%",  pct: 30, monto: 6600,  estado: "pagado",    trigger: "Al firmar acuerdo" },
      { id: 2, label: "Avance 60%",    pct: 40, monto: 8800,  estado: "habilitado", trigger: "Al confirmar 60% de obra" },
      { id: 3, label: "Cierre 30%",    pct: 30, monto: 6600,  estado: "bloqueado",  trigger: "Al confirmar obra terminada" },
    ],
    incluyeMateriales: true,
    garantia: 30,
    comisionApp: 0.06,
  },
  {
    id: 2,
    ordenId: "ORD-2025-0038",
    usuarioId: 1,
    solucionadorId: 2,
    titulo: "Instalación calefón",
    descripcion: "Instalación de calefón Orbis 13 litros. Revisión conexión de gas incluida.",
    categoria: "Plomería / Gas",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    fechaEstimada: "Miércoles 02/04 · 10:00 – 13:00 hs",
    monto: 32000,
    estado: "enCurso",
    color: "#534AB7",
    avanceReportado: 0,
    avanceAprobado: 0,
    pendienteAprobacion: false,
    formaCobro: "total",
    etapasPago: [
      { id: 1, label: "Pago total", pct: 100, monto: 32000, estado: "bloqueado", trigger: "Al confirmar obra terminada" },
    ],
    incluyeMateriales: false,
    garantia: 15,
    comisionApp: 0.06,
  },
];

// ── SOLICITUDES PENDIENTES DE PRESUPUESTO ─────────────────────
export const SOLICITUDES = [
  {
    id: 1,
    usuarioId: 1,
    cliente: "Laura Pérez",
    inicial: "L",
    color: "#2A7D5A",
    servicio: "Pérdida de agua en baño principal",
    descripcionDetallada: "Hay una pérdida importante debajo de la pileta del baño principal. El piso ya está húmedo.",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    distancia: "2.3 km",
    presupuestoEstimado: "$15.000 - $25.000",
    urgente: false,
    fotos: 2,
    disponibilidad: [
      { dia: "Lun", turnos: ["7-12", "15-19"] },
      { dia: "Mié", turnos: ["7-12"] },
      { dia: "Sáb", turnos: ["7-12", "12-15"] },
    ],
    horaPuntual: null,
    tiempo: "hace 5 min",
  },
  {
    id: 2,
    usuarioId: 1,
    cliente: "Laura Pérez",
    inicial: "L",
    color: "#2A7D5A",
    servicio: "Instalación calefón nuevo",
    descripcionDetallada: "Tengo un calefón nuevo marca Orbis 13 litros. El viejo se rompió hace una semana.",
    direccion: "Av. Mitre 1240, Piso 3 Dpto B — Posadas",
    distancia: "2.3 km",
    presupuestoEstimado: "$30.000 - $45.000",
    urgente: true,
    fotos: 1,
    disponibilidad: [
      { dia: "Mar", turnos: ["15-19", "19-21"] },
      { dia: "Jue", turnos: ["15-19"] },
    ],
    horaPuntual: "08:30",
    tiempo: "hace 12 min",
  },
];

// ── MENSAJES DE CHAT ──────────────────────────────────────────
export const MENSAJES_CHAT = {
  // trabajoId: array de mensajes
  1: [
    { id: 1, autor: "solucionador", texto: "Hola Laura, vi tu solicitud. Puedo ir el lunes a las 9.", hora: "09:15" },
    { id: 2, autor: "usuario",      texto: "Perfecto Carlos, te espero. ¿Necesitás que prepare algo?", hora: "09:22" },
    { id: 3, autor: "solucionador", texto: "No, yo traigo todo. Voy con materiales incluidos.", hora: "09:25" },
  ],
  2: [
    { id: 1, autor: "solucionador", texto: "Hola, vi la solicitud del calefón. Tengo disponibilidad el miércoles.", hora: "14:30" },
    { id: 2, autor: "usuario",      texto: "Genial, quedamos para el miércoles a las 10.", hora: "14:45" },
  ],
};

// ── HELPER FUNCTIONS ──────────────────────────────────────────
export function getUsuario(id) {
  return USUARIOS.find(u => u.id === id) || USUARIOS[0];
}

export function getSolucionador(id) {
  return SOLUCIONADORES.find(s => s.id === id) || SOLUCIONADORES[0];
}

export function getTrabajoActivo(id) {
  return TRABAJOS_ACTIVOS.find(t => t.id === Number(id)) || TRABAJOS_ACTIVOS[0];
}

export function getTrabajosDeUsuario(usuarioId) {
  return TRABAJOS_ACTIVOS.filter(t => t.usuarioId === usuarioId);
}

export function getTrabajosDelSolucionador(solucionadorId) {
  return TRABAJOS_ACTIVOS.filter(t => t.solucionadorId === solucionadorId);
}

export function getSolicitudesDelSolucionador() {
  return SOLICITUDES;
}

export function getMensajes(trabajoId) {
  return MENSAJES_CHAT[trabajoId] || [];
}


// ── EXPORTS DE COMPATIBILIDAD ────────────────────────────────
export const TRABAJOS = TRABAJOS_ACTIVOS;

export const MENSAJES = [
  {
    solucionadorId: 1,
    mensajes: [
      { id: 1, autor: "solucionador", texto: "Hola Laura, puedo ir el lunes a las 9.", hora: "09:15" },
      { id: 2, autor: "yo",           texto: "Perfecto Carlos, te espero.", hora: "09:22" },
    ],
  },
];

export const CALIFICACIONES_PENDIENTES = [
  {
    id: 1,
    trabajoId: 1,
    solucionadorId: 1,
    servicio: "Pérdida de agua en baño principal",
    fecha: "Hoy",
  },
];