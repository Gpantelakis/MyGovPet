import './App.css';
import NavBar from "./components/modules/NavBar.js";
import TopBar from "./components/modules/TopBar.js"
import Register from "./components/pages/RegisterSteps/Register.js";
import PetOwnerMenu from "./components/pages/PetOwner/PetOwnerMenu.js";
import ServicePage from "./components/pages/PetOwner/services.js";
import PetMenu52 from "./components/pages/PetOwner/PetMenu5-2";
import PetMenu62 from "./components/pages/PetOwner/PetMenu6-2";
import PetMenu72 from "./components/pages/PetOwner/PetMenu7-2";



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
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/PetOwnerMenu" element={<PetOwnerMenu />} />
            <Route path="/PetOwnerMenu/service/:id" element={<ServicePage />} />
            <Route path="/PetOwnerMenu/service/5/appointment/:vetId/:time" element={<PetMenu52 />}/>
            <Route path="/PetOwnerMenu/service/6/overview/:vetId" element={<PetMenu62 />}/>
            <Route path="/PetOwnerMenu/service/7/appointment/:vetId/:time" element={<PetMenu72 />}/>
          </Routes>
        </div>
        
      </BrowserRouter>
    </>
  );
}

export default App;
