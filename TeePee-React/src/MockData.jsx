// ── MOCK DATA COMPARTIDO ─────────────────────
// Única fuente de verdad para datos de prueba.
// Cuando se conecte el backend, reemplazar por llamadas a la API.

export const USUARIOS = [
  {
    id: 1,
    nombre: "Martín García",
    email: "martin@gmail.com",
    inicial: "M",
    color: "#B84030",
  },
  {
    id: 2,
    nombre: "Laura Sánchez",
    email: "laura@gmail.com",
    inicial: "L",
    color: "#2A7D5A",
  },
  {
    id: 3,
    nombre: "Diego Fernández",
    email: "diego@gmail.com",
    inicial: "D",
    color: "#8C6820",
  },
];

export const SOLUCIONADORES = [
  {
    id: 1,
    nombre: "Carlos Méndez",
    oficio: "Plomero",
    calificacion: 4.8,
    trabajos: 47,
    color: "#2A7D5A",
    inicial: "C",
  },
  {
    id: 2,
    nombre: "Ana Rodríguez",
    oficio: "Electricista",
    calificacion: 4.9,
    trabajos: 63,
    color: "#B84030",
    inicial: "A",
  },
  {
    id: 3,
    nombre: "Miguel Torres",
    oficio: "Pintor",
    calificacion: 4.6,
    trabajos: 31,
    color: "#8C6820",
    inicial: "M",
  },
  {
    id: 4,
    nombre: "Rosa Leiva",
    oficio: "Limpieza",
    calificacion: 5.0,
    trabajos: 82,
    color: "#534AB7",
    inicial: "R",
  },
  {
    id: 5,
    nombre: "Jorge Acuña",
    oficio: "Carpintero",
    calificacion: 4.7,
    trabajos: 28,
    color: "#D85A30",
    inicial: "J",
  },
];

export const TRABAJOS = [
  {
    id: 1,
    usuarioId: 1,
    solucionadorId: 1,
    descripcion: "Reparación de cañería bajo mesada",
    estado: "en-curso",
    etapa: 2,
    totalEtapas: 3,
    progreso: 65,
    horario: "Hoy 14:30 hs",
    monto: "$15.000",
  },
  {
    id: 2,
    usuarioId: 1,
    solucionadorId: 2,
    descripcion: "Instalación de toma corrientes cocina",
    estado: "en-curso",
    etapa: 1,
    totalEtapas: 3,
    progreso: 20,
    horario: "Mañana 10:00 hs",
    monto: "$22.000",
  },
  {
    id: 3,
    usuarioId: 1,
    solucionadorId: 3,
    descripcion: "Pintura living y comedor",
    estado: "en-curso",
    etapa: 3,
    totalEtapas: 4,
    progreso: 75,
    horario: "Vie 09:00 hs",
    monto: "$45.000",
  },
  {
    id: 4,
    usuarioId: 1,
    solucionadorId: 4,
    descripcion: "Limpieza general departamento",
    estado: "completado",
    etapa: 3,
    totalEtapas: 3,
    progreso: 100,
    horario: "Lun pasado",
    monto: "$12.000",
  },
  {
    id: 5,
    usuarioId: 1,
    solucionadorId: 5,
    descripcion: "Reparación de puerta placard",
    estado: "completado",
    etapa: 4,
    totalEtapas: 4,
    progreso: 100,
    horario: "Hace 2 semanas",
    monto: "$8.500",
  },
];

