import { useNavigate } from "react-router-dom";  
import { useRef, useState, useEffect } from "react";

function Requests() {
  const nav = useNavigate();
  const canvasRef = useRef(null);
  const [forms, setForms] = useState([]);

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

  //  Function to handle "Join" button click
  const handleJoinChat = (form) => {
    console.log(`Joining chat with ${form.email}`);
    // Navigate to chat page 
    nav(`/chat?email=${encodeURIComponent(form.email)}`);
  };

  //  Table Styling
  const tableHeaderStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
    background: "#333",
    color: "white",
  };

  const tableCellStyle = {
    padding: "10px",
    border: "1px solid #ddd",
  };

  const tableRowEven = {
    background: "#f2f2f2",
  };

  const tableRowOdd = {
    background: "white",
  };

  const buttonStyle = {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  };

  return (
    <>
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
        {forms.length === 0 ? (
          <p>No forms submitted yet.</p>
        ) : (
          <div>
            <h2>Submitted Forms</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Product</th>
                  <th style={tableHeaderStyle}>Message</th>
                  <th style={tableHeaderStyle}>Join Chat</th>  {/*join chat col */}
                </tr>
              </thead>
              <tbody>
                {forms.map((form, index) => (
                  <tr key={index} style={index % 2 === 0 ? tableRowEven : tableRowOdd}>
                    <td style={tableCellStyle}>{form.email}</td>
                    <td style={tableCellStyle}>{form.service_product}</td>
                    <td style={tableCellStyle}>{form.message}</td>
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
          background: #1c1c1c;
        }
      `}</style>
    </>
  );
}

export default Requests;
