import { useRef, useState, useEffect } from "react";
import MainButton from "./MainButton";
import { IconX } from "@tabler/icons-react";

const FileInput = ({
  id = "archivo",
  label = "Seleccionar archivo",
  accept = "image/*, application/pdf",
  onChange,
  value = null,
  previewUrl = null,
  setPreviewUrl = null,
  onClear,
  disabled = false,
  loading = false,
  existingImage = null,
  sinPreview = false,
}) => {
  const inputRef = useRef(null);
  const [internalPreview, setInternalPreview] = useState(null);
  const [esPdf, setEsPdf] = useState(false);

  // Detectar si el archivo es PDF desde múltiples fuentes
  useEffect(() => {
    const detectarPdf = () => {
      if (value && typeof value === "object" && value.name) {
        const ext = value.name.split(".").pop().toLowerCase();
        return ext === "pdf";
      }
      if (previewUrl && typeof previewUrl === "string") {
        return previewUrl.toLowerCase().endsWith(".pdf");
      }
      if (existingImage && typeof existingImage === "string") {
        return existingImage.toLowerCase().endsWith(".pdf");
      }
      return false;
    };

    setEsPdf(detectarPdf());
  }, [value, previewUrl, existingImage]);

  // Mostrar preview inicial
  useEffect(() => {
    if (previewUrl) {
      setInternalPreview(previewUrl);
    } else if (existingImage) {
      setInternalPreview(existingImage);
    }
  }, [previewUrl, existingImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resetear para permitir mismo archivo
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(file);

    if (!sinPreview && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInternalPreview(reader.result);
        setPreviewUrl?.(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setInternalPreview(null);
      setPreviewUrl?.(null);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null);
    setInternalPreview(null);
    setPreviewUrl?.(null);
    onClear?.();
  };

  const mostrarPreview = !sinPreview && internalPreview && !esPdf;
  const mostrarBotonQuitar = value || internalPreview;

  return (
    <div className="space-y-2 text-center text-texto">
      {label && (
        <label htmlFor={id} className="block font-medium">
          {label}
        </label>
      )}

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || loading}
      />

      {/* Imagen */}
      {mostrarPreview && (
        <div className="mt-2 flex flex-col items-center gap-2">
          <img
            src={internalPreview}
            alt="Vista previa"
            className="max-h-25 border border-white/10 rounded-lg object-contain"
          />
        </div>
      )}

      {/* PDF */}
      {esPdf && (value?.name || internalPreview) && (
        <p className="text-sm text-gray-300">
          Archivo PDF seleccionado:{" "}
          <strong>{value?.name || internalPreview?.split("/").pop()}</strong>
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        {mostrarBotonQuitar && (
          <MainButton
            type="button"
            variant="danger"
            onClick={handleClear}
            className="flex-1"
            disabled={disabled || loading}
          >
            <IconX size={18} /> Quitar archivo
          </MainButton>
        )}
        <label htmlFor={id}>
          <MainButton
            as="span"
            variant="accent"
            loading={loading}
            disabled={disabled}
            className="cursor-pointer flex-1"
          >
            {value || internalPreview ? "Cambiar archivo" : "Seleccionar archivo"}
          </MainButton>
        </label>
      </div>
    </div>
  );
};

export default FileInput;
