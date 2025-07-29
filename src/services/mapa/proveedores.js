import { obtenerProveedores } from "../proveedores/obtenerProveedor";
import { getVisible, getVisiblePorZona } from "./mapaBase";
import maplibregl from "maplibre-gl";
import { generarIconoMultiProveedor } from "./iconoTablerToImage";

// Utilidad para calcular centroide de una zona
const calcularCentroide = (geom) => {
  const coords = geom.coordinates?.[0];
  if (!coords) return null;
  let x = 0,
    y = 0;
  coords.forEach(([lng, lat]) => {
    x += lng;
    y += lat;
  });
  return [x / coords.length, y / coords.length];
};

export const cargarProveedoresEnMapa = async (
  map,
  filtros,
  setProveedorActivo
) => {
  const proveedores = await obtenerProveedores();
  const proveedoresConEstado = proveedores.map((p) => ({
    ...p,
    visible: getVisible(p, filtros),
  }));

  const zonasConProveedores = new Map();

  for (const prov of proveedoresConEstado) {
    if (!prov.ZonaProveedor || prov.ZonaProveedor.length === 0) continue;

    for (const relacionZona of prov.ZonaProveedor) {
      const zona = relacionZona.zonas;
      if (!zona || !zona.geom) continue;

      // Agrupar por zona
      if (!zonasConProveedores.has(zona.id)) {
        zonasConProveedores.set(zona.id, {
          zona,
          proveedores: [],
        });
      }
      zonasConProveedores.get(zona.id).proveedores.push(prov);

      const sourceId = `zona-${prov.id}-${zona.id}`;
      const fillLayerId = `fill-${prov.id}-${zona.id}`;
      const lineLayerId = `line-${prov.id}-${zona.id}`;

      if (map.getSource(sourceId)) {
        map.removeLayer(fillLayerId);
        map.removeLayer(lineLayerId);
        map.removeSource(sourceId);
      }

      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "Feature", geometry: zona.geom, properties: {} },
      });

      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": prov.color || "#888888",
          "fill-opacity": 0.4,
        },
        layout: {
          visibility: prov.visible ? "visible" : "none",
        },
      });

      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": prov.color || "#000000",
          "line-width": 2,
          "line-opacity": 1,
        },
        layout: {
          visibility: prov.visible ? "visible" : "none",
        },
      });

      // Popup hover
      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
      });
      let popupTimeout = null;
      let lastMouseMove = null;

      map.on("mouseenter", fillLayerId, () => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        map.getCanvas().style.cursor = "pointer";
        map.setPaintProperty(fillLayerId, "fill-opacity", 0.6);
      });

      map.on("mousemove", fillLayerId, (e) => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        lastMouseMove = Date.now();
        clearTimeout(popupTimeout);

        const zonaInfo = zonasConProveedores.get(zona.id);

        popupTimeout = setTimeout(() => {
          const quiet = Date.now() - lastMouseMove >= 350;
          if (quiet && !window.modoSeleccionActivo) {
            if (zonaInfo?.proveedores?.length > 1) {
              const contenido = zonaInfo.proveedores
                .map(
                  (p) =>
                    `<div><span style="color:${p.color}">⬤</span> ${p.nombre}</div>`
                )
                .join("");
              popup
                .setLngLat(e.lngLat)
                .setHTML(`<strong>Proveedores:</strong><br>${contenido}`)
                .addTo(map);
            } else {
              popup
                .setLngLat(e.lngLat)
                .setHTML(
                  `<div class="text-sm font-semibold">${prov.nombre}</div>`
                )
                .addTo(map);
            }
          }
        }, 350);

        // Si ya está visible, seguirlo con el mouse
        if (popup.isOpen()) {
          popup.setLngLat(e.lngLat);
        }
      });

      map.on("mouseleave", fillLayerId, () => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        map.getCanvas().style.cursor = "";
        map.setPaintProperty(fillLayerId, "fill-opacity", 0.4);
        clearTimeout(popupTimeout);
        popup.remove();
      });
    }
  }

  // Renderizar íconos para zonas con múltiples proveedores
  const iconoBitmap = await generarIconoMultiProveedor();

  zonasConProveedores.forEach(({ zona, proveedores }) => {
    if (proveedores.length <= 1) return;

    const iconId = `multi-icon-${zona.id}`;
    const sourceId = `multi-source-${zona.id}`;
    const coordinates =
      zona?.centro || zona?.centroid || calcularCentroide(zona.geom);
    if (!coordinates) return;

    if (map.getSource(sourceId)) {
      map.removeLayer(iconId);
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates,
        },
        properties: {
          proveedores: JSON.stringify(
            proveedores.map((p) => ({
              nombre: p.nombre,
              color: p.color,
            }))
          ),
        },
      },
    });

    if (!map.hasImage("multi-icon")) {
      map.addImage("multi-icon", iconoBitmap);
    }

    map.addLayer({
      id: iconId,
      type: "symbol",
      source: sourceId,
      layout: {
        "icon-image": "multi-icon",
        "icon-size": 0.6,
        "icon-allow-overlap": true,
      },
    });

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", iconId, (e) => {
      map.getCanvas().style.cursor = "pointer";
      const data = JSON.parse(e.features[0].properties.proveedores);
      const content = data
        .map(
          (p) =>
            `<div><span style="color:${p.color}">⬤</span> ${p.nombre}</div>`
        )
        .join("");
      popup
        .setLngLat(e.lngLat)
        .setHTML(`<strong>Proveedores:</strong><br>${content}`)
        .addTo(map);
    });

    map.on("mouseleave", iconId, () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  });

  return proveedoresConEstado;
};

export const actualizarVisibilidadEnMapa = (map, proveedoresRef, filtros) => {
  proveedoresRef.current.forEach((prov) => {
    if (!prov.ZonaProveedor || prov.ZonaProveedor.length === 0) return;

    prov.ZonaProveedor.forEach((relacionZona) => {
      const zona = relacionZona.zonas;
      if (!zona) return;

      const fillLayerId = `fill-${prov.id}-${zona.id}`;
      const lineLayerId = `line-${prov.id}-${zona.id}`;

      const visible = getVisiblePorZona(prov, zona.id, filtros);

      if (map.getLayer(fillLayerId)) {
        map.setLayoutProperty(
          fillLayerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
      if (map.getLayer(lineLayerId)) {
        map.setLayoutProperty(
          lineLayerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    });
  });
};

