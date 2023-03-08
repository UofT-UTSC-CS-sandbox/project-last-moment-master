import Login from "./components/pages/Login/Login.jsx";
import SignUp from "./components/pages/SignUp/SignUp.jsx";
import MainPage from "./components/pages/MainPage/MainPage.jsx";
import { Route, Routes } from "react-router-dom";
import React from "react";
import Navbar from "./components/NavBar/Navbar.jsx";

function App() {
  return (
    <div>
      {/* <h1 className="text-5xl text-green-400">Skill Vitrine</h1> */}
      <Navbar />
      <Routes>
        {/* <Route path='/' exact component={Login}></Route> */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mainpage" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
