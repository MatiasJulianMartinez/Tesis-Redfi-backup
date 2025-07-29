import { IconX } from "@tabler/icons-react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import ModalContenedor from "../../ui/ModalContenedor";

const ModalVerBoleta = ({ boleta, onClose, boletaAnterior }) => {
  if (!boleta) return null;

  const montoActual = parseFloat(boleta.monto);
  const montoAnterior = boletaAnterior ? parseFloat(boletaAnterior.monto) : null;

  let diferenciaTexto = "—";
  let diferenciaColor = "text-texto";

  if (montoAnterior !== null) {
    const diferencia = montoActual - montoAnterior;
    if (diferencia > 0) {
      diferenciaTexto = `📈 Subió $${diferencia.toFixed(2)}`;
      diferenciaColor = "text-green-400";
    } else if (diferencia < 0) {
      diferenciaTexto = `📉 Bajó $${Math.abs(diferencia).toFixed(2)}`;
      diferenciaColor = "text-red-400";
    } else {
      diferenciaTexto = `🟰 Sin cambios`;
      diferenciaColor = "text-yellow-300";
    }
  }

  const esPdf = boleta.url_imagen?.toLowerCase().endsWith(".pdf");

  const manejarDescarga = async () => {
    try {
      const respuesta = await fetch(boleta.url_imagen);
      const blob = await respuesta.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = esPdf ? "pdf" : boleta.url_imagen.split(".").pop().split("?")[0];
      link.download = `boleta-${boleta.mes}-${boleta.anio}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Detalle de boleta</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3 ml-0 sm:ml-5 text-xl">
          <p><strong>Mes:</strong> {boleta.mes}</p>
          <p><strong>Año:</strong> {boleta.anio}</p>
          <p><strong>Monto:</strong> ${montoActual.toFixed(2)}</p>
          <p className={diferenciaColor}><strong>Diferencia:</strong> {diferenciaTexto}</p>
          <p><strong>Proveedor:</strong> {boleta.proveedor}</p>
          <p>
            <strong>Vencimiento:</strong>{" "}
            {new Date(boleta.vencimiento).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          {boleta.promo_hasta && (
            <p className="text-yellow-400">
              <strong>Promoción hasta:</strong>{" "}
              {new Date(boleta.promo_hasta).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          {boleta.url_imagen ? (
            <>
              {esPdf ? (
                <a
                  href={boleta.url_imagen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 p-4 border border-blue-500 rounded-lg bg-blue-950/50 hover:bg-blue-800 transition-colors text-blue-300 hover:text-white shadow-md max-w-xs text-sm"
                >
                  <span className="text-4xl">📄</span>
                  <span className="font-semibold underline">Ver archivo PDF cargado</span>
                </a>
              ) : (
                <img
                  src={boleta.url_imagen}
                  alt="Boleta"
                  className="max-h-[300px] object-contain rounded border"
                />
              )}
              <button
                onClick={manejarDescarga}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm shadow"
              >
                 Descargar archivo
              </button>
            </>
          ) : (
            <div className="text-center text-gray-400 italic border border-dashed p-6 rounded max-w-xs">
              ❌ El usuario no cargó una imagen de la boleta.
            </div>
          )}
        </div>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerBoleta;
