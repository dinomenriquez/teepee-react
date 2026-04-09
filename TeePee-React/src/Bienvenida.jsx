import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Bienvenida.module.css";
import { LogoTeePee, LogoTexto } from "./Iconos";
import { IconoVolver } from "./Iconos";
import { Eye, EyeOff, Home, Wrench, Info, Search, ShieldCheck, Star, CreditCard, X } from "lucide-react";

export default function Bienvenida() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [vista, setVista] = useState("bienvenida");
  const [verPassLogin, setVerPassLogin] = useState(false);
  const [verPassUsuario, setVerPassUsuario] = useState(false);
  const [verPassSolucionador, setVerPassSolucionador] = useState(false);
  const [modalTC, setModalTC] = useState(false);
  const [modalPasos, setModalPasos] = useState(false);
  const [formLogin, setFormLogin] = useState({ email: "", pass: "" });
  const [formUsuario, setFormUsuario] = useState({ nombre: "", apellido: "", email: "", pass: "" });
  const [formSolucionador, setFormSolucionador] = useState({ nombre: "", apellido: "", email: "", oficio: "", pass: "" });

  // ── Modal Términos y Condiciones (compartido) ──
  const ModalTC = () => (
    <div className={styles.modalOverlay} onClick={() => setModalTC(false)}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <h2 className={styles.modalTitulo}>Términos y Condiciones</h2>
        <div className={styles.modalContenido}>
          <p><strong className={styles.modalStrong}>1. Aceptación</strong><br />Al registrarte en TeePee aceptás estos términos.</p>
          <p><strong className={styles.modalStrong}>2. Uso de la plataforma</strong><br />TeePee conecta usuarios con solucionadores. Los solucionadores son trabajadores independientes.</p>
          <p><strong className={styles.modalStrong}>3. Escrow y pagos</strong><br />Los pagos quedan retenidos hasta confirmar el trabajo. Comisión del 6% al 10%.</p>
          <p><strong className={styles.modalStrong}>4. Garantía</strong><br />Los solucionadores pueden ofrecer garantía voluntaria. TeePee facilita la mediación.</p>
          <p><strong className={styles.modalStrong}>5. Cancelaciones</strong><br />Sujetas a la política de devolución según el estado del trabajo.</p>
          <p><strong className={styles.modalStrong}>6. Privacidad</strong><br />Tus datos son tratados conforme a nuestra Política de Privacidad. No vendemos datos.</p>
          <p><strong className={styles.modalStrong}>7. Conducta</strong><br />Prohibido el uso fraudulento y el acoso. El incumplimiento puede resultar en suspensión.</p>
          <p><strong className={styles.modalStrong}>8. Jurisdicción</strong><br />Rigen las leyes de Argentina. Disputas en tribunales de Posadas, Misiones.</p>
        </div>
        <button type="button" className={styles.modalBtn} onClick={() => setModalTC(false)}>
          Entendido
        </button>
      </div>
    </div>
  );

  // ── VISTA: BIENVENIDA ──
  if (vista === "bienvenida") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.fondo}>
          <div className={styles.fondoCirculo1}></div>
          <div className={styles.fondoCirculo2}></div>
        </div>

        <div className={styles.logoBloque}>
          <div className={styles.logoIcono}>
            <LogoTeePee size={112} />
          </div>
          <h1 className={styles.logoTexto}>
            <LogoTexto size={48} />
          </h1>
          <p className={styles.logoTagline}>Conectamos hogares con profesionales</p>
        </div>

        <div className={styles.rolesBloque}>
          <p className={styles.rolesTitulo}>¿Cómo querés usar TeePee?</p>

          <button type="button" className={styles.rolCard} onClick={() => setVista("registro-usuario")}>
            <div className={styles.rolIcono}><Home size={24} /></div>
            <div className={styles.rolTexto}>
              <span className={styles.rolTitulo}>Soy Usuario</span>
              <span className={styles.rolSub}>Necesito servicios para mi hogar</span>
            </div>
            <span className={styles.rolFlecha}>›</span>
          </button>

          <button type="button" className={`${styles.rolCard} ${styles.rolCardSolucionador}`} onClick={() => setVista("registro-solucionador")}>
            <div className={styles.rolIcono}><Wrench size={24} /></div>
            <div className={styles.rolTexto}>
              <span className={styles.rolTitulo}>Soy Solucionador</span>
              <span className={styles.rolSub}>Ofrezco mis servicios profesionales</span>
            </div>
            <span className={styles.rolFlecha}>›</span>
          </button>
        </div>

        <div className={styles.loginLink}>
          <span className={styles.loginLinkTexto}>¿Ya tenés cuenta?</span>
          <button type="button" className={styles.loginLinkBtn} onClick={() => setVista("login")}>
            Iniciá sesión →
          </button>
        </div>

        <button type="button" className={styles.btnPasos} onClick={() => setModalPasos(true)}>
          <Info size={14} /> ¿Cómo funciona TeePee?
        </button>

        {/* Modal primeros pasos */}
        {modalPasos && (
          <div className={styles.modalOverlay} onClick={() => setModalPasos(false)}>
            <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHandle} />
              <div className={styles.pasosHeader}>
                <h2 className={styles.pasosTitulo}>¿Cómo funciona TeePee?</h2>
                <button type="button" className={styles.pasosCerrar} onClick={() => setModalPasos(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className={styles.pasosList}>
                <div className={styles.paso}>
                  <div className={styles.pasoIcono}><Search size={20} /></div>
                  <div className={styles.pasoTexto}>
                    <p className={styles.pasoTitulo}>1. Describí lo que necesitás</p>
                    <p className={styles.pasoDes}>Contanos qué servicio necesitás y cuándo. Plomería, electricidad, pintura y más.</p>
                  </div>
                </div>
                <div className={styles.paso}>
                  <div className={styles.pasoIcono}><Star size={20} /></div>
                  <div className={styles.pasoTexto}>
                    <p className={styles.pasoTitulo}>2. Recibí presupuestos</p>
                    <p className={styles.pasoDes}>Profesionales verificados te envían presupuestos. Comparalos y elegí el mejor.</p>
                  </div>
                </div>
                <div className={styles.paso}>
                  <div className={styles.pasoIcono}><CreditCard size={20} /></div>
                  <div className={styles.pasoTexto}>
                    <p className={styles.pasoTitulo}>3. Pagá de forma segura</p>
                    <p className={styles.pasoDes}>Tu dinero queda retenido hasta que el trabajo esté terminado y aprobado.</p>
                  </div>
                </div>
                <div className={styles.paso}>
                  <div className={styles.pasoIcono}><ShieldCheck size={20} /></div>
                  <div className={styles.pasoTexto}>
                    <p className={styles.pasoTitulo}>4. Trabajo garantizado</p>
                    <p className={styles.pasoDes}>Si algo no está bien, TeePee media. Tu satisfacción es nuestra prioridad.</p>
                  </div>
                </div>
              </div>
              <button type="button" className={styles.modalBtn} onClick={() => setModalPasos(false)}>
                ¡Empecemos!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── VISTA: LOGIN ──
  if (vista === "login") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.formHeader}>
          <button className={styles.btnVolver} onClick={() => setVista("bienvenida")}>
            <IconoVolver size={20} />
          </button>
          <div className={styles.formHeaderLogo}>
            <LogoTeePee size={26} />
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
              <input type="email" className={styles.campoInput} placeholder="tu@email.com"
                value={formLogin.email} onChange={(e) => setFormLogin({ ...formLogin, email: e.target.value })} />
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Contraseña</label>
              <div className={styles.campoConOjo}>
                <input type={verPassLogin ? "text" : "password"} className={styles.campoInput} placeholder="••••••••" />
                <button type="button" className={styles.btnOjo} onClick={() => setVerPassLogin((v) => !v)}>
                  {verPassLogin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="button" className={styles.campoOlvide}>¿Olvidaste tu contraseña?</button>
            </div>

            <button type="button" className={styles.btnPrimario}
              onClick={() => {
                login({ nombre: formLogin.email.split("@")[0] || "Usuario", email: formLogin.email, roles: ["usuario"], rolActivo: "usuario" });
                navigate("/home");
              }}>
              Iniciar sesión
            </button>

            <div className={styles.separador}>
              <div className={styles.separadorLinea}></div>
              <span className={styles.separadorTexto}>o</span>
              <div className={styles.separadorLinea}></div>
            </div>

            <button type="button" className={styles.btnGoogle}
              onClick={() => {
                try {
                  const prev = JSON.parse(localStorage.getItem("teepee_session"));
                  const rol = prev?.rolActivo || "usuario";
                  const roles = prev?.roles || ["usuario"];
                  login({ nombre: "Usuario Google", email: "google@gmail.com", roles, rolActivo: rol });
                  navigate(rol === "solucionador" ? "/home-solucionador" : "/home");
                } catch {
                  login({ nombre: "Usuario Google", email: "google@gmail.com", roles: ["usuario"], rolActivo: "usuario" });
                  navigate("/home");
                }
              }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              Continuar con Google
            </button>
          </div>

          <div className={styles.formFooter}>
            <span className={styles.formFooterTexto}>¿No tenés cuenta?</span>
            <button type="button" className={styles.formFooterBtn} onClick={() => setVista("bienvenida")}>
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
          <button className={styles.btnVolver} onClick={() => setVista("bienvenida")}>
            <IconoVolver size={20} />
          </button>
          <div className={styles.formHeaderLogo}>
            <LogoTeePee size={26} />
            <LogoTexto size={22} />
          </div>
        </div>

        <div className={styles.formBloque}>
          <div className={styles.formTituloBloque}>
            <div className={styles.rolBadge}><Home size={14} /> Usuario</div>
            <h2 className={styles.formTitulo}>Creá tu cuenta</h2>
            <p className={styles.formSub}>Es gratis y tarda menos de 2 minutos</p>
          </div>

          <div className={styles.form}>
            <div className={styles.campoFila}>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Nombre</label>
                <input type="text" className={styles.campoInput} placeholder="Martín"
                  value={formUsuario.nombre} onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Apellido</label>
                <input type="text" className={styles.campoInput} placeholder="García"
                  value={formUsuario.apellido} onChange={(e) => setFormUsuario({ ...formUsuario, apellido: e.target.value })} />
              </div>
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Correo electrónico</label>
              <input type="email" className={styles.campoInput} placeholder="tu@email.com" />
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Contraseña</label>
              <div className={styles.campoConOjo}>
                <input type={verPassUsuario ? "text" : "password"} className={styles.campoInput} placeholder="Mínimo 8 caracteres" />
                <button type="button" className={styles.btnOjo} onClick={() => setVerPassUsuario((v) => !v)}>
                  {verPassUsuario ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.terminosBloque}>
              <input type="checkbox" id="terminos" className={styles.terminosCheck} />
              <label htmlFor="terminos" className={styles.terminosTexto}>
                Acepto los{" "}
                <button type="button" className={styles.terminosLink} onClick={() => setModalTC(true)}>
                  términos y condiciones
                </button>
              </label>
            </div>

            <button type="button" className={styles.btnPrimario}
              onClick={() => {
                login({ nombre: formUsuario.nombre || "Usuario", email: formUsuario.email, roles: ["usuario"], rolActivo: "usuario" });
                navigate("/home");
              }}>
              Crear cuenta gratis
            </button>

            <div className={styles.separador}>
              <div className={styles.separadorLinea}></div>
              <span className={styles.separadorTexto}>o</span>
              <div className={styles.separadorLinea}></div>
            </div>

            <button type="button" className={styles.btnGoogle}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              Registrate con Google
            </button>
          </div>

          <div className={styles.formFooter}>
            <span className={styles.formFooterTexto}>¿Ya tenés cuenta?</span>
            <button type="button" className={styles.formFooterBtn} onClick={() => setVista("login")}>
              Iniciá sesión →
            </button>
          </div>
        </div>

        {modalTC && <ModalTC />}
      </div>
    );
  }

  // ── VISTA: REGISTRO SOLUCIONADOR ──
  if (vista === "registro-solucionador") {
    return (
      <div className={styles.pantalla}>
        <div className={styles.formHeader}>
          <button className={styles.btnVolver} onClick={() => setVista("bienvenida")}>
            <IconoVolver size={20} />
          </button>
          <div className={styles.formHeaderLogo}>
            <LogoTeePee size={26} />
            <LogoTexto size={22} />
          </div>
        </div>

        <div className={styles.formBloque}>
          <div className={styles.formTituloBloque}>
            <div className={`${styles.rolBadge} ${styles.rolBadgeSolucionador}`}>
              <Wrench size={14} /> Solucionador
            </div>
            <h2 className={styles.formTitulo}>Registrate como profesional</h2>
            <p className={styles.formSub}>Completá tus datos para empezar a recibir solicitudes</p>
          </div>

          <div className={styles.form}>
            <div className={styles.campoFila}>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Nombre</label>
                <input type="text" className={styles.campoInput} placeholder="Carlos"
                  value={formSolucionador.nombre} onChange={(e) => setFormSolucionador({ ...formSolucionador, nombre: e.target.value })} />
              </div>
              <div className={styles.campo}>
                <label className={styles.campoLabel}>Apellido</label>
                <input type="text" className={styles.campoInput} placeholder="Méndez"
                  value={formSolucionador.apellido} onChange={(e) => setFormSolucionador({ ...formSolucionador, apellido: e.target.value })} />
              </div>
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Correo electrónico</label>
              <input type="email" className={styles.campoInput} placeholder="tu@email.com" />
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Oficio principal</label>
              <select className={styles.campoSelect} value={formSolucionador.oficio}
                onChange={(e) => setFormSolucionador({ ...formSolucionador, oficio: e.target.value })}>
                <option value="">Seleccioná tu oficio</option>
                <option>Plomería</option>
                <option>Electricidad</option>
                <option>Gas</option>
                <option>Pintura</option>
                <option>Carpintería</option>
                <option>Aire Acondicionado</option>
                <option>Albañilería</option>
                <option>Limpieza</option>
                <option>Cerrajería</option>
                <option>Jardinería</option>
                <option>Herrería</option>
                <option>Soldadura</option>
                <option>Techista</option>
                <option>Plaquista / Durlock</option>
                <option>Pisos y revestimientos</option>
                <option>Vidriería</option>
                <option>Fumigación</option>
                <option>Mudanzas</option>
                <option>Electricista industrial</option>
                <option>Gasista matriculado</option>
                <option>Refrigeración</option>
                <option>Techos y cubiertas</option>
                <option>Antenas y CCTV</option>
                <option>Redes y cableado</option>
                <option>Tapicería</option>
              </select>
            </div>

            <div className={styles.campo}>
              <label className={styles.campoLabel}>Contraseña</label>
              <div className={styles.campoConOjo}>
                <input type={verPassSolucionador ? "text" : "password"} className={styles.campoInput} placeholder="Mínimo 8 caracteres" />
                <button type="button" className={styles.btnOjo} onClick={() => setVerPassSolucionador((v) => !v)}>
                  {verPassSolucionador ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.terminosBloque}>
              <input type="checkbox" id="terminos-s" className={styles.terminosCheck} />
              <label htmlFor="terminos-s" className={styles.terminosTexto}>
                Acepto los{" "}
                <button type="button" className={styles.terminosLink} onClick={() => setModalTC(true)}>
                  términos y condiciones
                </button>
              </label>
            </div>

            <div className={styles.infoBloque}>
              <span className={styles.infoIcono}><Info size={16} /></span>
              <p className={styles.infoTexto}>
                Después del registro vas a poder completar tu perfil completo: fotos, certificaciones, disponibilidad horaria y más.
              </p>
            </div>

            <button type="button" className={`${styles.btnPrimario} ${styles.btnPrimarioSolucionador}`}
              onClick={() => {
                login({ nombre: formSolucionador.nombre || "Solucionador", email: formSolucionador.email, roles: ["solucionador"], rolActivo: "solucionador" });
                navigate("/home-solucionador");
              }}>
              Comenzar como Solucionador
            </button>
          </div>

          <div className={styles.formFooter}>
            <span className={styles.formFooterTexto}>¿Ya tenés cuenta?</span>
            <button type="button" className={styles.formFooterBtn} onClick={() => setVista("login")}>
              Iniciá sesión →
            </button>
          </div>
        </div>

        {modalTC && <ModalTC />}
      </div>
    );
  }
}