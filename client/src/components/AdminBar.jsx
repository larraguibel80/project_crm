import { Link } from "react-router-dom";

const AdminBar = () => {
  return (
    <nav className="navbar">
      <div className="container">
      <img className="logoPicture" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740" />
        <Link className="navbar-brand" to="/">CRM System</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/adminpage">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agentslist">Agents</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/requestadmin">Requests</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/list">List</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminBar;
