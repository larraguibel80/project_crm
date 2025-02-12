import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

function Requests() {
  const nav = useNavigate();
  const canvasRef = useRef(null); // Referencia al canvas

  // 🎨 Efecto de fondo con ondas dinámicas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let waves = [];
    const numWaves = 5;
    const colors = ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.15)"];

    // Crear ondas iniciales
    for (let i = 0; i < numWaves; i++) {
      waves.push({
        y: Math.random() * canvas.height,
        amplitude: Math.random() * 50 + 50,
        wavelength: Math.random() * 100 + 50,
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      });
    }

    function drawWaves() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);

        for (let x = 0; x < canvas.width; x++) {
          const y = wave.y + Math.sin(x / wave.wavelength + wave.phase) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animación de ondas
        wave.phase += wave.speed;
      });

      requestAnimationFrame(drawWaves);
    }

    drawWaves();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* 🎨 Canvas de fondo con ondas dinámicas */}
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <header>
        <div className="Logo">
          <img
            className="logoPicture"
            src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"
            alt="Logo"
          />
        </div>
        <h1>CRM System</h1>
      </header>

      <main>
        {/* Espacio para el contenido */}
      </main>

      <footer>
        <p>&copy; 2025 CRM System. All rights reserved.</p>
      </footer>

      <style>{`
        .canvas-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: #1c1c1c;
        }
      `}</style>
    </>
  );
}

export default Requests;
