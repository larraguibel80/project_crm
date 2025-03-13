import { useNavigate } from "react-router-dom";
import { useRef, useState ,useEffect } from "react";
import AdminBar from "../components/AdminBar";

function RequestsAdmin() {
  const nav = useNavigate();
  const canvasRef = useRef(null); 
  const [forms, setForms] = useState([]);
  const [filters, setFilters] = useState("");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("/api/formlist");
        if (response.ok) {
          const data = await response.json();
          setForms(data);
        } else {
          console.error("Failed to fetch forms");
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []);

  const handleJoinChat = (form) => {
    console.log(`Joining chat with ${form.email}`);
    if (!form.token){
      console.error("Token do not exist")
      return;
    }

    console.log(`Joining specfik chatt: ${form.token}`);
    nav(`/chat/${form.token}`)
  
  };

  const formFilter = forms.filter((form) => 
    form.email.toLowerCase().includes(filters.toLowerCase()) ||
    form.service_product.toLowerCase().includes(filters.toLowerCase())
  );

  //  Table Styling
  const tableHeaderStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
    background: "#33333380",
    color: "white",
  };

  const tableCellStyle = {
    padding: "10px",
    border: "1px solid #ddd",
  };

  const tableRowEven = {
    background: "#F2F2F280",
  };

  const tableRowOdd = {
    background: "#FFFFFF90",
  };

  const buttonStyle = {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  };

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
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <AdminBar/>
      
      <h2>Submitted Forms</h2>
      <input className="filter" type="text" placeholder="Search for specific email or product/service" value={filters} onChange={(e) => setFilters(e.target.value)}/>

      <main>
      {formFilter.length === 0 ? (
          <p>No forms submitted yet.</p>
        ) : (
          <div>
            
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Product</th>
                  <th style={tableHeaderStyle}>Message</th>
                  <th style={tableHeaderStyle}>Created</th>
                  <th style={tableHeaderStyle}>Join Chat</th>
                </tr>
              </thead>
              <tbody>
                {formFilter.map((form, index) => (
                  <tr key={index} style={index % 2 === 0 ? tableRowEven : tableRowOdd}>
                    <td style={tableCellStyle}>{form.email}</td>
                    <td style={tableCellStyle}>{form.service_product}</td>
                    <td style={tableCellStyle}>{form.message}</td>
                    <td style={tableCellStyle}>{new Date(form.created).toLocaleString()}</td>
                    <td style={tableCellStyle}>
                      <button style={buttonStyle} onClick={() => handleJoinChat(form)}>
                        Join
                      </button>
                    </td> 
                  </tr>
                ))}
              </tbody>
            </table>
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
          background: #03001e; 
          background: -webkit-linear-gradient(to bottom, #fdeff9, #ec38bc, #7303c0, #03001e);
          background: linear-gradient(to bottom,rgb(252, 253, 239),rgb(236, 250, 107),rgb(235, 214, 76),rgb(222, 135, 13)); 
        }
          
        table{
          margin-bottom: 2.5%
        }
      `}</style>
    </>
  );
}

export default RequestsAdmin;
