import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Form from "./pages/Form";
import Login from "./pages/Login";
import Confirmation from "./pages/Confirmation";
import DashBoard from "./pages/DashBoard";
import ChatList from "./pages/ChatList";
import AgentsList from "./pages/AgentsList";
import Requests from "./pages/Requests";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/chatlist" element={<ChatList />}/>
        <Route path="/agentslist" element={<AgentsList />}/>
        <Route path="/requests" element={<Requests />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