export const PRESUPUESTOS = [
  {
    id: 1,
    usuarioId: 1,
    solucionadorId: 1,
    servicio: "Pérdida de agua",
    monto: 15000,
    estado: "pendiente",
    fecha: "Hoy",
    descripcion:
      "Pérdida bajo pileta cocina, requiere cambio de sifón y sellado.",
    nivel: "🥇",
    garantia: true,
    diasGarantia: 30,
    sinReclamos: true,
    tiempoRespuesta: "8 min",
    tiempoEstimado: "2–3 horas",
    vence: "2 días",
    badge: "Mejor precio",
  },
  {
    id: 2,
    usuarioId: 1,
    solucionadorId: 2,
    servicio: "Instalación luces",
    monto: 22000,
    estado: "pendiente",
    fecha: "Ayer",
    descripcion:
      "3 luces embutidas en living + 2 apliques dormitorio principal.",
    nivel: "🥈",
    garantia: true,
    diasGarantia: 15,
    sinReclamos: true,
    tiempoRespuesta: "12 min",
    tiempoEstimado: "3–4 horas",
    vence: "5 días",
    badge: null,
  },
  {
    id: 3,
    usuarioId: 1,
    solucionadorId: 3,
    servicio: "Pintura",
    monto: 45000,
    estado: "pendiente",
    fecha: "Hace 2 días",
    descripcion:
      "Living 25m², comedor 15m². Incluye materiales y mano de obra.",
    nivel: "🥇",
    garantia: false,
    diasGarantia: 0,
    sinReclamos: true,
    tiempoRespuesta: "5 min",
    tiempoEstimado: "2 días",
    vence: "1 día",
    badge: "Más reseñas",
  },
  {
    id: 4,
    usuarioId: 1,
    solucionadorId: 5,
    servicio: "Reparación carpintería",
    monto: 9000,
    estado: "aceptado",
    fecha: "Hace 3 días",
    descripcion:
      "Puerta placard dormitorio, bisagras rotas y marco desalineado.",
    nivel: "🥇",
    garantia: true,
    diasGarantia: 30,
    sinReclamos: false,
    tiempoRespuesta: "20 min",
    tiempoEstimado: "1–2 horas",
    vence: "3 días",
    badge: null,
  },
];

export const MENSAJES = [
  {
    id: 1,
    solucionadorId: 1,
    usuarioId: 1,
    ultimoMensaje: "Confirmo para las 14:30 hs",
    hora: "14:23",
    sinLeer: 2,
    leido: false,
  },
  {
    id: 2,
    solucionadorId: 2,
    usuarioId: 1,
    ultimoMensaje: "¿Podés enviar foto del tablero?",
    hora: "11:05",
    sinLeer: 0,
    leido: true,
  },
  {
    id: 3,
    solucionadorId: 4,
    usuarioId: 1,
    ultimoMensaje: "Listo, trabajo terminado 👍",
    hora: "Ayer",
    sinLeer: 0,
    leido: true,
  },
];

export const CALIFICACIONES_PENDIENTES = [
  {
    id: 1,
    trabajoId: 4,
    solucionadorId: 4,
    descripcion: "Limpieza general departamento",
    fecha: "Lun pasado",
    monto: "$12.000",
  },
];

// Helpers
export function getSolucionador(id) {
  return SOLUCIONADORES.find((s) => s.id === id) || SOLUCIONADORES[0];
}
export function getUsuario(id) {
  return USUARIOS.find((u) => u.id === id) || USUARIOS[0];
}
export function getTrabajosActivos(usuarioId = 1) {
  return TRABAJOS.filter(
    (t) => t.usuarioId === usuarioId && t.estado === "en-curso",
  );
}
export function getTrabajosCompletados(usuarioId = 1) {
  return TRABAJOS.filter(
    (t) => t.usuarioId === usuarioId && t.estado === "completado",
  );
}

export const SOLICITUDES = [
  {
    id: 1,
    usuarioId: 1,
    usuario: "Martín García",
    inicial: "M",
    descripcion: "Pérdida de agua en baño principal",
    distancia: "2.3 km",
    presupuestoEstimado: "$15.000 - $25.000",
    urgente: false,
    tiempo: "hace 5 min",
    disponibilidad: [
      { dia: "Lun", turnos: ["7-12", "15-19"] },
      { dia: "Mié", turnos: ["7-12"] },
      { dia: "Sáb", turnos: ["7-12", "12-15"] },
    ],
    horaPuntual: null,
  },
  {
    id: 2,
    usuarioId: 2,
    usuario: "Laura Sánchez",
    inicial: "L",
    descripcion: "Instalación de calefón nuevo",
    distancia: "4.1 km",
    presupuestoEstimado: "$30.000 - $45.000",
    urgente: true,
    tiempo: "hace 12 min",
    disponibilidad: [
      { dia: "Mar", turnos: ["15-19", "19-21"] },
      { dia: "Jue", turnos: ["15-19"] },
    ],
    horaPuntual: "08:30",
  },
  {
    id: 3,
    usuarioId: 3,
    usuario: "Diego Fernández",
    inicial: "D",
    descripcion: "Cambio de canilla y sifón cocina",
    distancia: "1.8 km",
    presupuestoEstimado: "$8.000 - $15.000",
    urgente: false,
    tiempo: "hace 28 min",
    disponibilidad: [
      { dia: "Vie", turnos: ["7-12"] },
      { dia: "Sáb", turnos: ["7-12", "12-15", "15-19"] },
    ],
    horaPuntual: null,
  },
];
