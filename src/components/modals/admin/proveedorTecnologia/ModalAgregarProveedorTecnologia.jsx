// src/components/modals/admin/relaciones/ModalAgregarProveedorTecnologia.jsx
import { useEffect, useState } from "react";
import ModalContenedor from "../../../ui/ModalContenedor";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import CheckboxDropdown from "../../../ui/CheckboxDropdown";
import Select from "../../../ui/Select";
import { IconX } from "@tabler/icons-react";
import { useAlerta } from "../../../../context/AlertaContext";
import { obtenerTecnologias } from "../../../../services/tecnologiaService";
import { obtenerProveedoresSinTecnologias, actualizarTecnologiasProveedor } from "../../../../services/relaciones/proveedorTecnologiaService";

const ModalAgregarProveedorTecnologia = ({ onClose, onActualizar }) => {
  const [proveedores, setProveedores] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [tecnologiasSeleccionadas, setTecnologiasSeleccionadas] = useState([]);

  const [loading, setLoading] = useState(false);
  const { mostrarError, mostrarExito } = useAlerta();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [provs, tecs] = await Promise.all([
          obtenerProveedoresSinTecnologias(),
          obtenerTecnologias(),
        ]);
        setProveedores(provs);
        setTecnologias(tecs);
      } catch (e) {
        mostrarError("Error al cargar proveedores o tecnologías.");
      }
    };
    cargarDatos();
  }, []);

  const handleSubmit = async () => {
    if (!proveedorSeleccionado) {
      mostrarError("Debes seleccionar un proveedor.");
      return;
    }
    setLoading(true);
    try {
      await actualizarTecnologiasProveedor(
        parseInt(proveedorSeleccionado),
        tecnologiasSeleccionadas
      );
      mostrarExito("Tecnologías asignadas correctamente");
      onActualizar?.();
      onClose();
    } catch (e) {
      mostrarError("Error al asignar tecnologías: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">Asignar tecnologías a proveedor</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          disabled={loading}
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Selector proveedor */}
      <div className="mb-6">
        <Select
          label="Proveedor"
          value={proveedorSeleccionado}
          onChange={(val) => setProveedorSeleccionado(val)}
          options={[
            { id: "", nombre: "Seleccionar proveedor" },
            ...proveedores,
          ]}
          getOptionValue={(opt) => opt.id}
          getOptionLabel={(opt) => opt.nombre}
          disabled={loading}
        />
      </div>

      {/* Selector tecnologías */}
      <div className="mb-6">
        <CheckboxDropdown
          label="Tecnologías a asignar"
          options={tecnologias.map((t) => ({
            value: String(t.id),
            label: t.tecnologia,
          }))}
          value={tecnologiasSeleccionadas.map(String)}
          onChange={(nuevas) =>
            setTecnologiasSeleccionadas(nuevas.map((id) => parseInt(id)))
          }
          disabled={loading || !proveedorSeleccionado}
        />
      </div>

      <hr className="border-white/10 mb-6" />

      <div className="flex flex-col sm:flex-row gap-3">
        <MainButton
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          className="flex-1 order-2 sm:order-1"
        >
          Cancelar
        </MainButton>
        <MainButton
          type="submit"
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          className="flex-1 order-1 sm:order-2"
        >
          {loading ? "Asignando..." : "Asignar tecnologías"}
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalAgregarProveedorTecnologia;
