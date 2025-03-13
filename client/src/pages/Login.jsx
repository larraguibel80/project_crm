import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBar from "../components/LoginBar";

function Login() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = 80;

    // Crear partículas
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        radius: Math.random() * 3 + 1,
        color: "rgba(255, 255, 255, 0.8)",
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }

    drawParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async () => {
    setError("");
    const loginData = { email, password, role };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }
      console.log("Login successful", result);

      if (role === "Admin") {
        navigate("/adminPage"); 
      } else {
        navigate("/dashboard"); 
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="canvas-bg"></canvas>
      <LoginBar/>

      <main>
        <div className="loginArea">
          <div className="loginlogoPlacement">
            <img
              className="loginLogo"
              src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg"
              alt="Login Logo"
            />
          </div>

          {/* Email and Password Inputs */}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Selection (Dropdown) */}
          <div className="postholderSelection" onClick={() => setShowDropdown(!showDropdown)}>
            <input type="text" placeholder="Role" value={role} readOnly />
            {showDropdown && (
              <div className="dropdown">
                <div onClick={() => setRole("Admin")}>Admin</div>
                <div onClick={() => setRole("Agent")}>Agent</div>
              </div>
            )}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="sendBtn" onClick={handleLogin}>
            Log in
          </button>
        </div>
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
          background: #00c3ff; 
          background: -webkit-linear-gradient(to bottom, #ffff1c, #00c3ff); 
          background: linear-gradient(to bottom, #ffff1c, #00c3ff); 
        }
        .postholderSelection {
          position: relative;
        }
        .postholderSelection input {
          margin-top: 0px;
          padding: 0.8rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          width: 100%;
          font-size: 1rem;
        }

        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          border: 1px solid #ccc;
          z-index: 1;
        }
        .dropdown div {
          padding: 10px;
          cursor: pointer;
        }
        .dropdown div:hover {
          background-color: lightgray;
        }
      `}</style>
    </>
  );
}

export default Login;