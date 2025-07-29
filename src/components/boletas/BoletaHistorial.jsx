import { useEffect, useState } from "react";
import { eliminarBoletaConImagen } from "../../services/boletas/crud";
import { IconLoader2, IconCalendar } from "@tabler/icons-react";
import ModalEditarBoleta from "../modals/boletas/ModalEditarBoleta";
import ModalVerBoleta from "../modals/boletas/ModalVerBoleta";
import ModalEliminar from "../modals/ModalEliminar";
import MainH2 from "../ui/MainH2";
import MainH3 from "../ui/MainH3";
import MainButton from "../ui/MainButton";
import Table from "../ui/Table";
import { useAlerta } from "../../context/AlertaContext";

const BoletaHistorial = ({ boletas, recargarBoletas }) => {
  const [cargando, setCargando] = useState(true);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [boletaParaVer, setBoletaParaVer] = useState(null);
  const [boletaAEliminar, setBoletaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const { mostrarExito, mostrarError } = useAlerta();

  useEffect(() => {
    const timer = setTimeout(() => setCargando(false), 300);
    return () => clearTimeout(timer);
  }, [boletas]);

  const confirmarEliminacion = async () => {
    if (!boletaAEliminar) return;
    try {
      setEliminando(true);
      await eliminarBoletaConImagen(boletaAEliminar);
      mostrarExito("Boleta eliminada correctamente.");
      window.dispatchEvent(new Event("nueva-boleta"));
      recargarBoletas?.();
    } catch (error) {
      mostrarError("Error al eliminar la boleta.");
      console.error(error);
    } finally {
      setEliminando(false);
      setBoletaAEliminar(null);
    }
  };

  const formatearFechaConTooltip = (fechaISO) => {
    if (!fechaISO) return <span className="text-xs text-texto/40">—</span>;

    const fecha = new Date(fechaISO);
    const formatoCorto = fecha.toLocaleDateString("es-AR");
    const formatoLargo = fecha.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return <span title={formatoLargo}>{formatoCorto}</span>;
  };

  const boletasOrdenadas = [...boletas].sort(
    (a, b) => new Date(b.fecha_carga) - new Date(a.fecha_carga)
  );

  const columnas = [
    {
      id: "numero",
      label: "#",
      renderCell: (_, index) => (
        <span className="text-center">{index + 1}</span>
      ),
    },
    {
      id: "proveedor",
      label: "Proveedor",
    },
    {
      id: "mes",
      label: "Mes",
    },
    {
      id: "monto",
      label: "Monto",
      renderCell: (b) => `$${parseFloat(b.monto).toFixed(2)}`,
    },
    {
      id: "fecha_carga",
      label: "Carga",
      renderCell: (b) => (
        <div className="text-green-400">
          {formatearFechaConTooltip(b.fecha_carga)}
        </div>
      ),
    },

    {
      id: "vencimiento",
      label: "Vencimiento",
      renderCell: (b) => (
        <div className="text-red-400">
          {formatearFechaConTooltip(b.vencimiento + "T12:00:00")}
        </div>
      ),
    },

    {
      id: "promo_hasta",
      label: "Promoción hasta",
      renderCell: (b) =>
        b.promo_hasta ? (
          <div className="text-yellow-400">
            {formatearFechaConTooltip(b.promo_hasta)}
          </div>
        ) : (
          <span className="text-texto">—</span>
        ),
    },

    {
      id: "acciones",
      label: "Acciones",
      renderCell: (b) => (
        <div className="flex flex-wrap gap-2 justify-center">
          <MainButton
            onClick={() => setBoletaParaVer(b)}
            title="Ver boleta"
            variant="see"
          >
            Ver
          </MainButton>
          <MainButton
            onClick={() => setBoletaSeleccionada(b)}
            title="Editar boleta"
            variant="edit"
          >
            Editar
          </MainButton>
          <MainButton
            onClick={() => setBoletaAEliminar(b)}
            title="Eliminar boleta"
            variant="delete"
          >
            Eliminar
          </MainButton>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto relative">
      <MainH2 className="text-center">Historial de boletas</MainH2>

      {cargando ? (
        <div className="flex justify-center items-center text-texto gap-2 mt-10">
          <IconLoader2 className="animate-spin" size={24} />
          Cargando boletas...
        </div>
      ) : boletas.length === 0 ? (
        <p className="text-texto text-center mt-6">
          No cargaste boletas aún.
        </p>
      ) : (
        <>
          {/* 🖥️ Tabla en escritorio */}
          <div className="hidden md:block">
            <Table columns={columnas} data={boletasOrdenadas} />
          </div>

          {/* 📱 Tarjetas en mobile */}
          <div className="md:hidden space-y-4 mt-6">
            {boletasOrdenadas.map((b) => (
              <div
                key={b.id}
                className="backdrop-blur-md bg-secundario border border-secundario/50 shadow-lg rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <MainH3>{b.proveedor}</MainH3>
                  <div className="flex gap-2">
                    <MainButton
                      onClick={() => setBoletaParaVer(b)}
                      variant="see"
                      title="Ver boleta"
                      iconSize={16}
                    />
                    <MainButton
                      onClick={() => setBoletaSeleccionada(b)}
                      variant="edit"
                      title="Editar boleta"
                      iconSize={16}
                    />
                    <MainButton
                      onClick={() => setBoletaAEliminar(b)}
                      variant="delete"
                      title="Eliminar boleta"
                      iconSize={16}
                    />
                  </div>
                </div>
                <p className="text-texto mb-1">
                  <strong>Mes:</strong> {b.mes}
                </p>
                <p className="text-texto mb-1">
                  <strong>Monto:</strong> ${parseFloat(b.monto).toFixed(2)}
                </p>
                <p className="mb-1 flex items-center gap-2 text-texto">
                  <strong className="text-texto">Carga:</strong>
                  <span className="text-green-400">
                    {formatearFechaConTooltip(b.fecha_carga)}
                  </span>
                </p>
                <p className="mb-1 flex items-center gap-2 text-texto">
                  <strong className="text-texto">Vencimiento:</strong>
                  <span className="text-red-400">
                    {formatearFechaConTooltip(b.vencimiento + "T12:00:00")}
                  </span>
                </p>
                <p className="mb-1 flex items-center gap-2 text-texto">
                  <strong className="text-texto">Promo hasta:</strong>
                  <span className="text-yellow-400">
                    {formatearFechaConTooltip(b.promo_hasta + "T12:00:00")}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODALES */}
      {boletaParaVer &&
        (() => {
          const indexActual = boletasOrdenadas.findIndex(
            (b) => b.id === boletaParaVer.id
          );
          const boletaAnterior = boletasOrdenadas[indexActual + 1] || null;
          return (
            <ModalVerBoleta
              boleta={boletaParaVer}
              boletaAnterior={boletaAnterior}
              onClose={() => setBoletaParaVer(null)}
            />
          );
        })()}

      {boletaSeleccionada && (
        <ModalEditarBoleta
          boleta={boletaSeleccionada}
          onClose={() => setBoletaSeleccionada(null)}
          onActualizar={recargarBoletas}
        />
      )}

      {boletaAEliminar && (
        <ModalEliminar
          titulo="Eliminar boleta"
          descripcion="¿Estás seguro que querés eliminar esta boleta? Esta acción no se puede deshacer."
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setBoletaAEliminar(null)}
          loading={eliminando}
        />
      )}
    </div>
  );
};

export default BoletaHistorial;
