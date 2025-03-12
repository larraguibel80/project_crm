import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import AdminBar from "../components/AdminBar";

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
  const [editAgent, setEditAgent] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  // Canvas animation
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

    let animationFrameId;

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

      animationFrameId = requestAnimationFrame(drawTriangles);
    }

    drawTriangles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents");
        if (response.ok) {
          const data = await response.json();
          setAgents(data.map(mapAgentData));
        } else {
          setError("Failed to fetch agents data");
        }
      } catch (error) {
        setError("Error fetching agents data");
        console.error(error);
      }
    };

    fetchAgents();
  }, []);

  // Map agent data
  const mapAgentData = (agent) => ({
    id: agent.id,
    firstName: agent.firstname,
    lastName: agent.lastname,
    email: agent.email,
    password: agent.password, // Store actual password for admin
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAgent((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditAgent((prev) => ({ ...prev, [name]: value }));
  };

  // Add agent
  const handleAddAgent = async () => {
    if (!newAgent.firstName || !newAgent.lastName || !newAgent.email || !newAgent.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newAgent.email)) {
      setError("Please enter a valid email address.");
      return;
    }

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
        setAgents((prevAgents) => [...prevAgents, mapAgentData(addedAgent)]);
        setNewAgent({ firstName: "", lastName: "", email: "", password: "" });
        setError(null);
      } else {
        setError("Failed to add agent.");
      }
    } catch (error) {
      setError("An error occurred while adding the agent.");
      console.error(error);
    }
  };

  // Edit agent
  const handleEditAgent = (agent) => {
    setEditAgent(agent);
    setShowPassword(false); // Reset password visibility when editing
  };

  // Save edited agent
  const handleSaveAgent = async () => {
    try {
      const response = await fetch(`/api/agents/${editAgent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editAgent),
      });
      if (response.ok) {
        const updatedAgent = await response.json();
        setAgents(agents.map((agent) => (agent.id === updatedAgent.id ? mapAgentData(updatedAgent) : agent)));
        setEditAgent(null);
        setError(null);
      } else {
        setError("Failed to update agent.");
      }
    } catch (error) {
      setError("An error occurred while updating the agent.");
      console.error(error);
    }
  };

  // Delete agent
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAgents(agents.filter((agent) => agent.id !== id));
        setError(null);
      } else {
        setError("Failed to delete agent.");
      }
    } catch (error) {
      setError("An error occurred while deleting the agent.");
      console.error(error);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="canvas-bg"></canvas>
      <AdminBar/>
      <main>
        <div className="LoginArea">
          <h2>Add Agent</h2>
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
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter agent password"
              value={newAgent.password}
              onChange={handleInputChange}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <button className="add-button" onClick={handleAddAgent}>Add</button>
          {error && <p className="error-message">{error}</p>}
        </div>

        {editAgent && (
          <div className="EditArea">
            <h2>Edit Agent</h2>
            <input
              type="text"
              name="firstName"
              value={editAgent.firstName}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="lastName"
              value={editAgent.lastName}
              onChange={handleEditInputChange}
            />
            <input
              type="email"
              name="email"
              value={editAgent.email}
              onChange={handleEditInputChange}
            />
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter agent password"
                value={editAgent.password}
                onChange={handleEditInputChange}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <button className="save-button" onClick={handleSaveAgent}>Save</button>
            <button className="cancel-button" onClick={() => setEditAgent(null)}>Cancel</button>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>Id</th>
              <th style={{ width: '25%' }}>First Name</th>
              <th style={{ width: '25%' }}>Last Name</th>
              <th style={{ width: '15%' }}>Email</th>
              <th style={{ width: '15%' }}>Password</th>
              <th style={{ width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent,index) => (
              <tr key={index}>
                <td>{agent.id}</td>
                <td>{agent.firstName}</td>
                <td>{agent.lastName}</td>
                <td>{agent.email}</td>
                <td>{agent.password}</td>
                <td className="buttons-column">
                  <button className="edit-button" onClick={() => handleEditAgent(agent)}>Edit</button>
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
          margin-left: 17%;
          margin-right: 17%;
          padding: 2%;
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
          gap: 20px;
        }
        .LoginArea input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
        }
        .password-input {
          position: relative;
          width: 100%;
        }
        .password-input input {
          padding-right: 40px; /* Space for the eye icon */
        }
        .eye-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
        .add-button {
          background-color: green;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
        }
        .save-button, .cancel-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .cancel-button {
          background-color: #FF0509;;
        }
        table {
          width: 66%;
          border-collapse: collapse;
          margin-top: 20px;
          background: #a8e063;
          background: -webkit-linear-gradient(to bottom, rgba(168, 224, 99, 0.5), rgba(102, 204, 102, 0.5));
          background: linear-gradient(to bottom, rgba(168, 224, 99, 0.5), rgba(102, 204, 102, 0.5));
          border-radius: 8px;
          margin-top: 2%;
          margin-left: 17%;
          margin-right: 25%;
          padding: 2%;
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
          margin-bottom: 5%;
        }
        thead {
          background: #a8e063;
          background: -webkit-linear-gradient(to bottom, rgba(168, 224, 99, 0.5), rgba(102, 204, 102, 0.5));
          background: linear-gradient(to bottom, rgba(168, 224, 99, 0.5), rgba(102, 204, 102, 0.5));
          border-radius: 8px;
        }
        td, th {
          padding: 10px;
          border: 1px solid #000;
          text-align: left;
          color: #000;
        }
        .buttons-column {
          display: flex;
          justify-content: space-between;
          padding: 5px;
        }
        .edit-button {
          background-color: #D9D9D9;
          border-radius: 8px;
          padding: 5px 10px;
          margin-left: 5px;
        }
        .delete-button {
          background-color: #FF0509;
          border-radius: 8px;
          padding: 5px 10px;
          margin-right: 5px;
        }
        .EditArea {
          display: flex;
          background:  #66cc66;
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
        .EditArea input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
        }
        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 10px;
        }
      `}</style>
    </>
  );
}

export default AgentsList;