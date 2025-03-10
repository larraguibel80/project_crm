import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Form from "./pages/Form";
import Login from "./pages/Login";
import Confirmation from "./pages/Confirmation";
import DashBoard from "./pages/DashBoard";
import Chat from "./pages/Chat";
import AgentsList from "./pages/AgentsList";
import Requests from "./pages/Requests";
import List from "./pages/List";
import ChangePassword from "./pages/ChangePassword";
import './App.css';
import AdminPage from "./pages/AdminPage";
import RequestsAdmin from "./pages/RequestsAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/chat/:token" element={<Chat />}/>
        <Route path="/agentslist" element={<AgentsList />}/>
        <Route path="/requests" element={<Requests />}/>
        <Route path="/list" element={<List />}/>
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/requestadmin" element={<RequestsAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
