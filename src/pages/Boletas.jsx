import { useEffect, useState } from "react";
import { obtenerBoletasDelUsuario } from "../services/boletas/crud";
import BoletaForm from "../components/boletas/BoletaForm";
import BoletaHistorial from "../components/boletas/BoletaHistorial";
import BoletasLayout from "../components/boletas/BoletasLayout";
import { useNotificaciones } from "../components/layout/Navbar";
import MainButton from "../components/ui/MainButton";
import MainLinkButton from "../components/ui/MainLinkButton";
import { useAlerta } from "../context/AlertaContext";
import { IconArrowLeft } from "@tabler/icons-react";

const Boletas = () => {
  useEffect(() => {
    document.title = "Red-Fi | Boletas";
  }, []);
  const [boletas, setBoletas] = useState([]);
  const [vista, setVista] = useState("historial");
  const { cargarNotificaciones } = useNotificaciones();
  const { mostrarError, mostrarExito } = useAlerta();

  const cargarBoletas = async () => {
    try {
      const data = await obtenerBoletasDelUsuario();
      setBoletas(data);
    } catch (error) {
      mostrarError("Error al cargar las boletas.");
    }
  };

  useEffect(() => {
    cargarBoletas();
  }, []);

  return (
    <BoletasLayout>
      <div className="flex gap-4 justify-center mb-8">
        <MainButton
          variant="toggle"
          active={vista === "formulario"}
          onClick={() => setVista("formulario")}
        >
          Nueva Boleta
        </MainButton>
        <MainButton
          variant="toggle"
          active={vista === "historial"}
          onClick={() => setVista("historial")}
        >
          Ver Historial
        </MainButton>
      </div>

      {vista === "formulario" ? (
        <BoletaForm
          onBoletaAgregada={cargarBoletas}
          onActualizarNotificaciones={cargarNotificaciones}
          setVista={setVista}
        />
      ) : (
        <BoletaHistorial boletas={boletas} recargarBoletas={cargarBoletas} />
      )}

      {/* 🔙 Botón volver al perfil */}
      <div className="text-center">
        <MainLinkButton to="/cuenta" variant="secondary">
          <IconArrowLeft />
          Volver al perfil
        </MainLinkButton>
      </div>
    </BoletasLayout>
  );
};

export default Boletas;
