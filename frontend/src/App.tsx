import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SinglePlay from "./pages/SinglePlay";
import MultiPlay from "./pages/MultiPlay";
import SocketPlay from "./pages/SocketPlay";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/singleplay" element={<SinglePlay />} />
      <Route path="/multiplay" element={<MultiPlay />} />
      <Route path="/socketplay" element={<SocketPlay />} />
    </Routes>
  );
}

export default App;
