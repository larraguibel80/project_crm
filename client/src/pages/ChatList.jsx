import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

function ChatList() {
  const nav = useNavigate();
  const canvasRef = useRef(null); // Referencia al canvas

  // 🎨 Efecto de fondo con cuadrados flotantes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const squares = [];
    const numSquares = 50;

    // Crear cuadrados
    for (let i = 0; i < numSquares; i++) {
      squares.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        maxSize: Math.random() * 40 + 20,
        growSpeed: Math.random() * 0.1 + 0.05,
        alpha: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360, // Rotación inicial
        rotationSpeed: Math.random() * 2 - 1, // Velocidad de rotación
      });
    }

    function drawSquares() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      squares.forEach((sq) => {
        ctx.save(); // Guardar el contexto

        // Mover el centro de rotación al cuadrado
        ctx.translate(sq.x + sq.size / 2, sq.y + sq.size / 2);
        ctx.rotate((sq.rotation * Math.PI) / 180);
        ctx.translate(-sq.x - sq.size / 2, -sq.y - sq.size / 2);

        // Dibujar cuadrado
        ctx.beginPath();
        ctx.rect(sq.x, sq.y, sq.size, sq.size);
        ctx.fillStyle = `rgba(255, 255, 255, ${sq.alpha})`;
        ctx.fill();

        ctx.restore(); // Restaurar el contexto

        // Animaciones
        sq.size += sq.growSpeed;
        sq.rotation += sq.rotationSpeed;

        if (sq.size > sq.maxSize || sq.size < 10) {
          sq.growSpeed *= -1; // Invertir la dirección de crecimiento
        }
      });

      requestAnimationFrame(drawSquares);
    }

    drawSquares();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* 🎨 Canvas de fondo con cuadrados flotantes */}
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <header>
        <div className="Logo">
          <img
            className="logoPicture"
            src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"
            alt="Logo"
          />
        </div>
        <h1>CRM Chatlist</h1>
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

export default ChatList;
