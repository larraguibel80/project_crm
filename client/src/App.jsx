import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Navbar from "./components/Navbar";
import Form from "./pages/Form";
import Login from "./pages/Login";
import Confirmation from "./pages/Confirmation";
import DashBoard from "./pages/DashBoard";
import Chat from "./pages/Chat";
import AgentsList from "./pages/AgentsList";
import Requests from "./pages/Requests";
import List from "./pages/List";
import './App.css';

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem("userRole");  // Check if user is authenticated

  return isAuthenticated ? element : <Navigate to="/login" />;  // If not authenticated, redirect to login
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:token" element={<Chat />} />
        <Route path="/agentslist" element={<AgentsList />} />

        {/* Protected route for requests */}
        <Route path="/requests" element={<PrivateRoute element={<Requests />} />} />

        <Route path="/list" element={<List />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
