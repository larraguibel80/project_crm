import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SettingsBar = () => {
const nav = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
      <img className="logoPicture" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740" />
        <Link className="navbar-brand" to="/">CRM System</Link>
        <button className="logInBtn">Settings</button>
      </div>
    </nav>
  );
};

export default SettingsBar;