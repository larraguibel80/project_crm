import { useNavigate } from "react-router-dom";
import { useRef,useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Chat() {
  const nav = useNavigate();
  const canvasRef = useRef(null); // Reference to the canvas
  const {token} = useParams();

  const [message, setMessage] = useState({
      message: "",
      username: ""
    });
    const [messages, setMessages] = useState([]);
    

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await fetch("/api/messages");
          if (response.ok) {
            const data = await response.json();

            
            console.log("Fetched messages", data)
            setMessages(data);
          } else {
            console.error("Failed to fetch messages");
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
  
      fetchMessages();

      const intervall = setInterval(fetchMessages,2000)
      return () => clearInterval(intervall);
    }, []);

    

  
    const handleChange = (e) => {
      setMessage({ ...message, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
      if (message.message === "") {
        console.error("You cannot send an empty message");
        return;
      }
  
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
  
        if (response.ok) {
          console.log("Message sent!");
          const newMessage = await response.json();
          setMessages([...messages, newMessage]);

          setMessage({...message,message:""});
        } else {
          console.error("Something went wrong!");
        }
      } catch (error) {
        console.error("Wrong connection with server", error);
      }
    };


  // Background effect with floating squares
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const squares = [];
    const numSquares = 50;

    // Create squares
    for (let i = 0; i < numSquares; i++) {
      squares.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        maxSize: Math.random() * 40 + 20,
        growSpeed: Math.random() * 0.1 + 0.05,
        alpha: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360, // Initial rotation
        rotationSpeed: Math.random() * 2 - 1, // Rotation speed
      });
    }

    function drawSquares() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      squares.forEach((sq) => {
        ctx.save(); // Save the context

        // Move the rotation center to the square
        ctx.translate(sq.x + sq.size / 2, sq.y + sq.size / 2);
        ctx.rotate((sq.rotation * Math.PI) / 180);
        ctx.translate(-sq.x - sq.size / 2, -sq.y - sq.size / 2);

        // Dibujar cuadrado
        ctx.beginPath();
        ctx.rect(sq.x, sq.y, sq.size, sq.size);
        ctx.fillStyle = `rgba(255, 255, 255, ${sq.alpha})`;
        ctx.fill();

        ctx.restore(); // Restore the context

        // Animaciones
        sq.size += sq.growSpeed;
        sq.rotation += sq.rotationSpeed;

        if (sq.size > sq.maxSize || sq.size < 10) {
          sq.growSpeed *= -1; // Reverse the growth direction
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
      {/* Background canvas with floating squares */}
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      

      <main>
        <div>
          <h4>Chat</h4>
          <span>Token: {token}</span>
          <div className="chatArea">

            <div className="chatRuta">
              {messages.map((msg,index) => (
                <h6 key={index}><strong>{msg.username}</strong>: {msg.message}</h6>
              ))}
            </div>

            <div className="messageArea">
              <input type="text" name="username" placeholder="Enter username" value={message.username} onChange={handleChange}/>
              <input type="message" name="message" placeholder="Write your message here" value={message.message} onChange={handleChange}/>
              <button onClick={handleSubmit}>Send</button>
            </div>
            
          </div>
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
          background: #000046; 
          background: -webkit-linear-gradient(to bottom, #1CB5E0, #000046); 
          background: linear-gradient(to bottom, #1CB5E0, #000046); 
        }
      `}</style>
    </>
  );
}

export default Chat;
