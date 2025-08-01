// src/components/modals/admin/relaciones/ModalEditarProveedorTecnologia.jsx
import { useEffect, useState } from "react";
import ModalContenedor from "../../../ui/ModalContenedor";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import CheckboxDropdown from "../../../ui/CheckboxDropdown";
import { IconX } from "@tabler/icons-react";
import {
  obtenerTecnologiasPorProveedor,
  actualizarTecnologiasProveedor,
} from "../../../../services/relaciones/proveedorTecnologiaService";
import { useAlerta } from "../../../../context/AlertaContext";
import { obtenerTecnologias } from "../../../../services/tecnologiaService";

const ModalEditarProveedorTecnologia = ({
  proveedor,
  onClose,
  onActualizar,
}) => {
  const [todasLasTecnologias, setTodasLasTecnologias] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { mostrarError, mostrarExito } = useAlerta();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const tecs = await obtenerTecnologias();
        setTodasLasTecnologias(tecs);
        const actuales = await obtenerTecnologiasPorProveedor(proveedor.id);
        setSeleccionadas(actuales); // Se espera array de IDs
      } catch (e) {
        mostrarError("Error al cargar tecnologías: " + e.message);
      }
    };
    cargarDatos();
  }, [proveedor]);

  const handleSubmit = async () => {
    setCargando(true);
    try {
      await actualizarTecnologiasProveedor(proveedor.id, seleccionadas);
      mostrarExito("Tecnologías actualizadas correctamente");
      onActualizar();
      onClose();
    } catch (e) {
      mostrarError("Error al actualizar tecnologías: " + e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">Editar tecnologías</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          disabled={cargando}
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Información del proveedor */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-texto/80">Proveedor:</span>
          <span className="text-texto">
            {proveedor.proveedor}
          </span>
        </div>
      </div>

      {/* Selector de tecnologías */}
      <div className="mb-6">
        <CheckboxDropdown
          label="Tecnologías asignadas"
          options={todasLasTecnologias.map((t) => ({
            value: String(t.id),
            label: t.tecnologia,
          }))}
          value={seleccionadas.map(String)}
          onChange={(nuevas) =>
            setSeleccionadas(nuevas.map((id) => parseInt(id)))
          }
        />
      </div>

      {/* Divider */}
      <hr className="border-white/10 mb-6" />

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3">
        <MainButton
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={cargando}
          className="flex-1 order-2 sm:order-1"
        >
          Cancelar
        </MainButton>
        <MainButton
          type="submit"
          variant="primary"
          loading={cargando}
          disabled={cargando}
          className="flex-1 order-1 sm:order-2"
          onClick={handleSubmit}
        >
          {cargando ? "Guardando..." : "Guardar cambios"}
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalEditarProveedorTecnologia;
