import { useRef, useState ,useEffect } from "react";
import SettingsBar from "../components/SettingsBar";

function ChangePassword() {
  const canvasRef = useRef(null);
  const [email, setEmail] = useState("");
  const [changedPassword, setChangedPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = 80;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        radius: Math.random() * 3 + 1,
        color: "rgba(255, 255, 255, 0.8)"
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

  const handleUpdatePassword = async () => {
    if(!email || !changedPassword ){
      setMessage("You need to enter email and your new password");
      return;
    } 
    try {
      const response = await fetch("/api/agents/password", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, newPassword :changedPassword})
      });

      const data = await response.json();
      setMessage(data.message);
    } catch(error){
      setMessage("Fail")}
  };

  return (
    <>
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <SettingsBar/>

      <main>
        <div className="passwordArea">
          <div className="loginlogoPlacement">
            <img
              className="loginLogo"
              src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg"
              alt="Login Logo"
            />
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="New Password" value={changedPassword} onChange={(e) => setChangedPassword(e.target.value)}/>
          <button className="sendBtn" onClick={handleUpdatePassword}>Change Password</button>
          <p>{message}</p>
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
          background: -webkit-linear-gradient(to bottom,rgb(255, 198, 28),rgb(185, 29, 29)); 
          background: linear-gradient(to bottom, rgb(178, 14, 14), rgb(254, 101, 101)); 
        }
      `}</style>
    </>
  );
}

export default ChangePassword;
