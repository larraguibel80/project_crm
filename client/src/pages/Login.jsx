import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To navigate after login

function Login() {
  const [email, setEmail] = useState(""); // Store email
  const [password, setPassword] = useState(""); // Store password
  const [error, setError] = useState(""); // Store any error messages
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // Hook to navigate to the requests page

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send as JSON
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if the response is OK (status code 2xx)
      if (!response.ok) {
        const errorData = await response.json().catch(() => {
          // If the response is not valid JSON, handle the error gracefully
          return { message: "Unknown error occurred, please try again." };
        });
        setError(errorData.message); // Show the error message from the backend
        return;
      }
  
      // If the response is valid and login is successful
      const data = await response.json();
      localStorage.setItem("userRole", data.role); // Save role to localStorage
      navigate("/requests"); // Redirect to the /requests page after successful login
    } catch (error) {
      console.error("Login error", error);
      setError("Something went wrong. Please try again."); // Handle unexpected errors
    }
  };
  

  // Particle effect code here (remains unchanged)

  return (
    <>
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <main>
        <div className="loginArea">
          <div className="loginlogoPlacement">
            <img
              className="loginLogo"
              src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg"
              alt="Login Logo"
            />
          </div>

          {/* Display error message if there's an error */}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleLogin}>
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
            <button className="sendBtn" type="submit">
              Log in
            </button>
          </form>
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

        .error {
          color: red;
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
}

export default Login;
