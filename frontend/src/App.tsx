import React from "react";
import { Route, Routes } from "react-router-dom";

import FuckTheDealer from "./Pages/Games/FuckTheDealer/FuckTheDealer.tsx";
import Home from "./Pages/Home/Home.tsx";
import SpinTheBottle from "./Pages/Games/SpinTheBottle/SpinTheBottle.tsx";
import GamesPage from "./Pages/GamesPage/GamesPage.tsx";

import "./App.css";
import { SocketProvider } from "./Providers/SocketContext.tsx";
import BussDriver from "./Pages/Games/BussDriver/BussDriver.tsx";


function App() {
  return (
    <div className="app">
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/fuckTheDealer" element={<FuckTheDealer />} />
          <Route path="/games/spinTheBottle" element={<SpinTheBottle />} />
          <Route path="/games/bussDriver" element={<BussDriver />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
