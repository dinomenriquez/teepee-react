import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Bienvenida.module.css";
import { LogoCompleto, LogoTeePee, LogoTexto } from "./Iconos";
import { Eye, EyeOff, Home, Wrench, Info } from "lucide-react";

export default function Bienvenida() {
  const navigate = useNavigate();
  const [vista, setVista] = useState("bienvenida");
  const [verPassLogin, setVerPassLogin] = useState(false);
  const [verPassUsuario, setVerPassUsuario] = useState(false);
  const [verPassSolucionador, setVerPassSolucionador] = useState(false);

  // ── VISTA: BIENVENIDA ──
  if (vista === "bienvenida") {
    return (
      <div className={styles.pantalla}>
        {/* Fondo decorativo */}
        <div className={styles.fondo}>
          <div className={styles.fondoCirculo1}></div>
          <div className={styles.fondoCirculo2}></div>
        </div>

        {/* Logo central */}
        <div className={styles.logoBloque}>
          <div className={styles.logoIcono}>
            <img src="/Logo-TeePee-corto.png" alt="TeePee" width={112} height={112} />
          </div>
          <h1 className={styles.logoTexto}>
            <LogoTexto size={48} />
          </h1>
          <p className={styles.logoTagline}>
            Conectamos hogares con profesionales
          </p>
        </div>

        {/* Botones de rol */}
        <div className={styles.rolesBloque}>
          <p className={styles.rolesTitulo}>¿Cómo querés usar TeePee?</p>

          {/* Tarjeta Usuario */}
          <button
            type="button"
            className={styles.rolCard}
            onClick={() => setVista("registro-usuario")}
          >
            <div className={styles.rolIcono}>
              <Home size={24} />
            </div>
            <div className={styles.rolTexto}>
              <span className={styles.rolTitulo}>Soy Usuario</span>
              <span className={styles.rolSub}>
                Necesito servicios para mi hogar
              </span>
            </div>
            <span className={styles.rolFlecha}>›</span>
          </button>

          {/* Tarjeta Solucionador */}
          <button
            type="button"
            className={`${styles.rolCard} ${styles.rolCardSolucionador}`}
            onClick={() => setVista("registro-solucionador")}
          >
            <div className={styles.rolIcono}>
              <Wrench size={24} />
            </div>
            <div className={styles.rolTexto}>
              <span className={styles.rolTitulo}>Soy Solucionador</span>
              <span className={styles.rolSub}>
                Ofrezco mis servicios profesionales
              </span>
            </div>
            <span className={styles.rolFlecha}>›</span>
          </button>
        </div>

        {/* Link a login */}
        <div className={styles.loginLink}>
          <span className={styles.loginLinkTexto}>¿Ya tenés cuenta?</span>
          <button
            type="button"
            className={styles.loginLinkBtn}
            onClick={() => setVista("login")}
          >
            Iniciá sesión →
          </button>
        </div>
      </div>
    );
  }

  // ── VISTA: LOGIN ──
  if (vista === "login") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.formHeader}>
          <button
            className={styles.btnVolver}
            onClick={() => setVista("bienvenida")}
          >
            ← Volver
          </button>
          <div className={styles.formHeaderLogo}>
            <LogoTexto size={22} />
          </div>
        </div>

        <div className={styles.formBloque}>
          <div className={styles.formTituloBloque}>
            <h2 className={styles.formTitulo}>Bienvenido de nuevo</h2>
            <p className={styles.formSub}>Ingresá tus datos para continuar</p>
          </div>

          <div className={styles.form}>
            <div className={styles.campo}>
              <label className={styles.campoLabel}>Correo electrónico</label>
              <input
                type="email"
                className={styles.campoInput}
                placeholder="tu@email.com"
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Contraseña</label>
              <div className={styles.campoConOjo}>
                <input
                  type={verPassLogin ? "text" : "password"}
                  className={styles.campoInput}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className={styles.btnOjo}
                  onClick={() => setVerPassLogin((v) => !v)}
                >
                  {verPassLogin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="button" className={styles.campoOlvide}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="button"
              className={styles.btnPrimario}
              onClick={() => navigate("/home")}
            >
              Iniciar sesión
            </button>

            <div className={styles.separador}>
              <div className={styles.separadorLinea}></div>
              <span className={styles.separadorTexto}>o</span>
              <div className={styles.separadorLinea}></div>
            </div>

            <button type="button" className={styles.btnGoogle}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
                />
              </svg>
              Continuar con Google
            </button>
          </div>

          <div className={styles.formFooter}>
            <span className={styles.formFooterTexto}>¿No tenés cuenta?</span>
            <button
              type="button"
              className={styles.formFooterBtn}
              onClick={() => setVista("bienvenida")}
            >
              Registrate gratis →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VISTA: REGISTRO USUARIO ──
  if (vista === "registro-usuario") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.formHeader}>
          <button
            className={styles.btnVolver}
            onClick={() => setVista("bienvenida")}
          >
            ← Volver
          </button>
          <div className={styles.formHeaderLogo}>
            <LogoTexto size={22} />
          </div>
        </div>

        <div className={styles.formBloque}>
          <div className={styles.formTituloBloque}>
            <div className={styles.rolBadge}>
              <Home size={14} /> Usuario
            </div>
            <h2 className={styles.formTitulo}>Creá tu cuenta</h2>
            <p className={styles.formSub}>
              Es gratis y tarda menos de 2 minutos
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.campoFila}>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Nombre</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  placeholder="Martín"
                />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Apellido</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  placeholder="García"
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Correo electrónico</label>
              <input
                type="email"
                className={styles.campoInput}
                placeholder="tu@email.com"
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Contraseña</label>
              <div className={styles.campoConOjo}>
                <input
                  type={verPassUsuario ? "text" : "password"}
                  className={styles.campoInput}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  className={styles.btnOjo}
                  onClick={() => setVerPassUsuario((v) => !v)}
                >
                  {verPassUsuario ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.terminosBloque}>
              <input
                type="checkbox"
                id="terminos"
                className={styles.terminosCheck}
              />
              <label htmlFor="terminos" className={styles.terminosTexto}>
                Acepto los{" "}
                <span className={styles.terminosLink}>
                  términos y condiciones
                </span>
              </label>
            </div>

            <button
              type="button"
              className={styles.btnPrimario}
              onClick={() => navigate("/home")}
            >
              Crear cuenta gratis
            </button>

            <div className={styles.separador}>
              <div className={styles.separadorLinea}></div>
              <span className={styles.separadorTexto}>o</span>
              <div className={styles.separadorLinea}></div>
            </div>

            <button type="button" className={styles.btnGoogle}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
                />
              </svg>
              Registrate con Google
            </button>
          </div>

          <div className={styles.formFooter}>
            <span className={styles.formFooterTexto}>¿Ya tenés cuenta?</span>
            <button
              type="button"
              className={styles.formFooterBtn}
              onClick={() => setVista("login")}
            >
              Iniciá sesión →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VISTA: REGISTRO SOLUCIONADOR ──
  if (vista === "registro-solucionador") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.formHeader}>
          <button
            className={styles.btnVolver}
            onClick={() => setVista("bienvenida")}
          >
            ← Volver
          </button>
          <div className={styles.formHeaderLogo}>
            <LogoTexto size={22} />
          </div>
        </div>

        <div className={styles.formBloque}>
          <div className={styles.formTituloBloque}>
            <div
              className={`${styles.rolBadge} ${styles.rolBadgeSolucionador}`}
            >
              <Wrench size={14} /> Solucionador
            </div>
            <h2 className={styles.formTitulo}>Registrate como profesional</h2>
            <p className={styles.formSub}>
              Completá tus datos para empezar a recibir solicitudes
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.campoFila}>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Nombre</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  placeholder="Carlos"
                />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Apellido</label>
                <input
                  type="text"
                  className={styles.campoInput}
                  placeholder="Méndez"
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Correo electrónico</label>
              <input
                type="email"
                className={styles.campoInput}
                placeholder="tu@email.com"
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Oficio principal</label>
              <select className={styles.campoSelect}>
                <option value="">Seleccioná tu oficio</option>
                <option>Plomería</option>
                <option>Electricidad</option>
                <option>Gas</option>
                <option>Pintura</option>
                <option>Carpintería</option>
                <option>Aire Acondicionado</option>
                <option>Albañilería</option>
                <option>Limpieza</option>
              </select>
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Contraseña</label>
              <div className={styles.campoConOjo}>
                <input
                  type={verPassSolucionador ? "text" : "password"}
                  className={styles.campoInput}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  className={styles.btnOjo}
                  onClick={() => setVerPassSolucionador((v) => !v)}
                >
                  {verPassSolucionador ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.terminosBloque}>
              <input
                type="checkbox"
                id="terminos-s"
                className={styles.terminosCheck}
              />
              <label htmlFor="terminos-s" className={styles.terminosTexto}>
                Acepto los{" "}
                <span className={styles.terminosLink}>
                  términos y condiciones
                </span>
              </label>
            </div>

            {/* Info sobre el proceso */}
            <div className={styles.infoBloque}>
              <span className={styles.infoIcono}>
                <Info size={16} />
              </span>
              <p className={styles.infoTexto}>
                Después del registro vas a poder completar tu perfil completo:
                fotos, certificaciones, disponibilidad horaria y más.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.btnPrimario} ${styles.btnPrimarioSolucionador}`}
              onClick={() => navigate("/home-solucionador")}
            >
              Comenzar como Solucionador
            </button>
          </div>

          <div className={styles.formFooter}>
            <span className={styles.formFooterTexto}>¿Ya tenés cuenta?</span>
            <button
              type="button"
              className={styles.formFooterBtn}
              onClick={() => setVista("login")}
            >
              Iniciá sesión →
            </button>
          </div>
        </div>
      </div>
    );
  }
}
