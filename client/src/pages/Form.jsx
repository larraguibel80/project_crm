import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginBar from "../components/LoginBar";

function Form() {
  const nav = useNavigate();
  const canvasRef = useRef(null); 

  const [form, setForm] = useState({
    email: "",
    service_product: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.email === "" || form.service_product === "" || form.message === "") {
      console.error("You cannot send an empty form");
      return;
    }

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        console.log("Form sent!");
        nav("/confirmation");
      } else {
        console.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Wrong connection with server", error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const circles = [];
    const numCircles = 50;

    for (let i = 0; i < numCircles; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 50 + 10,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5
        )`
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach((circle) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        
        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0) {
          circle.dx *= -1;
        }
        if (circle.y + circle.radius > canvas.height || circle.y - circle.radius < 0) {
          circle.dy *= -1;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
    
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
        <div className="formArea">
          <h2>Contact Form</h2>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input type="text" name="service_product" placeholder="Product" value={form.service_product} onChange={handleChange} />
          <textarea placeholder="Message" name="message" rows="6" value={form.message} onChange={handleChange}></textarea>
          <button className="sendBtn" onClick={handleSubmit}>Send</button>
        </div>
      </main>
      <br /><br /><br />

      <footer>
        <p> &copy; 2025 CRM System. All rights reserved.</p>
      </footer>

      <style>{`
        .canvas-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
        }
      `}</style>
    </>
  );
}

export default Form;
