import { BrowserRouter, Route, Routes } from "react-router";
import Form from "./pages/Form"
import './App.css'

function App() {
  return (
    <BrowserRouter>
    <Routes >
      <Route path="/Form" element={<Form/>} >
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App
