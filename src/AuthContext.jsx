import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "teepee_session";

function leerSesion() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function guardarSesion(sesion) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
  } catch {}
}

function borrarSesion() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => leerSesion());
  const cargando = false;

  function login({ nombre, email, roles, rolActivo, token = "mock-token" }) {
    const nueva = { nombre, email, roles, rolActivo, token, verificado: true };
    guardarSesion(nueva);
    setSesion(nueva);
  }

  function logout() {
    borrarSesion();
    setSesion(null);
    // Fuerza reload completo para limpiar cualquier estado residual
    window.location.href = "/bienvenida";
  }

  function cambiarRol(nuevoRol) {
    if (!sesion?.roles?.includes(nuevoRol)) return;
    const actualizada = { ...sesion, rolActivo: nuevoRol };
    guardarSesion(actualizada);
    setSesion(actualizada);
  }

  function activarSegundoRol(nuevoRol) {
    if (sesion?.roles?.includes(nuevoRol)) return;
    const actualizada = {
      ...sesion,
      roles: [...(sesion?.roles || []), nuevoRol],
      rolActivo: nuevoRol,
    };
    guardarSesion(actualizada);
    setSesion(actualizada);
  }

  const tieneDobleRol = sesion?.roles?.length === 2;
  const esSolucionador = sesion?.rolActivo === "solucionador";
  const esUsuario = sesion?.rolActivo === "usuario";

  return (
    <AuthContext.Provider
      value={{
        sesion,
        cargando,
        login,
        logout,
        cambiarRol,
        activarSegundoRol,
        tieneDobleRol,
        esSolucionador,
        esUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
