import React from "react";

import FuckTheDealer from "./Pages/Games/FuckTheDealer/FuckTheDealer.tsx";
import Home from "./Pages/Home/Home.tsx";
import SpinTheBottle from "./Pages/Games/SpinTheBottle/SpinTheBottle.tsx";
import GamesPage from "./Pages/GamesPage/GamesPage.tsx";

import "./App.css";
import { SocketProvider } from "./Providers/SocketContext.tsx";

function App() {
  return (
    <div className="app">
      <SocketProvider>
        <FuckTheDealer />
      </SocketProvider>
    </div>
  );
}

export default App;
