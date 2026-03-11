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
            viewBox="0 0 80 80"
            fill="none"
            className={className}
          >
      <line
        x1="14"
        y1="10"
        x2="60"
        y2="72"
        stroke="#3D1F1F"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="66"
        y1="10"
        x2="20"
        y2="72"
        stroke="#3D1F1F"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="18"
        x2="62"
        y2="70"
        stroke="#B84030"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="58"
        y1="18"
        x2="18"
        y2="70"
        stroke="#B84030"
        strokeWidth="7"
        strokeLinecap="round"
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
