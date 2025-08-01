import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import MainH1 from "../../components/ui/MainH1";
import MainH2 from "../../components/ui/MainH2";
import MainLinkButton from "../../components/ui/MainLinkButton";
import { IconArrowLeft } from "@tabler/icons-react";

const Curso2 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const preguntas = [
    {
      id: "p1",
      texto: "¿Qué parámetro afecta más a los juegos en línea?",
      correcta: "c",
      opciones: {
        a: "Mbps de descarga",
        b: "Velocidad de subida",
        c: "Latencia (ping)",
      },
    },
    {
      id: "p2",
      texto: "¿Qué valor indica una conexión rápida en navegación?",
      correcta: "a",
      opciones: {
        a: "Alta velocidad de bajada",
        b: "Ping alto",
        c: "Pérdida de paquetes",
      },
    },
    {
      id: "p3",
      texto: "¿Qué causa jitter?",
      correcta: "b",
      opciones: {
        a: "Conexiones estables",
        b: "Variaciones en el retardo de red",
        c: "Velocidad de carga muy alta",
      },
    },
    {
      id: "p4",
      texto: "¿Qué es una buena latencia para juegos online?",
      correcta: "a",
      opciones: {
        a: "Menor a 50 ms",
        b: "Mayor a 200 ms",
        c: "No importa en juegos",
      },
    },
    {
      id: "p5",
      texto: "¿Qué herramienta se usa para medir velocidad y latencia?",
      correcta: "b",
      opciones: {
        a: "YouTube",
        b: "SpeedTest",
        c: "Router",
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
      <MainH1>Velocidad y Latencia</MainH1>

      {/* 🎥 VIDEO */}
      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/HpyGbofovUk"
          title="Video Latencia"
          allowFullScreen
        ></iframe>
      </div>

      {/* 📄 TEXTO EXPLICATIVO */}
      <div className={`space-y-4 ${estiloTexto}`}>
        <p>
          La velocidad de internet se mide en megabits por segundo (Mbps) e
          indica cuántos datos pueden transferirse en un tiempo determinado.
        </p>
        <p>
          La latencia, por otro lado, mide el tiempo que tarda un paquete de
          datos en ir desde tu dispositivo hasta el servidor y volver.
        </p>
        <p>
          En juegos en línea o videollamadas, la latencia baja es más
          importante que la velocidad de descarga.
        </p>
        <p>
          El jitter representa la variación de la latencia. Si el tiempo entre
          paquetes no es constante, las transmisiones pueden verse afectadas.
        </p>
        <p>
          SpeedTest, Fast.com o pruebas de tu proveedor son herramientas útiles
          para conocer tu rendimiento real.
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
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
              Enviar respuestas
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
            >
              Reiniciar
            </button>
          </div>

          {mostrarResultados && (
            <p className="mt-4 font-bold text-lg text-center">
              ✅ Acertaste {resultado} de {preguntas.length} preguntas.
            </p>
          )}
        </form>
      </div>

      {/* 🔙 Volver a Academy */}
      <div className="text-center">
          <MainLinkButton to="/academy" variant="secondary">
            <IconArrowLeft />
            Volver al perfil
          </MainLinkButton>
      </div>
    </section>
  );
};

export default Curso2;
