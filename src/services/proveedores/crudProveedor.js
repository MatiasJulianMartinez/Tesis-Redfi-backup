import { supabase } from "../../supabase/client";

// Crear proveedor
/* export const crearProveedor = async (
  datos, // { nombre, descripcion, sitio_web, color, logotipo, tecnologias: [], zonas: [] }
  mostrarAlerta = () => {}
) => {
  const { tecnologias, zonas, logotipo, ...resto } = datos;
  const proveedorBase = { ...resto, logotipo };

  const { data: proveedor, error: errorInsert } = await supabase
    .from("proveedores")
    .insert([proveedorBase])
    .select()
    .single();

  if (errorInsert) {
    mostrarAlerta("Error al agregar el proveedor.");
    throw errorInsert;
  }

  try {
    if (Array.isArray(tecnologias) && tecnologias.length > 0) {
      const relacionesTecnologias = tecnologias.map((tecnologia_id) => ({
        proveedor_id: proveedor.id,
        tecnologia_id,
      }));

      const { error: errorTecnologias } = await supabase
        .from("ProveedorTecnologia")
        .insert(relacionesTecnologias);

      if (errorTecnologias) throw errorTecnologias;
    }

    if (Array.isArray(zonas) && zonas.length > 0) {
      const relacionesZonas = zonas.map((zona_id) => ({
        proveedor_id: proveedor.id,
        zona_id,
      }));

      const { error: errorZonas } = await supabase
        .from("ZonaProveedor")
        .insert(relacionesZonas);

      if (errorZonas) throw errorZonas;
    }

    return proveedor;
  } catch (error) {
    mostrarAlerta("El proveedor fue creado, pero fallaron las relaciones.");
    throw error;
  }
}; */

export const crearProveedor = async (
  datos, // { nombre, descripcion, sitio_web, color, logotipo }
  mostrarAlerta = () => {}
) => {
  const { tecnologias, zonas, ...proveedorBase } = datos;

  const { data: proveedor, error } = await supabase
    .from("proveedores")
    .insert([proveedorBase])
    .select()
    .single();

  if (error) {
    mostrarAlerta("Error al agregar el proveedor.");
    throw error;
  }

  return proveedor;
};


// Editar proveedor
/* export const actualizarProveedor = async (
  proveedorId,
  datos, // { nombre, descripcion, sitio_web, color, logotipo }
  mostrarAlerta = () => {}
) => {
  const {
    tecnologias,
    zonas,
    ProveedorTecnologia,
    ZonaProveedor,
    tecnologia,
    ...proveedorBase
  } = datos;

  // 1. Actualizar datos del proveedor
  const { error: errorUpdate } = await supabase
    .from("proveedores")
    .update(proveedorBase)
    .eq("id", proveedorId);

  if (errorUpdate) {
    console.error(errorUpdate);
    mostrarAlerta("Error al actualizar el proveedor.");
    throw errorUpdate;
  }

  try {
    // 2. Eliminar relaciones anteriores
    await Promise.all([
      supabase
        .from("ProveedorTecnologia")
        .delete()
        .eq("proveedor_id", proveedorId),
      supabase.from("ZonaProveedor").delete().eq("proveedor_id", proveedorId),
    ]);

    // 3. Insertar nuevas relaciones
    if (Array.isArray(tecnologias) && tecnologias.length > 0) {
      const nuevasRelacionesTecnologia = (tecnologias || [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
        .map((tecnologia_id) => ({
          proveedor_id: proveedorId,
          tecnologia_id,
        }));

      const { error: errorTecnologia } = await supabase
        .from("ProveedorTecnologia")
        .insert(nuevasRelacionesTecnologia);

      if (errorTecnologia) throw errorTecnologia;
    }

    if (Array.isArray(zonas) && zonas.length > 0) {
      const nuevasRelacionesZonas = (zonas || [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
        .map((zona_id) => ({
          proveedor_id: proveedorId,
          zona_id,
        }));

      const { error: errorZona } = await supabase
        .from("ZonaProveedor")
        .insert(nuevasRelacionesZonas);

      if (errorZona) throw errorZona;
    }

    return true;
  } catch (error) {
    mostrarAlerta(
      "El proveedor fue actualizado, pero fallaron las relaciones."
    );
    throw error;
  }
}; */

// Editar proveedor sin modificar relaciones
export const actualizarProveedor = async (
  proveedorId,
  datos, // { nombre, descripcion, sitio_web, color, logotipo }
  mostrarAlerta = () => {}
) => {
  const { tecnologias, zonas, eliminarLogo, ...proveedorBase } = datos;

  const { error: errorUpdate } = await supabase
    .from("proveedores")
    .update(proveedorBase)
    .eq("id", proveedorId);

  if (errorUpdate) {
    console.error(errorUpdate);
    mostrarAlerta("Error al actualizar el proveedor.");
    throw errorUpdate;
  }

  return true;
};

// Eliminar proveedor
export const eliminarProveedor = async (id, mostrarAlerta = () => {}) => {
  const { error } = await supabase.from("proveedores").delete().eq("id", id);

  if (error) {
    console.error("❌ Error en eliminar Proveedor:", error);
    mostrarAlerta("Error al eliminar el proveedor.");
    throw error;
  }
};