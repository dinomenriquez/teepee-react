// Iconos.jsx — biblioteca central de íconos TeePee
import {
  Home,
  Search,
  ClipboardList,
  FileText,
  User,
  Bell,
  Settings,
  ArrowLeft,
  ArrowRight,
  Calendar,
  DollarSign,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Wrench,
  Flame,
  Paintbrush,
  Wind,
  Hammer,
  Key,
  Leaf,
  Sparkles,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Trash2,
  Edit,
  Plus,
  Minus,
  RefreshCw,
  LogOut,
  TrendingUp,
  Award,
  ThumbsUp,
  Package,
  Truck,
  CreditCard,
} from "lucide-react";

// ── NAVEGACIÓN ────────────────────────────────
export const IconoInicio = (props) => <Home {...props} />;
export const IconoBuscar = (props) => <Search {...props} />;
export const IconoTrabajos = (props) => <ClipboardList {...props} />;
export const IconoPresupuestos = (props) => <FileText {...props} />;
export const IconoPerfil = (props) => <User {...props} />;
export const IconoAgenda = (props) => <Calendar {...props} />;
export const IconoIngresos = (props) => <DollarSign {...props} />;
export const IconoChat = (props) => <MessageCircle {...props} />;

// ── HEADERS ───────────────────────────────────
export const IconoCampana = (props) => <Bell {...props} />;
export const IconoConfig = (props) => <Settings {...props} />;
export const IconoVolver = (props) => <ArrowLeft {...props} />;
export const IconoSiguiente = (props) => <ArrowRight {...props} />;
export const IconoChevronD = (props) => <ChevronDown {...props} />;
export const IconoChevronU = (props) => <ChevronUp {...props} />;
export const IconoChevronR = (props) => <ChevronRight {...props} />;

// ── UBICACIÓN Y TIEMPO ────────────────────────
export const IconoUbicacion = (props) => <MapPin {...props} />;
export const IconoReloj = (props) => <Clock {...props} />;
export const IconoCalendario = (props) => <Calendar {...props} />;

// ── ESTADOS ───────────────────────────────────
export const IconoOk = (props) => <CheckCircle {...props} />;
export const IconoError = (props) => <XCircle {...props} />;
export const IconoAlerta = (props) => <AlertTriangle {...props} />;
export const IconoUrgente = (props) => <Zap {...props} />;

// ── CALIFICACIÓN ──────────────────────────────
export const IconoEstrella = (props) => <Star {...props} />;
export const IconoGarantia = (props) => <Shield {...props} />;
export const IconoTrofeo = (props) => <Award {...props} />;
export const IconoLike = (props) => <ThumbsUp {...props} />;
export const IconoTendencia = (props) => <TrendingUp {...props} />;

// ── OFICIOS ───────────────────────────────────
export const IconoPlomeria = (props) => <Wrench {...props} />;
export const IconoGas = (props) => <Flame {...props} />;
export const IconoPintura = (props) => <Paintbrush {...props} />;
export const IconoAireAcond = (props) => <Wind {...props} />;
export const IconoCarpinteria = (props) => <Hammer {...props} />;
export const IconoCerrajeria = (props) => <Key {...props} />;
export const IconoJardineria = (props) => <Leaf {...props} />;
export const IconoLimpieza = (props) => <Sparkles {...props} />;

// ── USUARIO Y CUENTA ──────────────────────────
export const IconoTelefono = (props) => <Phone {...props} />;
export const IconoEmail = (props) => <Mail {...props} />;
export const IconoContrasena = (props) => <Lock {...props} />;
export const IconoVerPass = (props) => <Eye {...props} />;
export const IconoOcultarPass = (props) => <EyeOff {...props} />;
export const IconoCamara = (props) => <Camera {...props} />;
export const IconoSubir = (props) => <Upload {...props} />;
export const IconoEliminar = (props) => <Trash2 {...props} />;
export const IconoEditar = (props) => <Edit {...props} />;
export const IconoSalir = (props) => <LogOut {...props} />;

// ── ACCIONES ──────────────────────────────────
export const IconoAgregar = (props) => <Plus {...props} />;
export const IconoQuitar = (props) => <Minus {...props} />;
export const IconoRefrescar = (props) => <RefreshCw {...props} />;

// ── PAGOS ─────────────────────────────────────
export const IconoPago = (props) => <CreditCard {...props} />;
export const IconoEnvio = (props) => <Truck {...props} />;
export const IconoPaquete = (props) => <Package {...props} />;
// ── LOGO TEEPEE ───────────────────────────────
export function LogoTeePee({ size = 40, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="92 346 192 160"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#4B2E2B"
        d="M200.368,346.159c2.168-2.775,6.174-3.268,8.949-1.1c2.773,2.168,3.266,6.174,1.098,8.949L104.829,489.151c-2.166,2.775-6.174,3.268-8.947,1.1c-2.775-2.168-3.268-6.174-1.1-8.949L200.368,346.159z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#4B2E2B"
        d="M191.735,377.919l-25.205-32.26c-2.168-2.775-6.174-3.268-8.949-1.1c-2.773,2.168-3.266,6.174-1.098,8.949l27.139,34.736L191.735,377.919z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#4B2E2B"
        d="M272.723,481.302l-79.505-101.511l-8.113,10.326l77.571,99.034c2.166,2.775,6.174,3.268,8.947,1.1C274.398,488.083,274.891,484.077,272.723,481.302z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#A63A2B"
        d="M202.979,398.71c2.49-2.49,6.525-2.49,9.016,0s2.49,6.525,0,9.016l-78.582,82.459c-2.49,2.49-7.854,2.141-10.345-0.35s-3.755-7.459-1.265-9.949L202.979,398.71z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#A63A2B"
        d="M193.444,427.273l-28.708-28.708c-2.49-2.49-6.525-2.49-9.016,0s-2.49,6.525,0,9.016l28.171,29.562L193.444,427.273z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#A63A2B"
        d="M245.912,479.741l-50.865-50.864l-9.59,9.908l48.846,51.255c2.49,2.49,7.854,2.141,10.345-0.35S248.402,482.231,245.912,479.741z"
      />
    </svg>
  );
}

// ── TEXTO LOGO TEEPEE ─────────────────────────
export function LogoTexto({ size = 18 }) {
  return (
    <span
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontSize: size,
        fontWeight: 800,
        color: "#3D1F1F",
        letterSpacing: "-0.5px",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      TeePe<span style={{ color: "#B84030" }}>e</span>
    </span>
  );
}

// ── LOGO COMPLETO (ícono + texto) ─────────────
export function LogoCompleto({ size = 32 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <LogoTeePee size={size} />
      <LogoTexto size={size * 0.5} />
    </div>
  );
}
