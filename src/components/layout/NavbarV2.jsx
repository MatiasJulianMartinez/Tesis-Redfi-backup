import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { THEME_ICONS } from "../../constants/themes";
import Logo from "../../icons/logotipo/imagotipo";
import {
  IconX,
  IconBell,
  IconBellFilled,
  IconHome,
  IconMap,
  IconTool,
  IconHeadset,
  IconUser,
  IconDots,
  IconLogout,
  IconPalette,
} from "@tabler/icons-react";
import { obtenerNotificacionesBoletas } from "../../services/boletas/notificaciones";
import MainButton from "../ui/MainButton";
import { logoutUser } from "../../services/authService";

export const useNotificaciones = () => {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarNotificaciones = async () => {
    if (!usuario) return;
    const alertas = await obtenerNotificacionesBoletas(usuario.id);
    setNotificaciones(alertas);
  };

  useEffect(() => {
    cargarNotificaciones();
    const handler = () => cargarNotificaciones();

    window.addEventListener("nueva-boleta", handler);
    return () => window.removeEventListener("nueva-boleta", handler);
  }, [usuario]);

  return { notificaciones, setNotificaciones, cargarNotificaciones };
};

const NavbarV2 = () => {
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const { usuario, logout } = useAuth();
  const { notificaciones, setNotificaciones } = useNotificaciones();
  const { currentTheme, availableThemes, changeTheme, toggleTheme, themeData } = useTheme();
  const location = useLocation();

  // Función para obtener el color principal del logo según el tema
  const getLogoColorPrincipal = () => {
    if (currentTheme === 'light') {
      return '#1f2a40'; // Secundario del tema dark
    }
    return themeData?.texto || "#FFFFFF";
  };

  const linkClase = "hover:text-acento transition px-4 py-2 font-bold";

  const mainNavigationItems = [
    { path: "/", label: "Inicio", icon: IconHome },
    { path: "/mapa", label: "Mapa", icon: IconMap },
    { path: "/herramientas", label: "Herramientas", icon: IconTool },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:block bg-fondo px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <Link to="/" className="flex items-center gap-2">
            <Logo
              className="h-10"
              colorPrincipal={getLogoColorPrincipal()}
              colorAcento={themeData?.acento || "#FB8531"}
            />
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className={linkClase}>
              Inicio
            </Link>
            <Link to="/mapa" className={linkClase}>
              Mapa
            </Link>
            <Link to="/herramientas" className={linkClase}>
              Herramientas
            </Link>
            <Link to="/soporte" className={linkClase}>
              Soporte
            </Link>

            {/* Botón de tema - siempre visible */}
            <div className="relative">
              <MainButton
                onClick={() => setMostrarTemas(!mostrarTemas)}
                variant="secondary"
                className="!bg-transparent hover:text-acento"
                icon={IconPalette}
                iconSize={26}
                title="Cambiar tema"
              />

              {mostrarTemas && (
                <div className="absolute right-0 mt-2 w-48 bg-fondo text-texto rounded-lg shadow-lg z-50 p-2 space-y-1">
                  {availableThemes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        changeTheme(theme);
                        setMostrarTemas(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 transition flex items-center gap-2 ${
                        currentTheme === theme ? "bg-primario" : ""
                      }`}
                    >
                      <span>{THEME_ICONS[theme]}</span>
                      <span className="capitalize">{theme}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!usuario ? (
              <>
                <Link
                  to="/login"
                  className="bg-acento px-3 py-1 rounded hover:bg-acento/80 hover:scale-110 transition font-bold cursor-pointer"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link to="/cuenta" className={linkClase}>
                  Perfil
                </Link>
                <div>
                  <MainButton
                    onClick={() => setMostrarNotis(!mostrarNotis)}
                    variant="secondary"
                    className={`relative !bg-transparent hover:text-acento ${
                      notificaciones.length > 0 ? "animate-bounce" : ""
                    }`}
                    icon={
                      notificaciones.length > 0
                        ? () => (
                            <IconBellFilled size={26} className="text-acento" />
                          )
                        : IconBell
                    }
                    iconSize={26}
                    title="Notificaciones"
                  >
                    {notificaciones.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-texto text-xs px-2 py-0.5 rounded-full shadow-md">
                        {notificaciones.length}
                      </span>
                    )}
                  </MainButton>

                  {mostrarNotis && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#393939] text-texto rounded-lg shadow-lg z-50 p-4 space-y-2">
                      {notificaciones.length === 0 ? (
                        <p className="text-gray-300 italic text-center">
                          Sin notificaciones
                        </p>
                      ) : (
                        notificaciones.map((msg, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-300 pb-2 last:border-b-0 flex justify-between items-start gap-2"
                          >
                            <span className="break-words">{msg}</span>
                            <MainButton
                              onClick={() =>
                                setNotificaciones((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                )
                              }
                              variant="cross"
                              title="Cerrar"
                              icon={IconX}
                              iconSize={20}
                              className="leading-none p-0"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={async () => {
                    await logoutUser();
                  }}
                  className="bg-red-400 px-3 py-1 rounded hover:bg-red-600 hover:scale-110 transition font-bold"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Solo Logo */}
      <nav className="lg:hidden bg-fondo px-4 py-4">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo
              className="h-8"
              colorPrincipal={getLogoColorPrincipal()}
              colorAcento={themeData?.acento || "#FB8531"}
            />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavbarV2;
