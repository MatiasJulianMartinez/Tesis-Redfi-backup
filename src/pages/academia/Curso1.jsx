import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import MainH1 from "../../components/ui/MainH1";
import MainH2 from "../../components/ui/MainH2";
import MainLinkButton from "../../components/ui/MainLinkButton";
import { IconArrowLeft } from "@tabler/icons-react";


const Curso1 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const preguntas = [
    {
      id: "p1",
      texto: "¿Dónde es mejor ubicar tu router para mejor señal?",
      correcta: "b",
      opciones: {
        a: "En una esquina del piso",
        b: "En el centro de la casa y en alto",
        c: "Debajo de una mesa",
      },
    },
    {
      id: "p2",
      texto: "¿Qué frecuencia tiene mayor alcance?",
      correcta: "a",
      opciones: {
        a: "2.4 GHz",
        b: "5 GHz",
        c: "6 GHz",
      },
    },
    {
      id: "p3",
      texto: "¿Cuál es un motivo común de interferencia Wi-Fi?",
      correcta: "c",
      opciones: {
        a: "Demasiada velocidad",
        b: "Luz solar directa",
        c: "Electrodomésticos como microondas",
      },
    },
    {
      id: "p4",
      texto: "¿Qué canal usar en 2.4 GHz para evitar saturación?",
      correcta: "a",
      opciones: {
        a: "1, 6 u 11",
        b: "Todos a la vez",
        c: "Cualquiera, no importa",
      },
    },
    {
      id: "p5",
      texto: "¿Qué podés hacer si no llega señal a una habitación?",
      correcta: "b",
      opciones: {
        a: "Cambiar de proveedor",
        b: "Usar repetidores o una red mesh",
        c: "Apagar y prender el router",
      },
    },
  ];

  const handleChange = (id, value) => {
    setRespuestas({ ...respuestas, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctas = preguntas.reduce(
      (acc, p) => acc + (respuestas[p.id] === p.correcta ? 1 : 0),
      0
    );
    setResultado(correctas);
    setMostrarResultados(true);
  };

  const handleReset = () => {
    setRespuestas({});
    setResultado(null);
    setMostrarResultados(false);
  };

  const estiloTexto = currentTheme === "light" ? "text-texto" : "text-white";
  const fondoCard =
    currentTheme === "light"
      ? "bg-white border border-gray-300"
      : "bg-white/5 border border-white/10";

  return (
    <section className={`p-6 max-w-4xl mx-auto space-y-10 ${estiloTexto}`}>
      <MainH1>Mejora tu Wi-Fi en casa</MainH1>

      {/* 🎥 VIDEO */}
      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/Gqq71BWfDpI"
          title="Video WiFi"
          allowFullScreen
        ></iframe>
      </div>

      {/* 📄 TEXTO EXPLICATIVO */}
      <div className={`space-y-4 ${estiloTexto}`}>
        <p>
          ¿Tienes problemas de conexión en tu casa? Muchas veces, el problema no
          es el proveedor, sino cómo está distribuida la red Wi-Fi.
        </p>
        <p>
          Uno de los factores más importantes es la ubicación del router...
        </p>
        <p>
          Las señales Wi-Fi funcionan mejor cuando el router está en el centro...
        </p>
        <p>
          Las redes de 2.4 GHz tienen mayor alcance...
        </p>
        <p>
          Un canal saturado también afecta tu red...
        </p>
        <p>
          Para extender la cobertura puedes usar repetidores...
        </p>
        <p>
          Finalmente, recuerda cambiar la contraseña predeterminada...
        </p>
        <p>
          Mantener tu router actualizado y reiniciarlo...
        </p>
      </div>

      {/* ✅ QUIZ */}
      <div className={`${fondoCard} p-6 rounded-lg`}>
        <MainH2 className="text-center">🧠 Quiz final</MainH2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {preguntas.map((p) => {
            const respuestaUsuario = respuestas[p.id];
            const esCorrecta = respuestaUsuario === p.correcta;
            return (
              <div key={p.id} className="space-y-2">
                <p className="font-medium">{p.texto}</p>
                <div className="flex flex-col gap-1 text-sm">
                  {Object.entries(p.opciones).map(([key, text]) => (
                    <label key={key} className="cursor-pointer">
                      <input
                        type="radio"
                        name={p.id}
                        value={key}
                        onChange={() => handleChange(p.id, key)}
                        checked={respuestaUsuario === key}
                        className="mr-2"
                      />
                      {text}
                    </label>
                  ))}
                </div>

                {mostrarResultados && (
                  <div
                    className={`p-2 rounded font-semibold text-sm ${
                      esCorrecta
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {esCorrecta
                      ? "✅ ¡Respuesta correcta!"
                      : `❌ Incorrecto. La respuesta correcta era: "${
                          p.opciones[p.correcta]
                        }"`}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-center gap-4 flex-wrap mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
            >
              Reiniciar
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
              Enviar respuestas
            </button>
          </div>

          {mostrarResultados && (
            <p className="mt-4 font-bold text-lg text-center">
              ✅ Acertaste {resultado} de {preguntas.length} preguntas.
            </p>
          )}
        </form>
      </div>

      {/* 🔙 Botón volver atrás */}
      <div className="text-center">
          <MainLinkButton to="/academy" variant="secondary">
            <IconArrowLeft />
            Volver al perfil
          </MainLinkButton>
      </div>
    </section>
  );
};

export default Curso1;
