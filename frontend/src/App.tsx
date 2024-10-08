import React from "react";
import { Route, Routes } from "react-router-dom";

import FuckTheDealer from "./Pages/Games/FuckTheDealer/FuckTheDealer";
import Home from "./Pages/Home/Home";
import SpinTheBottle from "./Pages/Games/SpinTheBottle/SpinTheBottle";
import GamesPage from "./Pages/GamesPage/GamesPage";

import "./App.css";
import { SocketProvider } from "./Providers/SocketContext";
import BussDriver from "./Pages/Games/BussDriver/BussDriver";
import RingOfFire from "./Pages/Games/RingOfFire/RingOfFIre";
import ThirtyShots from "./Pages/Games/30Shots/30Shots";
import HorseTrack from "./Pages/Games/HorseTrack/HorseTrack";

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
          <Route path="/games/ringOfFire" element={<RingOfFire />} />
          <Route path="/games/30Shots" element={<ThirtyShots />} />
          <Route path="/games/horseTrack" element={<HorseTrack />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
