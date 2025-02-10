import Form from "./pages/Form"
import Navigation from "./components/Navigation"
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <Form />
      </main>
    </div>
  );
}

export default App
