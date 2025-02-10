import { BrowserRouter, Route, Routes } from "react-router";
import Form from "./pages/Form"
import Login from "./pages/Login";
import Confirmation from "./pages/Confirmation";
import './App.css'


function App() {
  return (
    <BrowserRouter>
    <Routes >
      <Route path="/" element={<Form/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/confirmation" element={<Confirmation/>} >
      </Route>
    </Routes>
    
  </BrowserRouter>
  );
}

export default App
