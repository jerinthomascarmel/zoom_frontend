import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Auth/AuthPage";
import VideoCallPage from "./pages/VideoCallPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/videocall" element={<VideoCallPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
