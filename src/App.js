import './App.css';
import NavBar from "./components/modules/NavBar.js";
import TopBar from "./components/modules/TopBar.js"
import Register from "./components/pages/RegisterSteps/Register.js";
import PetOwnerMenu from "./components/pages/PetOwner/PetOwnerMenu.js";



import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/pages/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <TopBar />
        <NavBar />
        <div className="App-container">
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/PetOwnerMenu" element={<PetOwnerMenu />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
