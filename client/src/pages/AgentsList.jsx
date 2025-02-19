import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

function AgentsList() {
  const nav = useNavigate();
  const canvasRef = useRef(null);
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents");
        if (response.ok) {
          const data = await response.json();
          setAgents(data.map(agent => ({
            id: agent.id,
            firstName: agent.firstname,
            lastName: agent.lastname,
            email: agent.email,
            password: agent.password
          })));
        } else {
          console.error("Failed to fetch agents data");
        }
      } catch (error) {
        console.error("Error fetching agents data:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAgent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAgent = async () => {
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAgent),
      });
      if (response.ok) {
        const addedAgent = await response.json();
        setAgents((prevAgents) => [
          ...prevAgents,
          {
            id: addedAgent.id,
            firstName: addedAgent.firstname,
            lastName: addedAgent.lastname,
            email: addedAgent.email,
            password: addedAgent.password
          }
        ]);
      } else {
        console.error("Failed to add agent");
      }
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAgents(agents.filter((agent) => agent.id !== id)); // Remove the agent from the state
      } else {
        console.error("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="canvas-bg"></canvas>

      <main>
        <div className="LoginArea">
          <input
            type="text"
            name="firstName"
            placeholder="Enter agent firstname"
            value={newAgent.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Enter agent lastname"
            value={newAgent.lastName}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter agent email"
            value={newAgent.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter agent password"
            value={newAgent.password}
            onChange={handleInputChange}
          />
          <button className="add-button" onClick={handleAddAgent}>Add</button>
        </div>

        <h1 className="list-heading">Agents</h1>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.firstName}</td>
                <td>{agent.lastName}</td>
                <td>{agent.email}</td>
                <td>{agent.password}</td>
                <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(agent.id)}>Delete</button>
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
          background: -webkit-linear-gradient(to bottom, #99f2c8, #1f4037);
          background: linear-gradient(to bottom, #99f2c8, #1f4037);
        }
        main {
          padding: 20px;
          position: relative;
          z-index: 1;
        }
        .list-heading {
          text-align: left;
          margin-bottom: 10px;
        }
        .LoginArea {
          display: flex;
          background: #66cc66;
          background: -webkit-linear-gradient(to bottom, #a8e063, #66cc66);
          background: linear-gradient(to bottom, #a8e063, #66cc66);
          border-radius: 8px;
          flex-direction: column;
          margin-top: 2%;
          margin-left: 25%;
          margin-right: 25%;
          padding: 2%;
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
          gap: 20px;
        }
        .LoginArea input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .add-button {
          background-color: green;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: #a8e063;
            background: -webkit-linear-gradient(to bottom, #a8e063, #66cc66);
            background: linear-gradient(to bottom, #a8e063, #66cc66);
            border-radius: 8px;
        }
        thead {
          background: #a8e063;
          background: -webkit-linear-gradient(to bottom, #a8e063, #66cc66);
          background: linear-gradient(to bottom, #a8e063, #66cc66);
          border-radius: 8px;
        }
        th {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
          color: white;
        }
        td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
          color: black;
        }
        .edit-button {
          background-color: gray;
        }
        .delete-button {
          background-color: red;
        }
      `}</style>
    </>
  );
}

export default AgentsList;
