import { useNavigate } from "react-router-dom";
import { IconX, IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainButton from "../../ui/MainButton";
import Avatar from "../../ui/Avatar";
import ModalContenedor from "../../ui/ModalContenedor";

const ModalReseña = ({ reseña, onClose }) => {
  const navigate = useNavigate();
  const userId = reseña?.usuario_id;
  if (!reseña) return null;

  const estrellasLlenas = Math.round(reseña.estrellas);

  let nombreBruto =
    reseña?.user_profiles?.nombre || reseña?.user_profiles?.user?.nombre;

  let nombre;
  try {
    if (nombreBruto?.includes("{")) {
      const match = nombreBruto.match(/Usuario (.*)/);
      const json = match ? JSON.parse(match[1]) : null;
      nombre = json?.nombre || nombreBruto;
    } else {
      nombre = nombreBruto;
    }
  } catch {
    nombre = nombreBruto;
  }

  const proveedor =
    reseña.nombre_proveedor ||
    reseña.proveedores?.nombre ||
    reseña.proveedor?.nombre ||
    `Proveedor ID: ${reseña.proveedor_id}`;

  const fotoUrl =
    reseña?.user_profiles?.foto_url ||
    reseña?.user_profiles?.user?.foto_perfil ||
    null;

  const iniciales = nombre
    ? nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <ModalContenedor onClose={onClose}>
      {/* Botón cerrar */}
      <MainButton
        onClick={onClose}
        variant="cross"
        title="Cerrar"
        className="absolute top-3 right-3"
      >
        <IconX size={24} />
      </MainButton>
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <Avatar fotoUrl={fotoUrl} nombre={nombre} size={20} />
      </div>
      {/* Nombre */}
      <MainH2
        onClick={() => navigate(`/usuarios/${userId}`)}
        className="text-2xl lg:text-3xl text-center cursor-pointer hover:underline text-acento"
      >
        {nombre}
      </MainH2>
      {/* Proveedor */}
      <p className="text-center text-texto mb-4 font-semibold">
        Proveedor: {proveedor}
      </p>
      {/* Estrellas */}
      <div className="flex justify-center gap-1 text-yellow-400 text-2xl mb-4">
        {Array.from({ length: 5 }).map((_, i) =>
          i < estrellasLlenas ? (
            <IconCarambolaFilled key={i} size={24} />
          ) : (
            <IconCarambola key={i} size={24} />
          )
        )}
      </div>
      {/* Comentario */}
      <p className="text-texto bg-texto/5 border border-texto/50 rounded-lg px-4 py-4 text-center leading-relaxed">
        {reseña.comentario}
      </p>
    </ModalContenedor>
  );
};

export default ModalReseña;
