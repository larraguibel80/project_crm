import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import LoginBar from "../components/LoginBar";

function Confirmation() {
  const nav = useNavigate();
  const canvasRef = useRef(null); 
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lights = [];
    const numLights = 50;

    for (let i = 0; i < numLights; i++) {
      lights.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 15 + 5,
        maxRadius: Math.random() * 30 + 20,
        pulseSpeed: Math.random() * 0.1 + 0.05,
        alpha: Math.random() * 0.5 + 0.5,
        color: `rgba(255, 255, 255, 0.8)`
      });
    }

    function drawLights() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lights.forEach((light) => {
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fillStyle = light.color;
        ctx.fill();

        // Pulsar el radio de la luz
        light.radius += light.pulseSpeed;
        if (light.radius > light.maxRadius || light.radius < 5) {
          light.pulseSpeed *= -1;
        }
      });

      requestAnimationFrame(drawLights);
    }

    drawLights();

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
      <LoginBar/>

      <main>
        <div className="loginArea">
          <div className="loginlogoPlacement">
            <img
              className="loginLogo"
              src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"
              alt="Login Logo"
            />
          </div>
          <h2>Thank you for reaching out!</h2>
          <h4>
            We have received your message and will get back to you as soon as possible. Best regards,
          </h4>
          <button className="sendBtn" onClick={() => nav("/")}>
            Go Back
          </button>
        </div>
      </main>
<br/><br /><br />
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
          background: #6A9113; 
          background: -webkit-linear-gradient(to top, #141517, #6A9113);
          background: linear-gradient(to top, #141517, #6A9113); 
        }
      `}</style>
    </>
  );
}

export default Confirmation;
