import './App.css';
import NavBar from "./components/modules/NavBar.js";



import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/pages/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <div className="App-container">
          <Routes>
            <Route path="/Home" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
