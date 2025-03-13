import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import AdminBar from "../components/AdminBar";

function AdminPage() {
  const nav = useNavigate();
  const canvasRef = useRef(null); // Referencia al canvas

  // 🎨 Efecto de fondo con círculos flotantes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const circles = [];
    const numCircles = 50;

    // Floating circles
    for (let i = 0; i < numCircles; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 20,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`, // Colores aleatorios
      });
    }

    function drawCircles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach((circle) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();

        // Moving circles
        circle.x += circle.speedX;
        circle.y += circle.speedY;

        if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0) {
          circle.speedX *= -1;
        }
        if (circle.y + circle.radius > canvas.height || circle.y - circle.radius < 0) {
          circle.speedY *= -1;
        }
      });

      requestAnimationFrame(drawCircles);
    }

    drawCircles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <AdminBar/>

      <main>
        <h1 className="dashboard_text">Welcome to our CRM-System  <img className="logoPictureDash" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740" /></h1>
        <h2>We are here to support your operations.</h2>
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
          background: #1F1C2C;
          background: -webkit-linear-gradient(to bottom, #928DAB, #1F1C2C);
          background: linear-gradient(to bottom,rgb(188, 226, 253),rgb(52, 179, 248));
        }
      `}</style>
    </>
  );
}

export default AdminPage;

