import { useNavigate } from "react-router-dom";  // Make sure this import is included
import { useRef, useState, useEffect } from "react";

function Requests() {
  const nav = useNavigate();
  const canvasRef = useRef(null); // Reference to the canvas
  const [forms, setForms] = useState([]); // State to store fetched forms

  // 🎨 Background effect with dynamic waves
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let waves = [];
    const numWaves = 5;
    const colors = ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.15)"];

    // Create initial waves
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

        // Animate waves
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

  // Fetch the forms from the backend
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("/api/formlist");  // Make sure your backend is serving this endpoint
        if (response.ok) {
          const data = await response.json();
          setForms(data); // Store the fetched forms in the state
        } else {
          console.error("Failed to fetch forms");
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms(); // Call the function on component mount
  }, []); // Empty dependency array to run only once when the component is mounted

  return (
    <>
      {/* 🎨 Canvas background with dynamic waves */}
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <header>
        <div className="Logo">
          <img
            className="logoPicture"
            src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"
            alt="Logo"
          />
        </div>
        <h1>CRM System - Form Requests</h1>
      </header>

      <main>
        {/* Display the fetched forms */}
        {forms.length === 0 ? (
          <p>No forms submitted yet.</p>
        ) : (
          <div>
            <h2>Submitted Forms</h2>
            <ul>
              {forms.map((form, index) => (
                <li key={index}>
                  <p>Email: {form.email}</p>
                  <p>Product: {form.service_product}</p>
                  <p>Message: {form.message}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
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
