import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import AdminBar from "../components/AdminBar";

function List() {
  const nav = useNavigate();
  const canvasRef = useRef(null); 
  const [serviceList, setServiceList] = useState([]); 

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const triangles = [];
    const numTriangles = 50;

    for (let i = 0; i < numTriangles; i++) {
      triangles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        maxSize: Math.random() * 40 + 20,
        growSpeed: Math.random() * 0.1 + 0.05,
        alpha: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360, 
        rotationSpeed: Math.random() * 2 - 1, 
      });
    }

    function drawTriangles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      triangles.forEach((tri) => {
        ctx.save(); 

        ctx.translate(tri.x, tri.y);
        ctx.rotate((tri.rotation * Math.PI) / 180);
        ctx.translate(-tri.x, -tri.y);

        ctx.beginPath();
        ctx.moveTo(tri.x, tri.y - tri.size / 2);
        ctx.lineTo(tri.x - tri.size / 2, tri.y + tri.size / 2);
        ctx.lineTo(tri.x + tri.size / 2, tri.y + tri.size / 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${tri.alpha})`;
        ctx.fill();

        ctx.restore(); 

        tri.size += tri.growSpeed;
        tri.rotation += tri.rotationSpeed;

        if (tri.size > tri.maxSize || tri.size < 10) {
          tri.growSpeed *= -1;
        }
      });

      requestAnimationFrame(drawTriangles);
    }

    drawTriangles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch agents data from the backend
  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const response = await fetch("/api/service_list");
        if (response.ok) {
          const data = await response.json();
          setServiceList(data); // Update state with fetched data
        } else {
          console.error("Failed to fetch list data");
        }
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
    };

    fetchServiceList();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/service_list/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setServiceList(serviceList.filter((item) => item.id !== id)); // Remove the agent from the state
      } else {
        console.error("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };


  return (
    <>
      <canvas ref={canvasRef} className="canvas-bg"></canvas>
      <AdminBar/>
  
      <main>
        <h2>Service List</h2> 
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Customer Email</th>
              <th>Service/Product</th>
              <th>Message</th>
              <th>Created</th>
              <th>Agent Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.form_email}</td>
                <td>{item.service_product}</td>
                <td>{item.message}</td>
                <td>{item.created}</td>
                <td>{item.agent_email || "Not handled"} </td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          background: #1f4037;
          background: -webkit-linear-gradient(to bottom,rgb(255, 130, 52),rgb(234, 183, 15));
          background: linear-gradient(to bottom,rgb(191, 165, 128),rgb(237, 233, 157));
        }
        main {
          padding: 20px;
          position: relative;
         
        }
        .list-heading { /* Added this CSS for the h1 */
          text-align: left; /* Align text to the left */
          margin-left: 0; /* Ensure no extra margin */
          padding-left: 0; /* Ensure no extra padding */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background-color: rgba(255, 255, 255, 0.8);
          margin-bottom: 3%
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        button {
          margin-right: 5px;
          padding: 5px 10px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </>
  );
}

export default List;